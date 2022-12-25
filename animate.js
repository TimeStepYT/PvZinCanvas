sunflowers = []
peashooters = []

lastUpdate = performance.now()

function calcDeltaTime() {
    now = performance.now()
    dt = (now - lastUpdate) / 10
    lastUpdate = now
}

function getNearestGridElement() {

    gridX = GridX.reduce(
        function (prev, curr) {
            return (
                Math.abs(curr - xPos) < Math.abs(prev - xPos) ? curr : prev
            )
        }
    )
    
    gridY = GridY.reduce(
        function (prev, curr) {
            return (
                Math.abs(curr - yPos) < Math.abs(prev - yPos) ? curr : prev
            )
        }
    )
}

function drawAll() {
    ctx.drawImage(background1, -220, 0)

    drawSeedBank([1, 0])

    drawPlant(sunflowers, SunflowerFrames, 2, 0.301)
    drawPlant(peashooters, PeashooterFrames, 2, 0.28)

    drawPrev(100, 0, 4, 2, PeashooterFrames)
    drawPrev(50, 1, 4, 2, SunflowerFrames)

    sunflowerActions()
    sunStuff()
}


function animate() {
    requestAnimationFrame(animate)

    if (bgLoaded && activeWindow) {

        calcDeltaTime()

        getNearestGridElement()

        drawAll()

    } else if (!activeWindow) {
        lastUpdate = performance.now()
    }
}