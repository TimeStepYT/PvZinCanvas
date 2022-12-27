var canvas = document.getElementById("hahacanvasfunni")
var ctx = canvas.getContext("2d")

canvas.width = 800
canvas.height = 600
clickedAt = [0, 0]

packetX = undefined
selBankPlant = 0

currentFrameS = 0
currentFrame = 0
sunFrame = 0


const urlParams = new URLSearchParams(window.location.search);
const sunParam = parseInt(urlParams.get("sun"))

if (!isNaN(sunParam)) {
    sun = sunParam
} else {
    sun = 50
}

selPlants = [0, 1]
selPlant = null

xPos = 0
yPos = 0;

pointingOnClickable = false

activeWindow = true

taken = {
    72: {
        134: [false, null],
        233: [false, null],
        340: [false, null],
        434: [false, null],
        531: [false, null]
    },
    149: {
        134: [false, null],
        233: [false, null],
        340: [false, null],
        434: [false, null],
        531: [false, null]
    },
    232: {
        134: [false, null],
        233: [false, null],
        340: [false, null],
        434: [false, null],
        531: [false, null]
    },
    313: {
        134: [false, null],
        233: [false, null],
        340: [false, null],
        434: [false, null],
        531: [false, null]
    },
    396: {
        134: [false, null],
        233: [false, null],
        340: [false, null],
        434: [false, null],
        531: [false, null]
    },
    473: {
        134: [false, null],
        233: [false, null],
        340: [false, null],
        434: [false, null],
        531: [false, null]
    },
    553: {
        134: [false, null],
        233: [false, null],
        340: [false, null],
        434: [false, null],
        531: [false, null]
    },
    629: {
        134: [false, null],
        233: [false, null],
        340: [false, null],
        434: [false, null],
        531: [false, null]
    },
    708: {
        134: [false, null],
        233: [false, null],
        340: [false, null],
        434: [false, null],
        531: [false, null]
    }
}
GridX = [72, 149, 232, 313, 396, 473, 553, 629, 708]
GridY = [134, 233, 340, 434, 531]
gridX = 0
gridY = 0

function isFree() {
    return !(taken[gridX][gridY][0])
}
stopSunPointer = false
stopBankPointer = false

rect = canvas.getBoundingClientRect()
ctx.imageSmoothingQuality = "high"

onmousemove = function (e) {
    rect = canvas.getBoundingClientRect()

    xPos = e.clientX - rect.left
    yPos = e.clientY - rect.top

    for (i = 0; i < selPlants.length; i++) {
        if (!stopBankPointer) {
            packetX = 89 + i * (365 / 6)

            if (xPos >= 87 && xPos <= 446 && yPos <= 78.5 && yPos >= 7.5) {
                if (xPos >= packetX && xPos <= packetX + seedPacket.width / 2) {
                    pointingOnClickable = true
                    break
                } else {
                    pointingOnClickable = false
                }
            } else {
                pointingOnClickable = false
            }
        }
    }

    suns.filter(s => Math.sqrt((xPos - (s["x"] + sunImage.width / 4.5)) * (xPos - (s["x"] + sunImage.width / 4.5)) + (yPos - (s["y"] + sunImage.height / 4.5)) * (yPos - (s["y"] + sunImage.height / 4.5))) < (sunImage.height / 4.5 + 1) && !s["isCollected"]).forEach(s => {

        pointingOnClickable = true
        stopSunPointer = true

    })

    stopSunPointer = false
    stopBankPointer = false
    if (pointingOnClickable) canvas.style = "cursor: pointer;"
    else canvas.style = ""
}

onmousedown = function (e) {

    xPos = e.clientX - rect.left
    yPos = e.clientY - rect.top

    if (e.button == 0) {
        clickedAt = [xPos, yPos]

        if (xPos >= 87 && xPos <= 446 && yPos <= 78.5 && yPos >= 7.5) { } else if (selPlant != null) {
            p.place(selPlant)
            selPlant = null
        }
        suns.filter(s =>
            Math.sqrt(
                (xPos - (s["x"] + sunImage.width / 4.5)) *
                (xPos - (s["x"] + sunImage.width / 4.5)) +
                (yPos - (s["y"] + sunImage.height / 4.5)) *
                (yPos - (s["y"] + sunImage.height / 4.5))
            ) < sunImage.height / 4.5 + 1 &&
            !s["isCollected"]).forEach(s => {

                s["isCollected"] = true

            })
    }
    else {
        selPlant = null
        p.plant = null
    }
}

onkeydown = function (e) {
    if (e.key == "1") {
        selPlant = 0
        p.plant = 0
    } else if (e.key == "2") {
        selPlant = 1
        p.plant = 1
    } else if (e.key == "Escape") {
        selPlant = null
        p.plant = null
    } else if (e.key == "z") {
        addZombie()
    }
}

onfocus = function () {
    activeWindow = true
}

onblur = function () {
    activeWindow = false
}

animate()