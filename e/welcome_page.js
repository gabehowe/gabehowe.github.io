'use strict'
const linkButtons = document.querySelectorAll('.link_btn')
let christmasMode = false;
let infoSuffix = ' Have fun, and goodbye!'
const date = new Date()
linkButtons.forEach((button) => {
    button.addEventListener('click', () => {
        window.location.href = button.getAttribute('link')
    })
})
if (date.getMonth() === 11) {
    if (date.getDate() < 25) {
        christmasMode = true;
    }
}

if (christmasMode) {
    for (const snowflake of document.querySelectorAll('.snowflakes')[0].children) {
        snowflake.visibility = 'visible'
    }
    infoSuffix = ' Merry Christmas!'
    const image = new Image()
    document.body.append(image)
    image.src = './pictures/snowflake banner.svg'
    image.style.position = 'absolute'
    image.style.top = '-3%'
    image.style.minWidth = '104%'
    image.style.maxHeight = '60%'
    image.draggable = false;
    console.log(image.width)
    console.log("christmas!")
}
let text = document.getElementById('info_text').innerText
text += infoSuffix
document.getElementById('info_text').innerText = text