const authToken = localStorage.getItem('authToken')

function logout() {
    localStorage.removeItem('authToken')
    window.location.reload()
}

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
                            ${new Date(news.createdAt).toLocaleDateString()} • ${news.category.name || 'Категория'}
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
        setupActionButtons();
    } catch (error) {
        console.error(`Ошибка при получении новостей: ${error}`)
    }    
}

async function setupActionButtons() {
    
    const headerAuth = document.querySelector('.header__auth')

    if (authToken) {

        let userId, userName

        try {
            const response = await fetch(`${BASE_URL}/user/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'accept': 'application/json'
                },
            })
    
            if (response.ok) {
                const user = await response.json()
                userId = user.id
                userName = user.name
            }
        } catch(error) {
            console.error("Ошибка при авторизации: ", error)
        }
        
        
        headerAuth.innerHTML = 
        `
         <div class="user">
            <div class="user__avatar">
                <img 
                    src="https://i.pravatar.cc/150?img=${userId}" alt="Аватар"
                >
            </div>
            <p class="user__name">${userName}</p>
        </div>
        <button 
            class="button button--red button--small"
            onclick="logout()"
        >
            Выйти
        </button>
        `
    }

    document.querySelectorAll('.new-card__actions a.button--blue').forEach(link => {
        link.addEventListener('click', event => {
            if (!authToken) {
                event.preventDefault()
                alert('Авторизуйтесь для редактирования.')
            }
        })
    })

    document.querySelectorAll('.new-card__actions button.button--red').forEach(link => {
        link.addEventListener('click', event => {
            if (!authToken) {
                event.preventDefault()
                alert('Авторизуйтесь для удаления.')
            }
        })
    })
}

function displayCreateButton () {
    if (authToken) {
        const div = document.createElement('div')
        div.className = "fixed-button"
        div.innerHTML = `
            <a href="./create-news.html" class="addCategory-link">
                <button type="button" class="button-disk button--green">
                    <img src="./img/plus-white.png" alt="Кнопка Добавить категорию">
                </button>
            </a>
            ` 
        document.body.appendChild(div)
    }
}

document.querySelector('.header__nav-link__category').addEventListener('click', (event) => {
    if (authToken) {
        window.location.href = './categories.html'
    } else {
        event.preventDefault()
        alert('Авторизуйтесь для перехода на страницу с категориями.')
    }
})

function deleteNews() {

}

document.addEventListener('DOMContentLoaded', () => {
    fetchAndRenderNews();
    displayCreateButton();
})

