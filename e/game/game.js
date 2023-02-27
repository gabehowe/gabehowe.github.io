'use strict'
let trial = 1
const button = document.getElementById('main-button')
const trick2 = document.body.querySelector('.trick2')
const roasts = ["I told you.", "my grandmother could've clicked me by now", "could you be any worse?",
    "honestly, I knew you were bad, but I didn't think you could be this bad!",
    "try harder, you won't be able to click me", "lol imagine not being able to click me", "I'm getting tired, could you hurry up and click me already?",
    "what? did you expect me to stay put?"]
const girusText = document.body.querySelector('.girus-text')
let lastTime = 0
function buttonMove(left, top) {
    button.style.setProperty("--new-left", left.toString() + '%')
    button.style.setProperty("--new-top", top.toString() + '%')
    button.classList.remove("animation")
    void button.offsetWidth;
    button.classList.add("animation")
    setTimeout(() => {
        button.style.left = left.toString() + "%"
        button.style.top = top.toString() + "%"
        button.classList.remove("animation")
    }, button.style.getPropertyValue("--move-anim-len") * 1000)
}

function buttonSay(string) {
    girusText.querySelector('.nest').innerHTML = string
    girusText.style.left = button.style.left
    girusText.style.top = button.style.top
    girusText.classList.remove("girus-text")
    girusText.classList.remove("girus-text-inverted")
    void girusText.offsetWidth;
    let deg = getRandomArbitrary(1, 10)
    if (getRandomArbitrary(1, 2) === 1) {
        deg = deg * -1
    }
    girusText.style.setProperty('--random-deg', deg + 'deg')
    girusText.style.setProperty('--random-deg-div-2', (deg / 2) + 'deg')
    girusText.classList.add("girus-text")
}

function buttonSayWait(string, time) {
    wait(() => {
        buttonSay(string)
    }, time)
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * ((max + 1) - min) + min);
}


function wait(fun, currentTime, time) {
    if (time) {
        lastTime = time
    }
    setTimeout(fun, currentTime + lastTime)
    lastTime += currentTime


}


buttonMove(50, 50)
buttonSayWait("Hello there.", 1000)
buttonSayWait("Thought you had a chance, eh?", 2000)
buttonSayWait("You won't be able to click me, even if you think you can.", 2000)


trick2.addEventListener('click', () => {
    if (trial === 2) {
        trick2.remove()
        button.style.visibility = 'visible'
        wait(() => {
        }, 0, 0)
        trial = 3
        buttonSayWait("son of a", 0)
        buttonSayWait("ARRRGH", 1000)
        setTimeout(() => {
            button.classList.remove("rage-spin")
            void button.offsetWidth;
            button.classList.add("rage-spin")
            document.title = "Third Trial"
            trial = 3
            buttonSayWait("STOP!", 2000)
            buttonSayWait("You don't know what you're doing!", 1000)
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
            wait(() => {
                const div = document.getElementById('buttons')
                for (let i of div.children) {
                    if (typeof i === typeof button) {
                        i.style.left = "0"
                        i.style.top = "0"
                        i.style.bottom = "0"
                        i.style.right = "0"
                    }
                }
            }, 1500, 5000)
        }, 2000)
    }
})
button.addEventListener('mousedown', function () {
    if (trial === 1) {
        document.title = "Second Trial"
        trial = 2
        button.style.left = '50%'
        button.style.top = '50%'
        wait(() => {
        }, 0, 0)
        buttonSay("THAT'S NOT FAIR!")
        buttonSayWait("YOU CHEATED SOMEHOW!", 1000)
        buttonSayWait("It's fine.", 3000)
        buttonSayWait("It's not like you can cheat your way past my next trick", 1000)
        buttonSayWait("hehehe", 1000)
        wait (() => {button.style.animation = "button-collapse 1s"}, 1000)
        wait(() => {button.style.visibility = "hidden"}, 50)
        wait(() => {
            button.style.animation = ""
            trick2.style.visibility = 'visible'
            trick2.style.top = getRandomArbitrary(10, 90) + '%'
            trick2.style.left = getRandomArbitrary(10, 90) + '%'
        }, 950)
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
                    buttonSay(roasts[getRandomArbitrary(0, roasts.length)])
                }
            }, 40) // should be 40
        }
    }, 0);

})
girusText.addEventListener('animationend', () => {
    girusText.querySelector('.nest').innerHTML = ""
})
const linkButtons = document.querySelectorAll('.link-btn')
linkButtons.forEach((button) => {
    button.addEventListener('click', () => {
        window.location.href = button.getAttribute('link')
    })
})
