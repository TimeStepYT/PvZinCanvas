zombieSpawnRate = 5000
zombieFrame = -2500

zombrandYsel = [134, 233, 335, 425, 526]
rows = [1, 2, 3, 4, 5]
function addZombie() {
    zombrandY = Math.round(Math.random() * 4)
    zombies.push({
        "x": 800,
        "y": zombrandYsel[zombrandY] - ZombieWalk1Frames[0].height / 1.5,
        "animFrame": 0,
        "row": rows[zombrandY],
        "health": 10
    })
}
function zombieActions() {

    zombieFrame += 1 * dt
    if (zombieFrame >= zombieSpawnRate / 2 /*&&zombies.length <= 20*/) {
        addZombie()
        zombieFrame = 0
    }
    zombies.filter(z => z["x"] + ZombieWalk1Frames[0].width <= 0).forEach((z, zi) => {
        zombies.splice(zi, 1)
    })
    zombies.forEach(z => z["x"] -= (1 / 6) * dt)
}