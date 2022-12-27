function drawPea(peaArray, s) {
    if (peaArray != []) {

        peaArray.forEach((parr, pi) => {
            parr["x"] += 5 * dt

            zombies.forEach((z, zi) => {
                if (parr["x"] >= z["x"] + ZombieWalk1Frames[0].width / 6 && parr["row"] == z["row"]) {
                peaArray.splice(pi, 1)
                z["health"]--
                if (z["health"] <= 0) {
                    zombies.splice(zi, 1)
                }
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