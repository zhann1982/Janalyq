function getCategoryIdFromUrl() {
    const params = new URLSearchParams(window.location.search)
    return params.get('id')
}

function submitEditCategory() {

}

const BASE_URL = "https://webfinalapi.mobydev.kz"

async function fetchAndRenderCategoryName(categoryId) {
    try {

        const response = await fetch(`${BASE_URL}/categories/${categoryId}`)

        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`)

        const category = await response.json();

        document.querySelector('.category__name').value = category.name;


    } catch (error) {
        console.error(`Ошибка при получении новости: ${error}`)
    }    
}

document.addEventListener('DOMContentLoaded', () => {
    const categoryId = getCategoryIdFromUrl()
    if (categoryId) {
        fetchAndRenderCategoryName(categoryId)
    } else {
        console.error('ID новости не найден в URL')
    }

    submitEditCategory()
})