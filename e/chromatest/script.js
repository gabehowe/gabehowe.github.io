let canvas = document.getElementById('canvas')
let cc = canvas.getContext("2d")
let scale = 1
let sizeSlider = document.getElementById('sizeSlider')
let sizeSliderLabel = document.getElementById('sizeSliderLabel')

let multiplierSlider = document.getElementById('multiplierSlider')
let multiplierSliderLabel = document.getElementById('multiplierSliderLabel')

let radioButtons = document.querySelectorAll('input[name="display"]')
let display = "none"

for (const radioButton of radioButtons) {
    if (radioButton.checked) {
        display = radioButton.value
    }
    radioButton.addEventListener('click', () => {
        display = radioButton.value;
    })
}

canvas.width = document.body.clientWidth * scale
canvas.height = document.body.clientHeight * scale
addEventListener('resize', () => {
        canvas.width = document.body.clientWidth * scale
        canvas.height = document.body.clientHeight * scale
    }
)

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
function hslToRgb(h, s, l){
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return new Color(r, g, b)
}

class Color {

    constructor(r, g, b) {
        this.r = r
        this.g = g
        this.b = b
    }

    magnitude() {
        return Math.sqrt(this.r * this.r + this.b * this.b + this.g * this.g)
    }

    getH() {

        // Make r, g, and b fractions of 1
        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;

        // Find greatest and smallest channel values
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            h = 0;
        if (delta === 0)
            h = 0;
        // Red is max
        else if (cmax === r)
            h = ((g - b) / delta) % 6;
        // Green is max
        else if (cmax === g)
            h = (b - r) / delta + 2;
        // Blue is max
        else
            h = (r - g) / delta + 4;

        h = Math.round(h * 60);

        // Make negative hues positive behind 360°
        if (h < 0)
            h += 360;
        return h
    }

    getL() {

        // Make r, g, and b fractions of 1
        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;

        // Find greatest and smallest channel values
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            l = 0;
        // Calculate lightness
        l = (cmax + cmin) / 2;

        // Multiply l and s by 100
        l *= 100

        return l
    }

    getS() {

        let r = this.r / 255;
        let g = this.g / 255;
        let b = this.b / 255;

        // Find greatest and smallest channel values
        let cmin = Math.min(r, g, b),
            cmax = Math.max(r, g, b),
            delta = cmax - cmin,
            s = 0,
            l = this.getL();
        // Calculate lightness
        s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

        // Multiply l and s by 100

        if (s === Infinity) {
            s = 0;
        }

        s *= 100
        return s
    }

    hsl() {
        return `hsl(${this.getH()},${this.getS()},${this.getL()})`
    }

    normalize() {
        let magnitude = this.magnitude()
        let r = this.r / magnitude
        let g = this.g / magnitude
        let b = this.b / magnitude
        let d = r + g + b
        let r2 = r / d
        let g2 = g / d
        let b2 = b / d

        return new Color(this.r / magnitude, this.g / magnitude, this.b / magnitude)
    }

    hex() {
        return `#${(this.r * this.g * this.b).toString(16)}`
    }

    rgb() {
        return `rgb(${this.r * 255},${this.g * 255},${this.b * 255})`
    }
}

function loop(x) {
    return (Math.cos((0.75 * Math.PI) * x) / 2) + 0.5
}

let frame = 0
let boxCount = sizeSlider.value;
sizeSliderLabel.innerText = sizeSlider.value
sizeSlider.oninput = () => {
    sizeSliderLabel.innerText = sizeSlider.value
    boxCount = Math.round(sizeSlider.value);
}
let multiplier = multiplierSlider.value / 10;
multiplierSliderLabel.innerText = multiplierSlider.value
multiplierSlider.oninput = () => {
    multiplierSliderLabel.innerText = multiplierSlider.value
    multiplier = Math.round(multiplierSlider.value);
}

function outlinedText(text, x, y) {

    cc.fillStyle = "white"
    cc.font = 'Sans-serif'
    cc.strokeStyle = 'black'
    cc.lineWidth = 4;
    cc.miterLimit = 1;
    cc.strokeText(text, x - 7, y + 4)
    cc.fillText(text, x - 7, y + 4)
}

function colorFunc(frame, i, j, o) {
    return [(i)+(Math.abs(Math.cos(frame)*2))*360,100,j+1]
}

function animate() {
    requestAnimationFrame(animate)
    cc.fillStyle = "#111111"
    cc.fillRect(0, 0, innerWidth, innerHeight)
    frame += 0.01;
    let boxScale = (canvas.width / 2) / boxCount

    // if (frame % 1 !== 0) {
        for (let i = 0; i < boxCount; i++) {
            for (let j = 0; j < boxCount; j++) {

                // cc.fillStyle = `rgb( ${Math.floor(255 - 42.5 * i)}, ${Math.floor(255 - 42.5 * j)}, 0)`;
                let color = colorFunc(frame,i,j,0)
                cc.fillStyle = `hsl(${color[0]},${color[1]}%,${color[2]}%)`;
                cc.fillRect(j * boxScale, i * boxScale, boxScale, boxScale);
                if (display === "none") {
                }
                else if (display === "l") {
                    outlinedText(`${Math.round(color[2])}%`, j * boxScale + boxScale / 2, i * boxScale + boxScale / 2);
                }
                else if (display === "s") {
                    outlinedText(`${Math.round(color[1])}%`, j * boxScale + boxScale / 2, i * boxScale + boxScale / 2);
                }
                else if (display === "h") {
                    outlinedText(`${Math.round(color[0]%360)}°`, j * boxScale + boxScale / 2, i * boxScale + boxScale / 2);
                }
            }
        }

        for (let i = 0; i < boxCount; i++) {
            for (let j = 0; j < boxCount; j++) {

                // cc.fillStyle = `rgb( ${Math.floor(255 - 42.5 * i)}, ${Math.floor(255 - 42.5 * j)}, 0)`;

                let color = colorFunc(frame, i, j, 0)

                cc.fillStyle = hslToRgb(color[0]/360,color[1]/100,color[2]/100).normalize().rgb()
                cc.fillRect((j * boxScale) + (boxScale * boxCount + 1), i * boxScale, boxScale, boxScale);

                if (display === "none") {
                }
                else if (display === "l") {
                    outlinedText(`${Math.round(color[2])}%`, j * boxScale + boxScale / 2 + (boxScale * boxCount + 1), i * boxScale + boxScale / 2);
                }
                else if (display === "s") {
                    outlinedText(`${Math.round(color[1])}%`, j * boxScale + boxScale / 2 + (boxScale * boxCount + 1), i * boxScale + boxScale / 2);
                }
                else if (display === "h") {
                    outlinedText(`${Math.round(color[0])%360}°`, j * boxScale + boxScale / 2 + (boxScale * boxCount + 1), i * boxScale + boxScale / 2);
                }
            }
        }
    // }


}

animate()


const linkButtons = document.querySelectorAll('.link_btn')
linkButtons.forEach((button) => {
    button.addEventListener('click', () => {
        window.location.href = button.getAttribute('link')
    })
})
