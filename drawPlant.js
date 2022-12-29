function drawPlant(plantArray, plantFrames, s, speed) {
    plfr = plantFrames[0]
    plws = plfr.width / s
    plhs = plfr.height / s
    if (plantArray != []) {

        plantArray.forEach(plool => {
            plool.animFrame += speed * dt
            particularFrame = Math.round(plool.animFrame) % plantFrames.length

            ctx.drawImage(
                plantFrames[particularFrame],

                plool.x - cameraX,
                plool.y,
                plws,
                plhs
            )
        })

    }
}


function drawPrev(cost, plant, x, s, plantFrames) {
    plfr = plantFrames[0]
    plwis = plfr.width / s
    plhis = plfr.height / s
    plwix = plfr.width / x

    if (sun >= cost && selPlant == plant) {
        if (isFree()) {
            ctx.globalAlpha = 0.25

            ctx.drawImage(
                plfr,
                gridX - plwix - cameraX,
                gridY - plhis + 28,
                plwis,
                plhis
            )

            ctx.globalAlpha = 1
        }

        ctx.drawImage(
            plfr,
            xPos - plwix,
            yPos - plhis + 28,
            plwis,
            plhis
        )
    }
}