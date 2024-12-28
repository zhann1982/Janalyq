const authToken = localStorage.getItem('authToken')
const BASE_URL = "https://webfinalapi.mobydev.kz"
let categoryIdCheck

document.onreadystatechange = () => {if (!authToken)  window.location.href = './index.html'}

function logout() {
    localStorage.removeItem('authToken')
    window.location.href = './index.html'
}



document.addEventListener('DOMContentLoaded', async () => {

    const selectInput = document.querySelector('.news__category')
    const optionTag = document.createElement('option')
    optionTag.value = 0
    optionTag.textContent = ""
    selectInput.appendChild(optionTag)
    console.log(selectInput.selectedIndex, selectInput)

    try {
        const response = await fetch(`${BASE_URL}/categories`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            }
        })
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)

        const categoriesArray = await response.json()
        categoriesArray.map(category => {
            // const optionTag = `<option value="${category.id}">${category.name}</option>`
            const optionTag = document.createElement('option')
            optionTag.value = category.id
            optionTag.textContent = category.name
            selectInput.appendChild(optionTag)
        });
        
    } catch (error) {
        console.error(`Ошибка при получении списка категории: ${error}`)
    } 

    const urlParams = new URLSearchParams(window.location.search)
    const newsId = urlParams.get('id')

    if (newsId) {
        try {

            const response = await fetch(`${BASE_URL}/news/${newsId}`)
            if (response.ok) {
                const newsData = await response.json();

                document.querySelector('.news__title').value = newsData.title
                document.querySelector('.news__category').value = newsData.category.id
                console.log(newsData.category.id)
                document.querySelector('.news__content').value = newsData.content
            } else {
                alert('Ошибка при загрузке данных')
            }
            
    
        } catch (error) {
            console.error(`Ошибка: ${error}`)
        }  
    }

    document.querySelector('.news__form').addEventListener('submit', async (event) => {
        event.preventDefault()
    
        const title = document.querySelector('.news__title').value
        const content = document.querySelector('.news__content').value
        const categoryId = document.querySelector('.news__category').value
        const thumbnail = document.querySelector('.news__image').files[0]
    
        if (!title || !content || !categoryId || !thumbnail) {
            alert('Пожалуйста, заполните все поля')
            return;
        }
    
        const formData = new FormData()
        formData.append('title', title)
        formData.append('content', content)
        formData.append('categoryId', categoryId)
        formData.append('thumbnail', thumbnail)
    
        try {
            const response = await fetch(`${BASE_URL}/news/${newsId}`, {
                method: 'PUT',
                headers: {
                    'Authorization':`Bearer ${authToken}` 
                },
                body: formData
            })
    
            if (response.ok) {
                alert('Новость успешно обновлена')
                window.location.href = './index.html'
            } else {
                const errorResponse = await response.json()
                alert('Ошибка при обновлении новости: ', (errorResponse.message || 'Проверьте данные'))
            }
        } catch(error) {
            console.error("Ошибка: ", error)
        }
    })
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

document.querySelector('script').onload = function () {
    document.querySelector('.news__category').selectedIndex = categoryIdCheck
    console.log(categoryIdCheck)
}
