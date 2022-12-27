function drawPlant(plantArray, plantFrames, s, speed) {
    if (plantArray != []) {

        plantArray.forEach(plool => {
            plool["animFrame"] += speed * dt
            particularFrame = Math.round(plool["animFrame"]) % plantFrames.length

            ctx.drawImage(
                plantFrames[particularFrame],

                plool["x"],
                plool["y"],
                plantFrames[0].width / s,
                plantFrames[0].height / s
            )
        })

    }
}

function drawPrev(cost, plant, x, s, plantFrames) {
    if (sun >= cost && selPlant == plant) {
        if (isFree()) {
            ctx.globalAlpha = 0.25

            ctx.drawImage(
                plantFrames[0],

                gridX - plantFrames[0].width / x,
                gridY - plantFrames[0].height / s + 28,
                plantFrames[0].width / s,
                plantFrames[0].height / s
            )

            ctx.globalAlpha = 1
        }

        ctx.drawImage(
            plantFrames[0],

            xPos - plantFrames[0].width / x,
            yPos - plantFrames[0].height / s + 28,
            plantFrames[0].width / s,
            plantFrames[0].height / s
        )
    } else {
        selPlant = null
    }
}