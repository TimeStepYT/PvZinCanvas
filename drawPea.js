/*function drawPea(peaArray, s) {
    peaArray.forEach((parr, pi) => {
        parr["x"] += 5 * dt

        zombies.filter(z =>
            z["row"] === parr["row"] &&
            parr["x"] >= z["x"] + ZombieWalk1Frames[0].width / 6 &&
            parr["x"] <= z["x"] + ZombieWalk1Frames[0].width / 2
        ).forEach((z, zi) => {
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
    for (const i of peas.filter(pa => pa["x"] > 900)) {
        peas.splice(peas.indexOf(i, 1))
        console.log("oob pea")
    }
}
*/
function drawPea(peaArray, s) {
    peaArray.forEach((pea, peaIndex) => {
        // Update the position of the pea
        pea.x += 5 * dt;

        // Check if the pea has collided with a zombie
        const collidingZombies = zombies.filter(zombie => (
            zombie.row === pea.row &&
            pea.x >= zombie.x + ZombieWalk1Frames[0].width / 6 &&
            pea.x <= zombie.x + ZombieWalk1Frames[0].width / 2
        ));
        collidingZombies.forEach((zombie, zombieIndex) => {
            // Remove the pea from the array
            peaArray.splice(peaIndex, 1);
            // Reduce the zombie's health
            zombie.health--;
            if (zombie.health <= 0) {
                // Remove the zombie from the array
                zombies.splice(zombieIndex, 1);
                // Add a new zombie
                addZombie();
            }
        });

        // Draw the pea on the canvas
        ctx.drawImage(
            peaImage,
            pea.x,
            pea.y,
            peaImage.width / s,
            peaImage.height / s
        );
    });

    // Remove any peas that are out of bounds
    for (const i of peas.filter(pa => pa.x > 900)) {
        peas.splice(peas.indexOf(i, 1));
    }
}