const BASE_URL = "https://webfinalapi.mobydev.kz"

async function fetchAndRenderNews() {
    try {
        const response = await fetch(`${BASE_URL}/news`)
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)

        const newsArray = await response.json()
        document.querySelector(`.news-grid`).innerHTML = newsArray.map(news => `
            <article class="news-card">
                <div class="news-card__image">
                    <img 
                        src="${BASE_URL}${news.thumbnail.startsWith('/')?'':'/'}${news.thumbnail}" 
                        alt="${news.title}"
                    >
                </div>
                <div class="news-card__content">
                    <a class="news-card__link" href="./detail-news.html?id=${news.id}">
                        <h2 class="news-card__title">
                            ${news.title}
                        </h2>
                        <p class="news-card__attributes">
                            ${news.createdAt.split(' ').shift()} • ${news.category.name || 'Категория'}
                        </p>
                    </a>
                    <div>
                        <div class="new-card__author">
                            <div class="user">
                                <div class="user__avatar">
                                    <img 
                                        src="https://i.pravatar.cc/150?img=${news.author.id}" alt="Аватар"
                                    >
                                </div>
                                <p class="user__name">${news.author.name || 'Неизвестный автор'}</p>
                            </div>
                        </div>
                        <div class="new-card__actions">
                            <a 
                                href="./edit-news.html?id=${news.id}"
                                class="button button--blue button--small"
                            >
                                Редактировать
                            </a>
                            <button
                                type="button"
                                class="button button--red button--small"
                                onclick="deleteNews(${news.id})"
                            >
                                Удалить
                            </button>
                        </div>
                    </div>
                </div>
            </article>
        `).join('');
    } catch (error) {
        console.error(`Ошибка при получении новостей: ${error}`)
    }    
}

document.addEventListener('DOMContentLoaded', fetchAndRenderNews)