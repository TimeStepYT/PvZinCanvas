function drawPea(peaArray, s) {
    for (pea of peaArray) {
        peaIndex = peaArray.indexOf(pea)
        pea.x += 5 * dt;

        collidingZombies = zombies.filter(zombie => (
            zombie.row == pea.row &&
            pea.x >= zombie.x &&
            pea.x <= zombie.x + ZombieWalk1Frames[0].width / 1.5
        ))

        for (zombie of collidingZombies) {
            peaArray.splice(peaIndex, 1)
            zombie.hit = true
            zombie.health--;
            break
        }

        if (showHitboxes === 1) {
            ctx.strokeStyle = "lime"
            ctx.strokeRect(pea.x, pea.y, peaImage.width, peaImage.height)
        }

        ctx.drawImage(
            peaImage,
            pea.x,
            pea.y,
            peaImage.width / s,
            peaImage.height / s
        );
        if (pea.x > 900) {
            peaArray.splice(peaIndex, 1);
            break
        }
    }
}