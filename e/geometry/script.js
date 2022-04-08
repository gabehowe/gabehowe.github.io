const canvas = document.querySelector('canvas')
const cc = canvas.getContext('2d')
const length = 500
const strokeStyle = "#FF0000"
const webStyle = "#0000FF"

function drawPolygon(points, perimeter, area) {
    cc.beginPath()
    cc.strokeStyle = strokeStyle
    cc.fillStyle = "#FFFFFF"
    cc.lineWidth = 5
    for (const point of points) {
        cc.lineTo(point[0], point[1])
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

function generatePoints(sides) {
    if (sides < 3) {
        return
    }
    const angle = ((sides - 2) * 180) / sides
    let direction = angle
    const sideLength = length - (sides)
    const offset = /*sides === 3 ? 100 : */0
    let points = []
    for (let i = 0; i < sides; i++) {
        cc.lineTo((canvas.width / 2) - offset + sideLength * Math.cos(i * 2 * Math.PI / sides), (canvas.height / 2) + sideLength * Math.sin(i * 2 * Math.PI / sides));
        points.push([(canvas.width / 2) - offset + sideLength * Math.cos(i * 2 * Math.PI / sides), (canvas.height / 2) + sideLength * Math.sin(i * 2 * Math.PI / sides)])
        direction += angle
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
    cc.fillStyle = webStyle
    cc.arc(500, 500, radius, 0, Math.PI * 2)
    cc.closePath()
    if (filled) {
        cc.fill()
    }
    cc.stroke()
}

function drawWeb(points) {
    let completed = []
    cc.beginPath()
    cc.lineWidth = 5
    cc.strokeStyle = webStyle
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


            cc.moveTo(point[0], point[1])
            cc.lineTo(points[i][0], points[i][1])
        }
        completed.push(point)
    }
    cc.stroke()
}

function animate() {
    requestAnimationFrame(animate)
    canvas.width = 1000
    canvas.height = 1000
    const input = document.getElementById('polygonSidesSlider')
    const sideCounter = document.getElementById('sideCount')
    const web = document.getElementById('webCheckbox').checked
    if (input.value === input.max) {
        sideCounter.innerText = '∞'
    } else {
        sideCounter.innerText = input.value
    }
    cc.fillStyle = "#222222"
    cc.fillRect(0, 0, canvas.width, canvas.height)
    if (input.value === input.max) {
        drawCircle(web)
    } else {
        let polygonData = generatePoints(parseInt(input.value))
        let points = polygonData[0]
        let perimeter = polygonData[1]
        let area = polygonData[2]
        if (web) {
            drawWeb(points)
        }
        drawPolygon(points, perimeter, area)
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