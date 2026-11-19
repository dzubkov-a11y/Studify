let grades = JSON.parse(localStorage.getItem('myGrades')) || [];

let calcForm = document.getElementById('calcForm');
let subjectInput = document.getElementById('subjectInput');
let gradeInput = document.getElementById('gradeInput');
let gradesBoard = document.getElementById('gradesBoard');
let resultBox = document.getElementById('resultBox');

function updateGrades() {
    gradesBoard.innerHTML = '';

    if (grades.length === 0) {
        resultBox.textContent = 'Середній бал: 0';
        gradesBoard.innerHTML = '<p style="color: #94a3b8;">Поки немає доданих оцінок.</p>';
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
            deleteGrade(item.id);
        };

        li.appendChild(deleteBtn);
        list.appendChild(li);
    }

    let average = (sum / grades.length).toFixed(2);
    resultBox.textContent = 'Середній бал: ' + average;
    gradesBoard.appendChild(list);
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