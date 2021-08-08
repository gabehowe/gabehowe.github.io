'use strict'
/*** web tool that lets us practice hotkeys with a fake hotbar
 * it's conceptually simple i think
 * u gotta be able to change the binds
 * and which items are in which slots
 * the you have the app randomly show you an item and the time it takes for you to switch to it
 * sort of like a touch typing trainer specifically for minecraft hotbars***/
const binds = JSON.parse(localStorage.getItem('binds')) ?? {};
const hotbarContents = JSON.parse(localStorage.getItem('hotbarContents')) ?? {}
const hotbar = document.querySelector('.hotbar')
let inHotbar = []
const inHotbarObj = {}
let nextKey = false;
let toBeBound = '';
let running = false
let time = 0
let interval = 0
let currentItem = null
const trainerIMG = document.querySelector('.trainer-img')
const yourTime = document.querySelector('.your-time')
const slotButtons = document.querySelectorAll('.slot_button')
let currentBindButton = undefined
let nextClickReset = false
const buttonNames = JSON.parse(localStorage.getItem('buttonNames')) ?? {}
if (hotbarContents) {
    for (const [key, value] of Object.entries(hotbarContents)) {
        document.getElementById(key).appendChild(document.getElementById(value))
    }
    for (let child of hotbar.children) {
        if (child.firstElementChild) {
            inHotbar.push(child.firstElementChild)
        }
    }

}
updateBinds()
slotButtons.forEach((button) => {
    button.addEventListener('click', () => {
        if (nextClickReset) {
            nextClickReset = false
            binds[button.id.substr(4, 1)] = undefined
            buttonNames[button.id.substr(4, 1)] = undefined
            button.innerText = '※'
        }
        nextClickReset = true
        nextKey = true
        toBeBound = button.id.substr(4, 1)
        currentBindButton = button
    })
})

document.addEventListener('keypress', (event) => {
    if (nextKey && !event.shiftKey) {
        nextClickReset = false
        slotButtons.forEach((button) => {
            if (button.innerText.includes(event.key.toUpperCase())) {
                button.innerText = '※'
                binds[button.id.substr(4, 1)] = undefined
                buttonNames[button.id.substr(4, 1)] = undefined
            }
        })

        binds[toBeBound] = event.code
        buttonNames[toBeBound] = event.key
        currentBindButton.innerText = event.key.toUpperCase()
        updateBinds()
        console.log(`Slot ${toBeBound} bound to ${event.key}`)
        nextKey = false
    }
    if (running) {
        if (binds[currentItem.parentElement.id] === undefined) {
            return;
        }
        if (binds[currentItem.parentElement.id] !== event.code) {
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
        inHotbarObj[event.target.id] = draggedCardId
    } else {
        for (const [key, value] of inHotbarObj) {
            if (value === draggedCard) {
                inHotbarObj[key] = undefined
            }
        }
        inHotbar = arrayRemove(inHotbar, draggedCard)
    }
    localStorage.setItem('hotbarContents', JSON.stringify(inHotbarObj))
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
    if (currentItem.classList.contains('rainbow_wool')) {
        trainerIMG.style.animation = 'wool-rainbow 3s infinite;'
    } else {
        trainerIMG.style.animation = ''
    }
    trainerIMG.src = currentItem.src
    trainerIMG.style.visibility = 'visible'
    interval = setInterval(() => {
        time += 10
    }, 10)
}

function updateBinds() {
    localStorage.setItem('binds', JSON.stringify(binds))
    localStorage.setItem('buttonNames', JSON.stringify(buttonNames))
    slotButtons.forEach((button) => {
        if (buttonNames[button.id.substr(4, 1)]) {
            button.innerText = buttonNames[button.id.substr(4, 1)].toUpperCase()
        }
    })
}

const hide_hotbar = document.querySelector('.hide_hotbar')
let hotbarHidden = false
hide_hotbar.addEventListener('click', () => {
    const parent = document.querySelector('.parent')
    if (!hotbarHidden) {
        parent.style.visibility = 'hidden'
        hotbarHidden = true
        hide_hotbar.innerText = 'Show Hotbar'
    } else {
        parent.style.visibility = 'visible'
        hotbarHidden = false
        hide_hotbar.innerText = 'Hide Hotbar'
    }
})