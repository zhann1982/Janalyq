const authToken = localStorage.getItem('authToken')
const BASE_URL = "https://webfinalapi.mobydev.kz"

// document.onreadystatechange = () => {if (!authToken)  window.location.href = './index.html'}

function getNewsIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
}

function logout() {
    localStorage.removeItem('authToken')
    window.location.href = './index.html'
}


async function fetchAndRenderNewsById(newsId) {
    try {

        const response = await fetch(`${BASE_URL}/news/${newsId}`)
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)

        const news = await response.json();

        document.querySelector('.news__title').textContent = news.title;
        document.querySelector('.author__name').textContent = news.author.name || 'Неизвестный автор';
        document.querySelector('.news__createdAt').textContent = new Date(news.createdAt).toLocaleDateString();
        document.querySelector('.news__category').textContent = news.category.name;
        document.querySelector('.news__image').src = `${BASE_URL}${news.thumbnail}`;
        document.querySelector('.news__content').textContent = news.content;
        document.querySelector('.user__avatar-img').src = `https://i.pravatar.cc/150?img=${news.author.id}`;
        document.querySelector('.addCategory-link').href = `./edit-news.html?id=${newsId}`;

    } catch (error) {
        console.error(`Ошибка при получении новости: ${error}`)
    }   
    
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

            document.querySelector('.user__avatar img').src = `https://i.pravatar.cc/150?img=${user.id}`
            document.querySelector('.user__name').innerText = user.name
        }
    } catch(error) {
        console.error("Ошибка при авторизации: ", error)
    }
}

document.addEventListener('DOMContentLoaded', async () => {

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

    const newsId = getNewsIdFromUrl()
    if (newsId) {
        fetchAndRenderNewsById(newsId)
    } else {
        console.error('ID новости не найден в URL')
    }
})