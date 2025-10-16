const USE_DEBUG_DATA = false;

const API_KEYS = [
    '5bd42146-7679-4016-b124-f278ca89ea1b',
    '16ce9175-1b36-42a3-be22-9397bb20bdd0',
    '8e4b3214-1071-45b5-9e67-e31e97a6b1ec'
];

const API_ENDPOINTS = {
    SEARCH: 'https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword',
    TOP: 'https://kinopoiskapiunofficial.tech/api/v2.2/films/top',
    SIMILAR: filmId => `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/similars`,
    DETAILS: filmId => `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`
};

const CONFIG = {
    HISTORY: {
        STORAGE_KEY: 'filmoteka_history',
        MAX_SIZE: 10
    },
    PAGINATION: {
        FILMS_PER_PAGE: 20,
        TOTAL_FILMS: 250
    },
    API: {
        RETRY_ATTEMPTS: API_KEYS.length,
        TIMEOUT: 10000
    },
    SIMILAR: {
        MAX_FILMS: 10
    }
};

const TEXTS = {
    APP: {
        TITLE: 'Фильмотека',
        PLACEHOLDER: 'Найти фильм или сериал...',
        SEARCH_BTN: 'Поиск',
        BACK_BTN: 'На главную',
        HISTORY_BTN: 'История',
        HISTORY_BTN_CLEAR: 'Очистить',
        PAGINATION_INFO: 'Страница',
        FOOTER_TITLE: 'Фильмотека 2025 ©',
        FOOTER_TEXT: 'Фильмотека — веб-приложение для удобного просмотра видеоконтента. Поиск, рекомендации и подбор похожих фильмов реализованы через API КиноПоиска. Для просмотра используется агрегатор видеосервисов.',
        FOOTER_CREDIT: 'Assembled by <a href="https://free-gen.github.io" target="_blank" class="footer__link">FREEGEN</a>'
    },
    NAV: {
        RECOMMENDATIONS_TITLE: 'Рекомендации',
        RECOMMENDATIONS_SUBTITLE: 'Лучшие фильмы и сериалы всех времен по версии пользователей КиноПоиска',
        SEARCH_RESULTS_TITLE: 'Результаты поиска',
        SEARCH_RESULTS_SUBTITLE: q => `По запросу: "${q}"`,
        SIMILAR_TITLE: t => `${t}<br><span class="similar-title-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5"/></svg></span> похожие фильмы`,
        SIMILAR_SUBTITLE: '',
        HISTORY_TITLE: 'История просмотров',
        HISTORY_SUBTITLE: 'Фильмы и сериалы, которые вы смотрели'
    },
    ERRORS: {
        SEARCH: 'Ошибка поиска.<br>Превышен суточный лимит API-запросов.',
        RECOMMENDATIONS_LOAD: 'Ошибка при загрузке рекомендаций.<br>Превышен суточный лимит API-запросов.',
        SIMILAR_LOAD: 'Ошибка при загрузке похожих фильмов.<br>Превышен суточный лимит API-запросов.',
        NOT_FOUND: 'Ничего не найдено',
        SIMILAR_NOT_FOUND: 'Похожие фильмы не найдены',
        HISTORY_EMPTY: 'История просмотров пуста',
        API_UNAVAILABLE: 'Все API-ключи недоступны'
    },
    BUTTONS: {
        SIMILAR: 'Похожие',
        WATCH: 'Смотреть',
        CLEAR_HISTORY: 'Очистить историю'
    },
    META: {
        FILM: 'Фильм',
        SERIES: 'Сериал'
    },
    RATING_LABEL: 'Рейтинг:'
};

const DEBUG_BASE = {
    nameRu: 'Тестовый режим',
    year: 1984,
    rating: 3.1,
    posterUrlPreview: 'https://upload.wikimedia.org/wikipedia/fa/4/47/Parker_2013_Movie_Poster.png',
    type: 'FILM'
};

export { USE_DEBUG_DATA, API_KEYS, TEXTS, DEBUG_BASE, API_ENDPOINTS, CONFIG };