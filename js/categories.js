const authToken = localStorage.getItem('authToken')
const BASE_URL = "https://webfinalapi.mobydev.kz"

document.onreadystatechange = function(e) {
    if (document.readyState === 'complete') {
        if (!authToken) {
            window.location.href = './index.html'
        } else {
            window.onload = function(e){
                fetchAndRenderCategories()
            }
        }
    }
};

function logout() {
    localStorage.removeItem('authToken')
    window.location.href = './index.html'
}

async function deleteCategory(id) {

    if (!authToken) {
        alert('Авторизуйтесь для удаления категории')
        return;
    }

    const isConfirmed = confirm('Вы уверены что хотите удалить данную категорию')
    if (!isConfirmed) return

    try {
        const response = await fetch(`${BASE_URL}/category/${id}`, {
                method: "DELETE",
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${authToken}`                    
                }
        })

        if (response.ok) {
            alert('Категория успешно удалена.')
            window.location.reload()
        } else {
            alert('Ошибка при удалении категории.')
        }
    } catch (error) {
        console.error('Ошибка: ', error)
    }
    
}

async function fetchAndRenderCategories() {
    try {
        const response = await fetch(`${BASE_URL}/categories`)
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)

        const categoriesArray = await response.json()
        document.querySelector(`.categories__list`).innerHTML = categoriesArray.map(category => `
                <li class="categories__list-item">
                    <h4 class="categories__category-title">${category.name}</h4>
                    <div class="categories__actions">
                        <a href="./edit-category.html?id=${category.id}">
                            <button class="button button--blue button--small">
                                Редактировать
                            </button>
                        </a>
                        <button onclick="deleteCategory(${category.id})" class="button button--red button--small">
                            Удалить
                        </button>
                    </div>
                </li>
            `).join('');
    } catch (error) {
        console.error(`Ошибка при получении списка категории: ${error}`)
    }    

    try {
        const response = await fetch('https://webfinalapi.mobydev.kz/user/profile', {
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





