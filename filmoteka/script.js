// === Настройка тестового режима ===
const USE_DEBUG_DATA = false; // <<< false — реальный API, true — фейковые карточки

class Filmoteka {
    constructor() {
        // === Настройки ===
        this.API_KEYS = [
            '5bd42146-7679-4016-b124-f278ca89ea1b', // основной
            '8e4b3214-1071-45b5-9e67-e31e97a6b1ec'  // резервный
        ];
        this.currentApiKeyIndex = 0; // индекс активного ключа

        this.isSearchActive = false;
        this.RecomendationsCache = {};
        this.currentPage = 1;
        this.filmsPerPage = 20;
        this.totalFilms = 250;

        // === Текстовые константы ===
        this.TEXTS = {
            NAV: {
                RECOMMENDATIONS_TITLE: 'Рекомендации',
                RECOMMENDATIONS_SUBTITLE: 'Лучшие фильмы и сериалы всех времен по версии пользователей КиноПоиска',
                SEARCH_RESULTS_TITLE: 'Результаты поиска',
                SEARCH_RESULTS_SUBTITLE: (query) => `По запросу: "${query}"`,
                SIMILAR_TITLE: (filmTitle) => `${filmTitle}<br> <span class="similar-title-icon"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5"/></svg></span> похожие фильмы`,
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
            }
        };

        // === Тестовые данные ===
        this.DEBUG_FILM = {
            kinopoiskId: 123456,
            nameRu: 'Тестовый режим',
            year: 1984,
            rating: 3.1,
            posterUrlPreview: 'https://upload.wikimedia.org/wikipedia/fa/4/47/Parker_2013_Movie_Poster.png',
            type: 'FILM'
        };

        this.initializeElements();
        this.bindEvents();
        this.loadRecomendations();
    }

    // === Универсальный безопасный запрос с резервным API ===
    async safeFetch(url) {
        for (let attempt = 0; attempt < this.API_KEYS.length; attempt++) {
            const apiKey = this.API_KEYS[this.currentApiKeyIndex];
            try {
                const response = await fetch(url, {
                    headers: this.getHeaders(apiKey)
                });

                if (response.ok) return response;

                // 403 / 429 — лимит или блокировка
                if (response.status === 403 || response.status === 429) {
                    console.warn(`API key ${apiKey} недоступен. Переключаемся на резервный...`);
                    this.switchApiKey();
                    continue;
                }

                throw new Error(`Ошибка запроса (${response.status})`);
            } catch (err) {
                console.error(`Ошибка с ключом ${apiKey}:`, err);
                this.switchApiKey();
            }
        }
        throw new Error('Все API-ключи недоступны.');
    }

    switchApiKey() {
        this.currentApiKeyIndex = (this.currentApiKeyIndex + 1) % this.API_KEYS.length;
    }

    getHeaders(apiKey = this.API_KEYS[this.currentApiKeyIndex]) {
        return {
            'X-API-KEY': apiKey,
            'Content-Type': 'application/json'
        };
    }

    // === Инициализация DOM-элементов ===
    initializeElements() {
        this.searchBtn = document.getElementById('searchBtn');
        this.searchInput = document.getElementById('searchInput');
        this.navigationTitle = document.getElementById('navigationTitle');
        this.navigationSubtitle = document.getElementById('navigationSubtitle');
        this.backBtn = document.getElementById('backBtn');
        this.prevPageBtn = document.getElementById('prevPage');
        this.nextPageBtn = document.getElementById('nextPage');
        this.currentPageSpan = document.getElementById('currentPage');
        this.cardsContainer = document.getElementById('cardsContainer');
    }

    // === Привязка событий ===
    bindEvents() {
        this.searchBtn.addEventListener('click', () => this.searchFilms());
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchFilms();
        });
        this.backBtn.addEventListener('click', () => this.showRecommendations());
        this.prevPageBtn.addEventListener('click', () => this.previousPage());
        this.nextPageBtn.addEventListener('click', () => this.nextPage());
    }

    // === Основные методы ===
    clearSearch() {
        this.isSearchActive = false;
        this.showRecommendations();
    }

    async searchFilms() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.searchInput.value = '';
        this.showNavigation(
            this.TEXTS.NAV.SEARCH_RESULTS_TITLE,
            this.TEXTS.NAV.SEARCH_RESULTS_SUBTITLE(query),
            true
        );
        this.showLoading();

        if (USE_DEBUG_DATA) {
            const DEBUGFilms = Array.from({ length: 20 }, (_, i) => ({
                ...this.DEBUG_FILM,
                kinopoiskId: 100000 + i,
                nameRu: `Тестовый режим #${i + 1}`
            }));
            this.displayFilms(DEBUGFilms);
            return;
        }

        try {
            const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(query)}&page=1`;
            const response = await this.safeFetch(url);
            const data = await response.json();
            const limitedFilms = data.films.slice(0, 10);
            this.displayFilms(limitedFilms, { showPosition: false });
        } catch {
            this.showError(this.TEXTS.ERRORS.SEARCH);
        }
    }

    async loadRecomendations() {
        if (USE_DEBUG_DATA) {
            this.showNavigation(
                this.TEXTS.NAV.RECOMMENDATIONS_TITLE,
                this.TEXTS.NAV.RECOMMENDATIONS_SUBTITLE,
                false
            );
            const DEBUGFilms = Array.from({ length: 20 }, (_, i) => ({
                ...this.DEBUG_FILM,
                kinopoiskId: 200000 + i,
                nameRu: `Тестовый режим #${i + 1}`
            }));
            this.displayFilms(DEBUGFilms, { showPosition: true, startPosition: 1 });
            this.updatePagination();
            return;
        }

        if (this.RecomendationsCache[this.currentPage]) {
            this.displayRecomendations(this.RecomendationsCache[this.currentPage]);
            this.updatePagination();
            return;
        }

        this.showLoading();
        try {
            const movies = await this.fetchRecomendations(this.currentPage);
            this.RecomendationsCache[this.currentPage] = movies;
            this.displayRecomendations(movies);
            this.updatePagination();
            this.showNavigation(
                this.TEXTS.NAV.RECOMMENDATIONS_TITLE,
                this.TEXTS.NAV.RECOMMENDATIONS_SUBTITLE,
                false
            );
        } catch {
            this.showError(this.TEXTS.ERRORS.RECOMMENDATIONS_LOAD);
        }
    }

    async fetchRecomendations(page = 1) {
        const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=${page}`;
        const response = await this.safeFetch(url);
        const data = await response.json();
        return data.films || [];
    }

    displayRecomendations(movies) {
        const startPosition = (this.currentPage - 1) * this.filmsPerPage + 1;
        this.displayFilms(movies, { showPosition: true, startPosition });
    }

    async showSimilarFilms(filmId, filmTitle) {
        this.clearSearch();
        this.showNavigation(
            this.TEXTS.NAV.SIMILAR_TITLE(filmTitle),
            this.TEXTS.NAV.SIMILAR_SUBTITLE,
            true
        );
        this.showLoading();

        if (USE_DEBUG_DATA) {
            const DEBUGFilms = Array.from({ length: 20 }, (_, i) => ({
                ...this.DEBUG_FILM,
                kinopoiskId: 300000 + i,
                nameRu: `Тестовый режим (похожие) #${i + 1}`
            }));
            this.displayFilms(DEBUGFilms);
            return;
        }

        try {
            const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/similars`;
            const response = await this.safeFetch(url);
            const data = await response.json();
            if (data.items && data.items.length > 0) {
                const detailedFilms = await this.loadFilmDetails(data.items.slice(0, 10));
                this.displayFilms(detailedFilms);
            } else {
                this.showError(this.TEXTS.ERRORS.SIMILAR_NOT_FOUND);
            }
        } catch {
            this.showError(this.TEXTS.ERRORS.SIMILAR_LOAD);
        }
    }

    async loadFilmDetails(films) {
        const detailedFilms = [];
        for (const film of films) {
            try {
                const filmId = film.filmId || film.kinopoiskId;
                const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`;
                const response = await this.safeFetch(url);
                const filmDetails = await response.json();
                detailedFilms.push(filmDetails);
            } catch {
                detailedFilms.push(film);
            }
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        return detailedFilms;
    }

    // === Рендер фильмов ===
    displayFilms(films, options = {}) {
        if (!films || films.length === 0) {
            this.showError(this.TEXTS.ERRORS.NOT_FOUND);
            return;
        }
        
        this.cardsContainer.innerHTML = '';
        
        films.forEach((film, index) => {
            const position = options.startPosition ? (options.startPosition + index) : (index + 1);
            const filmElement = this.createFilmItem(film, {
                showPosition: options.showPosition || false,
                position: position
            });
            this.cardsContainer.appendChild(filmElement);
        });
    }

    createFilmItem(film, options = {}) {
        const filmId = film.kinopoiskId || film.filmId;
        const title = film.nameRu || film.nameEn || 'Без названия';
        const year = film.year || 'Неизвестно';
        const poster = film.posterUrlPreview || film.posterUrl || '';
        const filmType = film.type || film.filmType || 'FILM';
        const isSeries = ['TV_SERIES', 'MINI_SERIES', 'TV_SHOW'].includes(filmType);
        const typeText = isSeries ? 'Сериал' : 'Фильм';
        const rating = this.formatRating(film.rating || film.ratingKinopoisk || film.ratingImdb);
        
        // Клонируем шаблон
        const template = document.getElementById('filmCardTemplate');
        const card = template.content.cloneNode(true);
        
        // Находим элементы
        const posterImg = card.querySelector('.film-card__poster');
        const metaItem = card.querySelector('.film-card__meta-item');
        const ratingEl = card.querySelector('.film-card__rating');
        const ratingValue = card.querySelector('.film-card__rating-value');
        const titleEl = card.querySelector('.film-card__title');
        const yearEl = card.querySelector('.film-card__year');
        const similarBtn = card.querySelector('.film-card__similar-btn');
        const watchBtn = card.querySelector('.film-card__watch-btn');
        
        // Заполняем данными
        if (poster) {
            posterImg.src = poster;
            posterImg.alt = title;
            posterImg.onerror = () => { posterImg.style.display = 'none'; };
        } else {
            posterImg.style.display = 'none';
        }
        
        // Позиция и тип
        const positionDisplay = options.showPosition ? `#${options.position} ` : '';
        metaItem.textContent = positionDisplay + typeText;
        
        // Рейтинг
        if (rating) {
            ratingEl.classList.remove('hidden');
            ratingValue.textContent = rating;
            ratingValue.className = 'film-card__rating-value'; // сбрасываем классы
            ratingValue.classList.add(`film-card__rating--${this.getRatingColor(rating)}`);
        }
        
        // Заголовок и год
        titleEl.textContent = title;
        
        if (year && year !== 'Неизвестно') {
            yearEl.classList.remove('hidden');
            yearEl.textContent = `${year} год`;
        }
        
        // Обработчики событий
        similarBtn.onclick = () => this.showSimilarFilms(filmId, title.replace(/'/g, "\\'"));
        watchBtn.onclick = () => this.watchFilm(filmId);
        
        return card;
    }

    // === Навигация / UI ===
    showNavigation(title, subtitle, showBackButton = false) {
        this.navigationTitle.innerHTML = title;
        this.navigationSubtitle.textContent = subtitle;
        if (showBackButton) {
            this.backBtn.classList.remove('hidden');
            this.prevPageBtn.classList.add('hidden');
            this.nextPageBtn.classList.add('hidden');
            this.currentPageSpan.parentElement.classList.add('hidden');
        } else {
            this.backBtn.classList.add('hidden');
            this.prevPageBtn.classList.remove('hidden');
            this.nextPageBtn.classList.remove('hidden');
            this.currentPageSpan.parentElement.classList.remove('hidden');
        }
    }

    showRecommendations() {
        this.showNavigation(
            this.TEXTS.NAV.RECOMMENDATIONS_TITLE,
            this.TEXTS.NAV.RECOMMENDATIONS_SUBTITLE,
            false
        );
        this.loadRecomendations();
    }

    showLoading() {
        this.cardsContainer.innerHTML = this.getLoadingHTML();
    }

    showError(message) {
        this.cardsContainer.innerHTML = this.getErrorHTML(message);
    }

    // === Пагинация ===
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
        this.prevPageBtn.disabled = this.currentPage === 1;
        this.nextPageBtn.disabled = this.currentPage >= Math.ceil(this.totalFilms / this.filmsPerPage);
    }

    // === Вспомогательные методы ===
    getRatingColor(rating) {
        if (rating >= 0 && rating < 3) return 'low';
        if (rating >= 3 && rating < 6) return 'med';
        if (rating >= 6 && rating <= 10) return 'high';
        return 'low';
    }

    formatRating(rating) {
        if (!rating || rating === 'null') return null;
        const numRating = parseFloat(rating);
        return isNaN(numRating) ? null : numRating.toFixed(1);
    }

    getLoadingHTML() {
        return `
            <div class="message message--loading">
                <svg class="spinner" viewBox="0 0 50 50">
                    <circle class="spinner__path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
            </div>
        `;
    }

    getErrorHTML(message) {
        return `<div class="message message--error">${message}</div>`;
    }

    watchFilm(filmId) {
        if (USE_DEBUG_DATA) {
            alert('Тестовый режим: переход к фильму отключён.');
            return;
        }
        window.location.href = `https://sspoisk.ru/film/${filmId}/`;
    }
}

// === Инициализация ===
const filmoteka = new Filmoteka();

// === Service Worker ===
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/filmoteka/sw.js')
        .then(() => console.log('SW registered'))
        .catch(err => console.log('SW registration failed', err));

}

