// ========== НАСТРОЙКИ ==========
const DEBUG = true;

// TEST
const USE_TEST_DATE = false;
const TEST_DATE_VALUE = "20250510"; // YYYYMMDD
const TEST_TIME_VALUE = 1200; // MINUTES

// ========== APP STATE ==========
const app = {
  data: {
    stops: { route_forward: [], route_reverse: [] },
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

// ========== UTILS ==========
const utils = {
  toMin(t) {
    if (!t || typeof t !== 'string') return 0;
    const [h, m] = t.split(':');
    return +h * 60 + (+m || 0);
  },

  formatTime(minutes) {
    const h = Math.floor(minutes / 60) % 24;
    const m = minutes % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  },

  getCurrentTime() {
    if (DEBUG && USE_TEST_DATE && TEST_TIME_VALUE !== undefined) return TEST_TIME_VALUE;
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  },

  getBaseDate() {
    if (DEBUG && USE_TEST_DATE && TEST_DATE_VALUE) {
      const y = parseInt(TEST_DATE_VALUE.substring(0, 4));
      const m = parseInt(TEST_DATE_VALUE.substring(4, 6)) - 1;
      const d = parseInt(TEST_DATE_VALUE.substring(6, 8));
      return new Date(y, m, d);
    }
    return new Date();
  },

  formatPhone(phone) {
    if (!phone) return phone;
    let nums = phone.replace(/\D/g, '');
    if (nums.startsWith('8')) nums = '7' + nums.slice(1);
    return `8 (${nums.slice(1,4)}) ${nums.slice(4,7)}-${nums.slice(7,9)}-${nums.slice(9,11)}`;
  }
};

// ========== DATA LAYER ==========
const dataService = {
  detectStructure(schedules) {
    const keys = Object.keys(schedules);

    const hasWinterSummer = keys.some(k => k === 'winter' || k === 'summer');
    const hasWeekdayWeekend = keys.some(k => k === 'weekday' || k === 'weekend');
    const hasComposite = keys.some(k => k.includes('_'));

    let hasSeasons = false;
    let hasDayTypes = false;

    if (hasComposite) {
      hasSeasons = keys.some(k => k.startsWith('winter_') || k.startsWith('summer_'));
      hasDayTypes = keys.some(k => k.endsWith('_weekday') || k.endsWith('_weekend'));
    } else {
      hasSeasons = hasWinterSummer;
      hasDayTypes = hasWeekdayWeekend;
    }

    return { hasSeasons, hasDayTypes };
  },

  getScheduleForContext() {
    const { schedules } = app.data;
    const { season, dayType } = app.state;

    const keys = Object.keys(schedules);

    if (season && dayType) {
      const key = `${season}_${dayType}`;
      if (schedules[key]) return schedules[key];
    }

    if (season && schedules[season]) return schedules[season];
    if (dayType && schedules[dayType]) return schedules[dayType];
    if (schedules.default) return schedules.default;

    return keys.length ? schedules[keys[0]] : null;
  },

  getTimes() {
    const schedule = this.getScheduleForContext();
    if (!schedule || !schedule[app.state.dir]) return [];

    const all = [];
    Object.entries(schedule[app.state.dir]).forEach(([bus, times]) => {
      times.forEach(t => all.push({ t, g: bus }));
    });

    return all.sort((a, b) => utils.toMin(a.t) - utils.toMin(b.t));
  },

  getStopsWithTime() {
    const route = app.state.dir === 'route_forward'
      ? app.data.stops.route_forward
      : app.data.stops.route_reverse;

    let cumulative = 0;

    return route.map((stop, idx) => {
      if (idx === 0) return { name: stop.name, minutes_from_start: 0 };
      cumulative += stop.leg;
      return { name: stop.name, minutes_from_start: cumulative };
    });
  },

  getSeasonByDate() {
    if (!app.config.hasSeasons || !app.config.seasonDates) return null;

    const today = utils.getBaseDate();
    const md = (today.getMonth() + 1) * 100 + today.getDate();

    const seasons = Object.keys(app.config.seasonDates);
    const dates = seasons.map(s => parseInt(app.config.seasonDates[s].replace('-', '')));

    for (let i = 0; i < seasons.length; i++) {
      const start = dates[i];
      const next = dates[(i + 1) % dates.length];

      if (next < start) {
        if (md >= start || md < next) return seasons[i];
      } else {
        if (md >= start && md < next) return seasons[i];
      }
    }

    return seasons[0];
  }
};

// ========== API ==========
const api = {
  async fetchDayType(offset) {
    const date = utils.getBaseDate();
    date.setDate(date.getDate() + offset);

    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    try {
      const res = await fetch(`https://isdayoff.ru/${y}${m}${d}?tz=Asia/Vladivostok&cc=ru&holiday=1`);
      const code = await res.text();
      return (code === '0' || code === '2') ? 'weekday' : 'weekend';
    } catch {
      return 'weekday';
    }
  },

  async getDayTypes() {
    const [today, tomorrow] = await Promise.all([
      this.fetchDayType(0),
      this.fetchDayType(1)
    ]);
    return { today, tomorrow };
  }
};

// ========== LOGIC ==========
const logic = {
  getArrivalTimes(stopName) {
    const cur = utils.getCurrentTime();
    const stops = dataService.getStopsWithTime();
    const target = stops.find(s => s.name === stopName);
    if (!target) return [];

    return dataService.getTimes()
      .map(bus => {
        const arrival = utils.toMin(bus.t) + target.minutes_from_start;
        return { ...bus, arrival };
      })
      .filter(b => b.arrival >= cur)
      .map(b => ({
        arrival_time: utils.formatTime(b.arrival),
        bus_group: b.g
      }));
  }
};

// ========== UI ==========
const ui = {
  initRefs() {
    app.ui = {
      result: document.getElementById('result'),
      stopSelect: document.getElementById('stopSelect'),
      from: document.getElementById('fromText'),
      to: document.getElementById('toText'),
      providerLink: document.getElementById('providerLink'),
      phoneLink: document.getElementById('phoneLink')
    };
  },

  renderButtons(containerId, options, activeValue, onClick) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'pill-btn';
      btn.innerText = opt.label;

      if (opt.value === activeValue) {
        btn.classList.add('active');
      }

      btn.onclick = () => onClick(opt.value);

      container.appendChild(btn);
    });
  },

  updateButtonsUI() {
    const dayBlock = document.getElementById('dayTypeBlock');
    const seasonBlock = document.getElementById('seasonBlock');

    // ДНИ
    if (!app.config.hasDayTypes) {
      dayBlock.style.display = 'none';
      app.state.dayType = null;
    } else {
      dayBlock.style.display = 'block';

      this.renderButtons(
        'dayTypeButtons',
        [
          { value: 'weekday', label: 'Рабочие дни' },
          { value: 'weekend', label: 'Выходные дни' }
        ],
        app.state.dayType,
        (val) => {
          app.state.dayType = val;
          this.updateButtonsUI();
          controller.update();
        }
      );
    }

    // СЕЗОНЫ
    if (!app.config.hasSeasons) {
      seasonBlock.style.display = 'none';
      app.state.season = null;
    } else {
      seasonBlock.style.display = 'block';

      this.renderButtons(
        'seasonButtons',
        [
          { value: 'winter', label: 'Зимнее время' },
          { value: 'summer', label: 'Летнее время' }
        ],
        app.state.season,
        (val) => {
          app.state.season = val;
          this.updateButtonsUI();
          controller.update();
        }
      );
    }
  },

  renderResult(text) {
    app.ui.result.innerText = text;
  },

  populateStops() {
    const stops = dataService.getStopsWithTime();
    const select = app.ui.stopSelect;

    select.innerHTML = '';
    stops.forEach(s => {
      const opt = document.createElement('option');
      opt.value = s.name;
      opt.textContent = s.name;
      select.appendChild(opt);
    });

    app.state.selectedStop = stops[0]?.name || null;
    select.value = app.state.selectedStop;
  }
};

// ========== CONTROLLER ==========
const controller = {
  async update() {
    if (!app.state.selectedStop) {
      ui.renderResult('Выберите остановку');
      return;
    }

    const upcoming = logic.getArrivalTimes(app.state.selectedStop);

    if (!upcoming.length) {
      ui.renderResult('На сегодня рейсов больше нет');
      return;
    }

    let text = `Остановка: ${app.state.selectedStop}\n\n`;
    text += `Ближайший: ${upcoming[0].arrival_time} | ${upcoming[0].bus_group} график`;

    if (upcoming[1]) {
      text += `\nСледующий: ${upcoming[1].arrival_time} | ${upcoming[1].bus_group} график`;
    }

    ui.renderResult(text);
  },

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

// ========== PWA: регистрация Service Worker ==========
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('SW registered', reg.scope))
      .catch(err => console.log('SW registration failed', err));
  });
}

// ========== INIT ==========
async function init() {
  ui.initRefs();

  const res = await fetch('data.json');
  const data = await res.json();

  app.data.stops = data.stops;
  app.data.schedules = data.schedules;

  const detected = dataService.detectStructure(app.data.schedules);
  app.config = {
    ...app.config,
    ...detected,
    seasonDates: data.season_dates || null
  };

  document.getElementById('routeHeader').innerText = data.route_header;
  document.getElementById('routeSubscription').innerText = data.route_subscription;

  document.querySelector('.direction-btn').onclick = () => {
    controller.swapDirection();
  };

  app.ui.providerLink.innerText = data.route_provider;
  app.ui.providerLink.href = data.route_link;

  app.ui.phoneLink.innerText = utils.formatPhone(data.route_support);
  app.ui.phoneLink.href = `tel:${data.route_support}`;

  const { today } = await api.getDayTypes();

  if (app.config.hasDayTypes) app.state.dayType = today;
  if (app.config.hasSeasons) app.state.season = dataService.getSeasonByDate();

  if (app.data.stops.route_forward.length) {
    app.ui.from.innerText = app.data.stops.route_forward[0].name;
    app.ui.to.innerText = app.data.stops.route_reverse[0].name;
  }

  ui.updateButtonsUI();
  ui.populateStops();

  app.ui.stopSelect.onchange = () => {
    app.state.selectedStop = app.ui.stopSelect.value;
    controller.update();
  };

  controller.update();
}

init();