function drawPea(peaArray, s) {
    if (peaArray != []) {

        peaArray.forEach((parr, pi) => {
            parr["x"] += 5 * dt

            zombies.filter(z => z["row"] == parr["row"] && parr["x"] >= z["x"] + ZombieWalk1Frames[0].width / 6).forEach((z, zi) => {
                peaArray.splice(pi, 1)
                z["health"]--
                if (z["health"] <= 0) {
                    zombies.splice(zi, 1)
                    addZombie()
                }
            })

            ctx.drawImage(
                peaImage,
                parr["x"],
                parr["y"],
                peaImage.width / s,
                peaImage.height / s
            )
        })

    }
}