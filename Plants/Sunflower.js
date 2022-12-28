sunFlowerSunSpawnRate = 2000

function pushSun(fromSky) {
    if (fromSky) {
        suns.push({
            "x": Math.floor(Math.random() * 680),
            "y": -50,
            "fallingSunMaxY": Math.floor(Math.random() * (480 - 160) + 160),
            "isCollected": false,
            "fromSky": true,
            "sunFrame": 0
        })
        sunFrame = 0
    } else {
        sunflowers.filter(s => s.sunSpawnFrame >= sunFlowerSunSpawnRate / 2).forEach(s => {
            var randX = Math.round(Math.random() * 60) - 30

            suns.push({
                "x": s["x"],
                "y": s["y"] - 50,
                "fallingSunMaxY": null,
                "isCollected": false,
                "fromSky": false,
                "sunFrame": 0,
                "sunflowerSunSpawnAnimationFrame": s["y"] - 50,
                "sunflowerSunTargetX": randX
            })

            s.sunSpawnFrame = 0
        })
    }
}

function sunflowerActions() {
    sunflowers.forEach(s => {
        s.sunSpawnFrame += dt
    })
    pushSun(false)
}