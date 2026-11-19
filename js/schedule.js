let lessons = JSON.parse(localStorage.getItem('myLessons')) || [];

let lessonForm = document.getElementById('lessonForm');
let lessonDay = document.getElementById('lessonDay');
let lessonNum = document.getElementById('lessonNum');
let lessonSubject = document.getElementById('lessonSubject');
let lessonRoom = document.getElementById('lessonRoom');
let lessonsBoard = document.getElementById('lessonsBoard');

function showLessons() {
    lessonsBoard.innerHTML = '';
    let days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця"];

    for (let i = 0; i < days.length; i++) {
        let currentDay = days[i];

        let column = document.createElement('div');
        column.className = 'day-column';
        column.innerHTML = '<h3>' + currentDay + '</h3>';

        let dayLessons = [];
        for (let j = 0; j < lessons.length; j++) {
            if (lessons[j].day === currentDay) {
                dayLessons.push(lessons[j]);
            }
        }

        dayLessons.sort(function(a, b) {
            return a.num - b.num;
        });

        let list = document.createElement('ul');
        list.className = 'task-list';

        if (dayLessons.length === 0) {
            list.innerHTML = '<li class="empty-lesson">Уроків поки немає</li>';
        }

        for (let k = 0; k < dayLessons.length; k++) {
            let item = dayLessons[k];

            let li = document.createElement('li');
            li.className = 'task-item lesson-item';

            let info = document.createElement('div');
            info.className = 'lesson-info';

            let numBadge = '<span class="lesson-num">' + item.num + '</span>';
            let roomText = item.room ? '<small class="lesson-room">' + item.room + '</small>' : '';

            info.innerHTML = numBadge + '<span>' + item.subject + '</span>' + roomText;

            let deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.textContent = '✕';
            deleteBtn.className = 'btn-delete';
            deleteBtn.onclick = function() {
                li.classList.add('removing');
                setTimeout(function() {
                    deleteLesson(item.id);
                }, 220);
            };

            li.appendChild(info);
            li.appendChild(deleteBtn);
            list.appendChild(li);
        }

        column.appendChild(list);
        lessonsBoard.appendChild(column);
    }
}

lessonForm.onsubmit = function(event) {
    event.preventDefault();

    let newLesson = {
        id: Date.now(),
        day: lessonDay.value,
        num: Number(lessonNum.value),
        subject: lessonSubject.value,
        room: lessonRoom.value.trim()
    };

    lessons.push(newLesson);
    localStorage.setItem('myLessons', JSON.stringify(lessons));
    lessonSubject.value = '';
    lessonRoom.value = '';
    showLessons();
};

function deleteLesson(id) {
    let updated = [];
    for (let i = 0; i < lessons.length; i++) {
        if (lessons[i].id !== id) {
            updated.push(lessons[i]);
        }
    }
    lessons = updated;
    localStorage.setItem('myLessons', JSON.stringify(lessons));
    showLessons();
}

showLessons();