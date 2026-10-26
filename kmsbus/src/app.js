'use strict';

/* ==========================================================================
   16BUS — расписание автобусов
   ==========================================================================

   Структура файла:
   1. Настройки разработки
   2. Состояние приложения
   3. Вспомогательные функции
   4. Работа с данными расписания
   5. Получение типов дней через API
   6. Расчёт времени прибытия
   7. Отображение интерфейса
   8. Управление приложением
   9. Инициализация
  10. Подсказка установки PWA

   Основной поток данных:
   data.json → app.data → dataService → logic → controller → ui

   app хранит состояние приложения.
   dataService работает с расписанием и остановками.
   api получает информацию о рабочих и выходных днях.
   logic рассчитывает время прибытия автобусов.
   ui отвечает за отображение элементов интерфейса.
   controller связывает данные, расчёты и интерфейс.
*/


// ==========================================================================
// 1. НАСТРОЙКИ РАЗРАБОТКИ
// ==========================================================================

/**
 * Включает отладочные возможности.
 *
 * При DEBUG = true можно использовать тестовую дату и время.
 * В обычном режиме приложение использует текущее время устройства.
 */
const DEBUG = false;

/**
 * Настройки тестового режима.
 *
 * Тестовые значения применяются только при одновременном выполнении
 * двух условий: DEBUG = true и USE_TEST_DATE = true.
 *
 * TEST_DATE_VALUE — дата в формате YYYYMMDD.
 * TEST_TIME_VALUE — время в формате HH:MM.
 */
const USE_TEST_DATE = true;
const TEST_DATE_VALUE = '20250510';
const TEST_TIME_VALUE = '21:00';


// ==========================================================================
// 2. СОСТОЯНИЕ ПРИЛОЖЕНИЯ
// ==========================================================================

/**
 * Единое хранилище данных, настроек, выбранных параметров и ссылок на UI.
 *
 * data   — загруженные остановки и расписания.
 * config — особенности структуры расписания.
 * state  — текущие выборы пользователя и направление движения.
 * ui     — ссылки на элементы DOM, используемые приложением.
 */
const app = {
    data: {
        stops: {
            route_forward: [],
            route_reverse: []
        },

        schedules: {}
    },

    config: {
        hasSeasons: false,
        hasDayTypes: false,
        seasonDates: null
    },

    state: {
        season: null,
        dayType: null,
        dir: 'route_forward',
        selectedStop: null
    },

    ui: {}
};


// ==========================================================================
// 3. ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ==========================================================================

const utils = {

    /**
     * Преобразует время HH:MM в количество минут от начала суток.
     *
     * Пример: '08:30' → 510.
     *
     * Используется для сравнения и сортировки времени.
     */
    toMin(time) {
        if (!time || typeof time !== 'string') {
            return 0;
        }

        const [hours, minutes] = time.split(':');

        return Number(hours) * 60 + (Number(minutes) || 0);
    },


    /**
     * Преобразует количество минут в строку HH:MM.
     *
     * Часы выводятся в пределах суток.
     * Предполагается, что переданное значение неотрицательное.
     */
    formatTime(totalMinutes) {
        const hours = Math.floor(totalMinutes / 60) % 24;
        const minutes = totalMinutes % 60;

        return (
            `${String(hours).padStart(2, '0')}:` +
            `${String(minutes).padStart(2, '0')}`
        );
    },


    /**
     * Возвращает текущее время в минутах от начала суток.
     *
     * В режиме отладки можно подставить фиксированное время,
     * чтобы проверять расписание без изменения системных часов.
     */
    getCurrentTime() {
        if (DEBUG && USE_TEST_DATE && TEST_TIME_VALUE) {
            const [hours, minutes] = TEST_TIME_VALUE
                .split(':')
                .map(Number);

            return hours * 60 + minutes;
        }

        const now = new Date();

        return now.getHours() * 60 + now.getMinutes();
    },


    /**
     * Возвращает базовую дату для расчётов.
     *
     * В обычном режиме это текущая дата устройства.
     * В тестовом режиме используется TEST_DATE_VALUE.
     *
     * Возвращается новый объект Date, поэтому вызывающий код
     * может изменять его, не затрагивая другие расчёты.
     */
    getBaseDate() {
        if (DEBUG && USE_TEST_DATE && TEST_DATE_VALUE) {
            const year = Number(TEST_DATE_VALUE.substring(0, 4));
            const month = Number(TEST_DATE_VALUE.substring(4, 6)) - 1;
            const day = Number(TEST_DATE_VALUE.substring(6, 8));

            return new Date(year, month, day);
        }

        return new Date();
    },


    /**
     * Приводит телефон к формату 8 (XXX) XXX-XX-XX.
     *
     * Сначала удаляет все символы, кроме цифр.
     * Если номер начинается с 8, заменяет её на 7 для нормализации.
     *
     * Затем форматирует номер с отображением начальной 8.
     * Функция рассчитана на российский номер из 11 цифр.
     */
    formatPhone(phone) {
        if (!phone) {
            return phone;
        }

        let digits = phone.replace(/\D/g, '');

        if (digits.startsWith('8')) {
            digits = '7' + digits.slice(1);
        }

        return (
            `8 (${digits.slice(1, 4)}) ` +
            `${digits.slice(4, 7)}-` +
            `${digits.slice(7, 9)}-` +
            `${digits.slice(9, 11)}`
        );
    }
};


// ==========================================================================
// 4. РАБОТА С ДАННЫМИ РАСПИСАНИЯ
// ==========================================================================

const dataService = {

    /**
     * Определяет, какие параметры расписания поддерживаются.
     *
     * Возможные ключи:
     *   winter / summer
     *   weekday / weekend
     *   winter_weekday / summer_weekend
     *
     * Результат используется интерфейсом, чтобы показывать
     * только те переключатели, которые нужны конкретному маршруту.
     */
    detectStructure(schedules) {
        const keys = Object.keys(schedules);

        const hasWinterSummer = keys.some(
            key => key === 'winter' || key === 'summer'
        );

        const hasWeekdayWeekend = keys.some(
            key => key === 'weekday' || key === 'weekend'
        );

        const hasComposite = keys.some(
            key => key.includes('_')
        );

        let hasSeasons = false;
        let hasDayTypes = false;

        if (hasComposite) {
            hasSeasons = keys.some(
                key => key.startsWith('winter_') ||
                       key.startsWith('summer_')
            );

            hasDayTypes = keys.some(
                key => key.endsWith('_weekday') ||
                       key.endsWith('_weekend')
            );
        } else {
            hasSeasons = hasWinterSummer;
            hasDayTypes = hasWeekdayWeekend;
        }

        return {
            hasSeasons,
            hasDayTypes
        };
    },


    /**
     * Выбирает расписание с учётом текущих сезона и типа дня.
     *
     * Порядок поиска:
     * 1. Комбинация сезона и типа дня.
     * 2. Расписание только для выбранного сезона.
     * 3. Расписание только для выбранного типа дня.
     * 4. Расписание default.
     * 5. Первый доступный вариант, если остальные не найдены.
     *
     * Если расписаний нет, возвращает null.
     */
    getScheduleForContext() {
        const { schedules } = app.data;
        const { season, dayType } = app.state;
        const keys = Object.keys(schedules);

        // Наиболее конкретный вариант: сезон + тип дня.
        if (season && dayType) {
            const combinedKey = `${season}_${dayType}`;

            if (schedules[combinedKey]) {
                return schedules[combinedKey];
            }
        }

        // Расписание, заданное только для сезона.
        if (season && schedules[season]) {
            return schedules[season];
        }

        // Расписание, заданное только для типа дня.
        if (dayType && schedules[dayType]) {
            return schedules[dayType];
        }

        // Универсальное расписание.
        if (schedules.default) {
            return schedules.default;
        }

        // Резервный вариант для данных с другой структурой ключей.
        return keys.length ? schedules[keys[0]] : null;
    },


    /**
     * Собирает отправления всех групп автобусов выбранного направления.
     *
     * Возвращает массив объектов:
     *   { t: время отправления, g: название группы }
     *
     * Все отправления сортируются по времени.
     */
    getTimes() {
        const schedule = this.getScheduleForContext();

        if (!schedule || !schedule[app.state.dir]) {
            return [];
        }

        const departures = [];

        Object.entries(schedule[app.state.dir]).forEach(
            ([busGroup, times]) => {
                times.forEach(time => {
                    departures.push({
                        t: time,
                        g: busGroup
                    });
                });
            }
        );

        return departures.sort(
            (a, b) => utils.toMin(a.t) - utils.toMin(b.t)
        );
    },


    /**
     * Возвращает остановки выбранного направления с расчётным
     * количеством минут от начала маршрута.
     *
     * У первой остановки время равно нулю.
     * Для каждой следующей прибавляется продолжительность участка
     * из свойства leg предыдущей остановки в данных маршрута.
     */
    getStopsWithTime() {
        const route = app.state.dir === 'route_forward'
            ? app.data.stops.route_forward
            : app.data.stops.route_reverse;

        let cumulativeMinutes = 0;

        return route.map((stop, index) => {
            if (index === 0) {
                return {
                    name: stop.name,
                    minutes_from_start: 0
                };
            }

            cumulativeMinutes += stop.leg;

            return {
                name: stop.name,
                minutes_from_start: cumulativeMinutes
            };
        });
    },


    /**
     * Определяет сезон по календарной дате.
     *
     * seasonDates ожидается в формате, например:
     *   { winter: '10-01', summer: '04-01' }
     *
     * Границы сезонов учитывают переход через Новый год.
     * Если сезонность или даты не заданы, возвращает null.
     */
    getSeasonByDate() {
        if (!app.config.hasSeasons || !app.config.seasonDates) {
            return null;
        }

        const today = utils.getBaseDate();
        const monthDay = (today.getMonth() + 1) * 100 + today.getDate();

        const seasons = Object.keys(app.config.seasonDates);

        const seasonStartDates = seasons.map(season => {
            const date = app.config.seasonDates[season]
                .replace('-', '');

            return Number(date);
        });

        for (let index = 0; index < seasons.length; index++) {
            const currentStart = seasonStartDates[index];
            const nextStart = seasonStartDates[
                (index + 1) % seasonStartDates.length
            ];

            // Сезон пересекает границу года, например декабрь — апрель.
            if (nextStart < currentStart) {
                if (
                    monthDay >= currentStart ||
                    monthDay < nextStart
                ) {
                    return seasons[index];
                }
            } else if (
                monthDay >= currentStart &&
                monthDay < nextStart
            ) {
                return seasons[index];
            }
        }

        // Запасной вариант для нестандартных или неполных границ.
        return seasons[0];
    }
};


// ==========================================================================
// 5. ПОЛУЧЕНИЕ ТИПОВ ДНЕЙ ЧЕРЕЗ API
// ==========================================================================

const api = {

    /**
     * Запрашивает тип дня для даты со смещением относительно базовой даты.
     *
     * offset = 0 — сегодня.
     * offset = 1 — завтра.
     *
     * Сервис isdayoff.ru возвращает:
     *   0 — рабочий день;
     *   1 — выходной или праздник;
     *   2 — сокращённый рабочий день.
     *
     * В текущей логике код 0 и 2 считаются буднями,
     * остальные ответы — выходными.
     *
     * При ошибке запроса используется резервное значение weekday.
     */
    async fetchDayType(offset) {
        const date = utils.getBaseDate();

        date.setDate(date.getDate() + offset);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        try {
            const response = await fetch(
                `https://isdayoff.ru/${year}${month}${day}` +
                '?tz=Asia/Vladivostok&cc=ru&holiday=1'
            );

            const code = await response.text();

            return (code === '0' || code === '2')
                ? 'weekday'
                : 'weekend';

        } catch {
            // Без доступа к API считаем день будним.
            return 'weekday';
        }
    },


    /**
     * Получает тип дня для сегодня и завтра параллельно.
     *
     * Параллельные запросы позволяют не ждать завершения каждого
     * запроса по очереди.
     */
    async getDayTypes() {
        const [today, tomorrow] = await Promise.all([
            this.fetchDayType(0),
            this.fetchDayType(1)
        ]);

        return {
            today,
            tomorrow
        };
    }
};


// ==========================================================================
// 6. РАСЧЁТ ВРЕМЕНИ ПРИБЫТИЯ
// ==========================================================================

const logic = {

    /**
     * Рассчитывает ближайшие прибытия автобусов на указанную остановку.
     *
     * Алгоритм:
     * 1. Находит время в пути от начала маршрута до остановки.
     * 2. Прибавляет это время к каждому отправлению.
     * 3. Исключает рейсы, которые уже должны были прибыть.
     * 4. Возвращает время прибытия и группу автобуса.
     *
     * Результат:
     *   [{ arrival_time: '08:30', bus_group: '...' }, ...]
     */
    getArrivalTimes(stopName) {
        const currentMinutes = utils.getCurrentTime();
        const stops = dataService.getStopsWithTime();

        const targetStop = stops.find(
            stop => stop.name === stopName
        );

        if (!targetStop) {
            return [];
        }

        return dataService.getTimes()
            .map(departure => {
                const arrivalMinutes =
                    utils.toMin(departure.t) +
                    targetStop.minutes_from_start;

                return {
                    ...departure,
                    arrival: arrivalMinutes
                };
            })

            // Оставляем только ещё не наступившие прибытия.
            .filter(bus => bus.arrival >= currentMinutes)

            // Преобразуем внутренние данные в формат для отображения.
            .map(bus => ({
                arrival_time: utils.formatTime(bus.arrival),
                bus_group: bus.g
            }));
    }
};


// ==========================================================================
// 7. ОТОБРАЖЕНИЕ ИНТЕРФЕЙСА
// ==========================================================================

const ui = {

    /**
     * Находит элементы DOM и сохраняет ссылки на них в app.ui.
     *
     * Остальные части приложения обращаются к этим элементам
     * через app.ui, а не ищут их в документе повторно.
     */
    initRefs() {
        app.ui = {
            result: document.getElementById('result'),
            stopSelect: document.getElementById('stopSelect'),
            from: document.getElementById('fromText'),
            to: document.getElementById('toText'),
            providerLink: document.getElementById('providerLink'),
            phoneLink: document.getElementById('phoneLink'),
            refreshButton: document.getElementById('refreshButton')
        };
    },


    /**
     * Создаёт группу кнопок выбора, например для сезона или типа дня.
     *
     * options — массив объектов { value, label }.
     * activeValue — значение выбранной кнопки.
     * onClick — обработчик выбора нового значения.
     *
     * При каждом вызове старые кнопки контейнера заменяются новыми.
     */
    renderButtons(containerId, options, activeValue, onClick) {
        const container = document.getElementById(containerId);

        container.innerHTML = '';

        options.forEach(option => {
            const button = document.createElement('button');

            button.className = 'pill-btn';
            button.innerText = option.label;

            if (option.value === activeValue) {
                button.classList.add('active');
            }

            button.onclick = () => onClick(option.value);

            container.appendChild(button);
        });
    },


    /**
     * Обновляет переключатели сезона и типа дня.
     *
     * Если расписание не поддерживает соответствующий параметр,
     * блок скрывается, а состояние сбрасывается в null.
     *
     * При выборе нового значения интерфейс перерисовывается,
     * после чего обновляется результат расчёта.
     */
    updateButtonsUI() {
        const dayBlock = document.getElementById('dayTypeBlock');
        const seasonBlock = document.getElementById('seasonBlock');

        // Переключатель типа дня: будни / выходные.
        if (!app.config.hasDayTypes) {
            dayBlock.style.display = 'none';
            app.state.dayType = null;
        } else {
            dayBlock.style.display = 'block';

            this.renderButtons(
                'dayTypeButtons',
                [
                    { value: 'weekday', label: 'Будни' },
                    { value: 'weekend', label: 'Выходные' }
                ],
                app.state.dayType,
                value => {
                    app.state.dayType = value;

                    this.updateButtonsUI();
                    controller.update();
                }
            );
        }

        // Переключатель сезонного расписания.
        if (!app.config.hasSeasons) {
            seasonBlock.style.display = 'none';
            app.state.season = null;
        } else {
            seasonBlock.style.display = 'block';

            this.renderButtons(
                'seasonButtons',
                [
                    { value: 'winter', label: 'Зимнее' },
                    { value: 'summer', label: 'Летнее' }
                ],
                app.state.season,
                value => {
                    app.state.season = value;

                    this.updateButtonsUI();
                    controller.update();
                }
            );
        }
    },


    /**
     * Выводит текст результата расчёта в блок результата.
     */
    renderResult(text) {
        app.ui.result.innerText = text;
    },


    /**
     * Заполняет выпадающий список остановками текущего направления.
     *
     * После заполнения первая остановка выбирается автоматически.
     * Её название сохраняется в состоянии приложения.
     */
    populateStops() {
        const stops = dataService.getStopsWithTime();
        const select = app.ui.stopSelect;

        select.innerHTML = '';

        stops.forEach(stop => {
            const option = document.createElement('option');

            option.value = stop.name;
            option.textContent = stop.name;

            select.appendChild(option);
        });

        app.state.selectedStop = stops[0]?.name || null;
        select.value = app.state.selectedStop;
    }
};


// ==========================================================================
// 8. УПРАВЛЕНИЕ ПРИЛОЖЕНИЕМ
// ==========================================================================

const controller = {

    /**
     * Обновляет текст с ближайшими рейсами для выбранной остановки.
     *
     * Если остановка не выбрана или подходящих рейсов больше нет,
     * выводится соответствующее сообщение.
     */
    async update() {
        if (!app.state.selectedStop) {
            ui.renderResult('Выберите остановку');
            return;
        }

        const upcomingBuses = logic.getArrivalTimes(
            app.state.selectedStop
        );

        if (!upcomingBuses.length) {
            ui.renderResult('На сегодня рейсов больше нет :(');
            return;
        }

        // Первый найденный рейс — ближайший.
        let resultText =
            `Остановка: ${app.state.selectedStop}\n\n`;

        resultText +=
            `Ближайший: ${upcomingBuses[0].arrival_time}` +
            ` | ${upcomingBuses[0].bus_group} график`;

        // Второй рейс показывается только при его наличии.
        if (upcomingBuses[1]) {
            resultText +=
                `\nСледующий: ${upcomingBuses[1].arrival_time}` +
                ` | ${upcomingBuses[1].bus_group} график`;
        }

        ui.renderResult(resultText);
    },


    /**
     * Переключает направление маршрута.
     *
     * После переключения обновляются:
     * - направление в состоянии приложения;
     * - подписи начальной и конечной остановок;
     * - список остановок;
     * - результат расчёта.
     */
    swapDirection() {
        app.state.dir = app.state.dir === 'route_forward'
            ? 'route_reverse'
            : 'route_forward';

        if (app.data.stops.route_forward.length) {
            app.ui.from.innerText =
                app.state.dir === 'route_forward'
                    ? app.data.stops.route_forward[0].name
                    : app.data.stops.route_reverse[0].name;

            app.ui.to.innerText =
                app.state.dir === 'route_forward'
                    ? app.data.stops.route_reverse[0].name
                    : app.data.stops.route_forward[0].name;
        }

        ui.populateStops();
        this.update();
    }
};


// ==========================================================================
// 9. ИНИЦИАЛИЗАЦИЯ ПРИЛОЖЕНИЯ
// ==========================================================================

/**
 * Подготавливает приложение к работе.
 *
 * Последовательность:
 * 1. Находит элементы интерфейса.
 * 2. Загружает data.json.
 * 3. Определяет структуру расписания.
 * 4. Настраивает заголовки, ссылки и обработчики событий.
 * 5. Получает тип текущего дня и определяет сезон.
 * 6. Заполняет переключатели и список остановок.
 * 7. Выполняет первоначальный расчёт.
 */
async function init() {

    // ----------------------------------------------------------------------
    // 9.1. Подготовка DOM и загрузка данных
    // ----------------------------------------------------------------------

    ui.initRefs();

    const response = await fetch('data.json');
    const data = await response.json();

    app.data.stops = data.stops;
    app.data.schedules = data.schedules;


    // ----------------------------------------------------------------------
    // 9.2. Определение возможностей расписания
    // ----------------------------------------------------------------------

    const detectedStructure = dataService.detectStructure(
        app.data.schedules
    );

    app.config = {
        ...app.config,
        ...detectedStructure,
        seasonDates: data.season_dates || null
    };


    // ----------------------------------------------------------------------
    // 9.3. Заполнение информации о маршруте
    // ----------------------------------------------------------------------

    document.getElementById('routeHeader').innerText =
        data.route_header;

    document.getElementById('routeSubscription').innerText =
        data.route_subscription;


    // ----------------------------------------------------------------------
    // 9.4. Обработчики основных кнопок
    // ----------------------------------------------------------------------

    // Переключение направления маршрута.
    document.querySelector('.direction-btn').onclick = () => {
        controller.swapDirection();
    };

    // Ручное обновление результата с анимацией значка.
    app.ui.refreshButton.onclick = () => {
        const refreshIcon = app.ui.refreshButton.querySelector(
            '.material-icons'
        );

        if (refreshIcon) {
            // Web Animations API запускает вращение непосредственно
            // при каждом клике, без зависимости от CSS-классов.
            refreshIcon.animate(
                [
                    { transform: 'rotate(0deg)' },
                    { transform: 'rotate(360deg)' }
                ],
                {
                    duration: 900,
                    easing: 'cubic-bezier(0.2, 0.7, 0.3, 1)'
                }
            );
        }

        if (DEBUG) {
            console.log(
                'Обновление расписания:',
                new Date().toLocaleTimeString()
            );
        }

        controller.update();
    };


    // ----------------------------------------------------------------------
    // 9.5. Контакты и ссылка на перевозчика
    // ----------------------------------------------------------------------

    app.ui.providerLink.innerText = data.route_provider;
    app.ui.providerLink.href = data.route_link;

    app.ui.phoneLink.innerText = utils.formatPhone(
        data.route_support
    );

    app.ui.phoneLink.href = `tel:${data.route_support}`;


    // ----------------------------------------------------------------------
    // 9.6. Начальные значения сезона и типа дня
    // ----------------------------------------------------------------------

    const { today } = await api.getDayTypes();

    if (app.config.hasDayTypes) {
        app.state.dayType = today;
    }

    if (app.config.hasSeasons) {
        app.state.season = dataService.getSeasonByDate();
    }


    // ----------------------------------------------------------------------
    // 9.7. Начальные подписи направления
    // ----------------------------------------------------------------------

    if (app.data.stops.route_forward.length) {
        app.ui.from.innerText =
            app.data.stops.route_forward[0].name;

        app.ui.to.innerText =
            app.data.stops.route_reverse[0].name;
    }


    // ----------------------------------------------------------------------
    // 9.8. Подготовка элементов выбора и первый расчёт
    // ----------------------------------------------------------------------

    ui.updateButtonsUI();
    ui.populateStops();

    // При смене остановки сразу пересчитываем время прибытия.
    app.ui.stopSelect.onchange = () => {
        app.state.selectedStop = app.ui.stopSelect.value;
        controller.update();
    };

    // Первоначальное отображение расписания.
    controller.update();
}


// Запускаем приложение после загрузки скрипта.
init();


// ==========================================================================
// 10. ПОДСКАЗКА ОБ УСТАНОВКЕ PWA
// ==========================================================================

/**
 * Показывает подсказку об установке приложения, если сайт открыт
 * в обычном браузере.
 *
 * В установленном PWA подсказка не показывается.
 * Кнопка закрытия скрывает её до следующей перезагрузки страницы.
 */
(() => {
    const hint = document.getElementById('pwa-hint');
    const closeButton = document.getElementById('pwa-hint-close');

    // Если разметка подсказки отсутствует, ничего не делаем.
    if (!hint || !closeButton) {
        return;
    }

    // Проверяем, запущен ли сайт как установленное приложение.
    const isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        window.navigator.standalone === true;

    if (!isStandalone) {
        hint.hidden = false;
    }

    // Закрытие подсказки пользователем.
    closeButton.addEventListener('click', () => {
        hint.hidden = true;
    });
})();
