document.querySelector('.main__signup').addEventListener('submit', async (event) => {
    event.preventDefault()

    const name = document.querySelector('.main__name').value
    const email = document.querySelector('.main__email').value
    const password = document.querySelector('.main__password').value

    try {
        const response = await fetch('https://webfinalapi.mobydev.kz/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name, email, password})
        })

        if (response.ok) {
            const {token} = await response.json()
            localStorage.setItem('authToken', token)
            window.location.href = './index.html'
        }
    } catch(error) {
        console.error("Ошибка при регистрации: ", error)
    }
})
