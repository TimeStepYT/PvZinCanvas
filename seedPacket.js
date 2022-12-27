function drawCost(cost) {
    ctx.fillText(cost, Math.round(packetX + seedPacket.width - 69), 72)
}

function drawSeedBank() {
    ctx.textRendering = "geometricPrecision"
    ctx.drawImage(seedBankI, 10, 0)
    ctx.font = "19px Continuum"
    ctx.textAlign = "center"
    ctx.fillText(sun, 48, 78)

    ctx.textAlign = "right"
    ctx.font = "12px Pico129"
    for (i = 0; i < selPlants.length; i++) {
        
        packetX = 89 + i * (365 / 6)
        

        if (selPlants[i] == 0) {
            if (selPlant == 0 && p.plant == 0) ctx.filter = "brightness(50%)"
            ctx.drawImage(seedPacket, packetX, 8, seedPacket.width / 2, seedPacket.height / 2)
            ctx.drawImage(PeashooterFrames[6], packetX + 5, 18, PeashooterFrames[0].width / 4, PeashooterFrames[0].height / 4)
            drawCost(100)
        } else if (selPlants[i] == 1) {
            if (selPlant == 1 && p.plant == 1) ctx.filter = "brightness(50%)"
            ctx.drawImage(seedPacket, packetX, 8, seedPacket.width / 2, seedPacket.height / 2)
            ctx.drawImage(SunflowerFrames[6], packetX + 5, 18, SunflowerFrames[0].width / 4, SunflowerFrames[0].height / 4)
            drawCost(50)
        }
        ctx.filter = "brightness(100%)"
        if (clickedAt[0] >= 87 && clickedAt[0] <= 446 && clickedAt[1] <= 78.5 && clickedAt[1] >= 7.5) {
            if (clickedAt[0] >= packetX && clickedAt[0] <= packetX + seedPacket.width / 2) {
                selPlant = selPlants[i]
                p.plant = selPlants[i]
            }
        }
    }
}