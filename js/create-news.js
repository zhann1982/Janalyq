const authToken = localStorage.getItem('authToken')
const BASE_URL = "https://webfinalapi.mobydev.kz"

document.onreadystatechange = () => {if (!authToken)  window.location.href = './index.html'}
    
function logout() {
    localStorage.removeItem('authToken')
    window.location.href = './index.html'
}

document.querySelector('.button--blue').addEventListener('click', async (event) => {
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
        const response = await fetch(`${BASE_URL}/news`, {
            method: 'POST',
            headers: {
                'Authorization':`Bearer ${authToken}`,
                'accept': 'application/json',   
            },
            body: formData
        })

        if (response.ok) {
            alert('Новость успешно добавлена')
            window.location.href = './index.html'
        } else {
            alert('Ошибка при добавлении новости!')
        }
    } catch(error) {
        console.error("Ошибка: ", error)
    }
})