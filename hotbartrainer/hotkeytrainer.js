'use strict'
/*** web tool that lets us practice hotkeys with a fake hotbar
 * it's conceptually simple i think
 * u gotta be able to change the binds
 * and which items are in which slots
 * the you have the app randomly show you an item and the time it takes for you to switch to it
 * sort of like a touch typing trainer specifically for minecraft hotbars***/
const wool = document.body.querySelector(".rainbow_wool")
document.addEventListener('keypress', (event) => {
    if (isNaN(event.key)) {
        return
    }
    if (event.key === '0') {
        return;
    }
    document.documentElement.style.setProperty("--magic_number_mult",  event.key - 5)

})
