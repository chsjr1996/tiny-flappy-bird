// Get canvas element and push button
const cnv = document.getElementById("game");
const ctx = cnv.getContext("2d");
const pushBtn = document.getElementById("pushBtn");

// Set bird image
const bird = new Image();
bird.src = "bird.png";

// Start vars
var birdX = birdDY = score = bestScore = 0;
var timeout = birdSize = pipeWidth = topPipeBottomY = 24;
var birdY = pipeGap = 200;
var canvasSize = pipeX = 400;
var immortalBird = false; // For tests or others things...
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
    ctx.fillStyle = "skyblue";
    ctx.fillRect(0, 0, canvasSize, canvasSize);
}

drawBird = () => {
    birdY -= birdDY -= 0.5;
    ctx.drawImage(bird, birdX, birdY, birdSize * (524 / 374), birdSize);
}

drawPipes = () => {
    ctx.fillStyle = "green";
    pipeX -= 8;

    // Pipe off screen? Then reset pipe and randomize gap.
    pipeX < -pipeWidth &&
        (
            (pipeX = canvasSize),
            (pipeGap = getRandomArbitrary(100, 200)),
            (topPipeBottomY = pipeGap * Math.random())
        );

    // Draw top and bottom pipe
    ctx.fillRect(pipeX, 0, pipeWidth, topPipeBottomY);
    ctx.fillRect(pipeX, topPipeBottomY + pipeGap, pipeWidth, canvasSize);
}

drawScore = () => {
    ctx.fillStyle = "black";
    ctx.font = "14px sans-serif";
    ctx.fillText('Current: '+score++, 9, 25);
    bestScore = bestScore < score ? score : bestScore;
    ctx.fillText(`Best: ${bestScore}`, 9, 50);
}

drawRetry = () => {
    // Cover all canvas with black rect
    ctx.fillStyle = "black"
    ctx.fillRect(0, 0, canvasSize, canvasSize)

    // Draw retry message
    ctx.fillStyle = "white"
    ctx.font = "20px sans-serif";

    const firstMsg = `End game, your score is: ${score}`;
    const secondMsg = 'Push button to retry';
    const firstMsgWidth = ctx.measureText(firstMsg).width;
    const secondMsgWidth = ctx.measureText(secondMsg).width;

    ctx.fillText(firstMsg, (canvasSize / 2) - (firstMsgWidth/2), (canvasSize / 2))
    ctx.fillText(secondMsg, (canvasSize / 2) - (secondMsgWidth/2), ((canvasSize / 2) + 40));

    // Define action to restart game loop
    pushBtn.onclick = () => (!interval) && gameStartLoop();
}

gameOver = () => {
    if (immortalBird) return;
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