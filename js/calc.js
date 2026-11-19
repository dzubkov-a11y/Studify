let grades = JSON.parse(localStorage.getItem('myGrades')) || [];

let calcForm = document.getElementById('calcForm');
let subjectInput = document.getElementById('subjectInput');
let gradeInput = document.getElementById('gradeInput');
let gradesBoard = document.getElementById('gradesBoard');
let resultBox = document.getElementById('resultBox');
let statsChart = document.getElementById('statsChart');

function animateResult() {
    resultBox.classList.add('bump');
    setTimeout(function() {
        resultBox.classList.remove('bump');
    }, 250);
}

function showStats() {
    statsChart.innerHTML = '';

    if (grades.length === 0) {
        statsChart.innerHTML = '<p class="empty-stats">Додай оцінки, щоб побачити діаграму.</p>';
        return;
    }

    let subjects = [];
    let sums = [];
    let counts = [];

    for (let i = 0; i < grades.length; i++) {
        let subj = grades[i].subject;
        let val = Number(grades[i].grade);
        let foundIndex = -1;

        for (let j = 0; j < subjects.length; j++) {
            if (subjects[j] === subj) {
                foundIndex = j;
                break;
            }
        }

        if (foundIndex === -1) {
            subjects.push(subj);
            sums.push(val);
            counts.push(1);
        } else {
            sums[foundIndex] += val;
            counts[foundIndex] += 1;
        }
    }

    for (let i = 0; i < subjects.length; i++) {
        let avg = sums[i] / counts[i];
        let percent = Math.round((avg / 12) * 100);
        if (percent < 8) {
            percent = 8;
        }

        let col = document.createElement('div');
        col.className = 'bar-col';

        let valueLabel = document.createElement('span');
        valueLabel.className = 'bar-value';
        valueLabel.textContent = avg.toFixed(1);

        let track = document.createElement('div');
        track.className = 'bar-track';

        let fill = document.createElement('div');
        fill.className = 'bar-fill';
        fill.style.height = '0%';

        track.appendChild(fill);

        let nameLabel = document.createElement('span');
        nameLabel.className = 'bar-label';
        nameLabel.textContent = subjects[i];

        col.appendChild(valueLabel);
        col.appendChild(track);
        col.appendChild(nameLabel);
        statsChart.appendChild(col);

        setTimeout(function() {
            fill.style.height = percent + '%';
        }, 40 + i * 60);
    }
}

function updateGrades() {
    gradesBoard.innerHTML = '';

    if (grades.length === 0) {
        resultBox.textContent = 'Середній бал: 0';
        gradesBoard.innerHTML = '<p style="color: #94a3b8;">Поки немає доданих оцінок.</p>';
        showStats();
        return;
    }

    let sum = 0;
    let list = document.createElement('ul');
    list.className = 'task-list';

    for (let i = 0; i < grades.length; i++) {
        let item = grades[i];
        sum += Number(item.grade);

        let li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = '<span>' + item.subject + '<strong>' + item.grade + '</strong></span>';

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'btn-delete';
        deleteBtn.onclick = function() {
            li.classList.add('removing');
            setTimeout(function() {
                deleteGrade(item.id);
            }, 220);
        };

        li.appendChild(deleteBtn);
        list.appendChild(li);
    }

    let average = (sum / grades.length).toFixed(2);
    resultBox.textContent = 'Середній бал: ' + average;
    animateResult();
    gradesBoard.appendChild(list);
    showStats();
}

calcForm.onsubmit = function(event) {
    event.preventDefault();

    let newGrade = {
        id: Date.now(),
        subject: subjectInput.value,
        grade: Number(gradeInput.value)
    };

    grades.push(newGrade);
    localStorage.setItem('myGrades', JSON.stringify(grades));
    subjectInput.value = '';
    gradeInput.value = '';
    updateGrades();
};

function deleteGrade(id) {
    let updatedGrades = [];
    for (let i = 0; i < grades.length; i++) {
        if (grades[i].id !== id) {
            updatedGrades.push(grades[i]);
        }
    }
    grades = updatedGrades;
    localStorage.setItem('myGrades', JSON.stringify(grades));
    updateGrades();
}

updateGrades();