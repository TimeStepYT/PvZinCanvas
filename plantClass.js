prow = undefined

class Plant {
    constructor(plant, placeable) {
        this.plant = plant
        this.placeable = placeable
    }
    
    place() {
        if (p.plant == 1 && sun >= 50 && isFree()) {
            if (p.placeable == true) {

                sunflowers.push({
                    "x": gridX - SunflowerFrames[0].width / 4,
                    "y": gridY - SunflowerFrames[0].height / 2 + 28,
                    "sunSpawnFrame": 0,
                    "animFrame": 0,
                    "sunSpawned": false
                })

                taken[gridX][gridY] = [true, 1]
                sun -= 50
            }
        } else if (p.plant == 0 && sun >= 100 && isFree() && p.placeable) {
                const prow = GridY.indexOf(gridY) + 1

                peashooters.push({
                    "x": gridX - PeashooterFrames[0].width / 4,
                    "y": gridY - PeashooterFrames[0].height / 2 + 28,
                    "animFrame": 0,
                    "peaFrame": 40,
                    "alreadyShot": false,
                    "row": prow
                })
                
                taken[gridX][gridY] = [true, 0]
                sun -= 100
        }
    }
}
p = new Plant(0, true)