'use strict'
let trial = 1
const button = document.body.querySelector('.btn');
const trick2 = document.body.querySelector('.trick2')
const roasts = ["you're just bad aren't you", "my grandmother could've clicked me by now", "could you be any worse?",
    "honestly, I knew you were bad, but I didn't think you could be this bad!",
    "try harder, you won't be able to click me", "lol imagine not being able to click me", "I'm getting tired, could you hurry up and click me already?",
    "what? did you expect me to stay put?"]
const girusText = document.body.querySelector('.girus-text')
trick2.addEventListener('click', () => {
    if (trial === 2) {
        trick2.remove()
        button.style.visibility = 'visible'
        buttonSayWait("son of a", 0)
        buttonSayWait("ARRRGH", 1000)
        setTimeout(() => {
            button.classList.remove("rage-spin")
            void button.offsetWidth;
            button.classList.add("rage-spin")
            document.title = "Third Trial"
            trial = 3
            buttonSayWait("You don't know what you're doing!",3000)
            buttonSayWait("STOP!",4000)
        }, 2000)
    }
})
button.addEventListener('click', function () {
    if (trial === 1) {
        document.title = "Second Trial"
        trial = 2
        button.style.left = '50%'
        button.style.top = '50%'
        buttonSay("THAT'S NOT FAIR!")
        buttonSayWait("YOU CHEATED SOMEHOW!", 1000)
        buttonSayWait("It's fine.", 4000)
        buttonSayWait("It's not like you can cheat your way past my next trick", 5000)
        buttonSayWait("hehehe", 6000)
        setTimeout(() => {
            button.style.visibility = 'collapse'
            trick2.style.visibility = 'visible'
            trick2.style.top = getRandomArbitrary(10, 90) + '%'
            trick2.style.left = getRandomArbitrary(10, 90) + '%'
        }, 6500)
    }
});

button.addEventListener('mouseenter', async function () {

    setTimeout(async () => {
        if (trial === 1) {
            let newLeft = getRandomArbitrary(10, 90).toString()
            let newTop = getRandomArbitrary(10, 90).toString()
            buttonMove(newLeft, newTop)
            await setTimeout(async () => {
                if (trial === 1) {
                    button.style.left = newLeft + "%"
                    button.style.top = newTop + "%"
                    buttonSay(roasts[getRandomArbitrary(0, roasts.length)])
                }
            }, 40)
        }
    }, 100);

})
girusText.addEventListener('animationend', () => {
    girusText.querySelector('.nest').innerHTML = ""
})
document.addEventListener('load', () => {
    buttonSay("you shouldn't've come here")
    setTimeout(() => {
        buttonSay("well, it's not like you can press me")
    }, 200)

})

function buttonMove(left, top) {
    button.style.setProperty("--new-left", left + '%')
    button.style.setProperty("--new-top", top + '%')
    button.classList.remove("animation")
    void button.offsetWidth;
    button.classList.add("animation")
}

function buttonSay(string) {
    girusText.querySelector('.nest').innerHTML = string
    girusText.style.left = button.style.left
    girusText.style.top = button.style.top
    girusText.classList.remove("girus-text")
    girusText.classList.remove("girus-text-inverted")
    void girusText.offsetWidth;
    let deg = getRandomArbitrary(0, 10)
    if (getRandomArbitrary(0, 2) === 1) {
        deg = deg * -1
    }
    girusText.style.setProperty('--random-deg', deg + 'deg')
    girusText.style.setProperty('--random-deg-div-2', (deg/2) + 'deg')
    girusText.classList.add("girus-text")
}

function buttonSayWait(string, time) {
    setTimeout(() => {
        buttonSay(string)
    }, time)
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}