const authToken = localStorage.getItem('authToken')
const BASE_URL = "https://webfinalapi.mobydev.kz"
const params = new URLSearchParams(window.location.search)
const id = params.get('id')


document.onreadystatechange = () => {if (!authToken)  window.location.href = './index.html'}

function logout() {
    localStorage.removeItem('authToken')
    window.location.href = './index.html'
}

function getCategoryIdFromURL() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
}

async function fetchAndRenderCategoryName(categoryId) {
    try {

        const response = await fetch(`${BASE_URL}/categories/${categoryId}`)
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)
        const category = await response.json();
        document.querySelector('.category__name').value = category.name;

    } catch (error) {
        console.error(`Ошибка при получении категории: ${error}`)
    }    
}

document.addEventListener('DOMContentLoaded', () => {
    categoryId = getCategoryIdFromURL()
    if (categoryId) {
        fetchAndRenderCategoryName(categoryId)
    } else {
        console.error('ID категории не найден в URL')
    }
})

document.querySelector('.category__container').addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = document.querySelector('.category__name').value

    if (!name) {
        alert('Пожалуйста, заполните все поля')
        return;
    }

    try {
        const id = getCategoryIdFromURL()
        const response = await fetch(`${BASE_URL}/category/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization':`Bearer ${authToken}`,
                'accept': 'application/json' 
            },
            body: JSON.stringify({id, name})
        })

        if (response.ok) {
            alert('Категория успешно обновлена')
            window.location.href = './categories.html'
        } else {
            const errorResponse = await response.json()
            alert('Ошибка при обновлении категории: ', (errorResponse.message || 'Проверьте данные'))
        }
    } catch(error) {
        console.error("Ошибка: ", error)
    }
})

document.addEventListener('DOMContentLoaded', async () => {
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
})