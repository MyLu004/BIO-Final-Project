// Updated script.js with colorful distractors and a practice round
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const result = document.getElementById("result");
const playerNameInput = document.getElementById("playerName");
const gameContainer = document.getElementById("gameContainer");

let startTime, endTime;
let round = 0;
const roundsPerLevel = 3;
const totalLevels = 4;
const totalRounds = roundsPerLevel * totalLevels; // 12 rounds total
let practice = false;  // flag for practice round

// To track reaction times for each level
let reactionTimesByLevel = { 0: [], 1: [], 2: [], 3: [] };

// Colors for the target box
const colors = ["#e74c3c", "#2ecc71", "#3498db", "#f1c40f", "#9b59b6"];
// Colors for distractors (semi-transparent)
const distractorColors = [
  "rgba(231, 76, 60, 0.6)",
  "rgba(46, 204, 113, 0.6)",
  "rgba(52, 152, 219, 0.6)",
  "rgba(241, 196, 15, 0.6)",
  "rgba(155, 89, 182, 0.6)"
];

let distractionInterval;
let distractors = [];
let targetJitterInterval = null;

// --- Distractor Functions ---
function startDistractors(num, intervalSpeed) {
  for (let i = 0; i < num; i++) {
    const distractor = document.createElement("div");
    distractor.classList.add("distractor");
    // assign a random color
    distractor.style.backgroundColor = distractorColors[
      Math.floor(Math.random() * distractorColors.length)
    ];
    gameContainer.appendChild(distractor);
    distractors.push(distractor);
  }
  distractionInterval = setInterval(() => {
    const rect = gameContainer.getBoundingClientRect();
    distractors.forEach(d => {
      const size = 30;
      d.style.left = Math.random() * (rect.width - size) + "px";
      d.style.top  = Math.random() * (rect.height - size) + "px";
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
    const rect = gameContainer.getBoundingClientRect();
    const boxSize = 100;
    let left = parseInt(gameArea.style.left) || 0;
    let top  = parseInt(gameArea.style.top)  || 0;
    const offsetX = Math.random() * 20 - 10;
    const offsetY = Math.random() * 20 - 10;
    let newLeft = Math.min(Math.max(0, left + offsetX), rect.width - boxSize);
    let newTop  = Math.min(Math.max(0, top  + offsetY), rect.height - boxSize);
    gameArea.style.left = newLeft + "px";
    gameArea.style.top  = newTop + "px";
  }, jitterInterval);
}

function stopTargetJittering() {
  clearInterval(targetJitterInterval);
}

// --- Round Control ---
function startRound() {
  const player = playerNameInput.value.trim();
  const currentLevel = Math.floor(round / roundsPerLevel);

  if (practice) {
    result.textContent = `Practice Round: Get ready, ${player}!`;
  } else {
    result.textContent = `Round ${round + 1} of ${totalRounds} (Level ${currentLevel})... Get ready, ${player}!`;
    // only run distractors/jitter on real rounds
    if (currentLevel === 1) {
      startDistractors(5, 800);
    } else if (currentLevel === 2) {
      startDistractors(10, 400);
      startTargetJittering(500);
    } else if (currentLevel === 3) {
      startDistractors(15, 200);
      startTargetJittering(300);
    }
  }

  gameArea.style.display = "none";
  const delay = Math.random() * 3000 + 2000;
  setTimeout(() => {
    const rect = gameContainer.getBoundingClientRect();
    const box = 100;
    gameArea.style.left = Math.random() * (rect.width - box) + "px";
    gameArea.style.top  = Math.random() * (rect.height - box) + "px";
    gameArea.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    gameArea.style.display = "block";
    startTime = Date.now();
  }, delay);
}

startBtn.addEventListener("click", () => {
  const player = playerNameInput.value.trim();
  if (!player) {
    alert("Please enter your name before starting.");
    return;
  }
  practice = true;
  round = 0;
  reactionTimesByLevel = { 0: [], 1: [], 2: [], 3: [] };
  startBtn.disabled = true;
  result.textContent = `Get ready for a practice round, ${player}!`;
  setTimeout(startRound, 500);
});

gameArea.addEventListener("click", () => {
  // stop any distractions/jitter
  stopDistractors();
  stopTargetJittering();
  if (!startTime) return;

  endTime = Date.now();
  const rt = endTime - startTime;

  if (practice) {
    result.textContent = `Practice reaction: ${rt} ms. Now starting real rounds...`;
    practice = false;
    setTimeout(startRound, 1500);
    return;
  }

  const level = Math.floor(round / roundsPerLevel);
  reactionTimesByLevel[level].push(rt);
  result.textContent = `Round ${round + 1} reaction: ${rt} ms`;
  gameArea.style.display = "none";
  startTime = null;
  round++;

  if (round < totalRounds) {
    setTimeout(startRound, 1500);
  } else {
    let out = `Results for ${playerNameInput.value.trim()}:\n`;
    for (let lvl = 0; lvl < totalLevels; lvl++) {
      const times = reactionTimesByLevel[lvl];
      const avg = times.reduce((a, b) => a + b, 0) / times.length;
      out += `Level ${lvl} avg: ${avg.toFixed(2)} ms\n`;
    }
    result.textContent = out;
    startBtn.disabled = false;
  }
});
