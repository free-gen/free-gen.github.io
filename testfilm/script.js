const USE_DEBUG_DATA = false;

class Filmoteka {
    constructor() {
        this.API_KEYS = [
            '5bd42146-7679-4016-b124-f278ca89ea1b',
            '16ce9175-1b36-42a3-be22-9397bb20bdd0',
            '8e4b3214-1071-45b5-9e67-e31e97a6b1ec'
        ];
        this.currentApiKeyIndex = 0;
        this.isSearchActive = false;
        this.RecomendationsCache = {};
        this.currentPage = 1;
        this.filmsPerPage = 20;
        this.totalFilms = 250;

        this.TEXTS = {
            APP: {
                TITLE: 'Фильмотека',
                PLACEHOLDER: 'Найти фильм или сериал...',
                SEARCH_BTN: 'Поиск',
                BACK_BTN: 'На главную',
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
                SIMILAR_SUBTITLE: ''
            },
            ERRORS: {
                SEARCH: 'Ошибка поиска.<br>Превышен суточный лимит API-запросов.',
                RECOMMENDATIONS_LOAD: 'Ошибка при загрузке рекомендаций.<br>Превышен суточный лимит API-запросов.',
                SIMILAR_LOAD: 'Ошибка при загрузке похожих фильмов.<br>Превышен суточный лимит API-запросов.',
                NOT_FOUND: 'Ничего не найдено',
                SIMILAR_NOT_FOUND: 'Похожие фильмы не найдены'
            },
            BUTTONS: {
                SIMILAR: 'Похожие',
                WATCH: 'Смотреть'
            },
            META: {
                FILM: 'Фильм',
                SERIES: 'Сериал'
            },
            RATING_LABEL: 'Рейтинг:'
        };

        this.DEBUG_BASE = {
            nameRu: 'Тестовый режим',
            year: 1984,
            rating: 3.1,
            posterUrlPreview: 'https://upload.wikimedia.org/wikipedia/fa/4/47/Parker_2013_Movie_Poster.png',
            type: 'FILM'
        };

        this.initializeElements();
        this.applyTexts();
        this.bindEvents();
        this.initializePlayerElements();
        this.bindPlayerEvents();
        this.loadRecomendations();
    }

    initializeElements() {
        this.appTitle = document.getElementById('appTitle');
        this.searchInput = document.getElementById('searchInput');
        this.searchBtn = document.getElementById('searchBtn');
        this.navigationTitle = document.getElementById('navigationTitle');
        this.navigationSubtitle = document.getElementById('navigationSubtitle');
        this.backBtn = document.getElementById('backBtn');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.paginationInfo = document.getElementById('paginationInfo');
        this.currentPageSpan = document.createElement('span');
        this.currentPageSpan.id = 'currentPage';
        this.paginationInfo.append(this.TEXTS.APP.PAGINATION_INFO + ' ', this.currentPageSpan);
        this.cardsContainer = document.getElementById('cardsContainer');
        this.footerTitle = document.getElementById('footerTitle');
        this.footerText = document.getElementById('footerText');
        this.footerCredit = document.getElementById('footerCredit');
    }

    initializePlayerElements() {
        this.playerSection = document.getElementById('playerSection');
        this.playerTitle = document.getElementById('playerTitle');
        this.playerSelect = document.getElementById('playerSelect');
        this.playerIframe = document.getElementById('playerIframe');
        this.closePlayer = document.getElementById('closePlayer');
    }

    applyTexts() {
        const t = this.TEXTS.APP;
        document.title = t.TITLE;
        this.appTitle.textContent = t.TITLE;
        this.searchInput.placeholder = t.PLACEHOLDER;
        this.searchBtn.insertAdjacentText('beforeend', t.SEARCH_BTN);
        this.backBtn.insertAdjacentText('beforeend', t.BACK_BTN);
        this.footerTitle.textContent = t.FOOTER_TITLE;
        this.footerText.textContent = t.FOOTER_TEXT;
        this.footerCredit.innerHTML = t.FOOTER_CREDIT;
    }

    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchFilms());
        this.searchInput.addEventListener('keypress', e => {
            if (e.key === 'Enter') this.searchFilms();
        });
        this.backBtn.addEventListener('click', () => this.showRecommendations());
        this.prevPageBtn.addEventListener('click', () => this.previousPage());
        this.nextPageBtn.addEventListener('click', () => this.nextPage());
    }

    bindPlayerEvents() {
        this.closePlayer.addEventListener('click', () => this.hidePlayer());
        
        this.playerSelect.addEventListener('change', (e) => {
            if (e.target.value) {
                this.playerIframe.src = e.target.value;
            }
        });

        this.playerSection.addEventListener('click', (e) => {
            if (e.target === this.playerSection) {
                this.hidePlayer();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.playerSection.classList.contains('hidden')) {
                this.hidePlayer();
            }
        });
    }

    async safeFetch(url) {
        let usedReserve = false;

        for (let attempt = 0; attempt < this.API_KEYS.length; attempt++) {
            const key = this.API_KEYS[this.currentApiKeyIndex];
            try {
                const response = await fetch(url, {
                    headers: {
                        'X-API-KEY': key,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    if (usedReserve) {
                        console.info(`Резервный API-ключ ${key} успешно использован.`);
                    }
                    return response;
                }

                console.warn(`API-ключ ${key} недоступен (HTTP ${response.status}). Переключаемся на резервный...`);
                usedReserve = true;
                this.switchApiKey();
                continue;
            } catch (err) {
                console.error(`Ошибка при использовании ключа ${key}:`, err);
                usedReserve = true;
                this.switchApiKey();
            }
        }

        console.error('Все API-ключи недоступны. Работа невозможна.');
        throw new Error('Все API-ключи недоступны.');
    }

    switchApiKey() {
        this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.API_KEYS.length;
    }

    getDebugFilms(p = 'Фильм', c = 20, s = 100000) {
        return Array.from({ length: c }, (_, i) => ({
            ...this.DEBUG_BASE,
            kinopoiskId: s + i,
            nameRu: `${this.DEBUG_BASE.nameRu} — ${p} #${i + 1}`
        }));
    }

    async searchFilms() {
        const q = this.searchInput.value.trim();
        if (!q) return;
        this.searchInput.value = '';
        this.showNavigation(
            this.TEXTS.NAV.SEARCH_RESULTS_TITLE,
            this.TEXTS.NAV.SEARCH_RESULTS_SUBTITLE(q),
            true
        );
        this.showLoading();
        
        if (USE_DEBUG_DATA) {
            return this.displayFilms(this.getDebugFilms('Поиск', 20, 100000));
        }
        
        try {
            const res = await this.safeFetch(
                `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(q)}&page=1`
            );
            const d = await res.json();
            this.displayFilms(d.films.slice(0, 10));
        } catch {
            this.showError(this.TEXTS.ERRORS.SEARCH);
        }
    }

    async loadRecomendations() {
        this.showNavigation(
            this.TEXTS.NAV.RECOMMENDATIONS_TITLE,
            this.TEXTS.NAV.RECOMMENDATIONS_SUBTITLE
        );
        
        if (USE_DEBUG_DATA) {
            return this.displayFilms(
                this.getDebugFilms('Рекомендации', 20, 200000),
                { showPosition: true, startPosition: 1 }
            );
        }
        
        this.showLoading();
        
        try {
            const res = await this.safeFetch(
                `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=${this.currentPage}`
            );
            const d = await res.json();
            this.displayFilms(d.films, {
                showPosition: true,
                startPosition: (this.currentPage - 1) * this.filmsPerPage + 1
            });
            this.updatePagination();
            this.showPagination(true);
        } catch {
            this.showError(this.TEXTS.ERRORS.RECOMMENDATIONS_LOAD);
        }
    }

    async showSimilarFilms(id, title) {
        this.showNavigation(
            this.TEXTS.NAV.SIMILAR_TITLE(title),
            this.TEXTS.NAV.SIMILAR_SUBTITLE,
            true
        );
        this.showLoading();
        
        if (USE_DEBUG_DATA) {
            return this.displayFilms(this.getDebugFilms('Похожие', 20, 300000));
        }
        
        try {
            const res = await this.safeFetch(
                `https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}/similars`
            );
            const d = await res.json();
            
            if (d.items?.length) {
                const arr = await Promise.all(
                    d.items.slice(0, 10).map(async f => {
                        try {
                            const r = await this.safeFetch(
                                `https://kinopoiskapiunofficial.tech/api/v2.2/films/${f.filmId}`
                            );
                            return await r.json();
                        } catch {
                            return f;
                        }
                    })
                );
                this.displayFilms(arr);
            } else {
                this.showError(this.TEXTS.ERRORS.SIMILAR_NOT_FOUND);
            }
        } catch {
            this.showError(this.TEXTS.ERRORS.SIMILAR_LOAD);
        }
    }

    displayFilms(films, opt = {}) {
        if (!films?.length) {
            return this.showError(this.TEXTS.ERRORS.NOT_FOUND);
        }
        
        this.cardsContainer.innerHTML = '';
        
        films.forEach((f, i) => {
            const card = this.createFilmItem(f, {
                showPosition: opt.showPosition,
                position: (opt.startPosition || 0) + i
            });
            this.cardsContainer.appendChild(card);
        });
    }

    createFilmItem(f, opt = {}) {
        const id = f.kinopoiskId || f.filmId;
        const title = f.nameRu || f.nameEn || 'Без названия';
        const year = f.year || 'Неизвестно';
        const poster = f.posterUrlPreview || f.posterUrl || '';
        const type = ['TV_SERIES', 'MINI_SERIES', 'TV_SHOW'].includes(f.type) 
            ? this.TEXTS.META.SERIES 
            : this.TEXTS.META.FILM;
        const rating = this.formatRating(f.rating || f.ratingKinopoisk || f.ratingImdb);
        
        const tpl = document.getElementById('filmCardTemplate').content.cloneNode(true);
        const img = tpl.querySelector('.film-card__poster');
        const meta = tpl.querySelector('.film-card__meta-item');
        const rEl = tpl.querySelector('.film-card__rating');
        const rVal = tpl.querySelector('.film-card__rating-value');
        const tEl = tpl.querySelector('.film-card__title');
        const yEl = tpl.querySelector('.film-card__year');
        const sim = tpl.querySelector('.film-card__similar-btn');
        const watch = tpl.querySelector('.film-card__watch-btn');
        
        if (poster) {
            img.src = poster;
            img.alt = title;
        } else {
            img.style.display = 'none';
        }
        
        meta.textContent = (opt.showPosition ? `#${opt.position} ` : '') + type;

        if (rating) {
            rEl.classList.remove('hidden');
            rEl.textContent = `${this.TEXTS.RATING_LABEL} `;
            rVal.textContent = rating;
            rVal.className = 'film-card__rating-value';
            rVal.classList.add(`film-card__rating--${this.getRatingColor(rating)}`);
            rEl.appendChild(rVal);
        }
        
        tEl.textContent = title;
        
        if (year && year !== 'Неизвестно') {
            yEl.classList.remove('hidden');
            yEl.textContent = `${year} год`;
        }
        
        sim.textContent = this.TEXTS.BUTTONS.SIMILAR;
        watch.insertAdjacentText('beforeend', this.TEXTS.BUTTONS.WATCH);
        
        sim.onclick = () => this.showSimilarFilms(id, title);
        watch.onclick = () => this.watchFilm(id, title);
        
        return tpl;
    }

    getRatingColor(r) {
        const val = parseFloat(r);
        if (val < 3) return 'low';
        if (val < 6) return 'med';
        return 'high';
    }

    showNavigation(t, s, back = false) {
        this.navigationTitle.innerHTML = t;
        this.navigationSubtitle.textContent = s;
        
        if (back) {
            this.backBtn.classList.remove('hidden');
            this.showPagination(false);
        } else {
            this.backBtn.classList.add('hidden');
            this.showPagination(true);
        }
    }

    showPagination(show) {
        if (show) {
            this.prevPageBtn.classList.remove('hidden');
            this.nextPageBtn.classList.remove('hidden');
            this.paginationInfo.classList.remove('hidden');
        } else {
            this.prevPageBtn.classList.add('hidden');
            this.nextPageBtn.classList.add('hidden');
            this.paginationInfo.classList.add('hidden');
        }
    }

    showRecommendations() {
        this.currentPage = 1;
        this.loadRecomendations();
    }

    showLoading() {
        this.cardsContainer.innerHTML = `
            <div class="message message--loading">
                <svg class="spinner" viewBox="0 0 50 50">
                    <circle class="spinner__path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
            </div>`;
    }

    showError(msg) {
        this.cardsContainer.innerHTML = `
            <div class="message message--error">
                ${msg}
            </div>`;
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.loadRecomendations();
        }
    }

    nextPage() {
        if (this.currentPage < Math.ceil(this.totalFilms / this.filmsPerPage)) {
            this.currentPage++;
            this.loadRecomendations();
        }
    }

    updatePagination() {
        this.currentPageSpan.textContent = this.currentPage;
    }

    formatRating(r) {
        const n = parseFloat(r);
        return isNaN(n) ? null : n.toFixed(1);
    }

    async watchFilm(id, title = '') {
        if (USE_DEBUG_DATA) {
            return this.showPlayer(title || 'Тестовый фильм', [
                { name: 'Тестовый плеер', url: 'about:blank' }
            ]);
        }

        this.showLoadingMessage('Загрузка плееров...');
        
        try {
            const players = await this.getPlayerLinksFromAPIs(id);
            
            if (players.length > 0) {
                this.showPlayer(title || 'Фильм', players);
            } else {
                this.showPlayerError('Плееры не найдены для этого фильма');
            }
        } catch (error) {
            console.error('Ошибка при получении плееров:', error);
            const fallbackPlayers = this.generateDirectPlayers(id);
            this.showPlayer(title || 'Фильм', fallbackPlayers);
        }
    }

    async getPlayerLinksFromAPIs(id) {
        const players = [];
        
        try {
            const videocdnResponse = await fetch(`https://videocdn.tv/api/short?api_token=EnbO9h8pv1VyjbCJhg0WM9nG259n7mtz&kinopoisk_id=${id}`);
            if (videocdnResponse.ok) {
                const data = await videocdnResponse.json();
                if (data.data && data.data.length > 0) {
                    const firstResult = data.data[0];
                    if (firstResult.iframe_src) {
                        players.push({
                            name: 'VideoCDN',
                            url: firstResult.iframe_src
                        });
                    }
                }
            }
        } catch (error) {
            console.log('VideoCDN API не доступен');
        }
        
        players.push(...this.generateDirectPlayers(id));
        
        return players;
    }

    generateDirectPlayers(id) {
        return [
            {
                name: 'Alloha',
                url: `https://api.alloha.tv/?token=04941a9a3ca3ac16e2b4327347bbc1&kp=${id}`
            },
            {
                name: 'Collaps',
                url: `https://api.collaps.io/?token=eedefb541aeba871dcfc756e6b31c02e&kp=${id}`
            },
            {
                name: 'Kodik',
                url: `https://kodik.info/search?kp=${id}&token=b7cc4293ed475c4ad1fd599d114f4435`
            },
            {
                name: 'Bazon',
                url: `https://bazon.cc/api/search?token=2848f79ca09d4bbbf419bcdb464b4d11&kp=${id}`
            },
            {
                name: 'HDVB',
                url: `https://hdvb.ru/api/search?token=5e2fe4c70bafd9a7414c4f170ee1b192&kp=${id}`
            }
        ];
    }

    showLoadingMessage(message) {
        this.playerTitle.textContent = message;
        this.playerSection.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        this.playerIframe.src = '';
        this.playerSelect.innerHTML = '<option value="">Загрузка...</option>';
    }

    showPlayer(title, players) {
        this.playerTitle.textContent = title;
        this.populatePlayerSelect(players);
        
        if (players.length > 0) {
            this.playerSelect.value = players[0].url;
            this.playerIframe.src = players[0].url;
        }
        
        this.playerSection.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    showPlayerError(message) {
        this.playerTitle.textContent = 'Ошибка';
        this.playerSection.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        this.playerIframe.srcdoc = `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { 
                        margin: 0; 
                        padding: 40px; 
                        background: #1a1a1a; 
                        color: #fff; 
                        font-family: Arial, sans-serif; 
                        display: flex; 
                        align-items: center; 
                        justify-content: center; 
                        height: 100vh; 
                        text-align: center;
                    }
                    .error-content { max-width: 400px; }
                </style>
            </head>
            <body>
                <div class="error-content">
                    <h3>😕 Не удалось загрузить плееры</h3>
                    <p>${message}</p>
                    <p><small>Попробуйте другой фильм или проверьте подключение</small></p>
                </div>
            </body>
            </html>
        `;
        
        this.playerSelect.innerHTML = '<option value="">Плееры недоступны</option>';
    }

    hidePlayer() {
        this.playerSection.classList.add('hidden');
        this.playerIframe.src = '';
        document.body.style.overflow = '';
    }

    populatePlayerSelect(players) {
        this.playerSelect.innerHTML = '<option value="">Выберите плеер</option>';
        
        players.forEach(player => {
            const option = document.createElement('option');
            option.value = player.url;
            option.textContent = player.name;
            this.playerSelect.appendChild(option);
        });
    }
}

const filmoteka = new Filmoteka();

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/filmoteka/sw.js').catch(() => {});
}