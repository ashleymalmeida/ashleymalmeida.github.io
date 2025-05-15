// Base tile size for reference
const BASE_TITLE_SIZE = 25;

// Variables for rows and columns (keep same)
const ROWS = 25;
const COLS = 25;

let canvas, ctx;
let TITLE_SIZE;
let WIDTH, HEIGHT;

let snake;
let food;
let snakeBody;
let velocityX;
let velocityY;
let score;
let gameOver;

window.onload = () => {
  canvas = document.getElementById("gameCanvas");
  ctx = canvas.getContext("2d");

  // Initialize sizes and start game
  setupCanvasSize();
  resetGame();

  window.addEventListener("resize", () => {
    setupCanvasSize();
    resetGame();
  });

  document.addEventListener("keydown", handleKeyDown);

  draw();
};

function setupCanvasSize() {
  // Calculate tile size based on viewport width, max 25 tiles wide
  // We'll fit the canvas width to 90% viewport width max 600px
  const maxWidth = Math.min(window.innerWidth * 0.9, 600);
  TITLE_SIZE = Math.floor(maxWidth / COLS);
  WIDTH = TITLE_SIZE * COLS;
  HEIGHT = TITLE_SIZE * ROWS;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;
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

function randomTile() {
  return {
    x: Math.floor(Math.random() * COLS) * TITLE_SIZE,
    y: Math.floor(Math.random() * ROWS) * TITLE_SIZE,
  };
}

function handleKeyDown(e) {
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
}

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

  drawGrid();

  drawTile(food.x, food.y, "red");
  drawTile(snake.x, snake.y, "plum");
  snakeBody.forEach(t => drawTile(t.x, t.y, "plum"));

  ctx.fillStyle = "white";
  ctx.font = `${Math.floor(TITLE_SIZE * 0.6)}px Courier New`;
  ctx.textAlign = "left";

  if (gameOver) {
    ctx.textAlign = "center";
    ctx.fillText(`Game Over: ${score}`, WIDTH / 2, HEIGHT / 2 - TITLE_SIZE);
    ctx.fillText("Press 'R' to Restart", WIDTH / 2, HEIGHT / 2 + TITLE_SIZE);
  } else {
    ctx.fillText(`Score: ${score}`, 10, 20);
  }

  setTimeout(draw, 100);
}
