const BASE_URL = "https://webfinalapi.mobydev.kz"

async function fetchAndRenderCategories() {
    try {
        const response = await fetch(`${BASE_URL}/categories`)
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)

        const categoriesArray = await response.json()
        document.querySelector(`.categories__list`).innerHTML = categoriesArray.map(category => `
                <li class="categories__list-item">
                    <h4 class="categories__category-title">${category.name}</h4>
                    <div class="categories__actions">
                        <button onclick="./edit-category.html?id=${category.id}" class="button button--blue button--small">
                            Редактировать
                        </button>
                        <button onclick="deleteCategory(${category.id})" class="button button--red button--small">
                            Удалить
                        </button>
                    </div>
                </li>
            `).join('');
    } catch (error) {
        console.error(`Ошибка при получении списка категории: ${error}`)
    }    
}

document.addEventListener('DOMContentLoaded', fetchAndRenderCategories)

