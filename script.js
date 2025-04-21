const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const result = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const container = document.querySelector('.container');

let startTime, endTime;
let round = 0;
let reactionTimes = [];

// Array of colors for the box
const colors = ["#e74c3c", "#2ecc71", "#3498db", "#f1c40f", "#9b59b6"];

function startRound() {
  const playerName = playerNameInput.value.trim();
  result.textContent = `Round ${round + 1} of 5... Get ready, ${playerName}!`;
  gameArea.style.display = "none";

  // Random delay between 2000 to 5000ms (2-5 seconds)
  const randomDelay = Math.floor(Math.random() * 3000) + 2000;

  setTimeout(() => {
    // Randomize position within container
    const containerRect = container.getBoundingClientRect();
    const boxSize = 100; // gameArea width and height defined in CSS
    const maxLeft = containerRect.width - boxSize;
    const maxTop = containerRect.height - boxSize;
    const randomLeft = Math.floor(Math.random() * maxLeft);
    const randomTop = Math.floor(Math.random() * maxTop);
    gameArea.style.left = randomLeft + "px";
    gameArea.style.top = randomTop + "px";

    // Randomize color from the colors array
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameArea.style.backgroundColor = randomColor;

    gameArea.style.display = "block";
    startTime = new Date().getTime();
  }, randomDelay);
}

startBtn.addEventListener("click", () => {
  const playerName = playerNameInput.value.trim();
  if (playerName === "") {
    alert("Please enter your name before starting.");
    return;
  }

  // Initialize variables
  round = 0;
  reactionTimes = [];
  startBtn.disabled = true;
  startRound();
});

gameArea.addEventListener("click", () => {
  if (!startTime) return; // Prevent accidental clicks before round starts

  endTime = new Date().getTime();
  const reactionTime = endTime - startTime;
  reactionTimes.push(reactionTime);
  result.textContent = `Round ${round + 1} reaction time: ${reactionTime} ms`;

  gameArea.style.display = "none";
  startTime = null;
  round++;

  if (round < 5) {
    setTimeout(startRound, 1500); // 1.5 second pause between rounds
  } else {
    const average = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    result.textContent += `\n${playerNameInput.value.trim()}'s average reaction time: ${average.toFixed(2)} ms`;
    startBtn.disabled = false;
  }
});
