document.onreadystatechange = () => {if (!localStorage.getItem('authToken'))  window.location.href = './index.html'}

function submitCreateCategory() {
    
}

function logout() {
    localStorage.removeItem('authToken')
    window.location.href = './index.html'
}