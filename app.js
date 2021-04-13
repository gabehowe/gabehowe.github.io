'use strict'
const button = document.body.querySelector('.btn');
const roasts = ["you're just bad aren't you", "my grandmother could've clicked me by now", "could you be any worse?",
    "honestly, I knew you were bad, but I didn't think you could be this bad!",
    "try harder, you won't be able to click me", "lol imagine not being able to click me", "I'm getting tired, could you hurry up and click me already?",
    "what? did you expect me to stay put?"]
const girusText = document.body.querySelector('.girus-text')
button.addEventListener('click', function () {
    document.title = "Second Trial"
    button.style.left = '50%'
    button.style.top = '50%'
    buttonSay('THAT\'S NOT FAIR!')
    setTimeout(() => {
        buttonSay('YOU CHEATED SOMEHOW!')
    }, 1000);
});
button.addEventListener('mouseenter', function (event) {
    setTimeout(() => {
        let newLeft = getRandomArbitrary(5, 95).toString()
        let newTop = getRandomArbitrary(5, 95).toString()
        button.style.left = newLeft + "%"
        button.style.top = newTop + "%"
        buttonMove(newLeft,newTop)
        buttonSay(roasts[getRandomArbitrary(0, roasts.length)])
    }, 50);

})
girusText.addEventListener('animationend', () => {
    girusText.querySelector('.nest').innerHTML = ""
})
document.addEventListener('load', e => {
    buttonSay("you shouldn't've come here")
    setTimeout(() => {buttonSay("well, it's not like you can press me")}, 200)

})
function buttonMove (left, top) {
    button.style.setProperty("--new-left", left + '%')
    button.style.setProperty("--new-top", top + '%')
    button.classList.remove("animation")
    void button.offsetWidth;
    button.classList.add("animation")
}
function buttonSay (string) {
    girusText.querySelector('.nest').innerHTML = string
    girusText.style.left = button.style.left
    girusText.style.top = button.style.top
    girusText.classList.remove("girus-text")
    girusText.classList.remove("girus-text-inverted")
    void girusText.offsetWidth;
    let deg = getRandomArbitrary(0,15)
    if (getRandomArbitrary(0,2) === 1) {
        deg = deg * -1
    }
    girusText.style.setProperty('--random-deg', deg + 'deg' )
    girusText.classList.add("girus-text")
}

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}