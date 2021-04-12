'use strict'
const switcher = document.querySelector('.btn');
const roasts = ["smh imagine not being able to click this","you're just bad aren't you",
"u mum", "no u", "nub", "lol imagine not being able to click this"]
switcher.addEventListener('click', function () {
    window.location.href = "https://www.youtube.com/watch?v=s-n9TaTdOjA&t=2s"
});
/*
switcher.addEventListener('mouseenter', function (event) {
    console.log("i been hovered :\'(")
    window.location.href = "https://media.tenor.co/videos/1fef4b37b9b9e721d49ba6d6b8fdacb9/mp4"
})*/
const tooltip = document.querySelector('.tooltip')
switcher.addEventListener('mouseenter', function (event) {
    switcher.innerHTML = roasts[getRandomArbitrary(0,roasts.length)]
    switcher.style.left = getRandomArbitrary(0,100).toString() + "%"
    switcher.style.top = getRandomArbitrary(0,100).toString() + "%"
})
switcher.addEventListener('mouseleave', function (event) {
    switcher.src=""
})

function getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}