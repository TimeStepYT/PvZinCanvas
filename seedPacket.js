function drawCost(cost) {
    ctx.fillText(cost, Math.round(packetX + seedPacket.width - 69), 72)
}

function drawSeedBank() {
    // Store reference to seedPacket to avoid accessing the global variable multiple times
    const packet = seedPacket;

    ctx.textRendering = "geometricPrecision";
    ctx.drawImage(seedBankI, 10, 0);
    ctx.font = "19px Continuum";
    ctx.textAlign = "center";
    ctx.fillText(sun, 48, 78);

    ctx.textAlign = "right";
    ctx.font = "12px Pico129";

    // Precalculate packet dimensions to avoid recalculating in the loop
    const packetWidth = packet.width / 2;
    const packetHeight = packet.height / 2;

    // Precalculate the width of each packet
    const packetSpacing = 365 / 6;

    // Use a for loop to iterate over selPlants
    for (let i = 0; i < selPlants.length; i++) {
        const packetX = 89 + i * packetSpacing;

        if (selPlants[i] === 0) {
            if (sun >= 100) {
                if (selPlant === 0 && p.plant === 0) ctx.filter = "brightness(50%)";
            } else if (selPlant === 0) selPlant = null;

            ctx.drawImage(packet, packetX, 8, packetWidth, packetHeight);
            ctx.drawImage(PeashooterFrames[6], packetX + 5, 18, PeashooterFrames[0].width / 4, PeashooterFrames[0].height / 4);
            drawCost(100);

        } else if (selPlants[i] === 1) {
            if (sun >= 50) {
                if (selPlant === 1 && p.plant === 1) ctx.filter = "brightness(50%)";
            } else if (selPlant === 1) selPlant = null;
            
            ctx.drawImage(packet, packetX, 8, packetWidth, packetHeight);
            ctx.drawImage(SunflowerFrames[6], packetX + 5, 18, SunflowerFrames[0].width / 4, SunflowerFrames[0].height / 4);
            drawCost(50);
        }

        ctx.filter = "brightness(100%)";
        if (clickedAt[0] >= 87 && clickedAt[0] <= 446 && clickedAt[1] <= 78.5 && clickedAt[1] >= 7.5) {
            if (clickedAt[0] >= packetX && clickedAt[0] <= packetX + packetWidth) {
                selPlant = selPlants[i];
                p.plant = selPlants[i];
            }
        }
    }
}
