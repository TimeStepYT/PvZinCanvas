function drawZombieFrame(zarr, zombieFrames, s, particularFrame) {
    ctx.drawImage(
        zombieFrames[particularFrame],
        zarr.x - cameraX,
        zarr.y,
        zombieFrames[0].width / s,
        zombieFrames[0].height / s
    );
}

function drawZombie(zombieArray, zombieFrames, s, speed) {
    if (zombieArray.length === 0) {
        return;
    }

    zombieArray.forEach(zarr => {
        zarr.animFrame += Math.round(speed * dt);
        const particularFrame = Math.round(zarr.animFrame) % zombieFrames.length;

        if (zarr.hit) {
            ctx.filter = "brightness(150%)"
            zarr.hit = false
        }

        if (showHitboxes === 1) {
            ctx.strokeStyle = "red"
            ctx.strokeRect(zarr.x + peaImage.width - cameraX, zarr.y, ZombieWalk1Frames[0].width / 1.5, ZombieWalk1Frames[0].height)
        }

        drawZombieFrame(zarr, zombieFrames, s, particularFrame)
        drawZombieFrame(zarr, zombieFrames, s, particularFrame)
        ctx.filter = "brightness(100%)"

    });

}