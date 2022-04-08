const canvas = document.querySelector('canvas')
const cc = canvas.getContext('2d')
const length = 500
const strokeStyle = "#FF0000"
const webColor = "#0000FF"

function drawPolygon(points, perimeter, area, noLines) {
    cc.beginPath()
    cc.strokeStyle = strokeStyle
    cc.fillStyle = "#FFFFFF"
    cc.lineWidth = 5
    for (const point of points) {
        if (noLines) {
            cc.beginPath()
            cc.arc(point[0], point[1], 1, 0, Math.PI * 2)
            cc.closePath()
            cc.stroke()
        } else {
            cc.lineTo(point[0], point[1])
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
        points[i] = rotate(500, 500, points[i][0], points[i][1], rotation)
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
    cc.stroke()
    cc.closePath()
}

let spinRotation = 0

function animate() {
    requestAnimationFrame(animate)
    canvas.width = 1000
    canvas.height = 1000
    const sides = document.getElementById('polygonSidesSlider')
    const rotationValue = parseInt(document.getElementById('rotationSlider').value)
    const sideCounter = document.getElementById('polygonSidesCount')
    const web = document.getElementById('webCheckbox').checked
    const spin = document.getElementById('spinCheckbox').checked
    const noLines = document.getElementById('pointsCheckbox').checked
    const centerLines = document.getElementById('centerLineCheckbox').checked
    const rotationCounter = document.getElementById('rotationCount')
    let rotation
    if (spin) {
        spinRotation += rotationValue / 20
        rotation = spinRotation
    } else {
        rotation = rotationValue
    }
    rotationCounter.innerText = (rotationValue * 5).toString()
    if (sides.value === sides.max) {
        sideCounter.innerText = '∞'
    } else {
        sideCounter.innerText = sides.value
    }
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
        drawPolygon(points, perimeter, area, noLines)
    }
    cc.beginPath()
    cc.strokeStyle = "#00FF00"
    cc.arc(500, 500, 1, 0, Math.PI * 2)
    cc.stroke()
    cc.closePath()
}

const linkButtons = document.querySelectorAll('.link_btn')
linkButtons.forEach((button) => {
    button.addEventListener('click', () => {
        window.location.href = button.getAttribute('link')
    })
})

animate()