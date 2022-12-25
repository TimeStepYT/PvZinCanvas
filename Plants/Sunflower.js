sunFlowerSunSpawnRate = 2000

function sunflowerActions() {
    sunflowers.forEach(s => {
        s["sunSpawnFrame"] += dt
        s["sunSpawnFrame"] %= sunFlowerSunSpawnRate

        if (s["sunSpawnFrame"] >= sunFlowerSunSpawnRate / 2 && !s["sunSpawned"]) {
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

            s["sunSpawned"] = true
        } else if (s["sunSpawned"] && s["sunSpawnFrame"] <= sunFlowerSunSpawnRate / 2) {
            s["sunSpawned"] = false
        }
    })


}