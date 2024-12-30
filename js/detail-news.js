const authToken = localStorage.getItem('authToken')
const BASE_URL = "https://webfinalapi.mobydev.kz"

const newsId = getNewsIdFromUrl()

async function delete_News() {

    if (!authToken) {
        alert('Авторизуйтесь для удаления новости')
        return;
    }

    const isConfirmed = confirm('Вы уверены что хотите удалить данную новость')
    if (!isConfirmed) return

    try {
        const response = await fetch(`${BASE_URL}/news/${newsId}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'accept': 'application/json'
                }
        })

        if (response.ok) {
            alert('Новость успешно удалена.')
            window.location.href = "./index.html"
        } else {
            alert('Ошибка при удалении новости.')
        }
    } catch (error) {
        console.error('Ошибка: ', error)
    }
    
}

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
        if (authToken) {
            document.querySelector('.addCategory-link').href = `./edit-news.html?id=${newsId}`;
        } else {
            const buttonEdit  = document.querySelector('.buttonEdit')
            const buttonDelete  = document.querySelector('.buttonDelete')

            buttonEdit.style.background = "#C9C9C9"
            buttonDelete.style.background = "#C9C9C9"

            buttonEdit.addEventListener('click', (e) => {
                e.preventDefault()
                alert('Авторизуйтесь для редактирования новости')
            })

            const categoriesLink  = document.querySelector('.categoriesLink')
            categoriesLink.href = '#'
            categoriesLink.addEventListener('click', (e) => {
                e.preventDefault()
                alert('Требуется авторизация!')
            })
        }

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
         <div class="user header__user">
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

    if (newsId) {
        fetchAndRenderNewsById(newsId)
    } else {
        console.error('ID новости не найден в URL')
    }
})

