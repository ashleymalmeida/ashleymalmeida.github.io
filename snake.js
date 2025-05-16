
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const TITLE_SIZE = 25;
const ROWS = 25;
const COLS = 25;
const WIDTH = TITLE_SIZE * COLS;
const HEIGHT = TITLE_SIZE * ROWS;

let snake = { x: 5 * TITLE_SIZE, y: 5 * TITLE_SIZE };
let food = randomTile();
let snakeBody = [];
let velocityX = 0;
let velocityY = 0;
let score = 0;
let gameOver = false;




function randomTile() {
  return {
    x: Math.floor(Math.random() * COLS) * TITLE_SIZE,
    y: Math.floor(Math.random() * ROWS) * TITLE_SIZE,
  };
}

function resetGame() {
  snake = { x: 5 * TITLE_SIZE, y: 5 * TITLE_SIZE };
  food = randomTile();
  snakeBody = [];
  velocityX = 0;
  velocityY = 0;
  score = 0;
  gameOver = false;
}

document.addEventListener("keydown", (e) => {
  const key = e.key;

  // Prevent scrolling with arrow keys
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(key)) {
    e.preventDefault();
  }

  if (gameOver && key.toLowerCase() === "r") {
    resetGame();
    return;
  }
  if (gameOver) return;

  if (key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
});


function move() {
  if (gameOver) return;

  let nextX = snake.x + velocityX * TITLE_SIZE;
  let nextY = snake.y + velocityY * TITLE_SIZE;

  if (
    nextX < 0 || nextX >= WIDTH ||
    nextY < 0 || nextY >= HEIGHT ||
    snakeBody.some(t => t.x === nextX && t.y === nextY)
  ) {
    gameOver = true;
    return;
  }

  snakeBody.unshift({ x: snake.x, y: snake.y });

  if (nextX === food.x && nextY === food.y) {
    food = randomTile();
    score += 1;
  } else {
    snakeBody.pop();
  }

  snake.x = nextX;
  snake.y = nextY;
}

function drawTile(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, TITLE_SIZE, TITLE_SIZE);
}
function drawGrid() {
  ctx.strokeStyle = "#444"; // Light grid line color
  ctx.lineWidth = 1;

  // Draw vertical lines
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * TITLE_SIZE, 0);
    ctx.lineTo(c * TITLE_SIZE, HEIGHT);
    ctx.stroke();
  }

  // Draw horizontal lines
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * TITLE_SIZE);
    ctx.lineTo(WIDTH, r * TITLE_SIZE);
    ctx.stroke();
  }
}



function draw() {
  move();

  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawGrid(); // ✅ Add the grid here

  drawTile(food.x, food.y, "red");
  drawTile(snake.x, snake.y, "plum");
  snakeBody.forEach(t => drawTile(t.x, t.y, "plum"));

  ctx.fillStyle = "white";
  ctx.font = "16px Courier New";

  if (gameOver) {
    ctx.fillText(`Game Over: ${score}`, WIDTH / 2 - 60, HEIGHT / 2 - 10);
    ctx.fillText("Press 'R' to Restart", WIDTH / 2 - 75, HEIGHT / 2 + 20);
  } else {
    ctx.fillText(`Score: ${score}`, 10, 20);
  }

  setTimeout(draw, 100);
}


draw();
