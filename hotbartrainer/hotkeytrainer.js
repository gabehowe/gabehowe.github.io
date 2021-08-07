'use strict'
/*** web tool that lets us practice hotkeys with a fake hotbar
 * it's conceptually simple i think
 * u gotta be able to change the binds
 * and which items are in which slots
 * the you have the app randomly show you an item and the time it takes for you to switch to it
 * sort of like a touch typing trainer specifically for minecraft hotbars***/

const binds = {}
let inHotbar = []
let nextKey = false;
let toBeBound = '';
let running = false
const trainerIMG = document.querySelector('.trainer-img')
const bottomText = document.getElementById('bottomText')
const topText = document.getElementById('topText')
let time = 0
let interval = 0
let currentItem = null
const yourTime = document.querySelector('.your-time')
document.addEventListener('keypress', (event) => {
    if (event.shiftKey && !nextKey) {
        nextKey = true
        toBeBound = event.key
        return;
    }
    if (nextKey) {
        if (isNaN(event.key)) {
            topText.style.color = 'rgba(255,0,21,0.68)'
            topText.innerText = "invalid slot number"
            setTimeout(() => {
                topText.innerText = ''
            }, 1000)
            return;
        }
        if (bottomText.innerText.includes(`: ${toBeBound}`)) {
            const num = bottomText.innerText.substr(bottomText.innerText.indexOf(` : ${toBeBound}`) - 1, 1)
            binds[num] = undefined
        }
        binds[event.key] = toBeBound
        let boundstr = "use shift + &lt;key&gt; and then the number of the slot to bind a key <br> Current binds: <br>"
        for (const [key, value] of Object.entries(binds)) {
            if (value === undefined) continue
            boundstr += `${key} : ${value} <br>`
        }
        bottomText.innerHTML = boundstr
        console.log(`${toBeBound} bound to ${event.key}`)
        nextKey = false
    }
    if (running) {
        if (binds[currentItem.parentElement.id] === undefined) {
            return;
        }
        if (binds[currentItem.parentElement.id].toLowerCase() !== event.key.toLowerCase()) {
            return;
        }
        clearInterval(interval)
        yourTime.innerText = time / 1000
        trainerIMG.style.visibility = 'hidden'
        yourTime.style.visibility = 'visible'
        time = 0
        setTimeout(() => trainerStart(), 500)




    }


})


const slots = document.querySelectorAll('.slot')

const onDragOver = (event) => {
    event.preventDefault()
}
const onDrop = (event) => {
    event.preventDefault()
    if (event.dataTransfer == null) {
        return;
    }
    const draggedCardId = event.dataTransfer.getData('id')
    const draggedCard = document.getElementById(draggedCardId)
    if (event.target.classList.contains('card')) {
        return
    }
    if (!event.target.classList.contains('bank')) {
        inHotbar.push(draggedCard)
    } else {
        inHotbar = arrayRemove(inHotbar, draggedCard)
    }
    event.target.appendChild(draggedCard)
}


slots.forEach((slot) => {
    slot.ondragover = onDragOver;
    slot.ondrop = onDrop;
})

const cards = document.querySelectorAll('.card')

const onDragStart = (event) => {
    event.dataTransfer.setData('id', event.target.id)

}
const onDragEnd = () => {
}
const onDropCard = (event) => {
    event.preventDefault()
}
cards.forEach((card) => {
    card.ondragstart = onDragStart;
    card.ondragend = onDragEnd;
    card.ondrop = onDropCard;
})

const startButton = document.getElementById('start')


startButton.addEventListener('click', () => {
    if (!running) {
        if (inHotbar.length < 1) {
            return;
        }
        running = true
        startButton.innerText = "Stop Trainer"
        trainerStart()

    } else {
        trainerIMG.src = ""
        trainerIMG.style.visibility = 'hidden'
        running = false
        startButton.innerText = "Start Trainer"
        yourTime.style.visibility = 'hidden'

    }
})

function arrayRemove(arr, value) {

    return arr.filter(function (ele) {
        return ele !== value;
    });
}
function trainerStart() {
    yourTime.style.visibility = 'hidden'
    const rand = Math.floor(Math.random() * inHotbar.length)
    currentItem = inHotbar[rand]
    trainerIMG.src = currentItem.src
    trainerIMG.style.visibility = 'visible'
    interval = setInterval(() => {
        time += 10
    }, 10)
}