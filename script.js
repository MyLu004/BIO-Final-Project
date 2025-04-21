const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const result = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const gameContainer = document.getElementById("gameContainer");

let startTime, endTime;
let round = 0;
<<<<<<< Updated upstream
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
=======
const roundsPerLevel = 3;
const totalLevels = 4;
const totalRounds = roundsPerLevel * totalLevels; // 12 rounds total

// To track reaction times for each level
let reactionTimesByLevel = { 0: [], 1: [], 2: [], 3: [] };

// Colors for the target box
const colors = ["#e74c3c", "#2ecc71", "#3498db", "#f1c40f", "#9b59b6"];

// Variables for distractors and target jittering
let distractionInterval;
let distractors = [];
let targetJitterInterval = null;

// --- Distractor Functions ---

function startDistractors(num, intervalSpeed) {
  // Create 'num' distractor elements
  for (let i = 0; i < num; i++) {
    const distractor = document.createElement("div");
    distractor.classList.add("distractor");
    gameContainer.appendChild(distractor);
    distractors.push(distractor);
  }
  // Move distractors to random positions at the given interval
  distractionInterval = setInterval(() => {
    distractors.forEach(d => {
      const containerRect = gameContainer.getBoundingClientRect();
      const size = 30; // width/height of distractors (from CSS)
      const maxLeft = containerRect.width - size;
      const maxTop = containerRect.height - size;
      const randomLeft = Math.floor(Math.random() * maxLeft);
      const randomTop = Math.floor(Math.random() * maxTop);
      d.style.left = randomLeft + "px";
      d.style.top = randomTop + "px";
    });
  }, intervalSpeed);
}

function stopDistractors() {
  clearInterval(distractionInterval);
  distractors.forEach(d => d.remove());
  distractors = [];
}

// --- Target Jitter Functions ---

function startTargetJittering(jitterInterval) {
  targetJitterInterval = setInterval(() => {
    // Get current position
    let left = parseInt(gameArea.style.left) || 0;
    let top = parseInt(gameArea.style.top) || 0;
    // Small random offset
    const offsetX = Math.floor(Math.random() * 21) - 10; // -10 to +10 pixels
    const offsetY = Math.floor(Math.random() * 21) - 10;
    let newLeft = left + offsetX;
    let newTop = top + offsetY;
    // Ensure the target stays inside the game area
    const containerRect = gameContainer.getBoundingClientRect();
    const boxSize = 100;
    newLeft = Math.max(0, Math.min(newLeft, containerRect.width - boxSize));
    newTop = Math.max(0, Math.min(newTop, containerRect.height - boxSize));
    gameArea.style.left = newLeft + "px";
    gameArea.style.top = newTop + "px";
  }, jitterInterval);
}

function stopTargetJittering() {
  clearInterval(targetJitterInterval);
}

// --- Round Control Function ---

function startRound() {
  const playerName = playerNameInput.value.trim();
  // Determine the current level based on the round number (0-indexed)
  const currentLevel = Math.floor(round / roundsPerLevel);
  result.textContent = `Round ${round + 1} of ${totalRounds} (Level ${currentLevel})... Get ready, ${playerName}!`;
  gameArea.style.display = "none";

  // --- Configure distractions based on level ---
  // Level 0: No distractors, target is still.
  // Level 1: 5 distractors, moderate speed, target remains still.
  // Level 2: 10 distractors, faster, plus target jitter every 500ms.
  // Level 3: 15 distractors, very fast, plus target jitter every 300ms.
  if (currentLevel === 1) {
    startDistractors(5, 800);
  } else if (currentLevel === 2) {
    startDistractors(10, 400);
    startTargetJittering(500);
  } else if (currentLevel === 3) {
    startDistractors(15, 200);
    startTargetJittering(300);
  }
  // For Level 0, we do nothing (no distractions)

  // Random delay (2-5 seconds) before showing the target
  const randomDelay = Math.floor(Math.random() * 3000) + 2000;
  setTimeout(() => {
    // Randomize target box position within the gameContainer
    const containerRect = gameContainer.getBoundingClientRect();
    const boxSize = 100;
>>>>>>> Stashed changes
    const maxLeft = containerRect.width - boxSize;
    const maxTop = containerRect.height - boxSize;
    const randomLeft = Math.floor(Math.random() * maxLeft);
    const randomTop = Math.floor(Math.random() * maxTop);
    gameArea.style.left = randomLeft + "px";
    gameArea.style.top = randomTop + "px";

<<<<<<< Updated upstream
    // Randomize color from the colors array
=======
    // Random target color
>>>>>>> Stashed changes
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    gameArea.style.backgroundColor = randomColor;

    gameArea.style.display = "block";
    startTime = new Date().getTime();
  }, randomDelay);
}

// --- Event Listeners ---

startBtn.addEventListener("click", () => {
  const playerName = playerNameInput.value.trim();
  if (playerName === "") {
    alert("Please enter your name before starting.");
    return;
  }
<<<<<<< Updated upstream

  // Initialize variables
  round = 0;
  reactionTimes = [];
=======
  // Reset variables for a new session
  round = 0;
  reactionTimesByLevel = { 0: [], 1: [], 2: [], 3: [] };
>>>>>>> Stashed changes
  startBtn.disabled = true;
  startRound();
});

gameArea.addEventListener("click", () => {
<<<<<<< Updated upstream
  if (!startTime) return; // Prevent accidental clicks before round starts

  endTime = new Date().getTime();
  const reactionTime = endTime - startTime;
  reactionTimes.push(reactionTime);
=======
  // When the target is clicked, stop any distractions and jittering
  stopDistractors();
  stopTargetJittering();

  if (!startTime) return; // Prevent accidental clicks

  endTime = new Date().getTime();
  const reactionTime = endTime - startTime;
  const currentLevel = Math.floor(round / roundsPerLevel);
  reactionTimesByLevel[currentLevel].push(reactionTime);
>>>>>>> Stashed changes
  result.textContent = `Round ${round + 1} reaction time: ${reactionTime} ms`;

  gameArea.style.display = "none";
  startTime = null;
  round++;

<<<<<<< Updated upstream
  if (round < 5) {
    setTimeout(startRound, 1500); // 1.5 second pause between rounds
  } else {
    const average = reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length;
    result.textContent += `\n${playerNameInput.value.trim()}'s average reaction time: ${average.toFixed(2)} ms`;
=======
  if (round < totalRounds) {
    setTimeout(startRound, 1500); // Brief pause between rounds
  } else {
    // Calculate and show averages per level at the end
    let output = `Results for ${playerNameInput.value.trim()}:\n`;
    for (let level = 0; level < totalLevels; level++) {
      const times = reactionTimesByLevel[level];
      const average = times.reduce((a, b) => a + b, 0) / times.length;
      output += `Level ${level} average: ${average.toFixed(2)} ms\n`;
    }
    result.textContent = output;
>>>>>>> Stashed changes
    startBtn.disabled = false;
  }
});
