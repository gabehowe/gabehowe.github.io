'use strict'
const button = document.body.querySelector('.btn');
const roasts = ["smh imagine not being able to click this", "you're just bad aren't you",
    "u mum", "no u", "nub", "lol imagine not being able to click this"]
button.addEventListener('click', function () {
    button.style.visibility = 'hidden'
    document.title = "Second Trial"
    const title = document.body.querySelector('.title')
    title.style.visibility = 'visible'
    title.innerHTML = "Well"
    setTimeout(() => { title.innerHTML = "You got past the first trial" }, 2000);
});
// button.addEventListener('mouseenter', function (event) {
//     button.innerHTML = roasts[getRandomArbitrary(0, roasts.length)]
//     button.style.left = getRandomArbitrary(5, 95).toString() + "%"
//     button.style.top = getRandomArbitrary(5, 95).toString() + "%"
// })

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}