bgLoaded = false

PeashooterFrames = []
for (i = 0; i <= 40; i++) {
    PeashooterFrames[i] = new Image()
    PeashooterFrames[i].src = "Plants/PeashooterFrames/Peashooter" + i + ".png"
}

SunflowerFrames = []
for (i = 0; i <= 55; i++) {
    SunflowerFrames[i] = new Image()
    SunflowerFrames[i].src = "Plants/SunflowerFrames/Sunflower" + i + ".png"
}

ZombieWalk1Frames = []
for (i = 0; i <= 100; i++) {
    ZombieWalk1Frames[i] = new Image()
    ZombieWalk1Frames[i].src = "Zombies/ZombieWalk1Frames/ZombieWalk1 (" + i + ").png"
}

background1 = new Image()
background1.src = "Images/background1.jpg"
background1.onload = function () {
    bgLoaded = true
}

seedBankI = new Image()
seedBankI.src = "Images/SeedBank.png"

sunImage = new Image()
sunImage.src = "Images/Sun.png"

seedPacket = new Image()
seedPacket.src = "Images/SeedPacket.png"

peaImage = new Image()
peaImage.src = "Images/ProjectilePea.png"