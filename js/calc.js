let grades = JSON.parse(localStorage.getItem('myGrades')) || [];
let savedTarget = localStorage.getItem('studifyTargetScore') || '';

let calcForm = document.getElementById('calcForm');
let subjectInput = document.getElementById('subjectInput');
let gradeInput = document.getElementById('gradeInput');
let resultBox = document.getElementById('resultBox');
let gradesBoard = document.getElementById('gradesBoard');
let statsChart = document.getElementById('statsChart');
let targetScoreInput = document.getElementById('targetScoreInput');
let targetStatus = document.getElementById('targetStatus');

let weightSelect = null;

function ensureWeightSelector() {
    if (!calcForm || document.getElementById('weightInput')) {
        weightSelect = document.getElementById('weightInput');
        return;
    }

    let sel = document.createElement('select');
    sel.id = 'weightInput';
    sel.innerHTML =
        '<option value="1">Вага: Звичайна (1x)</option>' +
        '<option value="2">Вага: Контрольна / Проєкт (2x)</option>';

    let submitBtn = calcForm.querySelector('button[type="submit"]');
    if (submitBtn) {
        calcForm.insertBefore(sel, submitBtn);
    } else {
        calcForm.appendChild(sel);
    }
    weightSelect = sel;
}

function getSelectedTarget() {
    if (!targetScoreInput || targetScoreInput.value === '') {
        return NaN;
    }
    let val = parseFloat(targetScoreInput.value);
    if (isNaN(val) || val < 1 || val > 12) {
        return NaN;
    }
    return val;
}

function getWeightedAverage() {
    if (grades.length === 0) {
        return 0;
    }
    let weightedSum = 0;
    let totalWeight = 0;
    for (let i = 0; i < grades.length; i++) {
        let val = Number(grades[i].grade);
        let w = grades[i].weight ? Number(grades[i].weight) : 1;
        weightedSum += val * w;
        totalWeight += w;
    }
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
}

if (targetScoreInput && savedTarget !== '') {
    let hasOption = false;
    for (let i = 0; i < targetScoreInput.options.length; i++) {
        if (targetScoreInput.options[i].value === savedTarget) {
            hasOption = true;
            break;
        }
    }
    if (hasOption) {
        targetScoreInput.value = savedTarget;
    }
}

ensureWeightSelector();

function updateCalc(shouldBump) {
    gradesBoard.innerHTML = '';

    if (grades.length === 0) {
        resultBox.textContent = 'Середній бал: 0';
        updateTargetHint(0, getSelectedTarget());
        renderStatsChart();
        return;
    }

    let list = document.createElement('ul');
    list.className = 'task-list';

    for (let i = 0; i < grades.length; i++) {
        let item = grades[i];
        let val = Number(item.grade);
        let w = item.weight ? Number(item.weight) : 1;

        let li = document.createElement('li');
        li.className = 'task-item';

        let textSpan = document.createElement('span');
        let weightBadge = w > 1 ? ' <small class="lesson-room">2x КР</small>' : '';
        textSpan.innerHTML = item.subject + ': <strong>' + val + '</strong>' + weightBadge;

        let deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'btn-delete';
        deleteBtn.onclick = function() {
            li.classList.add('removing');
            setTimeout(function() {
                deleteGrade(item.id);
            }, 250);
        };

        li.appendChild(textSpan);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    }

    gradesBoard.appendChild(list);

    let avg = getWeightedAverage();
    let roundedAvg = Math.round(avg * 100) / 100;
    resultBox.textContent = 'Середній бал: ' + roundedAvg;

    updateTargetHint(avg, getSelectedTarget());

    if (shouldBump) {
        resultBox.classList.remove('bump');
        void resultBox.offsetWidth;
        resultBox.classList.add('bump');
    }

    renderStatsChart();
}

function updateTargetHint(currentAvg, targetVal) {
    if (!targetStatus) {
        return;
    }

    if (isNaN(targetVal)) {
        targetStatus.textContent = 'Обери цільовий бал від 1 до 12 для підказки.';
        return;
    }

    if (grades.length === 0) {
        targetStatus.textContent = 'Додай першу оцінку, щоб розрахувати шлях до цілі ' + targetVal + '.';
        return;
    }

    let roundedAvg = Math.round(currentAvg * 100) / 100;
    let diff = Math.round((targetVal - roundedAvg) * 100) / 100;

    if (diff <= 0) {
        targetStatus.textContent = 'Ціль досягнута! Поточний середній бал (' + roundedAvg + ') вищий або дорівнює ' + targetVal + '.';
    } else {
        targetStatus.textContent = 'До цілі ' + targetVal + ' не вистачає ' + diff + ' бала.';
    }
}

function renderStatsChart() {
    if (!statsChart) {
        return;
    }

    statsChart.innerHTML = '';

    if (grades.length === 0) {
        statsChart.innerHTML = '<p class="empty-stats">Додай оцінки, щоб побачити стовпчикову діаграму за предметами.</p>';
        return;
    }

    let subjectMap = {};
    let subjectOrder = [];

    for (let i = 0; i < grades.length; i++) {
        let subj = grades[i].subject;
        let val = Number(grades[i].grade);
        let w = grades[i].weight ? Number(grades[i].weight) : 1;

        if (!subjectMap[subj]) {
            subjectMap[subj] = { weightedSum: 0, weightTotal: 0 };
            subjectOrder.push(subj);
        }

        subjectMap[subj].weightedSum += val * w;
        subjectMap[subj].weightTotal += w;
    }

    let bestSubj = null;
    let worstSubj = null;

    for (let i = 0; i < subjectOrder.length; i++) {
        let subj = subjectOrder[i];
        let avgSubj = subjectMap[subj].weightedSum / subjectMap[subj].weightTotal;
        let roundedSubj = Math.round(avgSubj * 10) / 10;

        if (!bestSubj || avgSubj > bestSubj.val) {
            bestSubj = { name: subj, val: roundedSubj };
        }
        if (!worstSubj || avgSubj < worstSubj.val) {
            worstSubj = { name: subj, val: roundedSubj };
        }

        let heightPercent = Math.max(6, Math.min(100, (avgSubj / 12) * 100));

        let col = document.createElement('div');
        col.className = 'bar-col';

        let valueEl = document.createElement('span');
        valueEl.className = 'bar-value';
        valueEl.textContent = roundedSubj;

        let track = document.createElement('div');
        track.className = 'bar-track';

        let fill = document.createElement('div');
        fill.className = 'bar-fill';

        track.appendChild(fill);

        let label = document.createElement('span');
        label.className = 'bar-label';
        label.textContent = subj;

        col.appendChild(valueEl);
        col.appendChild(track);
        col.appendChild(label);
        statsChart.appendChild(col);

        requestAnimationFrame(function() {
            requestAnimationFrame(function() {
                fill.style.height = heightPercent + '%';
            });
        });
    }

    if (bestSubj && worstSubj && subjectOrder.length > 1) {
        let summary = document.createElement('div');
        summary.className = 'chart-highlights';
        summary.textContent = 'Найвищий середній: ' + bestSubj.name + ' (' + bestSubj.val + ') · Найнижчий: ' + worstSubj.name + ' (' + worstSubj.val + ')';
        statsChart.parentNode.appendChild(summary);
    }
}

calcForm.onsubmit = function(event) {
    event.preventDefault();

    let oldSummary = document.querySelector('.chart-highlights');
    if (oldSummary) {
        oldSummary.remove();
    }

    let newGrade = {
        id: Date.now(),
        subject: subjectInput.value,
        grade: Number(gradeInput.value),
        weight: weightSelect ? Number(weightSelect.value) : 1
    };

    grades.push(newGrade);
    localStorage.setItem('myGrades', JSON.stringify(grades));
    gradeInput.value = '';
    updateCalc(true);
};

if (targetScoreInput) {
    targetScoreInput.onchange = function() {
        localStorage.setItem('studifyTargetScore', targetScoreInput.value);
        updateTargetHint(getWeightedAverage(), getSelectedTarget());
    };
}

function deleteGrade(id) {
    let oldSummary = document.querySelector('.chart-highlights');
    if (oldSummary) {
        oldSummary.remove();
    }

    let updatedGrades = [];
    for (let i = 0; i < grades.length; i++) {
        if (grades[i].id !== id) {
            updatedGrades.push(grades[i]);
        }
    }
    grades = updatedGrades;
    localStorage.setItem('myGrades', JSON.stringify(grades));
    updateCalc(false);
}

updateCalc(false);