sunflowers = []
peashooters = []

zombies = []

peas = []

lastUpdate = performance.now()

paused = false

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
    if (!paused) {
        ctx.drawImage(background1, -220, 0)

        drawSeedBank()

        drawPlant(sunflowers, SunflowerFrames, 2, 0.301)
        drawPlant(peashooters, PeashooterFrames, 2, 0.28)

        drawPrev(100, 0, 4, 2, PeashooterFrames)
        drawPrev(50, 1, 4, 2, SunflowerFrames)

        sunflowerActions()
        peashooterActions()
        zombieActions()

        drawZombie(zombies, ZombieWalk1Frames, 1, 0.301)

        drawPea(peas, 1)

        sunStuff()
    }
}


function animate() {
    requestAnimationFrame(animate)

    if (bgLoaded && activeWindow) {
        paused = false
        calcDeltaTime()

        getNearestGridElement()

        drawAll()

    } else if (!activeWindow) {
        paused = true
        lastUpdate = performance.now()
    }
}