zombieSpawnRate = 5000
zombieFrame = -500

zombrandYsel = [134, 233, 335, 425, 526]
rows = [1, 2, 3, 4, 5]
zwfh = ZombieWalk1Frames[0].height / 1.5

function addZombie() {
    zombrandY = Math.round(Math.random() * 4)
    zombies.push({
        "x": 800,
        "y": zombrandYsel[zombrandY] - zwfh,
        "animFrame": 0,
        "row": rows[zombrandY],
        "health": 10
    })
    zombies.sort((a, b) => a.row - b.row);
}
function zombieActions() {

    zombieFrame += 1 * dt
    if (zombieFrame >= zombieSpawnRate / 2 /*&&zombies.length <= 20*/) {
        addZombie()
        zombieFrame = 0
    }
    zombiesDeleteable = zombies.filter(z => z.x + ZombieWalk1Frames[0].width <= 0 || z.health <= 0)
    for (z of zombiesDeleteable) {
        zombies.splice(zombies.indexOf(z), 1)
        if (z.health <= 0) addZombie()
        break
    }
    zombies.forEach(z => z.x -= (1 / 6) * dt)
}