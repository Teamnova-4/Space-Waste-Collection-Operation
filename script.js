// script.js
const gameArea = document.getElementById("game-area");
const timeDisplay = document.getElementById("time");
const partsDisplay = document.getElementById("parts");
const debrisCountDisplay = document.getElementById("debris-count");
const debrisLimitDisplay = document.getElementById("debris-limit");
const messageBox = document.getElementById("message-box");
const messageText = document.getElementById("message-text");
const tutorialBox = document.getElementById("tutorial-box");
const gameoverBox = document.getElementById("gameover-box");
const gameoverMessage = document.getElementById("gameover-message");

const speedUpgradeCostDisplay = document.getElementById("speed-upgrade-cost");
const capacityUpgradeCostDisplay = document.getElementById(
  "capacity-upgrade-cost"
);
const newDroneCostDisplay = document.getElementById("new-drone-cost");

let gameInterval;
let timeLeft = 600; // 10 minutes in seconds
let parts = 0;
let debrisCount = 0;
let debrisLimit = 100;
let debrisSpawnInterval = 1000; // milliseconds
let drones = [];
let droneSpeedLevel = 1;
let droneCapacityLevel = 1;
let droneSpeedBase = 50; // pixels per second
let droneCapacityBase = 5; // debris count
let droneCount = 1;
let speedUpgradeCost = 10;
let capacityUpgradeCost = 15;
let newDroneCost = 20;
let gameStarted = false;

function initGame() {
  parts = 0;
  debrisCount = 0;
  timeLeft = 600;
  debrisSpawnInterval = 1000;
  drones = [];
  droneSpeedLevel = 1;
  droneCapacityLevel = 1;
  droneCount = 1;
  speedUpgradeCost = 10;
  capacityUpgradeCost = 15;
  newDroneCost = 20;

  speedUpgradeCostDisplay.innerText = speedUpgradeCost;
  capacityUpgradeCostDisplay.innerText = capacityUpgradeCost;
  newDroneCostDisplay.innerText = newDroneCost;
  debrisLimitDisplay.innerText = debrisLimit;

  partsDisplay.innerText = parts;
  debrisCountDisplay.innerText = debrisCount;
  timeDisplay.innerText = formatTime(timeLeft);
  gameoverBox.classList.add("hidden");
  messageBox.classList.add("hidden");
  tutorialBox.classList.remove("hidden");
  gameArea.innerHTML = ""; // Clear existing debris and drones
}

function startGame() {
  gameStarted = true;
  tutorialBox.classList.add("hidden");
  spawnDrone();
  startTimer();
  startDebrisSpawn();
  gameInterval = setInterval(gameLoop, 30); // Game loop runs every 30ms
}

function closeTutorialBox() {
  startGame();
}

function closeMessageBox() {
  messageBox.classList.add("hidden");
}

function formatTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft--;
    timeDisplay.innerText = formatTime(timeLeft);
    if (timeLeft <= 0) {
      gameOver();
    }
  }, 1000);
}

function startDebrisSpawn() {
  debrisInterval = setInterval(() => {
    if (gameStarted) {
      spawnDebris();
      if (debrisSpawnInterval > 200) {
        debrisSpawnInterval *= 0.99; // Gradually increase spawn rate
        clearInterval(debrisInterval);
        startDebrisSpawn(); // Restart interval with new speed
      }
    }
  }, debrisSpawnInterval);
}

function spawnDebris() {
  if (debrisCount < debrisLimit) {
    const debris = document.createElement("div");
    debris.classList.add("debris");
    debris.style.left = `${Math.random() * (gameArea.offsetWidth - 20)}px`;
    debris.style.top = `${Math.random() * (gameArea.offsetHeight - 20)}px`;
    gameArea.appendChild(debris);
    debrisCount++;
    debrisCountDisplay.innerText = debrisCount;

    debris.addEventListener("click", () => {
      if (gameStarted) {
        collectDebris(debris);
      }
    });
  }
}

function collectDebris(debrisElement) {
  gameArea.removeChild(debrisElement);
  debrisCount--;
  debrisCountDisplay.innerText = debrisCount;
  parts++;
  partsDisplay.innerText = parts;
}

function spawnDrone() {
  if (drones.length < droneCount) {
    const drone = document.createElement("div");
    drone.classList.add("drone");
    drone.innerText = "D";
    drone.dataset.capacity = droneCapacityBase * droneCapacityLevel;
    drone.dataset.currentCapacity = 0;
    drone.dataset.speed = droneSpeedBase * droneSpeedLevel;
    drone.dataset.targetDebris = null;
    drone.style.left = `${gameArea.offsetWidth / 2}px`;
    drone.style.top = `${gameArea.offsetHeight / 2}px`;
    gameArea.appendChild(drone);
    drones.push(drone);
  }
}

function upgradeDroneSpeed() {
  if (parts >= speedUpgradeCost) {
    parts -= speedUpgradeCost;
    partsDisplay.innerText = parts;
    droneSpeedLevel++;
    speedUpgradeCost = Math.ceil(speedUpgradeCost * 1.5); // Increase cost
    speedUpgradeCostDisplay.innerText = speedUpgradeCost;
    drones.forEach(
      (drone) => (drone.dataset.speed = droneSpeedBase * droneSpeedLevel)
    );
    showMessage("드론 속도 업그레이드 완료!");
  } else {
    showMessage("부품이 부족합니다!");
  }
}

function upgradeDroneCapacity() {
  if (parts >= capacityUpgradeCost) {
    parts -= capacityUpgradeCost;
    partsDisplay.innerText = parts;
    droneCapacityLevel++;
    capacityUpgradeCost = Math.ceil(capacityUpgradeCost * 1.5); // Increase cost
    capacityUpgradeCostDisplay.innerText = capacityUpgradeCost;
    drones.forEach(
      (drone) =>
        (drone.dataset.capacity = droneCapacityBase * droneCapacityLevel)
    );
    showMessage("드론 저장 용량 업그레이드 완료!");
  } else {
    showMessage("부품이 부족합니다!");
  }
}

function buyNewDrone() {
  if (parts >= newDroneCost) {
    parts -= newDroneCost;
    partsDisplay.innerText = parts;
    droneCount++;
    newDroneCost = Math.ceil(newDroneCost * 1.7); // Increase cost
    newDroneCostDisplay.innerText = newDroneCost;
    spawnDrone();
    showMessage("새로운 드론 구매 완료!");
  } else {
    showMessage("부품이 부족합니다!");
  }
}

function showMessage(text) {
  messageText.innerText = text;
  messageBox.classList.remove("hidden");
}

function gameLoop() {
  if (!gameStarted) return;

  drones.forEach((drone) => {
    if (!drone.dataset.targetDebris) {
      // Find nearest debris
      let nearestDebris = null;
      let minDistance = Infinity;
      const debrisList = Array.from(gameArea.querySelectorAll(".debris")); // Convert to array
      debrisList.forEach((debris) => {
        const distance = calculateDistance(drone, debris);
        if (distance < minDistance) {
          minDistance = distance;
          nearestDebris = debris;
        }
      });
      drone.dataset.targetDebris = nearestDebris ? nearestDebris : null;
    }

    if (drone.dataset.targetDebris) {
      moveToDebris(drone);
    }
  });

  if (debrisCount >= debrisLimit) {
    gameOver();
  }
}

function calculateDistance(drone, debris) {
  const dx = debris.offsetLeft - drone.offsetLeft;
  const dy = debris.offsetTop - drone.offsetTop;
  return Math.sqrt(dx * dx + dy * dy);
}

function moveToDebris(drone) {
  const targetDebris = drone.dataset.targetDebris;
  if (!targetDebris || !targetDebris.parentNode) {
    // Target debris removed
    drone.dataset.targetDebris = null;
    return;
  }

  const speed = parseInt(drone.dataset.speed) / 30; // Speed per frame (30fps)
  const dx = targetDebris.offsetLeft - drone.offsetLeft;
  const dy = targetDebris.offsetTop - drone.offsetTop;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance < 5) {
    // Arrived at debris
    collectDebrisByDrone(drone, targetDebris);
    drone.dataset.targetDebris = null;
  } else {
    const moveX = (dx / distance) * speed;
    const moveY = (dy / distance) * speed;
    drone.style.left = `${drone.offsetLeft + moveX}px`;
    drone.style.top = `${drone.offsetTop + moveY}px`;
  }
}

function collectDebrisByDrone(drone, debrisElement) {
  gameArea.removeChild(debrisElement);
  debrisCount--;
  debrisCountDisplay.innerText = debrisCount;
  let currentCapacity = parseInt(drone.dataset.currentCapacity);
  let capacity = parseInt(drone.dataset.capacity);
  drone.dataset.currentCapacity = currentCapacity + 1;
  parts++;
  partsDisplay.innerText = parts;

  if (
    parseInt(drone.dataset.currentCapacity) >= parseInt(drone.dataset.capacity)
  ) {
    drone.dataset.currentCapacity = 0; // Reset capacity after collecting max
  }
}

function gameOver() {
  gameStarted = false;
  clearInterval(gameInterval);
  clearInterval(timerInterval);
  clearInterval(debrisInterval);
  gameoverBox.classList.remove("hidden");
  if (timeLeft <= 0 && debrisCount < debrisLimit) {
    gameoverMessage.innerText =
      "시간 초과! 하지만 폐기물 제한량 이하로 유지 성공! 당신은 우주 청소 전문가입니다!";
  } else if (debrisCount >= debrisLimit) {
    gameoverMessage.innerText =
      "게임 오버! 폐기물 제한 초과! 우주가 쓰레기로 뒤덮였습니다!";
  } else {
    gameoverMessage.innerText = "게임 오버!"; // Fallback message
  }
}

function restartGame() {
  initGame();
  startGame();
}

initGame(); // Initialize game when page loads
