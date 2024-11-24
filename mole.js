let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let timer = 30;
let moleInterval;
let plantInterval;
let timerInterval;

// Get audio elements
const backgroundMusic = document.getElementById('background-music');
const failSound = document.getElementById('fail');
const pickSound = document.getElementById('pick');
const gameOverSound = document.getElementById('game-over');
const levelIISound = document.getElementById('level-ii-short');

// Ensures the background music is ready to play
backgroundMusic.addEventListener('canplaythrough', function() {
    console.log('Background music is ready to play');
});

// Start the game with background music
window.onload = function() {
    setGame();
}

// Set up the game grid and intervals
function setGame() {
    // Create the 9 tiles for the game
    for (let i = 0; i < 9; i++) {
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }

    // Start the game intervals
    startGame();
}

// Get a random tile ID from 0 to 8
function getRandomTile() {
    return Math.floor(Math.random() * 9).toString();
}

// Set a mole at a random tile
function setMole() {
    if (gameOver) return;

    // Clear any existing mole
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }

    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";  // Path for the mole image

    let num = getRandomTile();

    // Ensure mole and plant do not appear in the same tile
    if (currPlantTile && currPlantTile.id === num) {
        return;
    }

    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole); // Add the mole image to the tile
}

// Set a plant at a random tile
function setPlant() {
    if (gameOver) return;

    // Clear any existing plant
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }

    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";  // Path for the plant image

    let num = getRandomTile();

    // Ensure mole and plant do not appear in the same tile
    if (currMoleTile && currMoleTile.id === num) {
        return;
    }

    pickSound.play();

    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant); // Add the plant image to the tile
}

// Handle clicking on a tile
function selectTile() {
    if (gameOver) return;

    if (this === currMoleTile) {
        // Play the "hit" sound when the mole is hit (Optional: Add a hit sound here)
        score += 10;
        document.getElementById("score").innerText = `Score: ${score}`;
    } else if (this === currPlantTile) {
        // Play the "fail" sound when the player clicks a plant
        failSound.play();

        document.getElementById("score").innerText = `GAME OVER: ${score}`;
        document.getElementById("final-score").innerText = `Final Score: ${score}`;
        gameOver = true;
        clearInterval(moleInterval);
        clearInterval(plantInterval);
        document.getElementById("game-over").style.display = 'block'; // Show game over screen

        // Play the game over sound
        gameOverSound.play();
    }
}

// Start the game by initializing intervals and countdown timer
function startGame() {
    score = 0;
    gameOver = false;
    timer = 30;

    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("timer").innerText = `Time: ${timer}`;
    document.getElementById("game-over").style.display = 'none';

    // Try to play the background music
    backgroundMusic.play().catch((err) => {
        // Handle autoplay failure
        console.log('Autoplay blocked', err);
        // Show "Start Music" button
        document.getElementById("start-music").style.display = "block"; // Display a button to play music
    });

    moleInterval = setInterval(setMole, 1000); // Mole appears every 1 second
    plantInterval = setInterval(setPlant, 2000); // Plant appears every 2 seconds

    // Countdown timer
    timerInterval = setInterval(function() {
        timer--;
        document.getElementById("timer").innerText = `Time: ${timer}`;
        if (timer === 0) {
            gameOver = true;
            clearInterval(moleInterval);
            clearInterval(plantInterval);
            document.getElementById("score").innerText = `Final Score: ${score}`;
            document.getElementById("game-over").style.display = 'block'; // Show game over screen

            // Stop background music
            backgroundMusic.pause();
            backgroundMusic.currentTime = 0;  // Reset to the beginning of the track

            // Play game over sound
            gameOverSound.play();
        }
    }, 1000);
}

// Restart the game
document.getElementById("play-again").addEventListener("click", function() {
    gameOver = false;
    document.getElementById("game-over").style.display = 'none';
    setGame();
});

// Play the background music if the user clicks "Start Music"
document.getElementById("start-music").addEventListener("click", function() {
    backgroundMusic.play();
    document.getElementById("start-music").style.display = "none"; // Hide the button after music starts
});
