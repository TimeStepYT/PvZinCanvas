class Game {
    constructor() {
        this.canvas = document.getElementById("hahacanvasfunni")
        this.ctx = this.canvas.getContext("2d")
        this.ctx.imageSmoothingQuality = "high"
        this.canvas.width = 800
        this.canvas.height = 600

        this.rect = this.canvas.getBoundingClientRect();
        const urlParams = new URLSearchParams(window.location.search);
        const sunParam = parseInt(urlParams.get("sun"))

        this.showHitboxes = parseInt(urlParams.get("showHitboxes"))

        if (!isNaN(sunParam)) {
            this.sun = sunParam
        } else {
            this.sun = 50
        }

        this.inithooks()

        this.makeTakenDict()

        this.addRandZombies()

        requestAnimationFrame(() => this.animate())
    }

    inithooks() {
        window.onkeydown = (e) => this.onkeydown(e);
        window.onfocus = () => this.onfocus();
        window.onblur = () => this.onblur();
        window.onmousemove = e => this.onmousemove(e);
        window.onmousedown = e => this.onmousedown(e);
    }
    addRandZombies() {
        for (let i = 0; i < 5; i++) {
            const variation = Math.round(Math.random())
            const animFrame = variation === 0 ? Math.round(Math.random() * 28) : Math.round(Math.random() * 58)

            this.zombies.push({
                x: Math.round(Math.random() * 100 + 890),
                y: Math.round(Math.random() * 446 + 15.5),
                animFrame,
                animVariation: variation,
            })
        }
        this.zombies.sort((a, b) => a.y - b.y + b.x - a.x);

    }

    taken = {}
    GridX = [72, 149, 232, 313, 396, 473, 553, 629, 708]
    GridY = [134, 233, 340, 434, 531]

    gridX = 0
    gridY = 0

    makeTakenDict() {
        for (const x of this.GridX) {
            this.taken[x] = {};
            for (const y of this.GridY) {
                this.taken[x][y] = [false];
            }
        }
    }

    xPos = 0
    yPos = 0

    isFree() {
        return !(this.taken[this.gridX][this.gridY][0])
    }
    pointingOnClickable = false
    selPlants = [0, 1]
    suns = []
    uncollectedSunsOver = []
    stopSunPointer = false;
    stopSunPointer = false;

    onmousemove(e) {
        this.pointingOnClickable = false
        let rect = this.canvas.getBoundingClientRect()
        this.rect = rect

        let xPos = e.clientX - rect.left
        let yPos = e.clientY - rect.top
        this.xPos = xPos
        this.yPos = yPos

        for (let i = 0; i < this.selPlants.length; i++) {
            const selPlantPlant = this.selPlants[i]

            if (!this.stopBankPointer) {
                this.packetX = 89 + i * (365 / 6)

                if ((selPlantPlant == 0 && this.sun < 100) || this.seedBankY != 0) continue
                if ((selPlantPlant == 1 && this.sun < 50) || this.seedBankY != 0) continue

                if (xPos >= 87 && xPos <= 446 && yPos <= 78.5 && yPos >= 7.5) {
                    if (xPos >= this.packetX && xPos <= this.packetX + seedPacket.width / 2) {
                        this.pointingOnClickable = true
                        break
                    } else {
                        this.pointingOnClickable = false
                    }
                } else {
                    this.pointingOnClickable = false
                }
            }
        }

        this.uncollectedSunsOver = this.suns.filter(s =>
            Math.sqrt(
                (xPos - (s.x - this.cameraX + sunImage.width / 4.5)) *
                (xPos - (s.x - this.cameraX + sunImage.width / 4.5)) +
                (yPos - (s.y + sunImage.height / 4.5)) *
                (yPos - (s.y + sunImage.height / 4.5))
            ) <
            (sunImage.height / 4.5 + 1) &&
            !s["isCollected"]
        )

        this.uncollectedSunsOver.forEach(s => {

            this.pointingOnClickable = true
            this.stopSunPointer = true

        })

        this.stopSunPointer = false
        this.stopBankPointer = false
        if (this.pointingOnClickable) this.canvas.style = "cursor: pointer;"
        else this.canvas.style = ""
    }
    clickedAt = [null, null]
    onmousedown(e) {

        let rect = this.rect
        let xPos = e.clientX - rect.left
        let yPos = e.clientY - rect.top
        this.xPos = xPos
        this.yPos = yPos

        if (e.button == 0) {
            this.clickedAt = [xPos, yPos]

            this.uncollectedSunsOver = this.suns.filter(s =>
                Math.sqrt(
                    (xPos - (s.x - this.cameraX + sunImage.width / 4.5)) *
                    (xPos - (s.x - this.cameraX + sunImage.width / 4.5)) +
                    (yPos - (s.y + sunImage.height / 4.5)) *
                    (yPos - (s.y + sunImage.height / 4.5))) <
                (sunImage.height / 4.5 + 1) && !s["isCollected"])

            for (let s of this.uncollectedSunsOver.reverse()) {
                s.isCollected = true
                s.x -= this.cameraX
                this.clickedAt = [null, null]
                return
            }

            if (!(xPos >= 87 && xPos <= 446 && yPos <= 78.5 && yPos >= 7.5) && this.selPlant != null) {
                p.place(this.selPlant)
                this.selPlant = null
            }
        }
        else {
            this.selPlant = null
            p.plant = null
        }
    }

    cameraX = 0
    onkeydown(e) {
        switch (e.key) {
            case '1':
                this.selPlant = 0
                p.plant = 0
                break;
            case '2':
                this.selPlant = 1
                p.plant = 1
                break;
            case 'Escape':
                this.selPlant = null
                p.plant = null
                break;
            case 'z':
                this.addZombie()
                break;
            case 'a':
                this.cameraX -= 5 * this.dt
                if (this.cameraX < -220) this.cameraX = -220
                break;
            case 'd':
                this.cameraX += 5 * this.dt
                if (this.cameraX > 380) this.cameraX = 380
                break;
            case 'r':
                this.cameraX = 0
                break;
        }
    }

    activeWindow = true
    onfocus() {

        this.activeWindow = true
    }

    onblur() {

        this.activeWindow = false
    }


    drawZombieFrame(zarr, zombieFrames, s, particularFrame) {
        this.ctx.drawImage(
            zombieFrames[particularFrame],
            zarr.x - this.cameraX,
            zarr.y,
            zombieFrames[0].width / s,
            zombieFrames[0].height / s
        );
    }

    drawZombie(zombieArray, zombieFrames, s, speed) {
        if (zombieArray.length === 0) {
            return
        }

        zombieArray.forEach(zarr => {
            let particularFrame
            zarr.animFrame += Math.round(speed * this.dt);
            if (zarr.animVariation == 0) particularFrame = Math.round(zarr.animFrame) % ZombieIdleFrames.length
            else if (zarr.animVariation == 1) particularFrame = Math.round(zarr.animFrame) % ZombieIdle2Frames.length
            else particularFrame = Math.round(zarr.animFrame) % zombieFrames.length

            if (zarr.hit) {
                this.ctx.filter = "brightness(150%)"
                zarr.hit = false
            }

            if (this.showHitboxes === 1) {
                this.ctx.strokeStyle = "red"
                this.ctx.strokeRect(zarr.x + peaImage.width - this.cameraX, zarr.y, ZombieWalk1Frames[0].width / 1.5, ZombieWalk1Frames[0].height)
            }
            if (zarr.animVariation == 0) this.drawZombieFrame(zarr, ZombieIdleFrames, s, particularFrame)
            else if (zarr.animVariation == 1) this.drawZombieFrame(zarr, ZombieIdle2Frames, s, particularFrame)
            else this.drawZombieFrame(zarr, zombieFrames, s, particularFrame)
            // this.drawZombieFrame(zarr, zombieFrames, s, particularFrame)
            this.ctx.filter = "brightness(100%)"

        });

    }




    sunflowers = []
    peashooters = []

    zombies = []

    peas = []

    lastUpdate = performance.now()

    paused = false
    dt = 0
    calcDeltaTime() {
        const now = performance.now()
        this.dt = (now - this.lastUpdate) / 10
        this.lastUpdate = now
    }
    gridX = 0
    gridY = 0

    getNearestGridElement() {

        this.gridX = this.GridX.reduce(
            (prev, curr) =>

                Math.abs(curr - this.xPos - this.cameraX) < Math.abs(prev - this.xPos - this.cameraX) ? (curr) : (prev)

        )

        this.gridY = this.GridY.reduce(
            (prev, curr) =>
                Math.abs(curr - this.yPos) < Math.abs(prev - this.yPos) ? curr : prev

        )
    }

    drawAll() {
        if (!this.paused) {
            this.ctx.drawImage(background1, -220 - this.cameraX, 0)

            this.drawSeedBank()
            if (!this.startAnimationFinished) this.drawZombie(this.zombies, ZombieIdleFrames, 1, 0.301)

            if (this.startAnimationFinished) {
                this.drawPlant(this.sunflowers, SunflowerFrames, 2, 0.301)
                this.drawPlant(this.peashooters, PeashooterFrames, 2, 0.28)

                if (this.sun >= 100 && this.selPlant == 0) this.drawPrev(4, 2, PeashooterFrames)
                else if (this.sun >= 50 && this.selPlant == 1) this.drawPrev(4, 2, SunflowerFrames)

                this.sunflowerActions()
                this.peashooterActions()
                this.zombieActions()

                this.drawZombie(this.zombies, ZombieWalk1Frames, 1, 0.301)

                this.drawPea(this.peas, 1)

                this.sunStuff()
            } else {
                this.startAnimationFrame += this.dt

                if (this.startAnimationFrame >= 0) {

                    if (this.startAnimationFrame < 82) {
                        this.cameraX = (this.startAnimationFrame / 4.942565) ** 2
                    }

                    else if (this.startAnimationFrame < 120) {
                        this.cameraX = -(((this.startAnimationFrame - 120) / 3.7128) ** 2) + 380
                    }

                    else if (this.startAnimationFrame < 260) {
                        this.cameraX = 380
                    }

                    else if (this.startAnimationFrame < 298) {
                        this.cameraX = -(((this.startAnimationFrame - 260) / 3.7128) ** 2) + 380
                    }
                    else if (this.startAnimationFrame < 380) {
                        this.cameraX = ((this.startAnimationFrame - 380) / 4.942565) ** 2
                    }

                    else {
                        this.startAnimationFinished = true
                        this.cameraX = 0
                        this.zombies = []
                    }

                    if (this.startAnimationFrame >= 360 && this.startAnimationFrame < 380) {
                        this.seedBankY = (((this.startAnimationFrame - 370) - 20) / 2.14) ** 2
                    } else if (this.startAnimationFrame >= 380) this.seedBankY = 0


                }
            }
        }
    }

    paused = false
    bgLoaded = false
    animate() {

        if (this.bgLoaded && this.activeWindow) {
            this.paused = false
            this.calcDeltaTime()

            this.getNearestGridElement()

            this.drawAll()

        } else if (!this.activeWindow) {
            this.paused = true
            this.lastUpdate = performance.now()
        }
        requestAnimationFrame(() => this.animate())
    }
    packetX = undefined
    drawCost(cost) {
        this.ctx.fillText(cost, Math.round(this.packetX + seedPacket.width - 69), 72 - this.seedBankY)
    }

    drawSeedBank() {
        let ctx = this.ctx
        const sun = this.sun
        ctx.textRendering = "geometricPrecision"
        ctx.drawImage(seedBankI, 10, 0 - this.seedBankY)
        ctx.font = "19px Continuum"
        ctx.textAlign = "center"
        ctx.fillText(this.sun, 48, 78 - this.seedBankY)

        ctx.textAlign = "right"
        ctx.font = "12px Pico129"
        const selPlants = this.selPlants
        for (let i = 0; i < this.selPlants.length; i++) {

            this.packetX = 89 + i * (365 / 6)
            const packetX = this.packetX

            if (selPlants[i] == 0) {
                if (this.seedBankY == 0) {
                    if (sun >= 100) {
                        if (this.selPlant == 0 && p.plant == 0) ctx.filter = "brightness(33%)"
                    } else if (this.selPlant == 0) this.selPlant = null
                }
                if (sun < 100 || this.seedBankY != 0) ctx.filter = "brightness(67%)"

                ctx.drawImage(seedPacket, packetX, 8 - this.seedBankY, seedPacket.width / 2, seedPacket.height / 2)
                ctx.drawImage(PeashooterFrames[6], packetX + 5, 18 - this.seedBankY, PeashooterFrames[0].width / 4, PeashooterFrames[0].height / 4)
                this.drawCost(100)

            } else if (selPlants[i] == 1) {
                if (this.seedBankY == 0) {
                    if (sun >= 50) {
                        if (this.selPlant == 1 && p.plant == 1) ctx.filter = "brightness(33%)"
                    } else if (this.selPlant == 1) this.selPlant = null
                }
                if (sun < 50 || this.seedBankY != 0) ctx.filter = "brightness(67%)"

                ctx.drawImage(seedPacket, packetX, 8 - this.seedBankY, seedPacket.width / 2, seedPacket.height / 2)
                ctx.drawImage(SunflowerFrames[6], packetX + 5, 18 - this.seedBankY, SunflowerFrames[0].width / 4, SunflowerFrames[0].height / 4)
                this.drawCost(50)
            }

            ctx.filter = "brightness(100%)"
            var clickedAt = this.clickedAt;
            if (clickedAt[0] >= 87 && clickedAt[0] <= 446 && clickedAt[1] <= 78.5 && clickedAt[1] >= 7.5 && this.seedBankY == 0) {
                if (clickedAt[0] >= packetX && clickedAt[0] <= packetX + seedPacket.width / 2) {
                    this.selPlant = selPlants[i]
                    p.plant = selPlants[i]
                }
            } else if (this.seedBankY != 0) {
                this.clickedAt = []
            }
        }
    }


    drawPlant(plantArray, plantFrames, s, speed) {
        const plfr = plantFrames[0]
        const plws = plfr.width / s
        const plhs = plfr.height / s
        if (plantArray != []) {

            plantArray.forEach(plool => {
                plool.animFrame += speed * this.dt
                const particularFrame = Math.round(plool.animFrame) % plantFrames.length

                this.ctx.drawImage(
                    plantFrames[particularFrame],

                    plool.x - this.cameraX,
                    plool.y,
                    plws,
                    plhs
                )
            })

        }
    }


    drawPrev(x, s, plantFrames) {
       
            const plfr = plantFrames[0]
            const plwis = plfr.width / s
            const plhis = plfr.height / s
            const plwix = plfr.width / x
            let ctx = this.ctx;
            if (this.isFree()) {
                ctx.globalAlpha = 0.25

                ctx.drawImage(
                    plfr,
                    this.gridX - plwix - this.cameraX,
                    this.gridY - plhis + 28,
                    plwis,
                    plhis
                )

                ctx.globalAlpha = 1
            }

            ctx.drawImage(
                plfr,
                this.xPos - plwix,
                this.yPos - plhis + 28,
                plwis,
                plhis
            )
        
    }



    sunFlowerSunSpawnRate = 3500

    sunFrame = -150
    seedBankY = 87
    startAnimationFrame = -150
    startAnimationFinished = false

    pushSun(fromSky) {
        if (fromSky) {
            this.suns.push({
                "x": Math.floor(Math.random() * 680),
                "y": -50,
                "fallingSunMaxY": Math.floor(Math.random() * (480 - 160) + 160),
                "isCollected": false,
                "fromSky": true,
                "sunFrame": 0
            })
            this.sunFrame = 0
        } else {
            this.sunflowers.filter(s => s.sunSpawnFrame >= this.sunFlowerSunSpawnRate / 2).forEach(s => {
                const randX = Math.round(Math.random() * 60) - 30

                this.suns.push({
                    "x": s["x"],
                    "y": s["y"] - 50,
                    "fallingSunMaxY": null,
                    "isCollected": false,
                    "fromSky": false,
                    "sunFrame": 0,
                    "sunflowerSunSpawnAnimationFrame": s["y"] - 50,
                    "sunflowerSunTargetX": randX
                })

                s.sunSpawnFrame = 0
            })
        }
    }

    sunflowerActions() {
        this.sunflowers.forEach(s => {
            s.sunSpawnFrame += this.dt
        })
        this.pushSun(false)
    }
    peashooterPeaSpawnRate = 82

    peashooterActions() {
        this.peashooters.forEach(p => {
            p.peaFrame += 0.28 * this.dt
            if (p["peaFrame"] >= this.peashooterPeaSpawnRate / 2 && p["animFrame"] >= 39) {
                for (let z of this.zombies.filter(z => p["row"] == z["row"] && p["x"] <= z["x"])) {
                    this.peas.push({
                        "x": p["x"] + PeashooterFrames[0].width / 2 - peaImage.width,
                        "y": p["y"] + 10,
                        "row": p.row
                    })

                    p["peaFrame"] = 0
                    break
                }
            }
        })
    }


    zombieSpawnRate = 5000
    zombieFrame = -1650

    zombrandYsel = [134, 233, 335, 425, 526]
    addZombie() {
        const zombrandY = Math.round(Math.random() * 4)
        let zm = {
            "x": 800,
            "y": this.zombrandYsel[zombrandY] - 106.6667,
            "animFrame": 0,
            "row": zombrandY + 1,
            "health": 10
        }

        this.zombies.push(zm);
        this.zombies.sort((a, b) => a.row - b.row);
    }
    zombieActions() {

        this.zombieFrame += 1 * this.dt
        if (this.zombieFrame >= this.zombieSpawnRate / 2 /*&&zombies.length <= 20*/) {
            this.addZombie()
            this.zombieFrame = 0
        }
        const zombiesDeleteable = this.zombies.filter(z => z.x + ZombieWalk1Frames[0].width <= 0 || z.health <= 0)
        for (let z of zombiesDeleteable) {
            this.zombies.splice(this.zombies.indexOf(z), 1)
            if (z.health <= 0) this.addZombie()
            break
        }
        this.zombies.forEach(z => z.x -= (1 / 6) * this.dt)
    }


    drawPea(peaArray, s) {
        const ctx = this.ctx
        for (let pea of peaArray) {
            const peaIndex = peaArray.indexOf(pea)
            pea.x += 5 * this.dt;

            const collidingZombies = this.zombies.filter(zombie => (
                zombie.row == pea.row &&
                pea.x >= zombie.x &&
                pea.x <= zombie.x + ZombieWalk1Frames[0].width / 1.5
            ))

            for (let zombie of collidingZombies) {
                peaArray.splice(peaIndex, 1)
                zombie.hit = true
                zombie.health--;
                break
            }

            if (this.showHitboxes === 1) {
                ctx.strokeStyle = "lime"
                ctx.strokeRect(pea.x - this.cameraX, pea.y, peaImage.width, peaImage.height)
            }

            ctx.drawImage(
                peaImage,
                pea.x - this.cameraX,
                pea.y,
                peaImage.width / s,
                peaImage.height / s
            );
            for (pea of peaArray.filter(pea => pea.x > 900)) {
                peaArray.splice(peaIndex, 1);
                break
            }
        }
    }

    sunRate = 2500

    sunStuff() {
        const dt = this.dt
        const ctx = this.ctx
        this.sunFrame += dt % this.sunRate + 1
        if (this.sunFrame >= this.sunRate) {
            this.pushSun(true)
        }

        const notCollectedSuns = this.suns.filter(s => !s.isCollected)
        const collectedSuns = this.suns.filter(s => s.isCollected)


        notCollectedSuns.forEach((s, v) => {
            s.y = s.y < s["fallingSunMaxY"] && s.fromSky ? s.y + 0.5 * dt : s.y
            s.sunFrame += dt * 0.5
            if (s.sunFrame >= 800) {
                ctx.globalAlpha = (((s.sunFrame - 800) / 10) - 1) * -1
                if (s.sunFrame >= 805) {
                    this.suns.splice(v, 1)
                }
            }
            if (s.sunFrame <= 55 && !s.fromSky) {
                s.y = s["sunflowerSunSpawnAnimationFrame"] + (Math.pow(s.sunFrame - 27.4, 2) / 25) + 30
                s.x += (s["sunflowerSunTargetX"] / 55) * 0.5 * dt
            }
            ctx.drawImage(sunImage, s.x - this.cameraX, s.y, sunImage.width / 2, sunImage.height / 2)
            ctx.globalAlpha = 1
        })

        for (let s of collectedSuns) {
            this.suns.sort((a, b) => a.isCollected - b.isCollected);
            const v = this.suns.indexOf(s)
            const sunAngle = Math.atan2(-s.y, -s.x)
            s.x += (Math.cos(sunAngle) * 5) * s.x / 75 * dt
            s.y += (Math.sin(sunAngle) * 5) * s.y / 75 * dt
            if ((s.x <= 25 && s.y <= 7.5) /* || s.x <= 0 || s.y <= 0*/) {
                this.suns.splice(v, 1)
                this.sun += 25
                // this.running = false
                break
            }
            ctx.drawImage(sunImage, s.x, s.y, sunImage.width / 2, sunImage.height / 2)
        }
    }
}

class Plant {
    constructor(plant, placeable) {
        this.plant = plant
        this.placeable = placeable
    }

    place() {
        const gridX = game.gridX
        const gridY = game.gridY
        if (p.plant == 1 && game.sun >= 50 && game.isFree()) {
            if (p.placeable == true) {

                game.sunflowers.push({
                    "x": gridX - SunflowerFrames[0].width / 4,
                    "y": gridY - SunflowerFrames[0].height / 2 + 28,
                    "sunSpawnFrame": 0,
                    "animFrame": 0,
                    "sunSpawned": false
                })

                game.taken[gridX][gridY] = [true, 1]
                game.sun -= 50
            }
        } else if (p.plant == 0 && game.sun >= 100 && game.isFree() && p.placeable) {
            const prow = game.GridY.indexOf(gridY) + 1

            game.peashooters.push({
                "x": gridX - PeashooterFrames[0].width / 4,
                "y": gridY - PeashooterFrames[0].height / 2 + 28,
                "animFrame": 0,
                "peaFrame": 40,
                "alreadyShot": false,
                "row": prow
            })

            game.taken[gridX][gridY] = [true, 0]
            game.sun -= 100
        }
    }
}
p = new Plant(0, true)
game = new Game()


PeashooterFrames = []
for (let i = 0; i <= 40; i++) {
    PeashooterFrames[i] = new Image()
    PeashooterFrames[i].src = "Plants/PeashooterFrames/Peashooter" + i + ".png"
}

SunflowerFrames = []
for (let i = 0; i <= 55; i++) {
    SunflowerFrames[i] = new Image()
    SunflowerFrames[i].src = "Plants/SunflowerFrames/Sunflower" + i + ".png"
}

ZombieWalk1Frames = []
for (let i = 0; i <= 100; i++) {
    ZombieWalk1Frames[i] = new Image()
    ZombieWalk1Frames[i].src = "Zombies/ZombieWalk1Frames/ZombieWalk1 (" + i + ").png"
}

ZombieIdleFrames = []
for (let i = 0; i <= 28; i++) {
    ZombieIdleFrames[i] = new Image()
    ZombieIdleFrames[i].src = "Zombies/ZombieIdleFrames/ZombieIdle (" + i + ").png"
}

ZombieIdle2Frames = []
for (let i = 0; i <= 58; i++) {
    ZombieIdle2Frames[i] = new Image()
    ZombieIdle2Frames[i].src = "Zombies/ZombieIdle2Frames/ZombieIdle2 (" + i + ").png"
}

background1 = new Image()
background1.src = "Images/background1.jpg"
background1.onload = function () {
    game.bgLoaded = true
}

seedBankI = new Image()
seedBankI.src = "Images/SeedBank.png"

sunImage = new Image()
sunImage.src = "Images/Sun.png"

seedPacket = new Image()
seedPacket.src = "Images/SeedPacket.png"

peaImage = new Image()
peaImage.src = "Images/ProjectilePea.png"
