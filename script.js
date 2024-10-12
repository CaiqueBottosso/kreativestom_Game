let character = document.getElementById("character");
let characterBottom = parseInt(
  window.getComputedStyle(character).getPropertyValue("bottom")
);
let characterRight = parseInt(
  window.getComputedStyle(character).getPropertyValue("right")
);
let characterWidth = parseInt(
  window.getComputedStyle(character).getPropertyValue("width")
);
let floor = document.getElementById("floor");
let floorBottom = parseInt(
  window.getComputedStyle(floor).getPropertyValue("bottom")
);
let floorHeight = parseInt(
  window.getComputedStyle(floor).getPropertyValue("height")
);
let allScreen = document.getElementById("game");
let isJumping = false;
let upTime;
let downTime;
let displayScore = document.getElementById("score");
let displayScoreObstacles = document.getElementById("scoreObstacles");
let score = 0;
let scoreObstacles = 0;

const arrayObstacles = [
  "./images/p-air.png",
  "./images/p-basket.png",
  "./images/p-cotton.png",
  "./images/p-earth.png",
  "./images/p-lava.png",
  "./images/p-meat.png",
  "./images/p-ocean.png",
  "./images/p-pink.png",
  "./images/p-sun.png",
  "./images/rock.png",
  "./images/ufo.png",
];

const arrayCharacters = [
  "./images/alien.png",
  "./images/alien2.png",
  "./images/astro1.png",
  "./images/astro2.png",
  "./images/astro3.png",
];

const arrayBackground = [
  "./images/bg1.jpg",
  "./images/bg2.jpg",
  "./images/bg3.jpg",
  "./images/bg4.jpg",
  "./images/bg5.jpg",
  "./images/bg6.jpg",
  "./images/bg7.jpg",
  "./images/bg8.jpg",
  "./images/bg9.jpg",
  "./images/bg10.png",
];

// Load sound effects
const jumpSound = new Audio("./audio/cartoon-jump.mp3");
const crashSound = new Audio("./audio/arcade-explosion.wav");
const bgm = new Audio('./audio/space-bgm.mp3');

function playJumpSound() {
  jumpSound.play();
}

function playCrashSound() {
  crashSound.play();
}

bgm.loop = true;
// bgm.volume = 0.5;

function startBGM() {
  bgm.play();
}

function stopBGM() {
  bgm.pause();
  bgm.currentTime = 0; // Reset the music to the start
}

const jump = () => {
  if (isJumping) {
    return;
  }
  upTime = setInterval(() => {
    if (characterBottom >= floorHeight + 250) {
      clearInterval(upTime);
      downTime = setInterval(() => {
        if (characterBottom <= floorHeight + 10) {
          clearInterval(downTime);
          isJumping = false;
        }
        characterBottom -= 10;
        character.style.bottom = characterBottom + "px";
        playJumpSound();
      }, 20);
    }
    characterBottom += 10;
    character.style.bottom = characterBottom + "px";
    isJumping = true;
  }, 20);
};

const showScore = () => {
  score++;
  displayScore.innerText = score;
};

const showScoreObstacles = () => {
  scoreObstacles++;
  displayScoreObstacles.innerText = scoreObstacles;
};

const generateObstacles = () => {
  let obstacles = document.querySelector(".obstacles");
  let obstacle = document.createElement("div");
  obstacle.setAttribute("class", "obstacle");
  obstacles.appendChild(obstacle);

  let randomTimeout = Math.floor(Math.random() * 1000) + 1000;
  let obstacleRight = -30;
  let obstacleBottom = 50; // lowered
  let obstacleWidth = Math.floor(Math.random() * (50 - 10 + 1) + 10);
  let obstacleHeight = Math.floor(Math.random() * 50) + 50;
  obstacle.style.backgroundImage = `url(${
    arrayObstacles[Math.floor(Math.random() * 11)]
  })`;
  obstacle.style.backgroundSize = "contain";
  obstacle.style.backgroundRepeat = "no-repeat";
  const moveObstacle = () => {
    obstacleRight += 5;
    obstacle.style.right = obstacleRight + "px";
    obstacle.style.bottom = obstacleBottom + "px";
    obstacle.style.width = obstacleWidth + "px";
    obstacle.style.height = obstacleHeight + "px";
    if (characterRight == obstacleRight - characterWidth - 10) {
      showScoreObstacles();
    }
    if (
      characterRight >= obstacleRight - characterWidth &&
      characterRight <= obstacleRight + obstacleWidth &&
      characterBottom <= obstacleBottom + obstacleHeight
    ) {
      stopBGM();
      playCrashSound();
      alert(
        `Crash Landing!\nYou've hit an obstacle, but the galaxy isn’t conquered in one try. 
Will you leap again to finish the mission?\n\nFinal Score: ` +
          score * scoreObstacles
      );
      clearInterval(obstacleInterval);
      clearTimeout(obstacleTimeout);
      location.reload();
    }
  };

  let obstacleInterval = setInterval(moveObstacle, 20);
  let obstacleTimeout = setTimeout(generateObstacles, randomTimeout);
};

const control = (e) => {
  if (e.key == "ArrowUp" || e.key == " ") {
    jump();
  }
};

const game = () => {
  allScreen.style.backgroundImage = `url(${
    arrayBackground[Math.floor(Math.random() * 9)]
  })`;
  character.style.backgroundImage = `url(${
    arrayCharacters[Math.floor(Math.random() * 5)]
  })`;
  alert(`Welcome to Cosmic Leap!\n\nEmbark on a cosmic journey through distant galaxies. 
With each jump, you're closer to bringing back the light to the universe. 
Gear up, the stars are waiting for you!`);
  setInterval(showScore, 100);
  generateObstacles();
  startBGM()
};

game();

document.addEventListener("keydown", control);
