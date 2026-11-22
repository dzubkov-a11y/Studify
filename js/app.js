let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

let taskForm = document.getElementById('taskForm');
let taskInput = document.getElementById('taskInput');
let daySelect = document.getElementById('daySelect');
let board = document.getElementById('board');
let boardSection = document.querySelector('.board-section');

let daysOrder = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя'];

function ensureWeekProgressUI() {
    if (!boardSection || document.getElementById('weekProgressWrap')) {
        return;
    }

    let wrap = document.createElement('div');
    wrap.id = 'weekProgressWrap';
    wrap.className = 'week-progress-wrap';
    wrap.innerHTML =
        '<div class="week-progress-meta">' +
            '<span id="weekProgressText">Виконано: 0 з 0 (0%)</span>' +
            '<span id="weekImportantText">Важливих: 0</span>' +
        '</div>' +
        '<div class="week-progress-track">' +
            '<div class="week-progress-fill" id="weekProgressFill"></div>' +
        '</div>';

    let hint = boardSection.querySelector('.section-hint');
    if (hint) {
        hint.insertAdjacentElement('afterend', wrap);
    } else {
        boardSection.insertBefore(wrap, board);
    }
}

function updateWeekProgress() {
    ensureWeekProgressUI();

    let total = tasks.length;
    let doneCount = 0;
    let importantCount = 0;

    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].done) {
            doneCount += 1;
        }
        if (tasks[i].important) {
            importantCount += 1;
        }
    }

    let percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

    let progressText = document.getElementById('weekProgressText');
    let importantText = document.getElementById('weekImportantText');
    let progressFill = document.getElementById('weekProgressFill');

    if (progressText) {
        progressText.textContent = 'Виконано: ' + doneCount + ' з ' + total + ' (' + percent + '%)';
    }
    if (importantText) {
        importantText.textContent = 'Важливих: ' + importantCount;
    }
    if (progressFill) {
        progressFill.style.width = percent + '%';
    }
}

function showTasks() {
    board.innerHTML = '';
    updateWeekProgress();

    for (let i = 0; i < daysOrder.length; i++) {
        let currentDay = daysOrder[i];

        let column = document.createElement('div');
        column.className = 'day-column';
        column.innerHTML = '<h3>' + currentDay + '</h3>';

        let list = document.createElement('ul');
        list.className = 'task-list';

        for (let j = 0; j < tasks.length; j++) {
            let item = tasks[j];

            if (item.day === currentDay) {
                let li = document.createElement('li');
                li.className = 'task-item';
                if (item.done) {
                    li.classList.add('done');
                }
                if (item.important) {
                    li.classList.add('is-important');
                }

                let span = document.createElement('span');
                span.className = 'task-title';
                span.textContent = (item.important ? '★ ' : '') + item.text;
                span.onclick = function() {
                    toggleTask(item.id);
                };

                let actions = document.createElement('div');
                actions.className = 'task-mini-actions';

                let starBtn = document.createElement('button');
                starBtn.type = 'button';
                starBtn.className = 'mini-icon-btn star-btn' + (item.important ? ' active' : '');
                starBtn.title = 'Позначити як важливе';
                starBtn.textContent = '★';
                starBtn.onclick = function() {
                    toggleImportant(item.id);
                };

                let prevDayBtn = document.createElement('button');
                prevDayBtn.type = 'button';
                prevDayBtn.className = 'mini-icon-btn move-btn';
                prevDayBtn.title = 'Перенести на попередній день';
                prevDayBtn.textContent = '←';
                prevDayBtn.onclick = function() {
                    moveToPrevDay(item.id);
                };

                let nextDayBtn = document.createElement('button');
                nextDayBtn.type = 'button';
                nextDayBtn.className = 'mini-icon-btn move-btn';
                nextDayBtn.title = 'Перенести на наступний день';
                nextDayBtn.textContent = '→';
                nextDayBtn.onclick = function() {
                    moveToNextDay(item.id);
                };

                let deleteBtn = document.createElement('button');
                deleteBtn.type = 'button';
                deleteBtn.textContent = '✕';
                deleteBtn.className = 'btn-delete';
                deleteBtn.title = 'Видалити завдання';
                deleteBtn.onclick = function() {
                    li.classList.add('removing');
                    setTimeout(function() {
                        deleteTask(item.id);
                    }, 250);
                };

                actions.appendChild(starBtn);
                actions.appendChild(prevDayBtn);
                actions.appendChild(nextDayBtn);
                actions.appendChild(deleteBtn);

                li.appendChild(span);
                li.appendChild(actions);
                list.appendChild(li);
            }
        }

        column.appendChild(list);
        board.appendChild(column);
    }
}

taskForm.onsubmit = function(event) {
    event.preventDefault();

    let newTask = {
        id: Date.now(),
        text: taskInput.value.trim(),
        day: daySelect.value,
        done: false,
        important: false
    };

    tasks.push(newTask);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    taskInput.value = '';
    showTasks();
};

function toggleTask(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].done = !tasks[i].done;
            break;
        }
    }
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    showTasks();
}

function toggleImportant(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            tasks[i].important = !tasks[i].important;
            break;
        }
    }
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    showTasks();
}

function moveToPrevDay(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            let idx = daysOrder.indexOf(tasks[i].day);
            let prevIdx = (idx - 1 + daysOrder.length) % daysOrder.length;
            tasks[i].day = daysOrder[prevIdx];
            tasks[i].done = false;
            break;
        }
    }
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    showTasks();
}

function moveToNextDay(id) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id === id) {
            let idx = daysOrder.indexOf(tasks[i].day);
            let nextIdx = (idx + 1) % daysOrder.length;
            tasks[i].day = daysOrder[nextIdx];
            tasks[i].done = false;
            break;
        }
    }
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    showTasks();
}

function deleteTask(id) {
    let updatedTasks = [];
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id !== id) {
            updatedTasks.push(tasks[i]);
        }
    }
    tasks = updatedTasks;
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    showTasks();
}

showTasks();