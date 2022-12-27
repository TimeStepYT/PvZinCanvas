function drawZombie(zombieArray, zombieFrames, s, speed) {
    if (zombieArray != []) {

        zombieArray.forEach(zarr => {
            zarr["animFrame"] += speed * dt
            particularFrame = Math.round(zarr["animFrame"]) % zombieFrames.length

            ctx.drawImage(
                zombieFrames[particularFrame],

                zarr["x"],
                zarr["y"],
                zombieFrames[0].width / s,
                zombieFrames[0].height / s
            )
        })

    }
}