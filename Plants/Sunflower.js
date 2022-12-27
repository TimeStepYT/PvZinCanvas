sunFlowerSunSpawnRate = 2000

function sunflowerActions() {
    sunflowers.forEach(s => {
        s["sunSpawnFrame"] += dt

        if (s["sunSpawnFrame"] >= sunFlowerSunSpawnRate) {
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
            
            s["sunSpawnFrame"] = 0
        }
    })


}