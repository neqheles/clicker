let score = 0;
let clicksPerSecond = 0;
let autoClickers = 0;
let megaClickers = 0;
let ultraClickers = 0;

const costs = {
    upgrade1: 10,
    upgrade2: 50,
    upgrade3: 200
};

const scoreElement = document.getElementById('score');
const cpsElement = document.getElementById('cps');
const avatar = document.getElementById('avatar');
const clickEffect = document.getElementById('clickEffect');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

let isPlaying = false;
let clickTimes = [];

// Музыка
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicBtn.classList.remove('playing');
    } else {
        bgMusic.play();
        musicBtn.classList.add('playing');
    }
    isPlaying = !isPlaying;
});

// Клик по аватарке
avatar.addEventListener('click', (e) => {
    score++;
    updateScore();

    // Анимация аватарки
    avatar.classList.remove('clicked');
    void avatar.offsetWidth; // Trigger reflow
    avatar.classList.add('clicked');

    // Эффект +1
    createClickEffect(e.clientX, e.clientY);

    // Обновление CPS
    const now = Date.now();
    clickTimes.push(now);
    clickTimes = clickTimes.filter(time => now - time < 1000);
});

function createClickEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'click-number';
    effect.textContent = '+1';
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    document.body.appendChild(effect);

    setTimeout(() => {
        effect.remove();
    }, 1000);
}

function updateScore() {
    scoreElement.textContent = Math.floor(score);
    updateUpgrades();
}

function updateCPS() {
    const manualCPS = clickTimes.length;
    const autoCPS = autoClickers + (megaClickers * 5) + (ultraClickers * 20);
    clicksPerSecond = manualCPS + autoCPS;
    cpsElement.textContent = clicksPerSecond;
}

function updateUpgrades() {
    updateUpgrade('upgrade1', costs.upgrade1);
    updateUpgrade('upgrade2', costs.upgrade2);
    updateUpgrade('upgrade3', costs.upgrade3);
}

function updateUpgrade(id, cost) {
    const upgrade = document.getElementById(id);
    if (score >= cost) {
        upgrade.classList.remove('disabled');
    } else {
        upgrade.classList.add('disabled');
    }
}

// Улучшения
document.getElementById('upgrade1').addEventListener('click', () => {
    if (score >= costs.upgrade1) {
        score -= costs.upgrade1;
        autoClickers++;
        costs.upgrade1 = Math.floor(costs.upgrade1 * 1.5);
        document.getElementById('cost1').textContent = costs.upgrade1;
        updateScore();
    }
});

document.getElementById('upgrade2').addEventListener('click', () => {
    if (score >= costs.upgrade2) {
        score -= costs.upgrade2;
        megaClickers++;
        costs.upgrade2 = Math.floor(costs.upgrade2 * 1.5);
        document.getElementById('cost2').textContent = costs.upgrade2;
        updateScore();
    }
});

document.getElementById('upgrade3').addEventListener('click', () => {
    if (score >= costs.upgrade3) {
        score -= costs.upgrade3;
        ultraClickers++;
        costs.upgrade3 = Math.floor(costs.upgrade3 * 1.5);
        document.getElementById('cost3').textContent = costs.upgrade3;
        updateScore();
    }
});

// Автоклики
setInterval(() => {
    const autoScore = (autoClickers + (megaClickers * 5) + (ultraClickers * 20)) / 10;
    if (autoScore > 0) {
        score += autoScore;
        updateScore();
    }
}, 100);

// Обновление CPS
setInterval(() => {
    updateCPS();
}, 100);

// Очистка старых кликов
setInterval(() => {
    const now = Date.now();
    clickTimes = clickTimes.filter(time => now - time < 1000);
}, 100);

// Инициализация
updateScore();