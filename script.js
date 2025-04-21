const playerNameInput = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const result = document.getElementById("result");

let startTime, endTime;
let round = 0;
let reactionTimes = [];

function startRound() {
  result.textContent = `Round ${round + 1} of 5... Get ready!`;
  gameArea.style.display = "none";
  gameArea.style.backgroundColor = "lightgray";

  const randomDelay = Math.floor(Math.random() * 3000) + 2000; // 2-5 seconds

  setTimeout(() => {
    gameArea.style.display = "block";
    gameArea.style.backgroundColor = "green";
    startTime = new Date().getTime();
  }, randomDelay);
}

startBtn.addEventListener("click", () => {
    const playerName = playerNameInput.value.trim();
  
    if (playerName === "") {
      alert("Please enter your name before starting.");
      return;
    }
  
    round = 0;
    reactionTimes = [];
    startBtn.disabled = true;
    result.textContent = `Good luck, ${playerName}!`;
    startRound();
  });
  

gameArea.addEventListener("click", () => {
  if (!startTime) return; // ignore accidental click
  endTime = new Date().getTime();
  const reactionTime = endTime - startTime;
  reactionTimes.push(reactionTime);
  result.textContent = `Round ${round + 1} reaction time: ${reactionTime} ms`;
  gameArea.style.display = "none";
  startTime = null;
  round++;

  if (round < 5) {
    setTimeout(startRound, 1500); // short pause between rounds
  } else {
    const average =
      reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    result.textContent += `\n${playerNameInput.value.trim()}'s average reaction time: ${average.toFixed(2)} ms`;

    
  }
});
