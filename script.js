const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const startSound = document.getElementById('startSound');
const eatSound = document.getElementById('eatSound');

const gridSize = 20;
let snake = [{ x: 10, y: 10 }];
let food = { x: 15, y: 15 };
let direction = '';
let score = 0;
let gameSpeed = 150;
let gameInterval;
let gamePaused = true;
let firstMove = true;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function update() {
    if (gamePaused) return;

    const head = { ...snake[0] };
    switch (direction) {
        case 'up':
            head.y -= 1;
            break;
        case 'down':
            head.y += 1;
            break;
        case 'left':
            head.x -= 1;
            break;
        case 'right':
            head.x += 1;
            break;
    }

    snake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = score;
        eatSound.play();
        food = generateFood();
        if (score % 5 === 0) {
            gameSpeed = Math.max(50, gameSpeed - 10);
            clearInterval(gameInterval);
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
        snake.pop();
    }

    if (checkCollision()) {
        clearInterval(gameInterval);
        alert('Game Over! Score: ' + score);
        resetGame();
    }
}

function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize))
        };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= canvas.width / gridSize || head.y < 0 || head.y >= canvas.height / gridSize) {
        return true;
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function resetGame() {
    snake = [{ x: 10, y: 10 }];
    food = generateFood();
    direction = '';
    score = 0;
    scoreDisplay.textContent = score;
    gameSpeed = 150;
    gamePaused = true;
    firstMove = true;
    clearInterval(gameInterval);
    draw();
}

function gameLoop() {
    update();
    draw();
}

document.addEventListener('keydown', (e) => {
    if (firstMove) {
        gamePaused = false;
        firstMove = false;
        startSound.play();
        direction = e.key.replace('Arrow', '').toLowerCase();
        if (!gameInterval) {
            gameInterval = setInterval(gameLoop, gameSpeed);
        }
    } else {
      switch (e.key) {
          case 'ArrowUp':
              if (direction !== 'down') direction = 'up';
              break;
          case 'ArrowDown':
              if (direction !== 'up') direction = 'down';
              break;
          case 'ArrowLeft':
              if (direction !== 'right') direction = 'left';
              break;
          case 'ArrowRight':
              if (direction !== 'left') direction = 'right';
              break;
      }
    }
});

draw();
