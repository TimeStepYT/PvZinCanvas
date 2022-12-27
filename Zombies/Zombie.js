zombieSpawnRate = 5000
zombieFrame = -2500

zombrandYsel = [134, 233, 335, 425, 526]
rows = [1, 2, 3, 4, 5]

function zombieActions() {
    zombrandY = Math.round(Math.random() * 4)
    zombieFrame += 1 * dt
    if (zombieFrame >= zombieSpawnRate / 2) {
        zombies.push({
            "x": 800,
            "y": zombrandYsel[zombrandY] - ZombieWalk1Frames[0].height / 1.5,
            "animFrame": 0,
            "row": rows[zombrandY],
            "health": 10
        })
        zombieFrame = 0
    }
    zombies.forEach((z, zi) => {
        if (!paused) {
            if (z["x"] + ZombieWalk1Frames.width / 2 <= 0) zombies.splice(zi, 1) 
            z["x"] -= (1 / 6) * dt
        }
    })
}