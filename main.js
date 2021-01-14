// Get canvas element and push button
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const pushBtn = document.getElementById("pushBtn");

// Set bird image
const bird = new Image();
bird.src = "bird.png";

// Start vars
var birdX = birdDY = score = bestScore = 0;
var timeout = birdSize = pipeWidth = topPipeBottomY = 24;
var birdY = pipeGap = 200;
var canvasSize = pipeX = 400;
var interval;

/**
 * Generic methods
 */

getRandomArbitrary = (min, max) => {
    return Math.random() * (max - min) + min;
}

/**
 * Canvas methods
 */

drawSky = () => {
    context.fillStyle = "skyblue";
    context.fillRect(0, 0, canvasSize, canvasSize);
}

drawBird = () => {
    birdY -= birdDY -= 0.5;
    context.drawImage(bird, birdX, birdY, birdSize * (524 / 374), birdSize);
}

drawPipes = () => {
    context.fillStyle = "green";
    pipeX -= 8;

    // Pipe off screen? Then reset pipe and randomize gap.
    pipeX < -pipeWidth &&
        (
            (pipeX = canvasSize),
            (pipeGap = getRandomArbitrary(100, 200)),
            (topPipeBottomY = pipeGap * Math.random())
        );

    // Draw top and bottom pipe
    context.fillRect(pipeX, 0, pipeWidth, topPipeBottomY);
    context.fillRect(pipeX, topPipeBottomY + pipeGap, pipeWidth, canvasSize);
}

drawScore = () => {
    context.fillStyle = "black";
    context.fillText(score++, 9, 25);
    bestScore = bestScore < score ? score : bestScore;
    context.fillText(`Best: ${bestScore}`, 9, 50);
}

drawRetry = () => {
    // Cover all canvas with black rect
    context.fillStyle = "black"
    context.fillRect(0, 0, canvasSize, canvasSize)

    // Draw retry message
    context.fillStyle = "white"
    context.fillText(`End game, your score is: ${score}`, (canvasSize / 2), (canvasSize / 2))
    context.fillText('Click on screen to retry', (canvasSize / 2), ((canvasSize / 2) + 10));

    // Define action to restart game loop
    pushBtn.onclick = () => (!interval) && gameStartLoop();
}

gameOver = () => {
    clearInterval(interval);
    interval = null;
    drawRetry();
    ((birdDY = 0), (birdY = 200), (pipeX = canvasSize), (score = 0));
}

// Bird death conditions
didBirdHitPipe = () => ((birdY < topPipeBottomY || birdY > topPipeBottomY + pipeGap) && pipeX < birdSize * (524 / 374));
didBirdFall = () => (birdY > canvasSize);

gameStartLoop = () => {
    pushBtn.onclick = () => (birdDY = 9);

    interval = setInterval(() => {
        drawSky();
        drawBird();
        drawPipes();
        drawScore();

        (didBirdHitPipe() || didBirdFall()) && gameOver()
    }, timeout)
}

gameStartLoop();