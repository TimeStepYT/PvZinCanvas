suns = []
sunRate = 2500

function sunStuff() {
    sunFrame += dt % sunRate + 1
    if (sunFrame >= sunRate) {
        pushSun(true)
    }

    notCollectedSuns = suns.filter(s => !s.isCollected)
    collectedSuns = suns.filter(s => s.isCollected)


    notCollectedSuns.forEach((s, v) => {
        s.y = s.y < s["fallingSunMaxY"] && s.fromSky ? s.y + 0.5 * dt : s.y
        s.sunFrame += dt * 0.5
        if (s.sunFrame >= 800) {
            ctx.globalAlpha = (((s.sunFrame - 800) / 10) - 1) * -1
            if (s.sunFrame >= 805) {
                suns.splice(v, 1)
            }
        }
        if (s.sunFrame <= 55 && !s.fromSky) {
            s.y = s["sunflowerSunSpawnAnimationFrame"] + (Math.pow(s.sunFrame - 27.4, 2) / 25) + 30
            s.x += (s["sunflowerSunTargetX"] / 55) * 0.5 * dt
        }
        ctx.drawImage(sunImage, s.x - cameraX, s.y, sunImage.width / 2, sunImage.height / 2)
        ctx.globalAlpha = 1
    })

    for (s of collectedSuns) {
        suns.sort((a, b) => a.isCollected - b.isCollected);
        v = suns.indexOf(s)
        sunAngle = Math.atan2(-s.y, -s.x)
        s.x += (Math.cos(sunAngle) * 5) * s.x / 75 * dt
        s.y += (Math.sin(sunAngle) * 5) * s.y / 75 * dt
        if ((s.x <= 25 && s.y <= 7.5) /* || s.x <= 0 || s.y <= 0*/) {
            suns.splice(v, 1)
            sun += 25
            running = false
            break
        }
        ctx.drawImage(sunImage, s.x, s.y, sunImage.width / 2, sunImage.height / 2)
    }
}