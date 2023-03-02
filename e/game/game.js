'use strict'
let trial = 1
const button = document.getElementById('main-button')
const trick2 = document.body.querySelector('.trick2')
const roasts = ["I told you.", "my grandmother could've clicked me by now", "could you be any worse?", "honestly, I knew you were bad, but I didn't think you could be this bad!", "try harder, you won't be able to click me", "lol imagine not being able to click me", "I'm getting tired, could you hurry up and click me already?", "what? did you expect me to stay put?"]
let moveAnimationLength = 0.1
let speechQueue = []
let welcomeSpeechComplete = false
let c = document.getElementById('canvas')
let cc = canvas.getContext('2d')

function buttonMove(left, top) {
    button.style.transition = `${moveAnimationLength}s`
    setTimeout(() => {
        button.style.left = `calc(${left}% - ${getComputedStyle(button).width} / 2)`
        button.style.top = `calc(${top}% - ${getComputedStyle(button).height} / 2)`
    }, moveAnimationLength)
}

function buttonSay(string) {
    while (button.firstElementChild) {
        button.firstElementChild.remove()
    }

    const nest = document.createElement('span')
    nest.classList.add('nest')
    button.appendChild(nest)
    nest.innerText = string
    nest.style.scale = '0'


    let deg = getRandomArbitrary(1, 10)
    if (getRandomArbitrary(1, 2) === 1) {
        deg = deg * -1
    }
    setTimeout(() => {
        nest.style.scale = '100%'
        nest.style.top = '-50%'
    }, 250)
    setTimeout(() => {
        nest.style.transition = '0.1s'
        nest.style.scale = '0'
        nest.addEventListener("transitionend", () => {
            nest.remove()
        })
    }, 1850)
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min) + min);
}


buttonMove(50, 50)
speechQueue.push(["Hello there.", 0])
speechQueue.push(["Thought you had a chance, eh?", 2000])
speechQueue.push(["You won't be able to click me, even if you think you can.", 2000])

function speak() {
    let timeout = speechQueue.length > 0 ? (speechQueue)[0][1] : 100
    setTimeout(() => {
        if (speechQueue.length > 0) {
            buttonSay(speechQueue.shift()[0])
        }
        speak()

    }, timeout)
}

trick2.addEventListener('click', () => {
    if (trial === 2) {
        trick2.remove()
        button.style.visibility = 'visible'
        trial = 3
        speechQueue.push(["son of a", 0])
        speechQueue.push(["ARRRGH", 1000])
        setTimeout(() => {
            button.classList.remove("rage-spin")
            void button.offsetWidth;
            button.classList.add("rage-spin")
            document.title = "Third Trial"
            trial = 3
            speechQueue.push(["STOP!", 2000])
            speechQueue.push(["You don't know what you're doing!", 1000])
            const div = document.getElementById('buttons')
            setTimeout(_ => {
                button.style.left = getRandomArbitrary(-110, 110).toString() + "%"
                button.style.top = getRandomArbitrary(-110, 110).toString() + "%"
                button.style.right = getRandomArbitrary(-110, 110).toString() + "%"
                button.style.bottom = getRandomArbitrary(-110, 110).toString() + "%"
                button.classList.add('duplication')
                button.style.borderStyle = "inset"
                button.classList.remove('rage-spin')
                let insertedButton = false;
                for (let i = 0; i < 24; i++) {
                    const rand = getRandomArbitrary(0, 23)
                    if (rand === 1) {
                        insertedButton = true
                        button.style.position = 'relative'
                        div.appendChild(button)
                        continue
                    }
                    var newButton = document.createElement('button')
                    newButton.id = "t3btn" + i.toString()
                    newButton.classList.add("btn")
                    newButton.style.position = "relative"
                    newButton.innerText = "Button"
                    newButton.style.left = getRandomArbitrary(-110, 110).toString() + "%"
                    newButton.style.top = getRandomArbitrary(-110, 110).toString() + "%"
                    newButton.style.right = getRandomArbitrary(-110, 110).toString() + "%"
                    newButton.style.bottom = getRandomArbitrary(-110, 110).toString() + "%"
                    newButton.classList.add('duplication')
                    div.appendChild(newButton)
                }

                if (!insertedButton) {
                    button.style.position = 'relative'
                    div.appendChild(button)

                } else {
                    const finalButton = document.createElement('button')
                    finalButton.id = "t3btn23"
                    finalButton.classList.add("btn")
                    finalButton.style.position = "relative"
                    finalButton.innerText = "Button"
                    finalButton.style.left = getRandomArbitrary(-110, 110).toString() + "%"
                    finalButton.style.top = getRandomArbitrary(-110, 110).toString() + "%"
                    finalButton.style.right = getRandomArbitrary(-110, 110).toString() + "%"
                    finalButton.style.bottom = getRandomArbitrary(-110, 110).toString() + "%"
                    finalButton.classList.add('duplication')
                    div.appendChild(finalButton)
                }
                div.style.visibility = 'visible'
            }, 5000)
        }, 2000)
    }
})
button.addEventListener('mousedown', function () {
    if (trial === 1) {
        document.title = "Second Trial"
        trial = 2
        button.style.left = '50%'
        button.style.top = '50%'
        buttonSay("THAT'S NOT FAIR!")
        speechQueue.push(["YOU CHEATED SOMEHOW!", 1000])
        speechQueue.push(["It's fine.", 1000])
        speechQueue.push(["It's not like you can cheat your way past my next trick", 1000])
        speechQueue.push(["hehehe", 1000])

        setTimeout(() => {
            button.style.transition = '0.2s'
            button.style.opacity = '0'
            button.style.cursor = 'auto'
        }, 1000)
        setTimeout(() => {
            button.style.opacity = '100%';
            button.style.cursor = 'pointer'
            button.style.display = 'none'

            trick2.style.visibility = 'visible'
            trick2.style.opacity = '100%'
            trick2.style.top = getRandomArbitrary(10, 90) + '%'
            trick2.style.left = getRandomArbitrary(10, 90) + '%'
        }, 3000)
    }
});

button.addEventListener('mouseenter', async function () {

    setTimeout(async () => {
        if (trial === 1) {
            let newLeft = getRandomArbitrary(10, 90).toString()
            let newTop = getRandomArbitrary(10, 90).toString()
            buttonMove(newLeft, newTop)
            setTimeout(async () => {
                if (trial === 1) {
                    if (!welcomeSpeechComplete) {
                        welcomeSpeechComplete = true;
                        speechQueue = []
                    }
                    buttonSay(roasts[getRandomArbitrary(0, roasts.length)])
                }
            }, 40) // should be 40
        }
    }, 0);

})
const linkButtons = document.querySelectorAll('.link-btn')
linkButtons.forEach((button) => {
    button.addEventListener('click', () => {
        window.location.href = button.getAttribute('link')
    })
})
speak()


function rotate(x, y, angle) {
    return [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)]
}

// function poof(frame, position, rotation, scale) {
//     cc.fillStyle = 'rgb(255,255,255)'
//     let adjustedPos = [position[0] + frame, position[1] + frame]
//     cc.beginPath()
//     cc.moveTo(adjustedPos[0], adjustedPos[1])
//     let rotatedCoords = rotate((10 * scale), (10 * scale), rotation)
//     cc.lineTo(adjustedPos[0] + rotatedCoords[0], adjustedPos[1] + rotatedCoords[1])
//     rotatedCoords = rotate((14 * scale), 0, rotation)
//     cc.lineTo(adjustedPos[0] + rotatedCoords[0], adjustedPos[1] + rotatedCoords[1])
//     cc.fill()
//     cc.closePath()
//     // bottom
//     cc.beginPath()
//     rotatedCoords = rotate((10 * scale), (10 * scale), rotation)
//     cc.arc(adjustedPos[0] + rotatedCoords[0], adjustedPos[1] + rotatedCoords[1], 5 * scale, 0, Math.PI * 2)
//     cc.fill()
//     cc.closePath()
//     // top
//     cc.beginPath()
//     rotatedCoords = rotate((14 * scale), 0, rotation)
//     cc.arc(adjustedPos[0] + rotatedCoords[0], adjustedPos[1] + rotatedCoords[1], 5 * scale, 0, Math.PI * 2)
//     cc.fill()
//     cc.closePath()
//
//     cc.beginPath()
//     rotatedCoords = rotate((16 * scale), (6 * scale), rotation)
//     cc.arc(adjustedPos[0] + rotatedCoords[0], adjustedPos[1] + rotatedCoords[1], 5 * scale, 0, Math.PI * 2)
//     cc.fill()
//     cc.closePath()
// }
//
// function fpcnt(val, axis) {
//     let dim = axis === 1 ? window.innerWidth : window.innerHeight
//     return val * dim
// }
//
// let frame = 0
//
// function animate() {
//     requestAnimationFrame(animate)
//     frame++;
//     c.width = window.innerWidth
//     c.height = window.innerHeight
//     cc.fillStyle = getComputedStyle(c).getPropertyValue('--primary-color')
//     cc.fillRect(0, 0, c.width, c.height)
//     poof(Math.round(1), [fpcnt(.4, 0), fpcnt(.4, 1)], 2, 1)
//
// }
//
// animate()
