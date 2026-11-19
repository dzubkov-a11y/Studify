let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

let form = document.getElementById('taskForm');
let input = document.getElementById('taskInput');
let daySelect = document.getElementById('daySelect');
let board = document.getElementById('board');

function showTasks() {
    board.innerHTML = '';
    let days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця", 'Субота', 'Неділя'];

    for (let i = 0; i < days.length; i++) {
        let currentDay = days[i];

        let column = document.createElement('div');
        column.className = 'day-column';
        column.innerHTML = '<h3>' + currentDay + '</h3>';

        let list = document.createElement('ul');
        list.className = 'task-list';

        for (let j = 0; j < tasks.length; j++) {
            let task = tasks[j];

            if (task.day === currentDay) {
                let li = document.createElement('li');
                li.className = 'task-item';
                li.innerHTML = '<span>' + task.text + '</span>';

                let deleteBtn = document.createElement('button');
                deleteBtn.textContent = '✕';
                deleteBtn.className = 'btn-delete';
                
                deleteBtn.onclick = function() {
                    deleteTask(task.id);
                };

                li.appendChild(deleteBtn);
                list.appendChild(li);
            }
        }

        column.appendChild(list);
        board.appendChild(column);
    }
}

form.onsubmit = function(event) {
    event.preventDefault();

    let newTask = {
        id: Date.now(),
        text: input.value,
        day: daySelect.value
    };

    tasks.push(newTask);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    input.value = '';
    showTasks();
};

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