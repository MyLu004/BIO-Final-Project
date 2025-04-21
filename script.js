const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const result = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const container = document.querySelector('.container');

let startTime, endTime;
let round = 0;
const roundsPerLevel = 3;
const totalRounds = roundsPerLevel * 3; // 9 rounds total

// Reaction time data split by distraction level (0, 1, and 2)
let reactionTimesByLevel = { 0: [], 1: [], 2: [] };

// Colors for the target box (randomly chosen each round)
const colors = ["#e74c3c", "#2ecc71", "#3498db", "#f1c40f", "#9b59b6"];

// Variables for distraction mode
let distractionInterval; // Holds the interval timer for moving distractors
let distractors = [];    // Array to hold distractor elements

// Function to start distractions based on the current level
function startDistractions(level) {
  let numDistractors;
  let intervalSpeed;
  
  // Define parameters based on level:
  // Level 1: Low distraction → 5 distractors, move every 800ms
  // Level 2: High distraction → 10 distractors, move every 400ms
  if (level === 1) {
    numDistractors = 5;
    intervalSpeed = 800;
  } else if (level === 2) {
    numDistractors = 10;
    intervalSpeed = 400;
  } else {
    // Level 0: no distraction
    return;
  }
  
  // Create distractor elements and add them to the container
  for (let i = 0; i < numDistractors; i++) {
    const distractor = document.createElement("div");
    distractor.classList.add("distractor");
    container.appendChild(distractor);
    distractors.push(distractor);
  }
  
  // Move distractors to new random positions at the specified interval speed
  distractionInterval = setInterval(() => {
    distractors.forEach(d => {
      const containerRect = container.getBoundingClientRect();
      const size = 30; // Size defined in CSS for distractors
      const maxLeft = containerRect.width - size;
      const maxTop = containerRect.height - size;
      const randomLeft = Math.floor(Math.random() * maxLeft);
      const randomTop = Math.floor(Math.random() * maxTop);
      d.style.left = randomLeft + "px";
      d.style.top = randomTop + "px";
    });
  }, intervalSpeed);
}

// Function to remove distractors when the round is over
function stopDistractions() {
  clearInterval(distractionInterval);
  distractors.forEach(d => {
    if (d.parentNode) {
      d.parentNode.removeChild(d);
    }
  });
  distractors = [];
}

// Function to start a new round
function startRound() {
  const playerName = playerNameInput.value.trim();
  // Determine current level based on round count:
  // Rounds 0-2: Level 0, 3-5: Level 1, 6-8: Level 2
  const currentLevel = Math.floor(round / roundsPerLevel);
  
  result.textContent = `Round ${round + 1} of ${totalRounds} (Level ${currentLevel})... Get ready, ${playerName}!`;
  gameArea.style.display = "none";
  
  // If the current level includes distractions, start them
  if (currentLevel > 0) {
    startDistractions(currentLevel);
  }
  
  // Random delay between 2000 and 5000 ms
  const randomDelay = Math.floor(Math.random() * 3000) + 2000;
  
  setTimeout(() => {
    // Randomize position for the target box within the container
    const containerRect = container.getBoundingClientRect();
    const boxSize = 100; // Target box size (as defined in CSS)
    const maxLeft = containerRect.width - boxSize;
    const maxTop = containerRect.height - boxSize;
    const randomLeft = Math.floor(Math.random() * maxLeft);
    const randomTop = Math.floor(Math.random() * maxTop);
    gameArea.style.left = randomLeft + "px";
    gameArea.style.top = randomTop + "px";
    
    // Randomize the target color
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
  
  // Reset variables at the start of the game
  round = 0;
  reactionTimesByLevel = { 0: [], 1: [], 2: [] };
  startBtn.disabled = true;
  result.textContent = `Good luck, ${playerName}!`;
  startRound();
});

gameArea.addEventListener("click", () => {
  // If we started any distractors this round, remove them when the target is clicked
  stopDistractions();
  
  if (!startTime) return; // Ignore accidental clicks before target appears
  
  endTime = new Date().getTime();
  const reactionTime = endTime - startTime;
  
  // Determine current distraction level from the round number
  const currentLevel = Math.floor(round / roundsPerLevel);
  
  // Record the reaction time under the current level
  reactionTimesByLevel[currentLevel].push(reactionTime);
  
  result.textContent = `Round ${round + 1} reaction time: ${reactionTime} ms`;
  gameArea.style.display = "none";
  startTime = null;
  round++;
  
  if (round < totalRounds) {
    // Pause briefly between rounds
    setTimeout(startRound, 1500);
  } else {
    // Calculate and display averages for each level
    let output = "";
    for (let level = 0; level < 3; level++) {
      const times = reactionTimesByLevel[level];
      const average = times.reduce((a, b) => a + b, 0) / times.length;
      output += `Level ${level} average: ${average.toFixed(2)} ms\n`;
    }
    result.textContent = `Results for ${playerNameInput.value.trim()}:\n` + output;
    startBtn.disabled = false;
  }
});
