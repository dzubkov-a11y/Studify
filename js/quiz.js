let questions = JSON.parse(localStorage.getItem('myQuizQuestions')) || [];

let quizForm = document.getElementById('quizForm');
let quizSubject = document.getElementById('quizSubject');
let quizQuestion = document.getElementById('quizQuestion');
let optInputs = [
    document.getElementById('opt0'),
    document.getElementById('opt1'),
    document.getElementById('opt2'),
    document.getElementById('opt3')
];
let correctOption = document.getElementById('correctOption');
let quizList = document.getElementById('quizList');
let quizScoreBox = document.getElementById('quizScoreBox');
let resetQuizBtn = document.getElementById('resetQuizBtn');
let quizActions = document.querySelector('.quiz-actions');

let onlyMistakesMode = false;
let explanationInput = null;

function ensureQuizExtraControls() {
    if (quizForm && !document.getElementById('quizExplanation')) {
        let inp = document.createElement('input');
        inp.type = 'text';
        inp.id = 'quizExplanation';
        inp.placeholder = 'Коротке пояснення правильної відповіді (необов’язково)...';
        let submitBtn = quizForm.querySelector('button[type="submit"]');
        if (submitBtn) {
            quizForm.insertBefore(inp, submitBtn);
        } else {
            quizForm.appendChild(inp);
        }
        explanationInput = inp;
    }

    if (quizActions && !document.getElementById('mistakesOnlyBtn')) {
        let btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'mistakesOnlyBtn';
        btn.className = 'secondary-btn';
        btn.textContent = 'Лише помилки';
        btn.onclick = function() {
            onlyMistakesMode = !onlyMistakesMode;
            btn.classList.toggle('active', onlyMistakesMode);
            renderQuiz();
        };
        quizActions.insertBefore(btn, resetQuizBtn);
    }
}

ensureQuizExtraControls();

function renderQuiz() {
    quizList.innerHTML = '';

    let answeredCount = 0;
    let rightCount = 0;

    for (let i = 0; i < questions.length; i++) {
        if (questions[i].picked !== null && questions[i].picked !== undefined) {
            answeredCount += 1;
            if (questions[i].picked === questions[i].correct) {
                rightCount += 1;
            }
        }
    }

    let accuracy = answeredCount > 0 ? Math.round((rightCount / answeredCount) * 100) : 0;

    quizScoreBox.textContent =
        'Правильних відповідей: ' + rightCount +
        ' з ' + answeredCount +
        ' (всього питань: ' + questions.length + ') · Точність: ' + accuracy + '%';

    let visibleQuestions = [];
    for (let i = 0; i < questions.length; i++) {
        let q = questions[i];
        let isMistake = (q.picked !== null && q.picked !== undefined && q.picked !== q.correct);
        if (!onlyMistakesMode || isMistake) {
            visibleQuestions.push({ q: q, index: i });
        }
    }

    if (visibleQuestions.length === 0) {
        let msg = onlyMistakesMode
            ? 'Помилок немає — так тримати!'
            : 'Додай перше питання зверху, щоб пройти самоперевірку.';
        quizList.innerHTML = '<p class="empty-filter-msg">' + msg + '</p>';
        return;
    }

    for (let k = 0; k < visibleQuestions.length; k++) {
        let q = visibleQuestions[k].q;
        let idx = visibleQuestions[k].index;

        let card = document.createElement('div');
        card.className = 'quiz-card';

        let topRow = document.createElement('div');
        topRow.className = 'quiz-card-top';

        let subjBadge = document.createElement('span');
        subjBadge.className = 'flashcard-subject';
        subjBadge.textContent = q.subject;

        let deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = function() {
            card.classList.add('removing');
            setTimeout(function() {
                deleteQuestion(q.id);
            }, 220);
        };

        topRow.appendChild(subjBadge);
        topRow.appendChild(deleteBtn);

        let title = document.createElement('h3');
        title.className = 'quiz-question-text';
        title.textContent = (idx + 1) + '. ' + q.question;

        let optionsBox = document.createElement('div');
        optionsBox.className = 'quiz-options-list';

        let hasPicked = (q.picked !== null && q.picked !== undefined);

        for (let j = 0; j < q.options.length; j++) {
            let optBtn = document.createElement('button');
            optBtn.type = 'button';
            optBtn.className = 'quiz-option-btn';
            optBtn.textContent = q.options[j];

            if (hasPicked) {
                if (j === q.correct) {
                    optBtn.classList.add('is-correct');
                }
                if (j === q.picked && q.picked !== q.correct) {
                    optBtn.classList.add('is-wrong');
                }
            }

            optBtn.onclick = function() {
                pickAnswer(q.id, j);
            };

            optionsBox.appendChild(optBtn);
        }

        card.appendChild(topRow);
        card.appendChild(title);
        card.appendChild(optionsBox);

        if (hasPicked) {
            let feedback = document.createElement('p');
            feedback.className = 'quiz-feedback';
            if (q.picked === q.correct) {
                feedback.classList.add('ok');
                feedback.textContent = 'Правильно! Обрано вірний варіант.';
            } else {
                feedback.classList.add('err');
                feedback.textContent = 'Невірно. Правильна відповідь: ' + q.options[q.correct];
            }
            card.appendChild(feedback);

            if (q.explanation) {
                let exp = document.createElement('p');
                exp.className = 'quiz-explanation';
                exp.textContent = 'Пояснення: ' + q.explanation;
                card.appendChild(exp);
            }
        }

        quizList.appendChild(card);
    }
}

quizForm.onsubmit = function(event) {
    event.preventDefault();

    let newQuestion = {
        id: Date.now(),
        subject: quizSubject.value,
        question: quizQuestion.value.trim(),
        options: [
            optInputs[0].value.trim(),
            optInputs[1].value.trim(),
            optInputs[2].value.trim(),
            optInputs[3].value.trim()
        ],
        correct: Number(correctOption.value),
        explanation: explanationInput ? explanationInput.value.trim() : '',
        picked: null
    };

    questions.push(newQuestion);
    localStorage.setItem('myQuizQuestions', JSON.stringify(questions));

    quizQuestion.value = '';
    if (explanationInput) {
        explanationInput.value = '';
    }
    for (let i = 0; i < optInputs.length; i++) {
        optInputs[i].value = '';
    }
    correctOption.value = '0';

    renderQuiz();
};

function pickAnswer(questionId, optionIndex) {
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].id === questionId) {
            questions[i].picked = optionIndex;
            break;
        }
    }
    localStorage.setItem('myQuizQuestions', JSON.stringify(questions));
    renderQuiz();
}

function deleteQuestion(questionId) {
    let updated = [];
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].id !== questionId) {
            updated.push(questions[i]);
        }
    }
    questions = updated;
    localStorage.setItem('myQuizQuestions', JSON.stringify(questions));
    renderQuiz();
}

if (resetQuizBtn) {
    resetQuizBtn.onclick = function() {
        for (let i = 0; i < questions.length; i++) {
            questions[i].picked = null;
        }
        localStorage.setItem('myQuizQuestions', JSON.stringify(questions));
        renderQuiz();
    };
}

renderQuiz();