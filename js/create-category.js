const authToken = localStorage.getItem('authToken')
const BASE_URL = "https://webfinalapi.mobydev.kz"

document.onreadystatechange = () => {if (!authToken)  window.location.href = './index.html'}

function logout() {
    localStorage.removeItem('authToken')
    window.location.href = './index.html'
}

document.querySelector('.button--blue').addEventListener('click', async (event) => {
    event.preventDefault()

    const name = document.querySelector('.category__name').value
    
    if (!name) {
        alert('Пожалуйста, заполните все поля')
        return;
    }

    // const formData = new FormData()
    // formData.append('name', name)

    try {
        const response = await fetch(`${BASE_URL}/category`, {
            method: 'POST',
            headers: {
                'Authorization':`Bearer ${authToken}`,
                'accept': 'application/json',  
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name})
        })

        if (response.ok) {
            alert('Категория успешно добавлена')
            window.location.href = './categories.html'
        } else {
            alert('Ошибка при добавлении категории!')
        }
    } catch(error) {
        console.error("Ошибка: ", error)
    }
})

