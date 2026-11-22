let startBtn = document.getElementById('startBreathBtn');
let circle = document.getElementById('breathingCircle');
let text = document.getElementById('breathingText');
let cyclesCounter = document.getElementById('cyclesCounter');
let paceButtons = document.querySelectorAll('.pace-btn');
let relaxCard = document.querySelector('.relax-card');

let selectedPace = '4-2-4';
let completedCycles = 0;
let isRunning = false;
let timers = [];

let pomoMode = 'focus';
let pomoSecondsLeft = 25 * 60;
let pomoInterval = null;

function initPomodoroBox() {
    if (!relaxCard || document.getElementById('pomodoroBox')) {
        return;
    }

    let box = document.createElement('div');
    box.id = 'pomodoroBox';
    box.className = 'pomodoro-box';
    box.innerHTML =
        '<h3>Фокус-таймер Pomodoro</h3>' +
        '<div class="pomo-modes">' +
            '<button type="button" class="pace-btn active" id="pomoFocusBtn">Фокус (25 хв)</button>' +
            '<button type="button" class="pace-btn" id="pomoBreakBtn">Перерва (5 хв)</button>' +
        '</div>' +
        '<div class="pomo-display" id="pomoDisplay">25:00</div>' +
        '<div class="pomo-controls">' +
            '<button type="button" class="secondary-btn" id="pomoToggleBtn">Старт</button>' +
            '<button type="button" class="secondary-btn" id="pomoResetBtn">Скинути</button>' +
        '</div>';

    relaxCard.appendChild(box);

    let focusBtn = document.getElementById('pomoFocusBtn');
    let breakBtn = document.getElementById('pomoBreakBtn');
    let toggleBtn = document.getElementById('pomoToggleBtn');
    let resetBtn = document.getElementById('pomoResetBtn');

    focusBtn.onclick = function() {
        setPomoMode('focus', 25 * 60);
        focusBtn.classList.add('active');
        breakBtn.classList.remove('active');
    };

    breakBtn.onclick = function() {
        setPomoMode('break', 5 * 60);
        breakBtn.classList.add('active');
        focusBtn.classList.remove('active');
    };

    toggleBtn.onclick = function() {
        if (pomoInterval) {
            clearInterval(pomoInterval);
            pomoInterval = null;
            toggleBtn.textContent = 'Продовжити';
        } else {
            toggleBtn.textContent = 'Пауза';
            pomoInterval = setInterval(function() {
                if (pomoSecondsLeft > 0) {
                    pomoSecondsLeft -= 1;
                    renderPomoTime();
                } else {
                    clearInterval(pomoInterval);
                    pomoInterval = null;
                    toggleBtn.textContent = 'Старт';
                    if (pomoMode === 'focus') {
                        setPomoMode('break', 5 * 60);
                        breakBtn.classList.add('active');
                        focusBtn.classList.remove('active');
                    } else {
                        setPomoMode('focus', 25 * 60);
                        focusBtn.classList.add('active');
                        breakBtn.classList.remove('active');
                    }
                }
            }, 1000);
        }
    };

    resetBtn.onclick = function() {
        if (pomoInterval) {
            clearInterval(pomoInterval);
            pomoInterval = null;
        }
        document.getElementById('pomoToggleBtn').textContent = 'Старт';
        pomoSecondsLeft = (pomoMode === 'focus' ? 25 : 5) * 60;
        renderPomoTime();
    };

    renderPomoTime();
}

function setPomoMode(mode, seconds) {
    if (pomoInterval) {
        clearInterval(pomoInterval);
        pomoInterval = null;
    }
    pomoMode = mode;
    pomoSecondsLeft = seconds;
    let toggleBtn = document.getElementById('pomoToggleBtn');
    if (toggleBtn) {
        toggleBtn.textContent = 'Старт';
    }
    renderPomoTime();
}

function renderPomoTime() {
    let display = document.getElementById('pomoDisplay');
    if (!display) {
        return;
    }
    let mins = Math.floor(pomoSecondsLeft / 60);
    let secs = pomoSecondsLeft % 60;
    let mStr = mins < 10 ? '0' + mins : String(mins);
    let sStr = secs < 10 ? '0' + secs : String(secs);
    display.textContent = mStr + ':' + sStr;
}

function getPaceSeconds() {
    if (selectedPace === '4-4-6') {
        return { inhale: 4000, hold: 4000, exhale: 6000 };
    }
    return { inhale: 4000, hold: 2000, exhale: 4000 };
}

for (let i = 0; i < paceButtons.length; i++) {
    paceButtons[i].onclick = function() {
        if (isRunning) {
            return;
        }
        selectedPace = this.getAttribute('data-pace');
        for (let j = 0; j < paceButtons.length; j++) {
            paceButtons[j].classList.remove('active');
        }
        this.classList.add('active');
    };
}

function stopBreathExercise() {
    isRunning = false;
    for (let i = 0; i < timers.length; i++) {
        clearTimeout(timers[i]);
    }
    timers = [];
    circle.className = 'breathing-circle';
    text.textContent = 'Натисни старт';
    startBtn.textContent = 'Почати вправу';
    for (let i = 0; i < paceButtons.length; i++) {
        paceButtons[i].disabled = false;
    }
}

function runBreathCycle() {
    let pace = getPaceSeconds();

    text.textContent = 'Вдих...';
    circle.className = 'breathing-circle inhale';

    let t1 = setTimeout(function() {
        if (!isRunning) {
            return;
        }
        text.textContent = 'Затримка';

        let t2 = setTimeout(function() {
            if (!isRunning) {
                return;
            }
            text.textContent = 'Видих...';
            circle.className = 'breathing-circle exhale';

            let t3 = setTimeout(function() {
                if (!isRunning) {
                    return;
                }
                completedCycles += 1;
                if (cyclesCounter) {
                    cyclesCounter.textContent = 'Завершено циклів: ' + completedCycles;
                }
                runBreathCycle();
            }, pace.exhale);

            timers.push(t3);
        }, pace.hold);

        timers.push(t2);
    }, pace.inhale);

    timers.push(t1);
}

startBtn.onclick = function() {
    if (isRunning) {
        stopBreathExercise();
        return;
    }
    isRunning = true;
    startBtn.textContent = 'Зупинити';
    for (let i = 0; i < paceButtons.length; i++) {
        paceButtons[i].disabled = true;
    }
    runBreathCycle();
};

initPomodoroBox();