document.onreadystatechange = () => {if (!localStorage.getItem('authToken'))  window.location.href = './index.html'}

function logout() {
    localStorage.removeItem('authToken')
    window.location.href = './index.html'
}

document.addEventListener('DOMContentLoaded', async () => {

    const authToken = localStorage.getItem('authToken')

    const urlParams = new URLSearchParams(window.location.search)
    const newsId = urlParams.get('id')

    if (newsId) {
        try {

            const response = await fetch(`https://webfinalapi.mobydev.kz/news/${newsId}`)
            if (response.ok) {
                const newsData = await response.json();

                document.querySelector('.news__title').value = newsData.title
                document.querySelector('.news__category').value = newsData.categoryId
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
            const response = await fetch(`https://webfinalapi.mobydev.kz/news/${newsId}`, {
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