//board
let board;
let boardWidth = 360;
let boardHeight = 650;
let context;

//bird
let birdWidth = 34; //width/height ratio = 408228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;


let bird = {
    x: birdX,
    y: birdY,
    width: birdWidth,
    height: birdHeight
};

//pipes
let pipeArray = [];
let pipeWidth = 100; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;


//physics
let velocityX = -2; //pipes moving left speed
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = false;
let score = 0;



window.onload = function () {
    board = document.getElementById("board"); // lowercase
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
    

    //draw the flappy bird
    context.fillStyle = "green";
    context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdImg = new Image();
    birdImg.src = "./flappybird.png";
    birdImg.onload = function() {

    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    };

    topPipeImg = new Image();
    topPipeImg.src = "./pipe2.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./pipe3.png";


    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    document.addEventListener("keydown", moveBird);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, imit the bird.y to the top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height)
        gameOver = true;

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there is 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;

        }

    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth ) {
        pipeArray.shift(); //removes first element from the array

    }


    //score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score, 5, 45);


    if (gameOver) {
        if (gameOver) {
            // Game Over Text
            context.fillStyle = "red";
            context.font = "bold 50px 'Courier New', monospace";
            let gameOverText = "GAME OVER";
            let gameOverMetrics = context.measureText(gameOverText);
            let gameOverX = (board.width - gameOverMetrics.width) / 2;
            let gameOverY = board.height / 2;
            context.fillText(gameOverText, gameOverX, gameOverY);
        
            // Score Text (below Game Over)
            context.fillStyle = "black";
            context.font = "bold 30px Arial";
            let scoreText = "Score: " + Math.floor(score);
            let scoreMetrics = context.measureText(scoreText);
            let scoreX = (board.width - scoreMetrics.width) / 2;
            let scoreY = gameOverY + 40; // 40 pixels below "Game Over"
            context.fillText(scoreText, scoreX, scoreY);
        }
        
    }
    

}

function placePipes() {
    if (gameOver) {
        return;
    }


    //(0-1) * pipeHeight/2.
    //0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;


    let topPipe = {
        img : topPipeImg,
        x: pipeX,
        y: randomPipeY,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
   

    pipeArray.push(topPipe);


    let bottomPipe = {
        img: bottomPipeImg,
        x: pipeX,
        y: randomPipeY + pipeHeight + openingSpace,
        width: pipeWidth,
        height: pipeHeight,
        passed: false
    }
    pipeArray.push(bottomPipe);


}

function moveBird(e) {
    if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
        //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            score = 0;
            gameOver = false;

        }
    }
}


function detectCollision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}