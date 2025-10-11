const API_KEY = '5bd42146-7679-4016-b124-f278ca89ea1b';
let isSearchActive = false;
let top250Cache = {};
let currentPage = 1;
const filmsPerPage = 20;
const totalFilms = 250;

const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const resultsDiv = document.getElementById('results');
const recommendationsSection = document.getElementById('recommendationsSection');
const similarSection = document.getElementById('similarSection');
const similarResultsDiv = document.getElementById('similarResults');
const similarTitle = document.getElementById('similarTitle');
const backBtn = document.getElementById('backBtn');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const recommendationsDiv = document.getElementById('recommendations');

document.addEventListener('DOMContentLoaded', function() {
    loadTop250();
    
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            loadTop250();
        }
    });
    
    nextPageBtn.addEventListener('click', () => {
        if (currentPage < Math.ceil(totalFilms / filmsPerPage)) {
            currentPage++;
            loadTop250();
        }
    });
});

searchBtn.addEventListener('click', toggleSearch);
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (isSearchActive) {
            clearSearch();
        } else {
            searchFilms();
        }
    }
});

backBtn.addEventListener('click', function() {
    hideSimilar();
    showRecommendations();
});

function getRatingColor(rating) {
    if (rating >= 0 && rating < 3) return 'rating-low';
    if (rating >= 3 && rating < 6) return 'rating-med';
    if (rating >= 6 && rating <= 10) return 'rating-high';
    return 'rating-low';
}

function formatRating(rating) {
    if (!rating || rating === 'null') return null;
    const numRating = parseFloat(rating);
    return isNaN(numRating) ? null : numRating.toFixed(1);
}

function updateSearchButton() {
    if (isSearchActive) {
        searchBtn.textContent = 'Закрыть';
        searchBtn.classList.add('btn--danger');
    } else {
        searchBtn.textContent = 'Поиск';
        searchBtn.classList.remove('btn--danger');
    }
}

function hideRecommendations() {
    recommendationsSection.classList.add('hidden');
}

function showRecommendations() {
    recommendationsSection.classList.remove('hidden');
}

function hideSimilar() {
    similarSection.classList.add('hidden');
}

function showSimilar() {
    similarSection.classList.remove('hidden');
}

function updatePagination() {
    currentPageSpan.textContent = currentPage;
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage >= Math.ceil(totalFilms / filmsPerPage);
}

function createFilmItem(film, options = {}) {
    const {
        showPosition = false,
        position = 0,
        customType = null
    } = options;
    
    const filmId = film.kinopoiskId || film.filmId;
    const title = film.nameRu || film.nameEn || 'Без названия';
    const year = film.year || 'Неизвестно';
    const poster = film.posterUrlPreview || film.posterUrl || '';
    
    const filmType = film.type || film.filmType || 'FILM';
    const isSeries = filmType === 'TV_SERIES' || filmType === 'MINI_SERIES' || filmType === 'TV_SHOW';
    const typeText = customType || (isSeries ? 'Сериал' : 'Фильм');
    
    const rating = formatRating(film.rating || film.ratingKinopoisk || film.ratingImdb);
    const ratingColor = rating ? getRatingColor(rating) : '';
    
    const positionDisplay = showPosition ? `#${position} ` : '';
    
    return `
        <div class="film-item">
            <img src="${poster}" alt="${title}" class="film-poster" onerror="this.style.display='none'">
            <div class="film-content">
                <div class="film-header">
                    <div class="film-meta">
                        <span class="film-meta-item">${positionDisplay}${typeText}</span>
                        ${rating ? `<span class="film-rating">Рейтинг: <span class="rating-value ${ratingColor}">${rating}</span></span>` : ''}
                    </div>
                    <div class="film-title">${title}</div>
                    ${year && year !== 'Неизвестно' ? `<div class="film-year">${year} год</div>` : ''}
                </div>
                <div class="film-actions">
                    <button class="btn btn--secondary" onclick="showSimilarFilms(${filmId}, '${title.replace(/'/g, "\\'")}')">
                        Похожие
                    </button>
                    <button class="btn btn--primary" onclick="watchFilm(${filmId})">
                        <svg width="12" height="12" viewBox="0 0 448 512" fill="currentColor" style="margin-right: 5px;">
                            <path d="M91.2 36.9c-12.4-6.8-27.4-6.5-39.6 .7S32 57.9 32 72l0 368c0 14.1 7.5 27.2 19.6 34.4s27.2 7.5 39.6 .7l336-184c12.8-7 20.8-20.5 20.8-35.1s-8-28.1-20.8-35.1l-336-184z"/>
                        </svg>
                        Смотреть
                    </button>
                </div>
            </div>
        </div>
    `;
}

function displayFilms(container, films, options = {}) {
    if (!films || films.length === 0) {
        container.innerHTML = '<div class="message error">Фильмы не найдены</div>';
        return;
    }

    container.innerHTML = '<div class="films-container"></div>';
    const filmsContainer = container.querySelector('.films-container');
    
    filmsContainer.innerHTML = films.map((film, index) => {
        const position = options.startPosition ? (options.startPosition + index) : (index + 1);
        return createFilmItem(film, {
            showPosition: options.showPosition || false,
            position: position,
            customType: options.customType || null
        });
    }).join('');
}

function toggleSearch() {
    if (isSearchActive) {
        clearSearch();
    } else {
        searchFilms();
    }
}

function clearSearch() {
    searchInput.value = '';
    resultsDiv.innerHTML = '';
    isSearchActive = false;
    updateSearchButton();
    showRecommendations();
}

async function searchFilms() {
    const query = searchInput.value.trim();
    if (!query) return;

    isSearchActive = true;
    updateSearchButton();
    hideRecommendations();
    hideSimilar();
    
    resultsDiv.innerHTML = '<div class="message loading"><svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg></div>';

    try {
        const url = `https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=${encodeURIComponent(query)}&page=1`;
        
        const response = await fetch(url, {
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Ошибка поиска');
        
        const data = await response.json();
        const limitedFilms = data.films.slice(0, 10);
        displayFilms(resultsDiv, limitedFilms);
        
    } catch (error) {
        resultsDiv.innerHTML = '<div class="message error">Ошибка при поиске фильмов</div>';
    }
}

async function loadTop250() {
    if (top250Cache[currentPage]) {
        displayTop250(top250Cache[currentPage]);
        updatePagination();
        return;
    }

    recommendationsDiv.innerHTML = '<div class="message loading"><svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg></div>';
    
    try {
        const movies = await fetchTop250(currentPage);
        top250Cache[currentPage] = movies;
        displayTop250(movies);
        updatePagination();
    } catch (error) {
        console.error('Error loading top 250:', error);
        recommendationsDiv.innerHTML = '<div class="message error">Ошибка при загрузке Топ-250</div>';
    }
}

async function fetchTop250(page = 1) {
    try {
        const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/top?type=TOP_250_BEST_FILMS&page=${page}`;
        
        const response = await fetch(url, {
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Ошибка загрузки Топ-250');
        
        const data = await response.json();
        return data.films || [];
        
    } catch (error) {
        console.error('Error fetching top 250:', error);
        throw error;
    }
}

function displayTop250(movies) {
    const startPosition = (currentPage - 1) * filmsPerPage + 1;
    displayFilms(recommendationsDiv, movies, {
        showPosition: true,
        startPosition: startPosition
    });
}

async function showSimilarFilms(filmId, filmTitle) {
    clearSearch();
    hideRecommendations();
    hideSimilar();
    
    similarTitle.innerHTML = `<span style="font-size: var(--text-md); font-weight: 700;">${filmTitle}<br>⤷ похожие фильмы</span>`;
    similarResultsDiv.innerHTML = '<div class="message loading"><svg class="spinner" viewBox="0 0 50 50"><circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle></svg></div>';
    showSimilar();

    try {
        const url = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}/similars`;
        const response = await fetch(url, {
            headers: {
                'X-API-KEY': API_KEY,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Ошибка загрузки похожих фильмов');
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            const detailedFilms = await loadFilmDetails(data.items.slice(0, 10));
            displayFilms(similarResultsDiv, detailedFilms);
        } else {
            similarResultsDiv.innerHTML = '<div class="message error">Похожие фильмы не найдены</div>';
        }
        
    } catch (error) {
        console.error('Error loading similar films:', error);
        similarResultsDiv.innerHTML = '<div class="message error">Ошибка при загрузке похожих фильмов</div>';
    }
}

async function loadFilmDetails(films) {
    const detailedFilms = [];
    
    for (const film of films) {
        try {
            const filmId = film.filmId || film.kinopoiskId;
            const detailUrl = `https://kinopoiskapiunofficial.tech/api/v2.2/films/${filmId}`;
            
            const response = await fetch(detailUrl, {
                headers: {
                    'X-API-KEY': API_KEY,
                    'Content-Type': 'application/json'
                }
            });
            
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

function watchFilm(filmId) {
    window.location.href = `https://sspoisk.ru/film/${filmId}/`;
}

if ('serviceWorker' in navigator) {
navigator.serviceWorker.register('/filmoteka/sw.js')
    .then(registration => console.log('SW registered'))
    .catch(error => console.log('SW registration failed'));
}