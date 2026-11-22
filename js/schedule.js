let lessons = JSON.parse(localStorage.getItem('myLessons')) || [];

let lessonForm = document.getElementById('lessonForm');
let lessonDay = document.getElementById('lessonDay');
let lessonNum = document.getElementById('lessonNum');
let lessonSubject = document.getElementById('lessonSubject');
let lessonRoom = document.getElementById('lessonRoom');
let lessonsBoard = document.getElementById('lessonsBoard');
let bellsSection = document.querySelector('.task-form-section');

let bellSchedule = [
    { num: 1, start: '08:30', end: '09:15' },
    { num: 2, start: '09:25', end: '10:10' },
    { num: 3, start: '10:30', end: '11:15' },
    { num: 4, start: '11:35', end: '12:20' },
    { num: 5, start: '12:30', end: '13:15' },
    { num: 6, start: '13:25', end: '14:10' },
    { num: 7, start: '14:20', end: '15:05' }
];

function timeToMinutes(hhmm) {
    let parts = hhmm.split(':');
    return Number(parts[0]) * 60 + Number(parts[1]);
}

function renderLiveBellBanner() {
    if (!bellsSection) {
        return;
    }

    let banner = document.getElementById('liveBellBanner');
    if (!banner) {
        banner = document.createElement('div');
        banner.id = 'liveBellBanner';
        banner.className = 'live-bell-banner';
        bellsSection.appendChild(banner);
    }

    let now = new Date();
    let curMins = now.getHours() * 60 + now.getMinutes();
    let dayOfWeek = now.getDay();

    if (dayOfWeek === 0 || dayOfWeek === 6) {
        banner.textContent = 'Сьогодні вихідний — уроків за дзвінками немає.';
        return;
    }

    for (let i = 0; i < bellSchedule.length; i++) {
        let b = bellSchedule[i];
        let s = timeToMinutes(b.start);
        let e = timeToMinutes(b.end);

        if (curMins >= s && curMins < e) {
            banner.textContent = 'Зараз триває ' + b.num + ' урок (' + b.start + '–' + b.end + ') · До кінця: ' + (e - curMins) + ' хв';
            return;
        }

        if (curMins < s) {
            banner.textContent = 'Наступний ' + b.num + ' урок о ' + b.start + ' · До дзвінка: ' + (s - curMins) + ' хв';
            return;
        }
    }

    banner.textContent = 'Усі уроки за розкладом дзвінків на сьогодні завершилися.';
}

function getTodayUkrainianDay() {
    let dayIndex = new Date().getDay();
    let map = {
        1: 'Понеділок',
        2: 'Вівторок',
        3: 'Середа',
        4: 'Четвер',
        5: "П'ятниця"
    };
    return map[dayIndex] || '';
}

function showLessons() {
    lessonsBoard.innerHTML = '';
    renderLiveBellBanner();

    let days = ['Понеділок', 'Вівторок', 'Середа', 'Четвер', "П'ятниця"];
    let todayName = getTodayUkrainianDay();

    for (let i = 0; i < days.length; i++) {
        let currentDay = days[i];
        let isToday = (currentDay === todayName);

        let column = document.createElement('div');
        column.className = 'day-column';
        if (isToday) {
            column.classList.add('today-column');
        }

        let headingText = isToday ? currentDay + ' · Сьогодні' : currentDay;
        column.innerHTML = '<h3>' + headingText + '</h3>';

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
setInterval(renderLiveBellBanner, 30000);