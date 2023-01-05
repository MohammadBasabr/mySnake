var context;
var canvas;
var score = 0;
var bestscore = 0;
var grid = 16;
var count = 0;
var music = new Audio("./sound/story.mp3");
var musicPicked = new Audio("./sound/Picked3.mp3");
var mutebtn = document.getElementById("btnmute");
//
//
//
function enableMute() {
  if (music.muted) {
    music.muted = false;
    mutebtn.setAttribute("src", "./image/Mute_Icon.svg");
  } else {
    music.muted = true;
    mutebtn.setAttribute("src", "./image/Speaker_Icon.svg");
  }
}
//
//
//
function windowload() {
  canvas = document.getElementById("cvs");
  canvas.setAttribute("tabindex", "0");
  canvas.focus();
  context = canvas.getContext("2d");
  
  // arrow keys to control the snake
  document.addEventListener("keydown", function (e) {
    //   console.log(e.key);
    var code = e.key;
    // left arrow key
    if (code === "ArrowLeft" && snake.dx === 0) {
      snake.dx = -grid;
      snake.dy = 0;
    }
    // up arrow key
    else if (code === "ArrowUp" && snake.dy === 0) {
      snake.dy = -grid;
      snake.dx = 0;
    }
    // right arrow key
    else if (code === "ArrowRight" && snake.dx === 0) {
      snake.dx = grid;
      snake.dy = 0;
    }
    // down arrow key
    else if (code === "ArrowDown" && snake.dy === 0) {
      snake.dy = grid;
      snake.dx = 0;
    }
  });
  window.requestAnimationFrame(loop);
  music.play();
}
//
//
// return a random integer between [min, max)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
//
//
//
function showScore(score) {
  document.getElementById("score").innerHTML = score;
}
//
//
//
function showBestScore(score) {
  document.getElementById("bestscore").innerHTML = score;
}
//
//
// reset the game
function resetGame() {
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = grid;
  snake.dy = 0;
  score = 0;
  showScore(score);
  apple.x = getRandomInt(0, 25) * grid;
  apple.y = getRandomInt(0, 25) * grid;
}
//
//
//
function loop() {
  requestAnimationFrame(loop);

  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0 || snake.x >= canvas.width) {
    resetGame();
    return;
  }

  if (snake.y < 0 || snake.y >= canvas.height) {
    resetGame();
    return;
  }

  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({ x: snake.x, y: snake.y });

  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  // draw apple
  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, grid - 1, grid - 1);

  // draw snake one cell at a time
  context.fillStyle = "green";
  snake.cells.forEach(function (cell, index) {
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid - 1, grid - 1);

    // snake ate apple
    if (cell.x === apple.x && cell.y === apple.y) {
      musicPicked.play();
      snake.maxCells++;
      // canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
      
      score++;
      bestscore = Math.max(bestscore, score);
      showBestScore(bestscore);
      showScore(score);
    }

    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i += 1) {
      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        resetGame();
        return;
      }
    }
  });
}
//
//
//
var snake = {
  x: 160,
  y: 160,

  // snake directin offsets
  dx: grid,
  dy: 0,

  // snake body
  cells: [],

  // snake body length, grows when eats an apple
  maxCells: 4,
};
//
//
//
var apple = {
  x: 320,
  y: 320,
};
// window.addEventListener("keydown", this.check, false);
// function check(e) {
//   var code = e.keyCode;
//   //Up arrow pressed
//   if (code == 37) alert("You pressed the Left arrow key");
//   else if (code == 38) alert("You pressed the Up arrow key");
//   else if (code == 39) alert("You pressed the Right arrow key");
//   else if (code == 40) alert("You pressed the Down arrow key");
// }
