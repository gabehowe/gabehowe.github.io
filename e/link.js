'use strict'
const linkButtons = document.querySelectorAll('.link_btn')
linkButtons.forEach((button) => {
    button.addEventListener('click', () => {
        window.location.href = button.getAttribute('link')
    })
})
