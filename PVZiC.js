canvas = document.getElementById("hahacanvasfunni")
ctx = document.getElementById("hahacanvasfunni").getContext("2d")

canvas.width = 800
canvas.height = 600
ctx.font = "100px BrianneTod, Calibri"
ctx.textAlign = "center"
ctx.fillStyle = "white"
ctx.fillText("Loading...", canvas.width / 2, canvas.height / 2 + 20)



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
        this.createPrevVars()
        this.initmusic()
        this.addRandZombies()
        requestAnimationFrame(() => this.animate())
    }
    initmusic() {
        this.bgmusic = new Audio("Sounds/Grasswalk.mp3")
        this.chooseyourseeds = new Audio("Sounds/ChooseYourSeeds.mp3")
    }

    playSound(sound, pitch = 1) {
        let audio = new Audio("Sounds/" + sound + ".ogg")
        audio.preservesPitch = false
        audio.playbackRate = pitch
        try {
            audio.play()
        } catch { }
    }

    shovelSelected = false
    inithooks() {
        window.onkeydown = e => this.onkeydown(e);
        window.onmessage = e => this.onmessage(e)
        window.onfocus = () => this.onfocus();
        window.onblur = () => this.onblur();
        window.onmousemove = e => this.onmousemove(e);
        window.onmousedown = e => this.onmousedown(e);
        window.onerror = (errorMessage, file, lineNumber, columnNumber, error) => this.onerror(errorMessage, file, lineNumber, columnNumber, error);
    }

    onmessage(e) {
        ctx.putImageData(e.data.image, 0, 0);
    }

    createPrevVars() {
        this.plwis = images.SunflowerFrames[0].width / 2
        this.plwix = images.SunflowerFrames[0].width / 4
        this.plhis = images.SunflowerFrames[0].height / 2
    }

    addRandZombies() {
        for (let i = 0; i < 5; i++) {
            const variation = Math.round(Math.random())
            const animFrame = variation === 0 ? Math.round(Math.random() * 28) : Math.round(Math.random() * 58)

            this.zombies.push({
                "x": Math.round(Math.random() * 100 + 890),
                "y": Math.round(Math.random() * 446 + 15.5),
                "animFrame": animFrame,
                "animVariation": variation,
                "type": Math.random() <= 0.55 ? "zombie" : "conehead"
            })
        }
        this.zombies.sort((a, b) => (a.y !== b.y) ? a.y - b.y : a.x - b.x);
    }
    eatingFrameRate = 70
    taken = {}
    GridX = [72, 149, 232, 313, 396, 473, 553, 629, 708]
    GridY = [134, 233, 340, 434, 531]

    gridX = 0
    gridY = 0

    cameraX = 0

    makeTakenDict() {
        for (const x of this.GridX) {
            this.taken[x] = {};
            for (const y of this.GridY) {
                this.taken[x][y] = [false];
            }
        }
    }

    xPos = -1
    yPos = -1

    isFree() {
        return !(this.taken[this.gridX][this.gridY][0])
    }
    pointingOnClickable = false
    selPlants = [{ "plant": 0, "reload": 0 }, { "plant": 1, "reload": 0 }]
    suns = []
    uncollectedSunsOver = []
    stopSunPointer = false;
    stopSunPointer = false;

    onerror(errorMessage, file, lineNumber, columnNumber, error) {
        document.getElementById("error").innerHTML += `
            ${errorMessage} ${error}<br>
            ${file}:${lineNumber}:${columnNumber}<br>`
    }

    pointingOnSeedBank() {
        const xPos = this.xPos
        const yPos = this.yPos

        for (let i = 0; i < this.selPlants.length; i++) {
            if (this.stopBankPointer) break

            const selPlantPlant = this.selPlants[i].plant
            this.packetX = 89 + i * (365 / 6)

            if ((selPlantPlant == 0 && this.sun < 100) || this.seedBankY != 0) continue
            if ((selPlantPlant == 1 && this.sun < 50) || this.seedBankY != 0) continue

            if (xPos >= 87 - this.cameraX * 1.125 && xPos <= 446 - this.cameraX * 1.125 && yPos <= 78.5 && yPos >= 7.5 && xPos >= this.packetX - this.cameraX * 1.125 && xPos <= this.packetX + images.seedPacket.width / 2 - this.cameraX * 1.125 && selPlantPlant != this.selPlant) {
                this.pointingOnClickable = true
                break
            } else {
                this.pointingOnClickable = false
            }
        }
    }

    pointingOnSun() {
        if (this.shovelSelected) return

        const xPos = this.xPos
        const yPos = this.yPos

        this.uncollectedSunsOver = this.suns.filter(s =>
            Math.sqrt(
                (xPos - (s.x - this.cameraX * 1.5 + images.sunImage.width / 2)) *
                (xPos - (s.x - this.cameraX * 1.5 + images.sunImage.width / 2)) +
                (yPos - (s.y + images.sunImage.height / 2)) *
                (yPos - (s.y + images.sunImage.height / 2))
            ) <
            (images.sunImage.height / 2 + 1) &&
            !s.isCollected
        )
        if (this.uncollectedSunsOver.length > 0) {
            this.pointingOnClickable = true
            this.stopSunPointer = true
        }
    }

    prevxPos = 0
    prevyPos = 0

    onmousemove(e) {
        if (!this.startAnimationFinished || this.loseAnimationPlaying) return

        this.prevxPos = this.xPos
        this.prevyPos = this.yPos

        this.getNearestGridElement()

        this.pointingOnClickable = false
        this.rect = this.canvas.getBoundingClientRect()
        let rect = this.rect

        this.xPos = e.clientX - rect.left
        this.yPos = e.clientY - rect.top

        this.pointingOnSeedBank()

        if (this.xPos >= 456 - this.cameraX * 1.125 && this.xPos <= 456 - this.cameraX * 1.125 + images.shovelSlotI.width && this.yPos <= images.shovelSlotI.height && !this.shovelSelected) this.pointingOnClickable = true

        this.pointingOnSun()

        this.stopSunPointer = false
        this.stopBankPointer = false

        if (this.pointingOnClickable) this.canvas.style = "cursor: pointer;"
        else this.canvas.style = ""
    }


    clickedAt = [null, null]

    onRightClick(e) {
        if (e.button != 2) return

        this.selPlant = null
        p.plant = null
        this.shovelSelected = false
    }

    onLeftClick(e) {
        if (e.button != 0 || this.loseAnimationPlaying) return
        if (!this.gamestarted) this.gamestarted = true
        const xPos = this.xPos
        const yPos = this.yPos
        this.clickedAt = [xPos, yPos]

        this.uncollectedSunsOver = this.suns.filter(s =>
            Math.sqrt(
                (xPos - (s.x - this.cameraX * 1.5 + images.sunImage.width / 2)) *
                (xPos - (s.x - this.cameraX * 1.5 + images.sunImage.width / 2)) +
                (yPos - (s.y + images.sunImage.height / 2)) *
                (yPos - (s.y + images.sunImage.height / 2))) <
            (images.sunImage.height / 2 + 1) && !s.isCollected)

        if (this.shovelSelected) {
            p.removePlant(this.GridX.indexOf(this.gridX) + 1, this.GridY.indexOf(this.gridY) + 1)
            this.shovelSelected = false
            return
        }
        for (let s of this.uncollectedSunsOver.reverse()) {
            s.isCollected = true
            this.playSound("points", Math.random() * 0.6 + 0.9)
            s.x -= this.cameraX * 1.5
            this.clickedAt = [null, null]
            this.pointingOnSun()
            return
        }
        if (
            (!(xPos >= 87 - this.cameraX * 1.125 && xPos <= 446 - this.cameraX * 1.125 && yPos <= 78.5 && yPos >= 7.5) && this.selPlant != null) &&
            !(xPos >= 456 - this.cameraX * 1.125 && xPos <= 456 - this.cameraX * 1.125 + images.shovelSlotI.width && yPos <= images.shovelSlotI.height)
        ) {
            p.place(this.selPlant)
            this.selPlant = null
        } else if (xPos >= 456 - this.cameraX * 1.125 && xPos <= 456 - this.cameraX * 1.125 + images.shovelSlotI.width && yPos <= images.shovelSlotI.height && !this.shovelSelected && this.selPlant == null) {
            this.shovelSelected = true
            this.playSound("shovel")
        }

        const selPlants = this.selPlants
        for (let i = 0; i < selPlants.length; i++) {
            this.packetX = 89 + i * (365 / 6)
            // ctx.filter = "brightness(100%)"
            if (xPos < 87 - this.cameraX * 1.125 || xPos > 446 - this.cameraX * 1.125 || yPos > 78.5 || yPos < 7.5 || this.seedBankY != 0 || xPos < this.packetX - this.cameraX * 1.125 || xPos > this.packetX - this.cameraX * 1.125 + images.seedPacket.width / 2) continue
            if (this.selPlant == selPlants[i].plant && p.plant == selPlants[i].plant) {
                this.selPlant = null
                p.plant = null
                break
            } else {
                this.selPlant = selPlants[i].plant
                p.plant = selPlants[i].plant
                this.playSound("seedlift")
            }
        }


        this.pointingOnClickable = false
        this.canvas.style = ""

    }

    onmousedown(e) {
        this.onLeftClick(e)
        this.onRightClick(e)
    }
    onkeydown(e) {
        if (!this.seedBankY == 0) return
        switch (e.key) {
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                if (this.xPos == -1) return
                this.playSound("seedlift")
                this.selPlant = Math.round(e.key) - 1
                p.plant = Math.round(e.key) - 1
                break;
            case '2':
                this.selPlant = 1
                p.plant = 1
                break;
            case 'Escape':
                this.selPlant = null
                p.plant = null
                this.shovelSelected = false
                break;
            case 'z':
                if (this.zombies.length <= 20) this.addZombie()
                break;
            case 'a':
                this.cameraX -= 5 * this.dt
                if (this.cameraX < -220) this.cameraX = -220
                break;
            case 'ArrowLeft':
                this.cameraX -= 5 * this.dt
                if (this.cameraX < -220) this.cameraX = -220
                break;
            case 'd':
                this.cameraX += 5 * this.dt
                if (this.cameraX > 380) this.cameraX = 380
                break;
            case 'ArrowRight':
                this.cameraX += 5 * this.dt
                if (this.cameraX > 380) this.cameraX = 380
                break;
            case 'r':
                this.cameraX = 0
                break;
            case 'Dead':
                this.shovelSelected = !this.shovelSelected
                break;
        }
        if (e.ctrlKey) {
            switch (e.key) {
                case 'a':
                    this.cameraX = -220
                    break;
                case 'd':
                    this.cameraX = 380
                    break;
                case 'ArrowLeft':
                    this.cameraX = -220
                    break;
                case 'ArrowRight':
                    this.cameraX = 380
                    break;
            }
        }
    }

    activeWindow = true
    onfocus() {
        this.activeWindow = true
    }

    onblur() {
        this.activeWindow = false
    }


    drawZombieFrame(zarr, zombieFrames, s, particularFrame, brightness) {
        ctx.filter = "brightness(" + brightness + "%)"
        ctx.drawImage(
            zombieFrames[particularFrame],
            zarr.x - this.cameraX,
            zarr.y,
            zombieFrames[0].width / s,
            zombieFrames[0].height / s,
        );
        ctx.filter = "brightness(100%)"
    }

    drawZombie(zombieArray, zombieFrames, s) {
        if (zombieArray.length === 0) return
        this.zombieBrightness = 100
        zombieArray.forEach(zarr => {
            if (!this.loseAnimationPlaying) {
                switch (zarr.type) {
                    case "zombie":
                        zarr.animFrame += this.dt * 0.301
                        break
                    case "conehead":
                        zarr.animFrame += this.dt * 0.6
                        break
                }
                if (zarr.hit) {
                    this.zombieBrightness = 150
                    zarr.hit = false
                }
            }

            let particularFrame
            switch (zarr.type) {
                case "zombie":
                    if (zarr.animVariation == 0) particularFrame = Math.round(zarr.animFrame) % images.ZombieIdleFrames.length
                    else if (zarr.animVariation == 1 || zarr.eating) particularFrame = Math.round(zarr.animFrame) % images.ZombieIdle2Frames.length
                    else particularFrame = Math.round(zarr.animFrame) % zombieFrames.length

                    if (zarr.animVariation == 0) {
                        for (let i = 0; i < 2; i++) this.drawZombieFrame(zarr, images.ZombieIdleFrames, s, particularFrame, this.zombieBrightness)
                    }
                    else if (zarr.animVariation == 1 || zarr.eating) {
                        for (let i = 0; i < 2; i++) this.drawZombieFrame(zarr, images.ZombieIdle2Frames, s, particularFrame, this.zombieBrightness)
                    }
                    else if (zarr != this.zombieVictor) {
                        for (let i = 0; i < 2; i++) this.drawZombieFrame(zarr, zombieFrames, s, particularFrame, this.zombieBrightness)
                    }
                    break
                case "conehead":
                    if (zarr.animVariation == 0) particularFrame = Math.round(zarr.animFrame) % images.ConeHeadIdle1Frames.length
                    else if (zarr.animVariation == 1 || zarr.eating) particularFrame = Math.round(zarr.animFrame) % images.ConeHeadIdle1Frames.length
                    else particularFrame = Math.round(zarr.animFrame) % images.ConeHeadIdle1Frames.length

                    if (zarr.animVariation == 0) {
                        this.drawZombieFrame(zarr, images.ConeHeadIdle1Frames, s * 2, particularFrame, this.zombieBrightness)
                    }
                    else if (zarr.animVariation == 1 || zarr.eating) {
                        this.drawZombieFrame(zarr, images.ConeHeadIdle1Frames, s * 2, particularFrame, this.zombieBrightness)
                    }
                    else if (zarr != this.zombieVictor) {
                        this.drawZombieFrame(zarr, images.ConeHeadIdle1Frames, s * 2, particularFrame, this.zombieBrightness)
                    }
                    break
            }
            this.zombieBrightness = 100

            if (this.showHitboxes === 1) {
                this.ctx.strokeStyle = "red"
                this.ctx.strokeRect(zarr.x + images.peaImage.width - this.cameraX, zarr.y, images.ZombieWalk1Frames[0].width / 1.5, images.ZombieWalk1Frames[0].height)
            }
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

    loseAnimationFrame = 0
    loseAnimation() {
        this.loseAnimationFrame += this.dt
        if (this.loseAnimationFrame < 0) return

        if (this.loseAnimationFrame < 48.576) {
            this.cameraX = -(((this.loseAnimationFrame) / 5.426) ** 2)
        }
        else if (this.loseAnimationFrame < 120) {
            this.cameraX = (((this.loseAnimationFrame - 120) / 6) ** 2) - 220
        }
        ctx.textAlign = "left"
        ctx.font = "35px BrianneTod"
        ctx.fillText("Kills: " + this.killCount, -205 - this.cameraX, 240)
        this.drawSun()
    }

    startAnimation() {
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

    zombieWinning(zarr, speed, s) {
        zarr.x = -100
        zarr.y = 250
        this.zombies.sort((a, b) => (a.y !== b.y) ? a.y - b.y : a.x - b.x);

        const zombieFrames = images.ZombieIdle2Frames

        zarr.animFrame += this.dt * speed

        let particularFrame = Math.round(zarr.animFrame) % zombieFrames.length

        if (this.showHitboxes === 1) {
            this.ctx.strokeStyle = "red"
            this.ctx.strokeRect(zarr.x + images.peaImage.width - this.cameraX, zarr.y, images.ZombieWalk1Frames[0].width / 1.5, images.ZombieWalk1Frames[0].height)
        }

        // draw two times (for opacity reasons)
        this.drawZombieFrame(zarr, zombieFrames, s, particularFrame)

        // this.ctx.filter = "brightness(100%)"
    }
    existsHere(variable) {
        return typeof variable !== 'undefined'
    }
    drawAll() {
        if (this.paused) {
            this.calcDeltaTime()
            return
        };
        if (!this.gamestarted) {
            ctx.fillStyle = "white"
            ctx.textAlign = "center"
            ctx.font = "100px BrianneTOD"
            ctx.fillText("Click to start!", canvas.width / 2, canvas.height / 2 + 20)
            ctx.fillStyle = "black"
            return
        }
        ctx.drawImage(images.background1, -220 - this.cameraX, 0, images.background1.width, images.background1.height)
        this.drawSeedBank()
        if (!this.startAnimationFinished) {
            this.drawZombie(this.zombies, images.ZombieIdleFrames, 1)
        }
        if (this.startAnimationFinished) {
            if (!this.chooseyourseeds.paused) {
                try {
                    this.chooseyourseeds.volume -= this.dt / 100
                } catch {
                    this.chooseyourseeds.pause()
                    this.chooseyourseeds.volume = 1
                }
            } else this.bgmusic.play()
            this.drawPlant(this.sunflowers, images.SunflowerFrames, 2, 0.301)
            this.drawPlant(this.peashooters, images.PeashooterFrames, 2, 0.28)

            if (!this.loseAnimationPlaying) {
                if (this.sun >= 100 && this.selPlant == 0) this.drawPrev(4, 2, images.PeashooterFrames)
                else if (this.sun >= 50 && this.selPlant == 1) this.drawPrev(4, 2, images.SunflowerFrames)
                if (this.shovelSelected) {
                    ctx.drawImage(images.shovelI, this.xPos - 17, this.yPos - images.shovelI.height + 15, images.shovelI.width, images.shovelI.height)
                }
                this.sunflowerActions()
                this.peashooterActions()
                this.zombieActions()
            } else if (this.zombieVictor !== null) {
                for (let i = 0; i < 2; i++) this.zombieWinning(this.zombieVictor, 1, 1)
            }

            this.drawZombie(this.zombies, images.ZombieWalk1Frames, 1, 0.2)

            this.drawPea(this.peas, 1)

            if (!this.loseAnimationPlaying) this.sunStuff()
            else this.loseAnimation()

        } else {
            this.chooseyourseeds.play()
            this.startAnimation()
        }
    }

    sunflowerloaded = false

    leftToDraw = []

    animate() {
        if (this.activeWindow) {
            if (this.paused) {
                this.paused = false
                this.lastUpdate = performance.now()
                this.dt = 0
            }
            else this.calcDeltaTime()

            this.drawAll()

        } else {
            //if (!this.paused) error.innerHTML += "paused\n"
            if (!this.paused) {
                this.paused = true
                this.playSound("pause")

                this.bgmusic.pause()
                this.chooseyourseeds.pause()
            }
            this.lastUpdate = performance.now()
            this.dt = 0
        }
        requestAnimationFrame(() => this.animate())
    }

    packetX = undefined

    drawCost(cost) {
        ctx.textAlign = "right"
        ctx.font = "12px Pico129"
        ctx.fillText(cost, Math.round(this.packetX + images.seedPacket.width - 69 - this.cameraX * 1.125), 72 - this.seedBankY)
    }

    drawSeedPacket(plant, PlantFrames, cost) {
        let seedPacketBrightness = 100
        if (this.seedBankY == 0 && this.selPlant == plant) {
            if (this.sun >= cost) seedPacketBrightness = 33
            else this.selPlant = null
        }
        if (this.sun < cost || this.seedBankY != 0) seedPacketBrightness = 67

        ctx.filter = "brightness(" + seedPacketBrightness + "%)"

        ctx.drawImage(images.seedPacket, Math.round(this.packetX - this.cameraX * 1.125), 8 - this.seedBankY, images.seedPacket.width / 2, images.seedPacket.height / 2)
        ctx.drawImage(PlantFrames[6], Math.round(this.packetX + 5 - this.cameraX * 1.125), 18 - this.seedBankY, PlantFrames[0].width / 4, PlantFrames[0].height / 4)
        ctx.filter = "brightness(100%)"
        this.drawCost(cost)
    }

    drawSeedBank() {
        let ctx = this.ctx
        ctx.textRendering = "geometricPrecision"

        // Draw Seed bank with shovel slot
        if (!this.loseAnimationPlaying) {
            ctx.drawImage(images.seedBankI, 10 - this.cameraX * 1.125, 0 - this.seedBankY, images.seedBankI.width, images.seedBankI.height)
            ctx.drawImage(images.shovelSlotI, 456 - this.cameraX * 1.125, 0 - this.seedBankY, images.shovelSlotI.width, images.shovelSlotI.height)
            if (!this.shovelSelected) {
                ctx.drawImage(images.shovelI, 451 - this.cameraX * 1.125, -5 - this.seedBankY, images.shovelI.width, images.shovelI.height)

            }
        } else {
            ctx.drawImage(images.seedBankI, 10 - this.cameraX * 1.125, 0 - this.seedBankY, images.seedBankI.width, images.seedBankI.height)
            ctx.drawImage(images.shovelSlotI, 456 - this.cameraX * 1.125, 0 - this.seedBankY, images.shovelSlotI.width, images.shovelSlotI.height)
            if (!this.shovelSelected) {
                ctx.drawImage(images.shovelI, 451 - this.cameraX * 1.125, -5 - this.seedBankY, images.shovelI.width, images.shovelI.height)
            }
        }

        ctx.textAlign = "center"
        ctx.font = "19px Continuum"

        ctx.fillText(this.sun, 48 - this.cameraX * 1.125, 78 - this.seedBankY)
        const selPlants = this.selPlants

        for (let i = 0; i < selPlants.length; i++) {
            this.packetX = 89 + i * (365 / 6)

            if (selPlants[i].plant == 0) this.drawSeedPacket(0, images.PeashooterFrames, 100)
            else if (selPlants[i].plant == 1) this.drawSeedPacket(1, images.SunflowerFrames, 50)
        }
    }


    drawPlant(plantArray, plantFrames, s, speed) {
        const plfr = plantFrames[0]
        const plws = plfr.width / s
        const plhs = plfr.height / s
        let plantBrightness = 100
        if (plantArray.length == 0) return

        plantArray.filter(p => p.health > 0).forEach(plool => {
            if (!this.loseAnimationPlaying) plool.animFrame += speed * this.dt
            const particularFrame = Math.round(plool.animFrame) % plantFrames.length
            if (this.shovelSelected && this.GridX.indexOf(this.gridX) + 1 == plool.col && this.GridY.indexOf(this.gridY) + 1 == plool.row) plantBrightness = 175
            if (plool.hurt) {
                plantBrightness = 150
                plool.hurt = false
            }
            ctx.filter = "brightness(" + plantBrightness + "%)"
            ctx.drawImage(plantFrames[particularFrame],
                plool.x - this.cameraX,
                plool.y,
                plws,
                plhs)
            plantBrightness = 100
            ctx.filter = "brightness(100%)"
        })
    }

    drawPrev(x, s, plantFrames) {
        if (this.xPos == -1) return

        const xPosDiff = this.xPos - this.prevxPos
        const yPosDiff = this.yPos - this.prevyPos


        const plfr = plantFrames[0]
        let ctx = this.ctx;
        if (this.isFree()) {
            ctx.globalAlpha = 0.25
            ctx.drawImage(plfr,
                this.gridX - this.plwix - this.cameraX,
                this.gridY - this.plhis + 28,
                this.plwis,
                this.plhis)
            ctx.globalAlpha = 1
        }
        ctx.drawImage(plfr,
            this.xPos - this.plwix,
            this.yPos - this.plhis + 28,
            this.plwis,
            this.plhis)

    }



    sunFlowerSunSpawnRate = 3500

    sunFrame = -150
    seedBankY = 87
    startAnimationFrame = -150
    startAnimationFinished = false

    pushSunflowerSun() {
        this.sunflowers.filter(s => s.sunSpawnFrame >= this.sunFlowerSunSpawnRate / 2).forEach(s => {
            const randX = Math.round(Math.random() * 60) - 30

            this.suns.push({
                "x": s.x,
                "y": s.y - 50,
                "fallingSunMaxY": null,
                "isCollected": false,
                "fromSky": false,
                "sunFrame": 0,
                "sunflowerSunSpawnAnimationFrame": s.y - 50,
                "sunflowerSunTargetX": randX,
                "rotation": 0,
                "size": 0,
                "sizeanim": 0
            })

            s.sunSpawnFrame = 0
        })
    }
    shootPea(p) {
        if (p.peaFrame < this.peashooterPeaSpawnRate / 2 || p.animFrame < 39) return

        for (let z of this.zombies.filter(z => p.row == z.row && p.x <= z.x)) {
            Math.random() > 0.5 ? this.playSound("throw") : this.playSound("throw2")
            this.peas.push({
                "x": p.x + images.PeashooterFrames[0].width / 2 - images.peaImage.width,
                "y": p.y + 10,
                "row": p.row
            })
            p.peaFrame = 0
            break
        }

    }

    pushSun(fromSky) {
        if (fromSky) {
            this.suns.push({
                "x": Math.floor(Math.random() * 680),
                "y": -50,
                "fallingSunMaxY": Math.floor(Math.random() * (480 - 160) + 160),
                "isCollected": false,
                "fromSky": true,
                "sunFrame": 0,
                "rotation": 0,
                "size": 0,
                "sizeanim": 0
            })
            this.sunFrame = 0
        } else this.pushSunflowerSun()
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
            this.shootPea(p)
        })
    }


    zombieSpawnRate = 6000
    zombieFrame = -1650

    killCount = 0

    zombrandYsel = [134, 233, 335, 425, 526]

    rowZombies = [0, 0, 0, 0, 0]

    addZombie() {
        const weightedArray = this.rowZombies.map((count, index) => ({
            index,
            weight: 5 - count // Higher weight for rows with fewer zombies
        }));
        const weightedSum = weightedArray.reduce((sum, { weight }) => sum + weight, 0);

        // Use the weighted array to choose a row index
        let zombrandY;
        let randomWeight = Math.random() * weightedSum;
        for (const { index, weight } of weightedArray) {
            randomWeight -= weight;
            if (randomWeight <= 0) {
                zombrandY = index;
                break;
            }
        }
        let zm = {
            "x": 800,
            "y": this.zombrandYsel[zombrandY] - 106.6667,
            "animFrame": 0,
            "row": zombrandY + 1,
            "health": 10,
            "eating": false,
            "eatingFrame": 0,
            "type": Math.random() <= 0.75 || this.killCount <= 3 ? "zombie" : "conehead"
        }

        this.zombies.push(zm);
        this.rowZombies[zombrandY]++
        this.zombies.sort((a, b) => (a.y !== b.y) ? a.y - b.y : a.x - b.x);
    }
    zombieEat(z) {
        if (z.eatingFrame < this.eatingFrameRate) return
        z.eatingFrame = 0

        for (const plant of p.filteredPlantsArray(p => p.row == z.row && p.x + images.PeashooterFrames[0].width / 4 > z.x && p.x < z.x)) {
            for (const pl of plant) {
                pl.health--
                pl.hurt = true
                if (pl.health > 0) {
                    if (Math.round(Math.random()) == 0) this.playSound("chomp")
                    else this.playSound("chomp2")
                    continue
                }

                p.removePlant(pl.col, pl.row)
                this.playSound("gulp")
                break
            }
        }
    }

    loseAnimationPlaying = false
    zombieVictor = null
    lost(z) {
        this.loseAnimationPlaying = true
        this.zombieVictor = z
    }

    zombieActions() {

        this.zombieFrame += 1 * this.dt
        if (this.zombieFrame >= this.zombieSpawnRate / 2 && this.zombies.length <= 20) {
            this.addZombie()
            this.zombieFrame = 0
        }
        const zombiesDeleteable = this.zombies.filter(z => z.health <= 0)
        for (let z of zombiesDeleteable) {
            if (z.type == "zombie") {
                this.addZombie()
                this.killCount++
                this.rowZombies[z.row - 1]--
                this.zombies.splice(this.zombies.indexOf(z), 1)
            } else {
                switch (z.type) {
                    case "conehead":
                        z.health = 10
                        z.type = "zombie"
                        break
                }
            }
            break
        }
        this.zombies.filter(z => !z.eating).forEach(z => {
            if (z.x + images.ZombieWalk1Frames[0].width / 2 <= 0) {
                this.lost(z)
                return
            }
            if (this.activeWindow) z.x -= this.dt / 5
            for (const plant of p.filteredPlantsArray(p => z.x <= p.x + images.PeashooterFrames[0].width / 4 && z.x >= p.x && z.row == p.row)) {
                for (const i = 0; i < plant.length; i++) {
                    z.eating = true
                    z.eatingFrame = this.eatingFrameRate
                    break
                }
            }
        })

        for (const z of this.zombies.filter(z => z.eating)) {
            this.zombieEat(z)
            if (z.eatingFrame < this.eatingFrameRate) z.eatingFrame += this.dt
        }
    }


    drawPea(peaArray, s) {
        if (peaArray.length == 0) {
            return
        }

        const ctx = this.ctx
        for (let pea of peaArray) {
            let progress = 4 * this.dt
            if (!this.loseAnimationPlaying) {
                const peaIndex = peaArray.indexOf(pea)
                pea.x += progress

                const collidingZombies = this.zombies.filter(zombie => (
                    zombie.row == pea.row &&
                    pea.x >= zombie.x &&
                    pea.x <= zombie.x + images.ZombieWalk1Frames[0].width / 1.5
                ))

                for (let zombie of collidingZombies) {
                    peaArray.splice(peaIndex, 1)
                    zombie.hit = true
                    zombie.health--;
                    switch (zombie.type) {
                        case "zombie":
                            let randSound = Math.round(Math.random() * 2)
                            switch (randSound) {
                                case 0:
                                    this.playSound("splat")
                                    break
                                case 1:
                                case 2:
                                    this.playSound("splat" + (randSound + 1))
                                    break
                            }
                            break
                        case "conehead":
                            let randSound2 = Math.round(Math.random())
                            if (randSound2 == 0) this.playSound("plastichit")
                            else this.playSound("plastichit2")
                            break
                    }

                    if (this.showHitboxes === 1) {
                        ctx.strokeStyle = "lime"
                        ctx.strokeRect(pea.x - this.cameraX, pea.y, images.peaImage.width, images.peaImage.height)
                    }
                }
                ctx.drawImage(images.peaImage,
                    pea.x - this.cameraX,
                    pea.y,
                    images.peaImage.width / s,
                    images.peaImage.height / s)
                if (!this.loseAnimationPlaying) {
                    for (pea of peaArray.filter(pea => pea.x > 900)) {
                        peaArray.splice(peaArray.indexOf(pea), 1);
                        break
                    }
                }
            }
        }
    }
    sunRate = 2500
    scale = 1 / 2
    drawRotated(image, x, y, deg, w = image.width, h = image.height) {
        ctx.save()
        ctx.translate(x + w / 2, y + h / 2)
        ctx.rotate(deg * Math.PI / 180)

        ctx.drawImage(image, -w / 2, -h / 2, w, h)

        ctx.restore()
    }
    drawSun() {
        const sunImg = images.sunImage
        const sunCtr = images.sunCenter

        this.suns.forEach(s => {
            s.rotation += this.dt / 4
            s.sizeanim += this.dt / 3

            s.size = Math.pow((s.sizeanim - 43.012) / 10, 2) - (116 - 79) / 2
            if (s.size > 0) s.sizeanim = 0
            ctx.globalAlpha = this.sunopacity * -(s.size / -18.5) / 3 + 0.7
            this.drawRotated(sunImg, s.x - this.cameraX * 1.5 - s.size / 2, s.y - s.size / 2, s.rotation, sunImg.width + s.size, sunImg.height + s.size)
            ctx.globalAlpha = this.sunopacity * (s.size / -18.5) / 3 + 0.5
            this.drawRotated(images.sun2, s.x - this.cameraX * 1.5 + (sunImg.width - images.sun2.width) / 2 + s.size / 2,
                s.y + (sunImg.height - images.sun2.height) / 2 + s.size / 2, s.rotation + 90, images.sun2.width - s.size, images.sun2.height - s.size)
            ctx.globalAlpha = this.sunopacity
            ctx.drawImage(sunCtr, s.x - this.cameraX * 1.5 + (sunImg.width - sunCtr.width / 1.2) / 2, s.y + (sunImg.height - sunCtr.height / 1.2) / 2, sunCtr.width / 1.2, sunCtr.height / 1.2)
        })
    }

    notCollectedSuns = []
    collectedSuns = []

    sunopacity = 1
    sunStuff() {
        const dt = this.dt

        this.sunFrame += dt % this.sunRate + 1
        if (this.sunFrame >= this.sunRate) {
            this.pushSun(true)
        }

        this.notCollectedSuns = this.suns.filter(s => !s.isCollected)
        this.collectedSuns = this.suns.filter(s => s.isCollected)


        this.notCollectedSuns.forEach((s, v) => {
            s.y = s.y < s.fallingSunMaxY && s.fromSky ? s.y + 0.5 * dt : s.y
            s.sunFrame += dt * 0.5
            if (s.sunFrame >= 800) {
                this.sunopacity = (((s.sunFrame - 800) / 10) - 1) * -1
                if (s.sunFrame >= 805) {
                    this.suns.splice(v, 1)
                }
            }
            if (s.sunFrame <= 55 && !s.fromSky) {
                s.y = s.sunflowerSunSpawnAnimationFrame + (Math.pow(s.sunFrame - 27.4, 2) / 25) + 30
                s.x += (s.sunflowerSunTargetX / 55) * 0.5 * dt
            }
            this.sunopacity = 1
        })

        for (let s of this.collectedSuns) {
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
        }
        this.drawSun()
    }
}

class Plant {
    constructor(plant, placeable) {
        this.plant = plant
        this.placeable = placeable
    }

    setPlantArray(pl, plant) {
        plant.splice(plant.indexOf(pl), 1);
    }

    removePlant(col, row) {
        for (const plants of this.plantsArray()) {
            for (const pl of plants) {
                if (pl.col != col || pl.row != row) continue

                if (game.sunflowers.indexOf(pl) >= 0) this.setPlantArray(pl, game.sunflowers)
                else if (game.peashooters.indexOf(pl) >= 0) this.setPlantArray(pl, game.peashooters)

                game.taken[game.GridX[col - 1]][game.GridY[row - 1]] = [false]
                for (const zo of game.zombies.filter(z => z.eating && z.row == pl.row && pl.x + images.PeashooterFrames[0].width / 4 > z.x && pl.x < z.x)) {
                    zo.eating = false
                }
                if (Math.random() > 0.5) game.playSound("plant")
                else game.playSound("plant2")
            }
        }
    }

    plantsArray() {
        return [game.sunflowers, game.peashooters]
    }

    filteredPlantsArray(filter) {
        const plants = []
        for (const i of this.plantsArray()) {
            plants.push(i.filter(filter))
        }
        return plants
    }

    finalPlaceActions(plant, cost) {
        game.taken[game.gridX][game.gridY] = [true, plant]
        game.sun -= cost
    }

    place() {
        const gridX = game.gridX
        const gridY = game.gridY
        if (this.xPos == -1) return
        if (!game.isFree()) return

        if (p.plant == 1 && game.sun >= 50) {
            if (p.placeable == false) return

            game.sunflowers.push({
                "x": gridX - images.SunflowerFrames[0].width / 4,
                "y": gridY - images.SunflowerFrames[0].height / 2 + 28,
                "sunSpawnFrame": 0,
                "animFrame": 0,
                "sunSpawned": false,
                "health": 6,
                "row": game.GridY.indexOf(gridY) + 1,
                "col": game.GridX.indexOf(gridX) + 1
            })

            this.finalPlaceActions(1, 50)
        } else if (p.plant == 0 && game.sun >= 100 && p.placeable) {
            game.peashooters.push({
                "x": gridX - images.PeashooterFrames[0].width / 4,
                "y": gridY - images.PeashooterFrames[0].height / 2 + 28,
                "animFrame": 0,
                "peaFrame": 40,
                "alreadyShot": false,
                "row": game.GridY.indexOf(gridY) + 1,
                "col": game.GridX.indexOf(gridX) + 1,
                "health": 6
            })

            this.finalPlaceActions(0, 100)
        }
        if (Math.round(Math.random()) == 0) {
            game.playSound("plant")
        } else {
            game.playSound("plant2")
        }
    }
}
bgLoaded = false
class Images {

    constructor() {

        this.PeashooterFrames = []
        for (let i = 0; i <= 40; i++) {
            this.PeashooterFrames[i] = new Image()
            this.PeashooterFrames[i].src = "Plants/PeashooterFrames/Peashooter" + i + ".png"
        }

        this.SunflowerFrames = []
        for (let i = 0; i <= 55; i++) {
            this.SunflowerFrames[i] = new Image()
            this.SunflowerFrames[i].src = "Plants/SunflowerFrames/Sunflower" + i + ".png"
        }

        this.ZombieWalk1Frames = []
        for (let i = 0; i <= 100; i++) {
            this.ZombieWalk1Frames[i] = new Image()
            this.ZombieWalk1Frames[i].src = "Zombies/ZombieWalk1Frames/ZombieWalk1 (" + i + ").png"
        }

        this.ZombieIdleFrames = []
        for (let i = 0; i <= 28; i++) {
            this.ZombieIdleFrames[i] = new Image()
            this.ZombieIdleFrames[i].src = "Zombies/ZombieIdleFrames/ZombieIdle (" + i + ").png"
        }

        this.ZombieIdle2Frames = []
        for (let i = 0; i <= 58; i++) {
            this.ZombieIdle2Frames[i] = new Image()
            this.ZombieIdle2Frames[i].src = "Zombies/ZombieIdle2Frames/ZombieIdle2 (" + i + ").png"
        }

        this.ConeHeadIdle1Frames = []
        for (let i = 0; i <= 58; i++) {
            this.ConeHeadIdle1Frames[i] = new Image()
            this.ConeHeadIdle1Frames[i].src = "Zombies/ConeHeadIdle1Frames/ConeHeadIdle1" + i + ".png"
        }

        this.background1 = new Image()
        this.background1.src = "Images/background1.jpg"
        this.background1.onload = function () {
            bgLoaded = true
        }
        this.seedBankI = new Image()
        this.seedBankI.src = "Images/SeedBank.png"

        this.shovelSlotI = new Image()
        this.shovelSlotI.src = "Images/ShovelBank.png"

        this.shovelI = new Image()
        this.shovelI.src = "Images/Shovel.png"

        this.sunImage = new Image()
        this.sunImage.src = "Images/Sun3.png"

        this.sun2 = new Image()
        this.sun2.src = "Images/Sun2.png"

        this.sunCenter = new Image()
        this.sunCenter.src = "Images/Sun1.png"

        this.seedPacket = new Image()
        this.seedPacket.src = "Images/SeedPacket.png"

        this.peaImage = new Image()
        this.peaImage.src = "Images/ProjectilePea.png"
    }


}

p = new Plant(0, true)
images = new Images()

waituntilimagesloaded = setInterval(() => {
    if (!bgLoaded) return
    game = new Game()
    clearInterval(waituntilimagesloaded)
}, 10)