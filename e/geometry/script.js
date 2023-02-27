const canvas = document.querySelector('canvas')
const cc = canvas.getContext('2d')
let length = 470
const strokeStyle = "#FF0000"
const webColor = "#0000FF"
const linkButtons = document.querySelectorAll('.link-btn')
let spiral = false
linkButtons.forEach((button) => {
    button.addEventListener('click', () => {
        window.location.href = button.getAttribute('link')
    })
})

function drawPolygon(points, perimeter, area, noLines, spiralCheckbox) {
    cc.beginPath()
    cc.strokeStyle = strokeStyle
    cc.fillStyle = "#FFFFFF"
    cc.lineWidth = 5
    if (!spiralCheckbox) {
        for (const point of points) {
            if (noLines) {
                cc.beginPath()
                cc.arc(point[0], (point[1]/1000) * canvas.height, 1, 0, Math.PI * 2)
                cc.closePath()
                cc.stroke()
            } else {
                cc.lineTo(point[0], point[1])
            }

        }
    }
    cc.closePath()
    cc.stroke()
    cc.font = '25px cambria'
    cc.textAlign = 'left'
    cc.fillText('A = ' + area, 0, 20)
    if (points.length === 3) {
        cc.fillText('A = √3/4 * side²', 0, 50)
    } else if (points.length === 4) {
        cc.fillText('A = side²', 0, 50)
    } else {
        cc.fillText('A = 1/2 * perimeter * apothem', 0, 50)
    }
}

function rotate(cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle, cos = Math.cos(radians), sin = Math.sin(radians),
        nx = (cos * (x - cx)) + (sin * (y - cy)) + cx, ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    return [nx, ny];
}

function generatePoints(sides, rotation) {
    if (sides < 3) {
        return
    }
    const sideLength = length - (sides)
    let points = []
    for (let i = 0; i < sides; i++) {
        points.push([(canvas.width / 2) + sideLength * Math.cos(i * 2 * Math.PI / sides), (canvas.height / 2) + sideLength * Math.sin(i * 2 * Math.PI / sides)])
    }
    for (let i = 0; i < points.length; i++) {
        points[i] = rotate(500, canvas.height/2, points[i][0], points[i][1], rotation)
    }
    let area
    const perimeter = sideLength * sides
    cc.fillStyle = '#FFFFFF'
    cc.font = '25px cambria'
    if (points.length === 3) {
        area = (Math.sqrt(3) / 4) * sideLength ** 2
    } else if (points.length === 4) {
        area = sideLength ** 2
    } else {
        const x = ((points[0][0] + points[1][0]) / 2)
        const y = ((points[0][1] + points[1][1]) / 2)
        const apothem = Math.hypot((x - 500), (y - 500))
        area = 0.5 * perimeter * apothem
    }

    return [points, perimeter, Math.round(area)]
}

function drawCircle(filled) {
    cc.beginPath()
    let radius = 475
    cc.fillStyle = "#FFFFFF"
    cc.font = '25px cambria'
    cc.textAlign = 'left'
    cc.fillText('A = ' + Math.round(Math.PI * radius ** 2).toString(), 0, 20)
    cc.font = '25px cambria'
    cc.fillText('A = πr²', 0, 50)
    cc.lineWidth = 5
    cc.strokeStyle = strokeStyle
    cc.fillStyle = webColor
    cc.arc(500, 500, radius, 0, Math.PI * 2)
    cc.closePath()
    if (filled) {
        cc.fill()
    }
    cc.stroke()
}

let spiralPoints = []

function drawSpiral(points, speed) {
    for (let i = 0; i < spiralPoints.length - 1; i++) {
        cc.beginPath()
        cc.strokeStyle = '#00FF00'
        cc.lineWidth = 2
        cc.moveTo(spiralPoints[i][0], spiralPoints[i][1])
        cc.lineTo(spiralPoints[i + 1][0], spiralPoints[i + 1][1])
        cc.stroke()
        cc.closePath()
    }
    if (spiral) {
        if (length < 0) {
            spiral = false
            return
        }
        spiralPoints = spiralPoints.concat(points)
        length -= speed / 5
    }

}

function drawCenterLines(points) {
    cc.beginPath()
    cc.lineWidth = 5
    cc.strokeStyle = webColor
    for (let e = 0; e < points.length; e++) {
        cc.moveTo(points[e][0], points[e][1])
        cc.lineTo(500, 500)
    }
    cc.stroke()
    cc.closePath()
}

function drawWeb(points) {
    let completed = []
    cc.lineWidth = 5
    cc.strokeStyle = webColor
    let lines = []
    for (let e = 0; e < points.length; e++) {
        let point = points[e]
        for (let i = 0; i < points.length; i++) {
            if (completed.indexOf(points[i]) !== -1) {
                // if i in completed, continue
                continue
            }
            if (points[i] === point) {
                // if i is current point, continue
                continue
            }
            if (points[e - 1] === points[i] || points[e + 1] === points[i]) {
                // if point is adjacent, continue
                continue
            }
            if (points[e - 1] === undefined && points[points.length - 1] === points[i]) {
                continue
            }

            lines.push({start: point, end: points[i]})
        }
        completed.push(point)
    }
    cc.beginPath()
    for (let i = 0; i < lines.length; i++) {
        cc.moveTo(lines[i]['start'][0], lines[i]['start'][1])
        cc.lineTo(lines[i]['end'][0], lines[i]['end'][1])
    }
    cc.closePath()
    cc.stroke()
}

let spinRotation = 0
let lastSpiral = false
let lastSideCount = 0
let lastRotation = 0

function init() {
    const sidesSlider = document.getElementById('polygonSidesSlider')
    const rotationSlider = document.getElementById('rotationSlider')

    // rotationValue.style.left = `${(92.7 / (rotationSlider.max - rotationSlider.min)) * (rotationSlider.value - rotationSlider.min) - 46.4}%`
    // rotationSlider.oninput = () => {
    //     rotationValue.style.left = `${(92.7 / (rotationSlider.max - rotationSlider.min)) * (rotationSlider.value - rotationSlider.min) - 46.4}%`
    // }
    //
    // sideValue.style.left = `${(92.7 / (sidesSlider.max - sidesSlider.min)) * (sidesSlider.value - sidesSlider.min) - 46.5}%`
    // sidesSlider.oninput = () => {
    //     sideValue.style.left = `${(92.7 / (sidesSlider.max - sidesSlider.min)) * (sidesSlider.value - sidesSlider.min) - 46.5}%`
    // }

    // let psdelt = window.getComputedStyle(document.querySelector('#polygonSidesSlider'), '::-moz-range-thumb')
    // console.log(psdelt)
}

function animate() {
    requestAnimationFrame(animate)
    canvas.width = 1000
    canvas.height = 1000
    const sides = document.getElementById('polygon-sides-slider')
    const rotationValue = parseInt(document.getElementById('rotation-slider').value)
    const web = document.getElementById('web-checkbox').checked
    const spin = document.getElementById('spin-checkbox').checked
    const noLines = document.getElementById('points-checkbox').checked
    const centerLines = document.getElementById('center-line-checkbox').checked
    const spiralCheckbox = document.getElementById('spiral-checkbox').checked
    if (lastSpiral !== spiralCheckbox) {
        spinRotation = 0
        lastSpiral = spiralCheckbox
        if (spiralCheckbox) {
            spiral = spiralCheckbox
        }
    }
    if (spiralCheckbox && (lastSideCount !== parseInt(sides.value) || rotationValue !== lastRotation)) {
        lastSideCount = parseInt(sides.value)
        lastRotation = rotationValue
        spinRotation = 0

        length = 470
        spiralPoints = []
        spiral = spiralCheckbox
    }
    if (!spiralCheckbox) {
        length = 470
        spiralPoints = []
    }
    // const rotationCounter = document.getElementById('rotationCount')
    let rotation
    if (spin) {
        spinRotation += rotationValue / 2
        rotation = spinRotation
    } else {
        rotation = rotationValue
    }
    // rotationCounter.innerText = (rotationValue * 5).toString()
    cc.fillStyle = "#222222"
    cc.fillRect(0, 0, canvas.width, canvas.height)
    if (sides.value === sides.max) {
        drawCircle(web)
    } else {
        let polygonData = generatePoints(parseInt(sides.value), rotation * 5, noLines)
        let points = polygonData[0]
        let perimeter = polygonData[1]
        let area = polygonData[2]
        if (web) {
            drawWeb(points)
        }
        if (centerLines) {
            drawCenterLines(points)
        }
        drawPolygon(points, perimeter, area, noLines, spiralCheckbox)
        drawSpiral(points, rotation)
    }
    cc.beginPath()
    cc.strokeStyle = "#00FF00"
    cc.arc(500, canvas.height/2, 1, 0, Math.PI * 2)
    cc.stroke()
    cc.closePath()
}

init()
animate()