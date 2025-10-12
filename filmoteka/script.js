class Filmoteka {
    constructor() {
        // === Настройки ===
        this.API_KEY = '5bd42146-7679-4016-b124-f278ca89ea1b';
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
                SIMILAR_TITLE: (filmTitle) => `${filmTitle}<br> <span class="similar-title-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5"/></svg></span> похожие фильмы`,
                SIMILAR_SUBTITLE: ''
            },
            ERRORS: {
                SEARCH: 'Ошибка при поиске фильмов',
                RECOMMENDATIONS_LOAD: 'Ошибка при загрузке рекомендаций',
                SIMILAR_LOAD: 'Ошибка при загрузке похожих фильмов',
                NOT_FOUND: 'Ничего не найдено',
                SIMILAR_NOT_FOUND: 'Похожие фильмы не найдены'
            },
            BUTTONS: {
                SIMILAR: 'Похожие',
                WATCH: 'Смотреть'
            }
        };

        this.initializeElements();
        this.bindEvents();
        this.loadRecomendations();
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

        try {
            const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(query)}&page=1`;
            const response = await fetch(url, { headers: this.getHeaders() });
            if (!response.ok) throw new Error('Ошибка поиска');

            const data = await response.json();
            const limitedFilms = data.films.slice(0, 10);
            this.displayFilms(limitedFilms, { showPosition: false });

        } catch (error) {
            this.showError(this.TEXTS.ERRORS.SEARCH);
        }
    }

    async loadRecomendations() {
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
        } catch (error) {
            console.error('Error loading recomendations:', error);
            this.showError(this.TEXTS.ERRORS.RECOMMENDATIONS_LOAD);
        }
    }

    async fetchRecomendations(page = 1) {
        try {
            const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=${page}`;
            const response = await fetch(url, { headers: this.getHeaders() });
            if (!response.ok) throw new Error('Ошибка загрузки рекомендаций');
            const data = await response.json();
            return data.films || [];
        } catch (error) {
            console.error('Error fetching recomendations:', error);
            throw error;
        }
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

        try {
            const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/similars`;
            const response = await fetch(url, { headers: this.getHeaders() });
            if (!response.ok) throw new Error('Ошибка загрузки похожих фильмов');

            const data = await response.json();

            if (data.items && data.items.length > 0) {
                const detailedFilms = await this.loadFilmDetails(data.items.slice(0, 10));
                this.displayFilms(detailedFilms);
            } else {
                this.showError(this.TEXTS.ERRORS.SIMILAR_NOT_FOUND);
            }

        } catch (error) {
            console.error('Error loading similar films:', error);
            this.showError(this.TEXTS.ERRORS.SIMILAR_LOAD);
        }
    }

    async loadFilmDetails(films) {
        const detailedFilms = [];

        for (const film of films) {
            try {
                const filmId = film.filmId || film.kinopoiskId;
                const detailUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`;
                const response = await fetch(detailUrl, { headers: this.getHeaders() });

                if (response.ok) {
                    const filmDetails = await response.json();
                    detailedFilms.push(filmDetails);
                } else {
                    detailedFilms.push(film);
                }
            } catch (error) {
                console.error('Error fetching film details:', error);
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
            const filmHTML = this.createFilmItem(film, {
                showPosition: options.showPosition || false,
                position: position
            });
            this.cardsContainer.insertAdjacentHTML('beforeend', filmHTML);
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
        const ratingColor = rating ? this.getRatingColor(rating) : '';
        const positionDisplay = options.showPosition ? `#${options.position} ` : '';

        return `
            <div class="film-card">
                <img src="${poster}" alt="${title}" class="film-card__poster" onerror="this.style.display='none'">
                <div class="film-card__content">
                    <div class="film-card__header">
                        <div class="film-card__meta">
                            <span class="film-card__meta-item">${positionDisplay}${typeText}</span>
                            ${rating ? `<span class="film-card__rating">Рейтинг: <span class="film-card__rating-value film-card__rating--${ratingColor}">${rating}</span></span>` : ''}
                        </div>
                        <div class="film-card__title">${title}</div>
                        ${year && year !== 'Неизвестно' ? `<div class="film-card__year">${year} год</div>` : ''}
                    </div>
                    <div class="film-card__actions">
                        <button class="btn btn--secondary" onclick="filmoteka.showSimilarFilms(${filmId}, '${title.replace(/'/g, "\\'")}')">
                            ${this.TEXTS.BUTTONS.SIMILAR}
                        </button>
                        <button class="btn btn--primary" onclick="filmoteka.watchFilm(${filmId})">
                            <svg width="12" height="12" viewBox="0 0 448 512" fill="currentColor">
                                <path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72v368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/>
                            </svg>
                            ${this.TEXTS.BUTTONS.WATCH}
                        </button>
                    </div>
                </div>
            </div>
        `;
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
    getHeaders() {
        return {
            'X-API-KEY': this.API_KEY,
            'Content-Type': 'application/json'
        };
    }

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
