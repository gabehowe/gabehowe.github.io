function blend_colors(color1, color2, percentage) {
    // https://coderwall.com/p/z8uxzw/javascript-color-blender
    // check input
    color1 = color1 || '#000000';
    color2 = color2 || '#ffffff';
    percentage = percentage || 0.5;

    // 1: validate input, make sure we have provided a valid hex
    if (color1.length !== 4 && color1.length !== 7)
        throw new error('colors must be provided as hexes');

    if (color2.length !== 4 && color2.length !== 7)
        throw new error('colors must be provided as hexes');

    if (percentage > 1 || percentage < 0)
        throw new error('percentage must be between 0 and 1');

    // output to canvas for proof


    // 2: check to see if we need to convert 3 char hex to 6 char hex, else slice off hash
    //      the three character hex is just a representation of the 6 hex where each character is repeated
    //      ie: #060 => #006600 (green)
    if (color1.length === 4)
        color1 = color1[1] + color1[1] + color1[2] + color1[2] + color1[3] + color1[3];
    else
        color1 = color1.substring(1);
    if (color2.length === 4)
        color2 = color2[1] + color2[1] + color2[2] + color2[2] + color2[3] + color2[3];
    else
        color2 = color2.substring(1);

    console.log('valid: c1 => ' + color1 + ', c2 => ' + color2);

    // 3: we have valid input, convert colors to rgb
    color1 = [parseInt(color1[0] + color1[1], 16), parseInt(color1[2] + color1[3], 16), parseInt(color1[4] + color1[5], 16)];
    color2 = [parseInt(color2[0] + color2[1], 16), parseInt(color2[2] + color2[3], 16), parseInt(color2[4] + color2[5], 16)];

    console.log('hex -> rgba: c1 => [' + color1.join(', ') + '], c2 => [' + color2.join(', ') + ']');

    // 4: blend
    let color3 = [
        (1 - percentage) * color1[0] + percentage * color2[0],
        (1 - percentage) * color1[1] + percentage * color2[1],
        (1 - percentage) * color1[2] + percentage * color2[2]
    ];

    console.log('c3 => [' + color3.join(', ') + ']');

    // 5: convert to hex
    color3 = '#' + int_to_hex(color3[0]) + int_to_hex(color3[1]) + int_to_hex(color3[2]);

    console.log(color3);

    // return hex
    return color3;
}

/*
    convert a Number to a two character hex string
    must round, or we will end up with more digits than expected (2)
    note: can also result in single digit, which will need to be padded with a 0 to the left
    @param: num         => the number to conver to hex
    @returns: string    => the hex representation of the provided number
*/
function int_to_hex(num) {
    let hex = Math.round(num).toString(16);
    if (hex.length === 1)
        hex = '0' + hex;
    return hex;
}

const canvas = document.querySelector('canvas')
const cc = canvas.getContext('2d')

canvas.width = innerWidth
canvas.height = innerHeight
let bubbles = []

class Vector2D {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    add(other) {
        if (!other) {
            return
        }
        this.x += other.x
        this.y += other.y
    }

    multiply(other) {
        if (!other) {
            return
        }
        if (!isNaN(other)) {
            this.x *= other
            this.y *= other
        } else {
            this.x *= other.x
            this.y *= other.y
        }
    }

    rotate(angle) {
        const x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
        const y = this.x * Math.sin(angle) + this.y * Math.cos(angle)
        return new Vector2D(x, y)
    }

    distance(other) {
        const x = other.x - this.x
        const y = other.y - this.y
        return Math.hypot(x, y)
    }

    withinBorder(radius) {
        if (this.x < radius) {
            return 'left'
        }
        if (this.x > (canvas.width - radius)) {
            return 'right'
        }
        if (this.y < radius) {
            return 'top'
        }
        if (this.y > (canvas.height - radius)) {
            return 'bottom'
        } else {
            return false
        }
    }
}

const mouse = new Vector2D(0, 0)
addEventListener('mousemove', (event) => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})


class Bubble {
    constructor(pos, radius, color, velocity, mass = 1) {
        this.pos = pos
        this.radius = radius
        this.color = color
        this.velocity = velocity
        this.mass = mass
    }

    draw() {
        cc.beginPath()
        cc.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        cc.fillStyle = this.color
        cc.fill()
        cc.closePath()
        if (this.pos.distance(mouse) < this.radius) {
            let textSize = this.radius / 2
            const yPos = this.pos.y + (this.radius / 6)
            cc.textAlign = 'center'
            cc.miterLimit = 2
            cc.lineJoin = 'round';
            cc.font = `bold ${textSize}px sans-serif`;
            cc.fillStyle = '#FFFFFF'
            cc.strokeStyle = 'black'
            // cc.lineWidth = 6.5
            cc.lineWidth = (this.radius * 0.065)
            cc.strokeText(`${Math.floor(this.radius)}`, this.pos.x, yPos)
            cc.fillStyle = '#FFFFFF';
            cc.lineWidth = 1
            cc.fillText(`${Math.floor(this.radius)}`, this.pos.x, yPos)


        }
    }

    absorb(otherIndex) {
        if (this.pos.withinBorder(this.radius + (bubbles[otherIndex].radius / 2))) {
            return
        }
        this.color = blend_colors(this.color, bubbles[otherIndex].color, 0.5)
        this.radius += (bubbles[otherIndex].radius / 2)
        bubbles.splice(otherIndex, 1)
    }

    update() {
        if (!this.pos) {
            return
        }
        this.pos.add(this.velocity)
        this.draw()
        for (let i = 0; i < bubbles.length; i++) {
            if (bubbles[i] === this) {
                continue
            }
            const distance = this.pos.distance(bubbles[i].pos)
            if (distance - (bubbles[i].radius + this.radius) < 0) {
                // if this bubble is colliding with another bubble
                const angle = -Math.atan2(bubbles[i].pos.y - this.pos.y, bubbles[i].pos.x - this.pos.x)
                const initialRotatedVelocity = this.velocity.rotate(angle)
                const otherInitialRotatedVelocity = bubbles[i].velocity.rotate(angle)
                const thisCalculatedVelocity = (new Vector2D(initialRotatedVelocity.x * (this.mass - bubbles[i].mass) /
                    (this.mass + bubbles[i].mass) + otherInitialRotatedVelocity.x * 2 * bubbles[i].mass / (this.mass + bubbles[i].mass), initialRotatedVelocity.y)).rotate(-angle)
                const otherCalculatedVelocity = (new Vector2D(otherInitialRotatedVelocity.x * (this.mass - bubbles[i].mass) /
                    (this.mass + bubbles[i].mass) + initialRotatedVelocity.x * 2 * bubbles[i].mass / (this.mass + bubbles[i].mass), otherInitialRotatedVelocity.y)).rotate(-angle)

                this.velocity = thisCalculatedVelocity
                bubbles[i].velocity = otherCalculatedVelocity
                if (this.radius > bubbles[i].radius && initialRotatedVelocity.x > otherInitialRotatedVelocity.x && this.radius < 100) {
                    this.absorb(i)
                    return;
                }
                if (distance - (bubbles[i].radius + this.radius - 5) < 0) {
                    this.absorb(i)
                    return;
                }
            }
        }
        const nearBorder = this.pos.withinBorder(this.radius)
        if (nearBorder) {
            if (nearBorder === 'left') {
                this.velocity.x *= -1
                // this.pos.x = this.radius + 1
            }
            if (nearBorder === 'right') {
                this.velocity.x *= -1
                // this.pos.x = (canvas.width - (this.radius + 1))
            }
            if (nearBorder === 'top') {
                this.velocity.y *= -1
                // this.pos.y = this.radius + 1
            }
            if (nearBorder === 'bottom') {
                this.velocity.y *= -1
                // this.pos.y = (canvas.height - (this.radius + 1))
            }
        }


    }
}

const randInRange = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)
const colors = ['#00FF00', '#FF0000', '#0000FF', '#FFFFFF', '#FFFF00', '#FF00FF', '#00FFFF']

function init() {
    for (let i = 0; i < 50; i++) {
        let radius = randInRange(10, 100)
        let pos = new Vector2D(randInRange(0, innerWidth), randInRange(0, innerHeight))
        let valid = true
        if (i !== 0) {
            for (let j = 0; j < bubbles.length; j++) {
                if (pos.distance(bubbles[j].pos) - (radius + bubbles[j].radius + 10) < 0 || (pos.x < radius || pos.x > (canvas.width - radius) || pos.y < radius || pos.y > (canvas.height - radius))) {
                    pos = new Vector2D(randInRange(0, innerWidth), randInRange(0, innerHeight))
                    radius = randInRange(10, 100)
                    j = -1;
                    valid = false
                } else {
                    valid = true
                }
            }
        }
        if (!valid) {
            continue
        }
        const color = colors[randInRange(0, colors.length - 1)]
        const velocity = new Vector2D(randInRange(0, 3) - 1.5, randInRange(0, 3) - 1.5)
        bubbles.push(new Bubble(pos, radius, color, velocity))

    }
}

function animate() {
    requestAnimationFrame(animate)
    canvas.width = innerWidth
    canvas.height = innerHeight
    cc.clearRect(0, 0, canvas.width, canvas.height)
    for (let i in bubbles) {
        bubbles[i].update()
    }
}

init()
animate()