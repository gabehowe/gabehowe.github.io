'use strict'
/*** web tool that lets us practice hotkeys with a fake hotbar
 * it's conceptually simple i think
 * u gotta be able to change the binds
 * and which items are in which slots
 * the you have the app randomly show you an item and the time it takes for you to switch to it
 * sort of like a touch typing trainer specifically for minecraft hotbars***/
const wool = document.body.querySelector(".rainbow_wool")
const binds = {}
let nextKey = false;
let toBeBound = '';
const bottomText = document.getElementById('bottomText')
const topText = document.getElementById('topText')
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
    if (isNaN(event.key)) {
        return
    }
    if (event.key === '0') {
        return;
    }
    // document.documentElement.style.setProperty("--magic_number_mult",  event.key - 5)

})


const slots = document.querySelectorAll('.slot')

const onDragOver = (event) => {
    event.preventDefault()
}
const onDrop = (event) => {
    event.preventDefault()
    const draggedCardId = event.dataTransfer.getData('id')
    const draggedCard = document.getElementById(draggedCardId)
    event.target.appendChild(draggedCard)
}

slots.forEach((slot, index) => {
    slot.ondragover = onDragOver;
    slot.ondrop = onDrop;
})

const cards = document.querySelectorAll('.card')

const onDragStart = (event) => {
    event.dataTransfer.setData('id', event.target.id)
}
const onDragEnd = (event) => {
}
cards.forEach((card, index) => {
    card.ondragstart = onDragStart;
    card.ondragend = onDragEnd;
})