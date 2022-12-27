peashooterPeaSpawnRate = 82

function peashooterActions() {
    peashooters.forEach((p, pi) => {
        p["peaFrame"] += 0.28 * dt
        zombies.filter(z => p["row"] == z["row"] && p["peaFrame"] >= peashooterPeaSpawnRate / 2 && p["animFrame"] >= 30).forEach((z, zi) => {
            if (p["x"] <= z["x"] + ZombieWalk1Frames[0].width / 4 ) {
                peas.push({
                    "x": p["x"] + PeashooterFrames[0].width / 2 - peaImage.width,
                    "y": p["y"] + 10,
                    "row": p["row"]
                })
            }
            p["peaFrame"] = 0
        })
    })
}