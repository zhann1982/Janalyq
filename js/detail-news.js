document.onreadystatechange = () => {if (!localStorage.getItem('authToken'))  window.location.href = './index.html'}

function getNewsIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
}

function logout() {
    localStorage.removeItem('authToken')
    window.location.href = './index.html'
}

// const newsId = getNewsIdFromUrl()

const BASE_URL = "https://webfinalapi.mobydev.kz"

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
}

document.addEventListener('DOMContentLoaded', () => {
    const newsId = getNewsIdFromUrl()
    if (newsId) {
        fetchAndRenderNewsById(newsId)
    } else {
        console.error('ID новости не найден в URL')
    }
})