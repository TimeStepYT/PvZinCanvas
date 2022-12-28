peashooterPeaSpawnRate = 82

function peashooterActions() {
    peashooters.forEach(p => {
        p.peaFrame += 0.28 * dt
        if (p["peaFrame"] >= peashooterPeaSpawnRate / 2 && p["animFrame"] >= 30) {
            zombies.filter(z => p["row"] == z["row"] && p["x"] <= z["x"]).forEach((z, zi) => {
                peas.push({
                    "x": p["x"] + PeashooterFrames[0].width / 2 - peaImage.width,
                    "y": p["y"] + 10,
                    "row": p.row
                })

                p["peaFrame"] = 0

            })
        }
    })
}