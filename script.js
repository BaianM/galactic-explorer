// Full list of let variables
let spaceship;
let spaceshipX, spaceshipY;
let velocityX = 0, velocityY = 0;
let spacebackground;
let asteroidImage;
let asteroids = [];
let spawnedTiles = new Set();
let shieldPoints = 10;
let commstationImage;
let crystalAsteroidImage;
let speedBoostActive = false;
let speedBoostTimer = 0;
let speedBoostMultiplier = 1;
let commstations = [];
let crystalAsteroids = [];
let spaceStation;
let spaceStationX, spaceStationY;
let wKeyPressTime = 0;
let gameState = "start";
let mission2State = "toStation";
let freighterX, freighterY;
let showDebugInfo = false;
let freighterImage;
let pirateFreighterImage;
let defencePlatformImage;
let defencePlatforms = [];
let projectiles = [];
let lastProjectileTime = 0;
let hitTexts = [];
let enemyProjectiles = [];
let level4Freighter = { x: 0, y: 0, radius: 100, health: 20 };
let level4DefensePlatforms = [];
let backgroundMusic;
let audioContext;
let explosionSound; // Updated: Declare explosionSound variable
let explosionSoundBuffer; // Optional: If you plan to use a buffer
let shootSound; // Declare shootSound variable

// Full list of const variables
const spaceshipWidth = 100;
const spaceshipHeight = 100;
const maxSpeed = 12;
const acceleration = 0.23;
const deceleration = 0.995;
const SPACE_STATION_DISTANCE = 11111;
const cursorSensitivity = 0.8;
const spaceStationWidth = 300;
const spaceStationHeight = 300;
const maxSpeedMultiplier = 2;
const freighterRadius = 200;
const FREIGHTER_DISTANCE = 10000;
const DEFENCE_PLATFORM_DISTANCE = 15000;
const PLAYER_PROJECTILE_COOLDOWN = 480;
const PROJECTILE_SPEED = 15; // Speed of player projectiles
const PROJECTILE_LIFESPAN = 180; // Lifespan of player projectiles in frames
const ENEMY_PROJECTILE_SPEED = 5; // Speed of enemy projectiles
const ENEMY_PROJECTILE_LIFESPAN = 240; // Lifespan of enemy projectiles in frames
const DEFENCE_PLATFORM_HEALTH = 6;
const TEXT_DISPLAY_DURATION = 60;
const DEFENCE_PLATFORM_COOLDOWN = 1200;
const LEVEL4_FREIGHTER_DISTANCE = 10000; // Reduced from 20000
const LEVEL4_DEFENSE_PLATFORM_DISTANCE = 500; // Reduced from 1000

// Declare firing range variables
let DEFENSE_PLATFORM_FIRE_RANGE; // Dynamic range for defense platforms
let FREIGHTER_FIRE_RANGE; // Dynamic range for pirate freighters

// Add the missing PLAYER_PROJECTILE_SPEED constant
const PLAYER_PROJECTILE_SPEED = 15; // Speed of player projectiles


function preload() {
    // Load images from your local ASSETS folder
    spaceship = loadImage("ASSETS/playership.png");
    spacebackground = loadImage("ASSETS/spacebackground.jfif");
    asteroidImage = loadImage("ASSETS/asteroid.jpg");
    commstationImage = loadImage("ASSETS/commstation.png"); // Ensure this file is in ASSETS
    crystalAsteroidImage = loadImage("ASSETS/crystalasteroid.png"); // Ensure this file is in ASSETS
    spaceStation = loadImage("ASSETS/spacestation.png"); // Ensure this file is in ASSETS
    freighterImage = loadImage("ASSETS/freighter.jpg");
    pirateFreighterImage = loadImage("ASSETS/piratefreighter.jpg");
    defencePlatformImage = loadImage("ASSETS/defenseplatform.jpg");

    // Load audio from your local audio folder
    backgroundMusic = loadSound("audio/space-adventure.mp3");
    explosionSound = loadSound("audio/explosion.mp3");
    shootSound = loadSound("audio/shootsound.mp3");
}



//Old preload

//function preload() {
    // Load images
    //spaceship = loadImage("https://res.cloudinary.com/dzv7hjwfn/image/upload/f_auto/q_auto/jevse0epuwspql8fuahc?_a=BBECd1AE0");
    //spacebackground = loadImage("https://res.cloudinary.com/dzv7hjwfn/image/upload/f_auto/q_auto/od0gbg3cgs1akzwbttt2?_a=BBECd1AE0");
    //asteroidImage = loadImage("https://res.cloudinary.com/dzv7hjwfn/image/upload/f_auto/q_auto/fpcbkcxu4scbh2y42us6?_a=BBECd1AE0");
    //commstationImage = loadImage("https://res.cloudinary.com/dzv7hjwfn/image/upload/f_auto/q_auto/kehapxjetpelf94oug24?_a=BBECd1AE0");
    //crystalAsteroidImage = loadImage("https://res.cloudinary.com/dzv7hjwfn/image/upload/f_auto/q_auto/vt3qqs3z8uym6ls9omkf?_a=BBECd1AE0");
    //spaceStation = loadImage("https://res.cloudinary.com/dzv7hjwfn/image/upload/f_auto/q_auto/ic29lbc2qwj3ofxrcrkj?_a=BBECd1AE0");
    //freighterImage = loadImage("https://res.cloudinary.com/dzv7hjwfn/image/upload/f_auto/q_auto/vtfwvol7vk4gktyhzx5l?_a=BBECd1AE0");
    //pirateFreighterImage = loadImage("https://res.cloudinary.com/dzv7hjwfn/image/upload/f_auto/q_auto/tqdckpvrcvobs2omdn28?_a=BBECd1AE0");
    //defencePlatformImage = loadImage("https://res.cloudinary.com/dzv7hjwfn/image/upload/f_auto/q_auto/ado9uujxlfpvz0ptfrkd?_a=BBECd1AE0");

    // Load audio
    //backgroundMusic = loadSound("audio/space-adventure.mp3");
    //explosionSound = loadSound("audio/explosion.mp3");
    //shootSound = loadSound("audio/shootsound.mp3");
//}




function setup() {
    createCanvas(windowWidth, windowHeight);
    spaceshipX = windowWidth / 2;
    spaceshipY = windowHeight / 2;

    // Calculate dynamic ranges
    DEFENSE_PLATFORM_FIRE_RANGE = ENEMY_PROJECTILE_SPEED * ENEMY_PROJECTILE_LIFESPAN / frameRate();
    FREIGHTER_FIRE_RANGE = PLAYER_PROJECTILE_SPEED * PROJECTILE_LIFESPAN / frameRate();

    // Place the space station at a random distant location
    const distance = 11111;
    const angle = random(TWO_PI);
    spaceStationX = spaceshipX + cos(angle) * distance;
    spaceStationY = spaceshipY + sin(angle) * distance;

    // Set up audio
    backgroundMusic.loop();
    backgroundMusic.setVolume(0.5);
}


// Updated setupAudio function
function setupAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Ensure to resume the audio context if it's suspended
    if (audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log("Audio context resumed in setupAudio");
        });
    }

    fetch("@asset('space-adventure')")
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            backgroundMusic = audioContext.createBufferSource();
            backgroundMusic.buffer = audioBuffer;
            backgroundMusic.connect(audioContext.destination);
            backgroundMusic.loop = true;
            backgroundMusic.start();
            console.log("Background music started");
        })
        .catch(e => console.error("Error with setting up audio:", e));
}


// Add a function to toggle music (optional)
function toggleMusic() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    } else if (audioContext.state === 'running') {
        audioContext.suspend();
    }
}




function playExplosionSound() {
    console.log("Attempting to play explosion sound", explosionSound);
    if (explosionSound && explosionSound.isLoaded()) {
        explosionSound.play();
    } else {
        console.warn("Explosion sound not loaded or is undefined");
    }
}




// Add this to your gameState options in the draw function:
function draw() {
    if (gameState === "start") {
        drawStartScreen();
    } else if (gameState === "playing") {
        drawGame();
    } else if (gameState === "mission2") {
        drawMission2Screen();
    } else if (gameState === "mission2Playing") {
        drawMission2Game();
    } else if (gameState === "mission3") {
        drawMission3Screen();
    } else if (gameState === "mission3Playing") {
        drawMission3Game();
    } else if (gameState === "finalMission") {
        drawFinalMissionScreen();
    } else if (gameState === "level4Playing") {
        drawLevel4Game();
    } else if (gameState === "gameComplete") {
        drawEndGameScreen();
    }
    drawCursor();
}


// Modify your setupBackgroundMusic function to check if the sound loaded correctly:
function setupBackgroundMusic() {
    if (backgroundMusic && backgroundMusic.isLoaded()) {
        backgroundMusic.loop();
        backgroundMusic.setVolume(0.5);
    } else {
        console.warn("Background music not loaded, skipping playback");
    }
}

function drawEndGameScreen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Congratulations! You now have all the skills you need to become a great pilot.\n\n" +
        "Good luck in the rest of your career.",
        width / 2, height / 2);
}



function drawStartScreen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Greetings pilot. To train you to become an expert pilot,\nyou will first need to complete a few missions, out in space.\n\n" +
        "Your First mission is simple. Familiarize yourself with the controls\nand environment, then follow the red arrow to the space station.\nThat's it for mission 1. Remember, missions will get more complicated later.\n\n" +
        "Use your cursor to turn around. Start moving with the W key.\nAsteroids and certain machinery can be damaging to your shield.\n\n" +
        "PRESS SPACE TO START",
        width / 2, height / 2);
}




// Remove one of the duplicate drawGame() functions

function drawMission2Game() {
    background(0);
    push();
    translate(width / 2 - spaceshipX, height / 2 - spaceshipY);
    drawBackground();
    drawAsteroids();
    drawCommstations();
    drawCrystalAsteroids();
    drawSpaceship();
    drawSpaceStation();
    drawFreighter();
    pop();

    handleMovement();
    checkMission2Collisions();
    drawDirectionArrow();

    // Display shield points at the top left
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`Shield Points: ${shieldPoints}`, 10, 10);

    // Debug information
    textSize(12);
    let yOffset = 100;
    text(`Velocity: (${velocityX.toFixed(4)}, ${velocityY.toFixed(4)}) units/frame`, 10, yOffset);
    yOffset += 20;
    let speed = sqrt(velocityX * velocityX + velocityY * velocityY);
    text(`Speed: ${speed.toFixed(4)} units/frame`, 10, yOffset);
    yOffset += 20;
    let inertiaDistance = 0;
    if (speed > 0) {
        inertiaDistance = (speed / (1 - deceleration));
    }
    text(`Inertia Distance: ${inertiaDistance.toFixed(2)} units`, 10, yOffset);
}



function drawDefencePlatforms() {
    for (let platform of defencePlatforms) {
        image(defencePlatformImage, platform.x - 75, platform.y - 75, 150, 150);
        // Health bar removed
    }
}



function drawMission2Screen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Congratulations! You've completed the first mission!\n\n" +
        "Next, you will be sent to take resources and fuel from a space station to a large Freighter.\n" +
        "Just follow the arrow. Good luck.",
        width / 2, height / 2);

    textSize(24);
    text("Press SPACE to continue", width / 2, height - 50);
}



// Add this new function to draw the final mission screen
function drawFinalMissionScreen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Congratulations! Now, you will do your final mission, to complete your training.\n\n" +
        "There is an unfueled pirate freighter, that, once fueled, will cause trouble in the local region.\n\n" +
        "You must reach it and destroy it, along with the 2 defense turrets around it.\n" +
        "Be warned, the Freighter has its own defenses.\n\n" +
        "Good luck.\n\n" +
        "Press SPACEBAR to start",
        width / 2, height / 2);
}




// Add this new function
function drawMission3Screen() {
    background(0);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("Congratulations! Now that you have a good understanding of movement,\nit is time to do some harder tasks.\n\n" +
        "You must destroy a group of pirate defense platforms that pirates use\nto prevent trading vessels from flying in this region.\n" +
        "To destroy them, you have been given a new upgrade, that lets you shoot projectiles.\n" +
        "Press 'D' on your keyboard to shoot. Just follow the arrows.\n\n" +
        "Press SPACEBAR to start.",
        width / 2, height / 2);
}


// Full drawHitTexts function
function drawHitTexts() {
    for (let i = hitTexts.length - 1; i >= 0; i--) {
        let hitText = hitTexts[i];
        fill(255, 0, 0, map(hitText.duration, 0, TEXT_DISPLAY_DURATION, 255, 0));
        textAlign(CENTER);
        textSize(16);
        text(hitText.text, hitText.x, hitText.y);
        hitText.duration--;
        hitText.y -= 1; // Move text upwards
        if (hitText.duration <= 0) {
            hitTexts.splice(i, 1);
        }
    }
}



function drawMission3Game() {
    background(0);
    push();
    translate(width / 2 - spaceshipX, height / 2 - spaceshipY);

    drawBackground();
    drawAsteroids();
    drawCommstations();
    drawCrystalAsteroids();
    drawDefencePlatforms(); // Ensure this is called to draw platforms
    drawProjectiles();
    drawSpaceship();
    drawHitTexts();

    pop();

    handleMovement(); // Ensure this is called for movement
    handleShooting();
    handleDefencePlatformShooting();
    checkMission3Collisions();

    // Draw the direction arrow
    drawDirectionArrow(); // Draw the direction arrow

    // Display shield points
    displayShieldPoints(); // Add this line to display shield points

    // Debug information
    fill(255);
    textSize(12);
    textAlign(LEFT, TOP);
    let yOffset = 100;
    text(`Velocity: (${velocityX.toFixed(4)}, ${velocityY.toFixed(4)}) units/frame`, 10, yOffset);
    yOffset += 20;
    let speed = sqrt(velocityX * velocityX + velocityY * velocityY);
    text(`Speed: ${speed.toFixed(4)} units/frame`, 10, yOffset);
    yOffset += 20;
    let inertiaDistance = 0;
    if (speed > 0) {
        inertiaDistance = (speed / (1 - deceleration));
    }
    text(`Inertia Distance: ${inertiaDistance.toFixed(2)} units`, 10, yOffset);
}



function drawProjectiles() {
    // Draw player projectiles
    for (let projectile of projectiles) {
        let alpha = projectile.lifespan > 60 ? 255 : map(projectile.lifespan, 0, 60, 0, 255);
        fill(255, 255, 0, alpha);
        ellipse(projectile.x, projectile.y, 10, 10);
    }

    // Draw enemy projectiles
    for (let enemyProjectile of enemyProjectiles) {
        let alpha = enemyProjectile.lifespan > 120 ? 255 : map(enemyProjectile.lifespan, 0, 120, 0, 255);
        fill(255, 0, 0, alpha);
        ellipse(enemyProjectile.x, enemyProjectile.y, 8, 8);

        // Update position of enemy projectiles
        enemyProjectile.x += enemyProjectile.vx;
        enemyProjectile.y += enemyProjectile.vy;
        enemyProjectile.lifespan--;

        // Remove projectile if lifespan is over
        if (enemyProjectile.lifespan <= 0) {
            enemyProjectiles.splice(enemyProjectiles.indexOf(enemyProjectile), 1);
        }
    }
}



function handleShooting() {
    if (keyIsDown(68) && millis() - lastProjectileTime > PLAYER_PROJECTILE_COOLDOWN) { // D key
        let angle = atan2((mouseY - height / 2) * cursorSensitivity, (mouseX - width / 2) * cursorSensitivity);
        projectiles.push({
            x: spaceshipX,
            y: spaceshipY,
            vx: cos(angle) * PROJECTILE_SPEED,
            vy: sin(angle) * PROJECTILE_SPEED,
            lifespan: PROJECTILE_LIFESPAN
        });
        lastProjectileTime = millis();

        // Play the shoot sound
        if (shootSound && shootSound.isLoaded()) {
            shootSound.setVolume(1.0); // Set volume if needed
            shootSound.play();
        }
    }

    // Update projectile positions and lifespan
    for (let i = projectiles.length - 1; i >= 0; i--) {
        projectiles[i].x += projectiles[i].vx;
        projectiles[i].y += projectiles[i].vy;
        projectiles[i].lifespan--;

        if (projectiles[i].lifespan <= 0) {
            projectiles.splice(i, 1);
        }
    }
}



function handleDefencePlatformShooting() {
    const currentTime = millis();

    // Handle shooting for regular defence platforms (level 3)
    for (let platform of defencePlatforms) {
        // Removed distance check
        if (currentTime - platform.lastShotTime > DEFENCE_PLATFORM_COOLDOWN) {
            shootAtPlayer(platform);
            platform.lastShotTime = currentTime;
        }
    }

    // Handle shooting for level 4 entities (freighter and defense platforms)
    if (gameState === "level4Playing") {
        // Freighter shooting
        if (currentTime - level4Freighter.lastShotTime > DEFENCE_PLATFORM_COOLDOWN) {
            shootAtPlayer(level4Freighter);
            level4Freighter.lastShotTime = currentTime;
        }

        // Level 4 defense platforms shooting
        for (let platform of level4DefensePlatforms) {
            if (currentTime - platform.lastShotTime > DEFENCE_PLATFORM_COOLDOWN) {
                shootAtPlayer(platform);
                platform.lastShotTime = currentTime;
            }
        }
    }
}


function shootAtPlayer(shooter) {
    let angle = atan2(spaceshipY - shooter.y, spaceshipX - shooter.x);
    enemyProjectiles.push({
        x: shooter.x,
        y: shooter.y,
        vx: cos(angle) * ENEMY_PROJECTILE_SPEED,
        vy: sin(angle) * ENEMY_PROJECTILE_SPEED,
        lifespan: ENEMY_PROJECTILE_LIFESPAN
    });
    console.log(`Entity at (${shooter.x}, ${shooter.y}) fired a projectile.`);

    // Calculate distance to player
    let distanceToPlayer = dist(spaceshipX, spaceshipY, shooter.x, shooter.y);
    let volume = map(distanceToPlayer, 0, 1000, 1, 0); // Adjust volume based on distance (0 to 1000 pixels)
    volume = constrain(volume, 0, 1); // Ensure volume is between 0 and 1

    // Play the shoot sound for enemy projectiles
    if (shootSound && shootSound.isLoaded()) {
        shootSound.setVolume(volume); // Set volume based on distance
        shootSound.play();
        console.log("Shoot sound played for enemy projectile");
    } else {
        console.warn("Shoot sound not loaded yet or is undefined");
    }
}




function checkMission3Collisions() {
    const shipRadius = spaceshipWidth / 2;

    // Check if player's shield points have reached zero
    if (shieldPoints <= 0) {
        gameState = "mission3";
        resetMission3State();
        return;
    }

    // Check collisions between ship and asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        let distance = dist(spaceshipX, spaceshipY, asteroid.x, asteroid.y);
        if (distance < (shipRadius + 75)) {
            shieldPoints = max(0, shieldPoints - 1);
            asteroids.splice(i, 1);
            playExplosionSound(); // Add explosion sound
        }
    }

    // Check collisions with comm stations
    for (let i = commstations.length - 1; i >= 0; i--) {
        let commstation = commstations[i];
        let distance = dist(spaceshipX, spaceshipY, commstation.x, commstation.y);
        if (distance < (shipRadius + 50)) {
            shieldPoints = max(0, shieldPoints - 1);
            commstations.splice(i, 1);
            playExplosionSound(); // Add explosion sound
        }
    }

    // Check collisions with crystal asteroids
    for (let i = crystalAsteroids.length - 1; i >= 0; i--) {
        let crystalAsteroid = crystalAsteroids[i];
        let distance = dist(spaceshipX, spaceshipY, crystalAsteroid.x, crystalAsteroid.y);
        if (distance < (shipRadius + 60)) {
            activateSpeedBoost();
            crystalAsteroids.splice(i, 1);
        }
    }

    // Check collisions between player projectiles and defence platforms
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let projectile = projectiles[i];
        let projectileHit = false;

        // Check collision with defence platforms
        for (let j = defencePlatforms.length - 1; j >= 0; j--) {
            if (dist(projectile.x, projectile.y, defencePlatforms[j].x, defencePlatforms[j].y) < 75) {
                defencePlatforms[j].health -= 1;
                hitTexts.push({
                    x: defencePlatforms[j].x,
                    y: defencePlatforms[j].y - 90,
                    text: "-1 Shield Health",
                    duration: TEXT_DISPLAY_DURATION
                });
                if (defencePlatforms[j].health <= 0) {
                    defencePlatforms.splice(j, 1);
                }
                projectileHit = true;
                playExplosionSound(); // Add explosion sound
                break;
            }
        }

        // Check collisions between player projectiles and asteroids
        for (let j = asteroids.length - 1; j >= 0; j--) {
            let asteroid = asteroids[j];
            if (dist(projectile.x, projectile.y, asteroid.x, asteroid.y) < 75) {
                asteroids.splice(j, 1);
                projectileHit = true;
                playExplosionSound(); // Add explosion sound
                break;
            }
        }

        // Check collisions between player projectiles and comm stations
        if (!projectileHit) {
            for (let j = commstations.length - 1; j >= 0; j--) {
                let commstation = commstations[j];
                if (dist(projectile.x, projectile.y, commstation.x, commstation.y) < 50) {
                    commstations.splice(j, 1);
                    projectileHit = true;
                    playExplosionSound(); // Add explosion sound
                    break;
                }
            }
        }

        // Check collisions between player projectiles and crystal asteroids
        if (!projectileHit) {
            for (let j = crystalAsteroids.length - 1; j >= 0; j--) {
                let crystalAsteroid = crystalAsteroids[j];
                if (dist(projectile.x, projectile.y, crystalAsteroid.x, crystalAsteroid.y) < 60) {
                    crystalAsteroids.splice(j, 1);
                    projectileHit = true;
                    playExplosionSound(); // Add explosion sound
                    break;
                }
            }
        }

        // Remove the projectile if it hit something
        if (projectileHit) {
            projectiles.splice(i, 1);
        }
    }

    // Check if all defense platforms are destroyed to move to final mission
    if (defencePlatforms.length === 0) {
        gameState = "finalMission"; // Transition to final mission screen
        resetMission3State(); // Reset Mission 3 state
    }

    // Check collisions between enemy projectiles and player
    let playerHit = false;
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        let enemyProjectile = enemyProjectiles[i];
        let distance = dist(spaceshipX, spaceshipY, enemyProjectile.x, enemyProjectile.y);
        if (distance < shipRadius) {
            if (!playerHit) {
                shieldPoints = max(0, shieldPoints - 1); // Ensure only 1 damage per frame
                hitTexts.push({
                    x: spaceshipX,
                    y: spaceshipY - 50,
                    text: "-1 Player Shield",
                    duration: TEXT_DISPLAY_DURATION
                });
                playerHit = true;
                playExplosionSound(); // Add explosion sound
            }
            enemyProjectiles.splice(i, 1);
        }
    }
}


function drawGame() {
    background(0);
    push();
    translate(width / 2 - spaceshipX, height / 2 - spaceshipY);
    drawBackground();
    drawAsteroids();
    drawCommstations();
    drawCrystalAsteroids();
    drawSpaceship();
    drawSpaceStation();
    pop();

    handleMovement();
    checkCollisions();
    displayShieldPoints();
    drawCursor();
    drawDirectionArrow();

    // Debug information
    fill(255);
    textSize(12);
    textAlign(LEFT, TOP);
    let yOffset = 100;
    text(`Velocity: (${velocityX.toFixed(4)}, ${velocityY.toFixed(4)}) units/frame`, 10, yOffset);
    yOffset += 20;
    let speed = sqrt(velocityX * velocityX + velocityY * velocityY);
    text(`Speed: ${speed.toFixed(4)} units/frame`, 10, yOffset);
    yOffset += 20;

    // Calculate inertia distance
    let inertiaDistance = 0;
    if (speed > 0) {
        inertiaDistance = (speed / (1 - deceleration));
    }
    text(`Inertia Distance: ${inertiaDistance.toFixed(2)} units`, 10, yOffset);

    if (shieldPoints <= 0) {
        restartGame();
    }
}




function drawCrystalAsteroids() {
    for (let crystalAsteroid of crystalAsteroids) {
        image(crystalAsteroidImage, crystalAsteroid.x, crystalAsteroid.y, 120, 120);
    }
}

// Update the drawSpaceStation function:
function drawSpaceStation() {
    image(spaceStation, spaceStationX - spaceStationWidth / 2, spaceStationY - spaceStationHeight / 2, spaceStationWidth, spaceStationHeight);
}

function displayShieldPoints() {
    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
    text(`Shield Points: ${shieldPoints} SP`, 10, 10);

    if (speedBoostActive) {
        text(`Speed Boost: ${Math.ceil(speedBoostTimer / 60)}s`, 10, 40);
    }
}



function drawBackground() {
    const scaleFactor = 0.125; // This will scale your 8000x6236 image to 1000x779.5
    const bgWidth = spacebackground.width * scaleFactor;
    const bgHeight = spacebackground.height * scaleFactor;

    const startX = Math.floor(spaceshipX / bgWidth) - 2;
    const startY = Math.floor(spaceshipY / bgHeight) - 2;
    const endX = startX + Math.ceil(width / bgWidth) + 4;
    const endY = startY + Math.ceil(height / bgHeight) + 4;

    for (let x = startX; x < endX; x++) {
        for (let y = startY; y < endY; y++) {
            const tileKey = `${x},${y}`;
            if (!spawnedTiles.has(tileKey)) {
                spawnedTiles.add(tileKey);
                spawnAsteroidsInTile(x * bgWidth, y * bgHeight, bgWidth, bgHeight);
            }
            image(spacebackground, x * bgWidth, y * bgHeight, bgWidth, bgHeight);
        }
    }
}


function drawAsteroids() {
    for (let asteroid of asteroids) {
        image(asteroidImage, asteroid.x, asteroid.y, 150, 150);
    }
}

function drawCommstations() {
    for (let commstation of commstations) {
        image(commstationImage, commstation.x, commstation.y, 100, 100);
    }
}

function drawCursor() {
    noCursor();
    fill(255);
    ellipse(mouseX, mouseY, 5, 5);
}




function drawDirectionArrow() {
    let targetX, targetY;
    if (gameState === "playing" || (gameState === "mission2Playing" && mission2State === "toStation")) {
        targetX = spaceStationX;
        targetY = spaceStationY;
    } else if (gameState === "mission2Playing" && mission2State === "toFreighter") {
        targetX = freighterX;
        targetY = freighterY;
    } else if (gameState === "mission3Playing") {
        if (defencePlatforms.length > 0) {
            let closestPlatform = defencePlatforms[0];
            let closestDist = Infinity;
            for (let platform of defencePlatforms) {
                let dist = Math.hypot(platform.x - spaceshipX, platform.y - spaceshipY);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestPlatform = platform;
                }
            }
            targetX = closestPlatform.x;
            targetY = closestPlatform.y;
        } else {
            // If all platforms are destroyed, don't draw the arrow
            return;
        }
    } else if (gameState === "level4Playing") {
        targetX = level4Freighter.x;
        targetY = level4Freighter.y;
    } else {
        // If we're not in a game state that needs an arrow, don't draw it
        return;
    }

    const dx = targetX - spaceshipX;
    const dy = targetY - spaceshipY;
    const angle = atan2(dy, dx);
    const arrowSize = 20;
    const margin = 40; // Margin from the edge of the screen

    // Calculate the position of the arrow
    let r = min(width, height) / 2 - margin;
    let arrowX = r * cos(angle);
    let arrowY = r * sin(angle);

    // Constrain arrow to screen edges if it would go off-screen
    if (abs(arrowX) > width / 2 - margin) {
        arrowX = (arrowX > 0) ? width / 2 - margin : -width / 2 + margin;
        arrowY = (dy / dx) * arrowX;
    }
    if (abs(arrowY) > height / 2 - margin) {
        arrowY = (arrowY > 0) ? height / 2 - margin : -height / 2 + margin;
        arrowX = (dx / dy) * arrowY;
    }

    // Move arrow to center of screen
    arrowX += width / 2;
    arrowY += height / 2;

    push();
    translate(arrowX, arrowY);
    rotate(angle);

    // Draw arrow
    fill(255, 0, 0);
    noStroke();
    triangle(0, -arrowSize / 2, 0, arrowSize / 2, arrowSize, 0);

    pop();
}





function drawSpaceship() {
    let angle = atan2((mouseY - height / 2) * cursorSensitivity, (mouseX - width / 2) * cursorSensitivity);
    push();
    translate(spaceshipX, spaceshipY);
    rotate(angle - PI / 2);
    imageMode(CENTER);
    image(spaceship, 0, 0, spaceshipWidth, spaceshipHeight);
    pop();
}



function handleMovement() {
    let angle = atan2((mouseY - height / 2) * cursorSensitivity, (mouseX - width / 2) * cursorSensitivity);

    let currentAcceleration = acceleration * speedBoostMultiplier;
    let currentMaxSpeed = maxSpeed * speedBoostMultiplier;

    if (keyIsDown(87)) { // W key
        if (wKeyPressTime === 0) {
            wKeyPressTime = millis();
        }
        let wKeyHoldDuration = (millis() - wKeyPressTime) / 1000; // Convert to seconds
        let accelerationMultiplier = min(1 + (wKeyHoldDuration / 30), maxSpeedMultiplier);

        currentAcceleration *= accelerationMultiplier;
        currentMaxSpeed *= accelerationMultiplier;

        velocityX += cos(angle) * currentAcceleration;
        velocityY += sin(angle) * currentAcceleration;
    } else {
        wKeyPressTime = 0;
    }

    if (keyIsDown(83)) { // S key
        velocityX *= 0.97;
        velocityY *= 0.97;

        if (abs(velocityX) < 0.1 && abs(velocityY) < 0.1) {
            velocityX -= cos(angle) * (currentAcceleration / 4);
            velocityY -= sin(angle) * (currentAcceleration / 4);
        }
    }

    // Apply deceleration
    velocityX *= deceleration;
    velocityY *= deceleration;

    // Limit speed
    let speed = sqrt(velocityX * velocityX + velocityY * velocityY);
    if (speed > currentMaxSpeed) {
        velocityX = (velocityX / speed) * currentMaxSpeed;
        velocityY = (velocityY / speed) * currentMaxSpeed;
    }

    // Update position
    spaceshipX += velocityX;
    spaceshipY += velocityY;

    // Stop completely if speed is very low
    if (abs(velocityX) < 0.01) velocityX = 0;
    if (abs(velocityY) < 0.01) velocityY = 0;

    // Handle speed boost timer
    if (speedBoostActive) {
        speedBoostTimer--;
        if (speedBoostTimer <= 0) {
            speedBoostActive = false;
            speedBoostMultiplier = 1;
        }
    }
}

// Update the drawFreighter function to use the normal freighter image:
function drawFreighter() {
    image(freighterImage, freighterX - freighterRadius, freighterY - freighterRadius, freighterRadius * 2, freighterRadius * 2);
}


function checkCollisions() {
    const shipRadius = spaceshipWidth / 2;

    // Check if player's shield points have reached zero
    if (shieldPoints <= 0) {
        gameState = "start";
        return;
    }

    let distanceToStation = dist(spaceshipX, spaceshipY, spaceStationX, spaceStationY);
    if (distanceToStation < (shipRadius + spaceStationWidth / 2)) {
        gameState = "mission2";
        return;
    }

    // Check collisions with asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        let distance = dist(spaceshipX, spaceshipY, asteroid.x, asteroid.y);
        if (distance < (shipRadius + 75)) {
            shieldPoints = max(0, shieldPoints - 1);
            asteroids.splice(i, 1);
            playExplosionSound(); // Add explosion sound
        }
    }

    // Check collisions with comm stations
    for (let i = commstations.length - 1; i >= 0; i--) {
        let commstation = commstations[i];
        let distance = dist(spaceshipX, spaceshipY, commstation.x, commstation.y);
        if (distance < (shipRadius + 60)) {
            shieldPoints = max(0, shieldPoints - 1);
            commstations.splice(i, 1);
            playExplosionSound(); // Add explosion sound
        }
    }

    // Check collisions with crystal asteroids
    for (let i = crystalAsteroids.length - 1; i >= 0; i--) {
        let crystalAsteroid = crystalAsteroids[i];
        let distance = dist(spaceshipX, spaceshipY, crystalAsteroid.x, crystalAsteroid.y);
        if (distance < (shipRadius + 60)) {
            activateSpeedBoost();
            crystalAsteroids.splice(i, 1);
        }
    }
}


function removeCollidedObjects(objectsToRemove) {
    for (let i = objectsToRemove.asteroids.length - 1; i >= 0; i--) {
        asteroids.splice(objectsToRemove.asteroids[i], 1);
        playExplosionSound();
    }
    for (let i = objectsToRemove.commstations.length - 1; i >= 0; i--) {
        commstations.splice(objectsToRemove.commstations[i], 1);
        playExplosionSound();
    }
    for (let i = objectsToRemove.crystalAsteroids.length - 1; i >= 0; i--) {
        crystalAsteroids.splice(objectsToRemove.crystalAsteroids[i], 1);
    }
}




function checkMission2Collisions() {
    const shipRadius = spaceshipWidth / 2;

    if (shieldPoints <= 0) {
        gameState = "mission2";
        resetMission2State();
        return;
    }

    if (mission2State === "toStation") {
        let distanceToStation = dist(spaceshipX, spaceshipY, spaceStationX, spaceStationY);
        if (distanceToStation < (shipRadius + spaceStationWidth / 2)) {
            mission2State = "toFreighter";
        }
    } else if (mission2State === "toFreighter") {
        let distanceToFreighter = dist(spaceshipX, spaceshipY, freighterX, freighterY);
        if (distanceToFreighter < (shipRadius + freighterRadius)) {
            gameState = "mission3";
            return;
        }
    }

    // Check collisions with asteroids
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        let distance = dist(spaceshipX, spaceshipY, asteroid.x, asteroid.y);
        if (distance < (shipRadius + 75)) {
            shieldPoints = max(0, shieldPoints - 1);
            asteroids.splice(i, 1);
            playExplosionSound(); // Add explosion sound
        }
    }

    // Check collisions with comm stations
    for (let i = commstations.length - 1; i >= 0; i--) {
        let commstation = commstations[i];
        let distance = dist(spaceshipX, spaceshipY, commstation.x, commstation.y);
        if (distance < (shipRadius + 60)) {
            shieldPoints = max(0, shieldPoints - 1);
            commstations.splice(i, 1);
            playExplosionSound(); // Add explosion sound
        }
    }

    // Check collisions with crystal asteroids
    for (let i = crystalAsteroids.length - 1; i >= 0; i--) {
        let crystalAsteroid = crystalAsteroids[i];
        let distance = dist(spaceshipX, spaceshipY, crystalAsteroid.x, crystalAsteroid.y);
        if (distance < (shipRadius + 60)) {
            activateSpeedBoost();
            crystalAsteroids.splice(i, 1);
        }
    }
}



function spawnAsteroidsInTile(tileX, tileY, tileWidth, tileHeight) {
    const randomValue = Math.random();

    if (randomValue < 0.7) { // Increased chance to spawn something
        if (Math.random() < 0.6) { // 60% chance for asteroids
            let numAsteroids = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numAsteroids; i++) {
                let asteroidX = tileX + Math.random() * tileWidth;
                let asteroidY = tileY + Math.random() * tileHeight;
                asteroids.push({ x: asteroidX, y: asteroidY });
            }
        }
        if (Math.random() < 0.2) { // 20% chance for commstation
            let commstationX = tileX + Math.random() * tileWidth;
            let commstationY = tileY + Math.random() * tileHeight;
            commstations.push({ x: commstationX, y: commstationY });
        }
        if (Math.random() < 0.1) { // 10% chance for crystal asteroid
            let crystalAsteroidX = tileX + Math.random() * tileWidth;
            let crystalAsteroidY = tileY + Math.random() * tileHeight;
            crystalAsteroids.push({ x: crystalAsteroidX, y: crystalAsteroidY });
        }
    }
}



function activateSpeedBoost() {
    speedBoostActive = true;
    speedBoostTimer = 300; // 5 seconds at 60 fps
    speedBoostMultiplier += 0.5; // Increase speed by 50% for each crystal
}


function restartGame() {
    spaceshipX = windowWidth / 2;
    spaceshipY = windowHeight / 2;
    velocityX = 0;
    velocityY = 0;
    shieldPoints = 10;
    asteroids = [];
    commstations = [];
    crystalAsteroids = [];
    spawnedTiles.clear();
    speedBoostActive = false;
    speedBoostTimer = 0;
    speedBoostMultiplier = 1;
    wKeyPressTime = 0;

    // Respawn the space station at a new random location
    const distance = 5000;
    const angle = random(TWO_PI);
    spaceStationX = spaceshipX + cos(angle) * distance;
    spaceStationY = spaceshipY + sin(angle) * distance;


}

function resetGameState() {
    spaceshipX = windowWidth / 2;
    spaceshipY = windowHeight / 2;
    velocityX = 0;
    velocityY = 0;
    shieldPoints = 10; // Reset shield points
    asteroids = [];
    commstations = [];
    crystalAsteroids = [];
    spawnedTiles.clear();
    speedBoostActive = false;
    speedBoostTimer = 0;
    speedBoostMultiplier = 1;
    wKeyPressTime = 0;

    const stationAngle = random(TWO_PI);
    spaceStationX = spaceshipX + cos(stationAngle) * SPACE_STATION_DISTANCE;
    spaceStationY = spaceshipY + sin(stationAngle) * SPACE_STATION_DISTANCE;
}


// Make sure to update the freighter position in the resetMission2State function:
function resetMission2State() {
    resetGameState(); // Reset basic game state
    mission2State = "toStation";
    shieldPoints = 10; // Reset shield points

    // Set freighter position
    const freighterAngle = random(TWO_PI);
    freighterX = spaceshipX + cos(freighterAngle) * FREIGHTER_DISTANCE;
    freighterY = spaceshipY + sin(freighterAngle) * FREIGHTER_DISTANCE;
}



function resetMission3State() {
    resetGameState(); // Reset basic game state
    projectiles = []; // Reset projectiles
    defencePlatforms = []; // Reset defence platforms
    hitTexts = []; // Reset hit texts

    // Define the spawn area boundaries
    const minDistance = 1000; // Minimum distance from spawn point
    const maxDistance = 3000; // Maximum distance from spawn point

    // Spawn only 3 defence platforms with health
    for (let i = 0; i < 3; i++) {
        let angle = random(TWO_PI);
        let distance = random(minDistance, maxDistance);

        let platformX = spaceshipX + cos(angle) * distance;
        let platformY = spaceshipY + sin(angle) * distance;

        defencePlatforms.push({
            x: platformX,
            y: platformY,
            health: DEFENCE_PLATFORM_HEALTH,
            lastShotTime: 0 // Initialize lastShotTime
        });
    }
}



// Add this new function to draw the hit texts
function drawHitTexts() {
    for (let i = hitTexts.length - 1; i >= 0; i--) {
        let hitText = hitTexts[i];
        fill(255, 0, 0, map(hitText.duration, 0, TEXT_DISPLAY_DURATION, 0, 255));
        textAlign(CENTER);
        textSize(16);
        text(hitText.text, hitText.x, hitText.y);
        hitText.duration--;
        hitText.y -= 1; // Move text upwards
        if (hitText.duration <= 0) {
            hitTexts.splice(i, 1);
        }
    }
}



function keyPressed() {
    if (keyCode === 32) { // 32 is the keyCode for SPACE
        if (gameState === "start") {
            gameState = "playing";
            resetGameState();
        } else if (gameState === "mission2") {
            gameState = "mission2Playing";
            resetMission2State();
        } else if (gameState === "mission3") {
            gameState = "mission3Playing";
            resetMission3State();
        } else if (gameState === "finalMission") {
            gameState = "level4Playing";
            resetLevel4State();
        }
    }
}



function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}




//------------------------------------------------//
//------------------------------------------------//
//------------------------------------------------//
//------------------------------------------------//
//------------------------------------------------//
//------------------------------------------------//
//------------------------------------------------//
//------------------------------------------------//



function drawLevel4Game() {
    background(0);
    push();
    translate(width / 2 - spaceshipX, height / 2 - spaceshipY);

    drawBackground();
    drawAsteroids();
    drawCommstations();
    drawCrystalAsteroids();
    drawLevel4Freighter();
    drawLevel4DefensePlatforms();
    drawProjectiles();
    drawSpaceship();
    drawHitTexts();

    pop();

    handleMovement();
    handleShooting();
    handleDefencePlatformShooting();
    checkLevel4Collisions();

    displayShieldPoints();
    drawDirectionArrow();

    // Debug information
    fill(255);
    textSize(12);
    textAlign(LEFT, TOP);
    let yOffset = 100;
    text(`Velocity: (${velocityX.toFixed(4)}, ${velocityY.toFixed(4)}) units/frame`, 10, yOffset);
    yOffset += 20;
    let speed = sqrt(velocityX * velocityX + velocityY * velocityY);
    text(`Speed: ${speed.toFixed(4)} units/frame`, 10, yOffset);
    yOffset += 20;
    let inertiaDistance = 0;
    if (speed > 0) {
        inertiaDistance = (speed / (1 - deceleration));
    }
    text(`Inertia Distance: ${inertiaDistance.toFixed(2)} units`, 10, yOffset);
}

function drawLevel4Freighter() {
    // Draw the pirate freighter image instead of a placeholder ellipse
    imageMode(CENTER);
    image(pirateFreighterImage, level4Freighter.x, level4Freighter.y, level4Freighter.radius * 2, level4Freighter.radius * 2);
    imageMode(CORNER); // Reset imageMode to default
}

function drawLevel4DefensePlatforms() {
    for (let platform of level4DefensePlatforms) {
        image(defencePlatformImage, platform.x - 75, platform.y - 75, 150, 150);
    }
}






function checkLevel4Collisions() {
    const shipRadius = spaceshipWidth / 2;

    // Check if player's shield points have reached zero
    if (shieldPoints <= 0) {
        gameState = "finalMission";
        resetLevel4State();
        return;
    }

    // Check collisions between ship and objects
    for (let i = asteroids.length - 1; i >= 0; i--) {
        let asteroid = asteroids[i];
        let distance = dist(spaceshipX, spaceshipY, asteroid.x, asteroid.y);
        if (distance < (shipRadius + 75)) {
            shieldPoints = max(0, shieldPoints - 1);
            asteroids.splice(i, 1);
            playExplosionSound(); // Add explosion sound
        }
    }

    for (let i = commstations.length - 1; i >= 0; i--) {
        let commstation = commstations[i];
        let distance = dist(spaceshipX, spaceshipY, commstation.x, commstation.y);
        if (distance < (shipRadius + 50)) {
            shieldPoints = max(0, shieldPoints - 1);
            commstations.splice(i, 1);
            playExplosionSound(); // Add explosion sound
        }
    }

    for (let i = crystalAsteroids.length - 1; i >= 0; i--) {
        let crystalAsteroid = crystalAsteroids[i];
        let distance = dist(spaceshipX, spaceshipY, crystalAsteroid.x, crystalAsteroid.y);
        if (distance < (shipRadius + 60)) {
            activateSpeedBoost();
            crystalAsteroids.splice(i, 1);
        }
    }

    // Check collisions between player projectiles and level 4 specific objects
    for (let i = projectiles.length - 1; i >= 0; i--) {
        let projectile = projectiles[i];
        let projectileHit = false;

        // Check collision with level 4 freighter
        let distanceToFreighter = dist(projectile.x, projectile.y, level4Freighter.x, level4Freighter.y);
        if (distanceToFreighter < level4Freighter.radius) {
            level4Freighter.health -= 1;
            hitTexts.push({
                x: level4Freighter.x,
                y: level4Freighter.y - level4Freighter.radius,
                text: "-1 Freighter Health",
                duration: TEXT_DISPLAY_DURATION
            });
            projectileHit = true;
            playExplosionSound(); // Add explosion sound
        }

        // Check collision with level 4 defense platforms
        if (!projectileHit) {
            for (let j = level4DefensePlatforms.length - 1; j >= 0; j--) {
                if (dist(projectile.x, projectile.y, level4DefensePlatforms[j].x, level4DefensePlatforms[j].y) < 75) {
                    level4DefensePlatforms[j].health -= 1;
                    hitTexts.push({
                        x: level4DefensePlatforms[j].x,
                        y: level4DefensePlatforms[j].y - 90,
                        text: "-1 Platform Health",
                        duration: TEXT_DISPLAY_DURATION
                    });
                    if (level4DefensePlatforms[j].health <= 0) {
                        level4DefensePlatforms.splice(j, 1);
                    }
                    projectileHit = true;
                    playExplosionSound(); // Add explosion sound
                    break;
                }
            }
        }

        // Check collisions between player projectiles and asteroids
        if (!projectileHit) {
            for (let j = asteroids.length - 1; j >= 0; j--) {
                let asteroid = asteroids[j];
                if (dist(projectile.x, projectile.y, asteroid.x, asteroid.y) < 75) {
                    asteroids.splice(j, 1);
                    projectileHit = true;
                    playExplosionSound(); // Add explosion sound
                    break;
                }
            }
        }

        // Check collisions between player projectiles and comm stations
        if (!projectileHit) {
            for (let j = commstations.length - 1; j >= 0; j--) {
                let commstation = commstations[j];
                if (dist(projectile.x, projectile.y, commstation.x, commstation.y) < 50) {
                    commstations.splice(j, 1);
                    projectileHit = true;
                    playExplosionSound(); // Add explosion sound
                    break;
                }
            }
        }

        // Check collisions between player projectiles and crystal asteroids
        if (!projectileHit) {
            for (let j = crystalAsteroids.length - 1; j >= 0; j--) {
                let crystalAsteroid = crystalAsteroids[j];
                if (dist(projectile.x, projectile.y, crystalAsteroid.x, crystalAsteroid.y) < 60) {
                    crystalAsteroids.splice(j, 1);
                    projectileHit = true;
                    playExplosionSound(); // Add explosion sound
                    break;
                }
            }
        }

        // Remove the projectile if it hit something
        if (projectileHit) {
            projectiles.splice(i, 1);
        }
    }

    // Check collisions between enemy projectiles and player
    let playerHit = false;
    for (let i = enemyProjectiles.length - 1; i >= 0; i--) {
        let enemyProjectile = enemyProjectiles[i];
        let distance = dist(spaceshipX, spaceshipY, enemyProjectile.x, enemyProjectile.y);
        if (distance < shipRadius) {
            if (!playerHit) {
                shieldPoints = max(0, shieldPoints - 1); // Ensure only 1 damage per frame
                hitTexts.push({
                    x: spaceshipX,
                    y: spaceshipY - 50,
                    text: "-1 Player Shield",
                    duration: TEXT_DISPLAY_DURATION
                });
                playerHit = true;
                playExplosionSound(); // Add explosion sound
            }
            enemyProjectiles.splice(i, 1);
        }
    }

    // Check if freighter and all defense platforms are destroyed
    if (level4Freighter.health <= 0 && level4DefensePlatforms.length === 0) {
        gameState = "gameComplete";
    }
}



function resetLevel4State() {
    resetGameState();
    projectiles = [];
    enemyProjectiles = [];
    hitTexts = [];

    // Set freighter position
    const freighterAngle = random(TWO_PI);
    level4Freighter = {
        x: spaceshipX + cos(freighterAngle) * LEVEL4_FREIGHTER_DISTANCE,
        y: spaceshipY + sin(freighterAngle) * LEVEL4_FREIGHTER_DISTANCE,
        radius: 100,
        health: 20,
        lastShotTime: 0
    };

    // Spawn 2 defense platforms
    level4DefensePlatforms = [];
    for (let i = 0; i < 2; i++) {
        let angle = freighterAngle + PI * (i + 0.5);
        let platform = {
            x: level4Freighter.x + cos(angle) * LEVEL4_DEFENSE_PLATFORM_DISTANCE,
            y: level4Freighter.y + sin(angle) * LEVEL4_DEFENSE_PLATFORM_DISTANCE,
            health: DEFENCE_PLATFORM_HEALTH,
            lastShotTime: 0
        };
        level4DefensePlatforms.push(platform);
    }

}
