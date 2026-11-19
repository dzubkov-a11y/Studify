let flashcards = JSON.parse(localStorage.getItem('myFlashcards')) || [];

let flashcardForm = document.getElementById('flashcardForm');
let cardSubject = document.getElementById('cardSubject');
let cardFront = document.getElementById('cardFront');
let cardBack = document.getElementById('cardBack');
let flashcardsGrid = document.getElementById('flashcardsGrid');
let flashcardsStats = document.getElementById('flashcardsStats');

function updateFlashcards() {
    flashcardsGrid.innerHTML = '';

    let knownCount = 0;
    let repeatCount = 0;
    for (let i = 0; i < flashcards.length; i++) {
        if (flashcards[i].status === 'known') {
            knownCount += 1;
        } else if (flashcards[i].status === 'repeat') {
            repeatCount += 1;
        }
    }

    flashcardsStats.textContent =
        'Всього: ' + flashcards.length +
        ' · Знаю: ' + knownCount +
        ' · Повторити: ' + repeatCount;

    if (flashcards.length === 0) {
        flashcardsGrid.innerHTML = '<p class="habit-empty">Додай першу картку — натисни на неї, щоб перевернути.</p>';
        return;
    }

    for (let i = 0; i < flashcards.length; i++) {
        let cardData = flashcards[i];

        let wrapper = document.createElement('div');
        wrapper.className = 'flashcard-item';
        if (cardData.status) {
            wrapper.classList.add('status-' + cardData.status);
        }

        let scene = document.createElement('div');
        scene.className = 'flashcard-scene';
        scene.onclick = function() {
            scene.classList.toggle('is-flipped');
        };

        let inner = document.createElement('div');
        inner.className = 'flashcard-inner';

        let frontFace = document.createElement('div');
        frontFace.className = 'flashcard-face flashcard-front';
        frontFace.innerHTML =
            '<span class="flashcard-subject">' + cardData.subject + '</span>' +
            '<p class="flashcard-text">' + cardData.front + '</p>' +
            '<span class="flashcard-hint">Клікни, щоб перевернути</span>';

        let backFace = document.createElement('div');
        backFace.className = 'flashcard-face flashcard-back';
        backFace.innerHTML =
            '<span class="flashcard-subject">' + cardData.subject + ' · Відповідь</span>' +
            '<p class="flashcard-text">' + cardData.back + '</p>' +
            '<span class="flashcard-hint">Клікни, щоб повернути</span>';

        inner.appendChild(frontFace);
        inner.appendChild(backFace);
        scene.appendChild(inner);

        let actions = document.createElement('div');
        actions.className = 'flashcard-actions';

        let repeatBtn = document.createElement('button');
        repeatBtn.type = 'button';
        repeatBtn.className = 'card-status-btn repeat';
        if (cardData.status === 'repeat') {
            repeatBtn.classList.add('active');
        }
        repeatBtn.textContent = 'Повторити';
        repeatBtn.onclick = function() {
            setCardStatus(cardData.id, 'repeat');
        };

        let knownBtn = document.createElement('button');
        knownBtn.type = 'button';
        knownBtn.className = 'card-status-btn known';
        if (cardData.status === 'known') {
            knownBtn.classList.add('active');
        }
        knownBtn.textContent = 'Знаю';
        knownBtn.onclick = function() {
            setCardStatus(cardData.id, 'known');
        };

        let deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = function() {
            wrapper.classList.add('removing');
            setTimeout(function() {
                deleteFlashcard(cardData.id);
            }, 220);
        };

        actions.appendChild(repeatBtn);
        actions.appendChild(knownBtn);
        actions.appendChild(deleteBtn);

        wrapper.appendChild(scene);
        wrapper.appendChild(actions);
        flashcardsGrid.appendChild(wrapper);
    }
}

flashcardForm.onsubmit = function(event) {
    event.preventDefault();

    let newCard = {
        id: Date.now(),
        subject: cardSubject.value,
        front: cardFront.value,
        back: cardBack.value,
        status: 'repeat'
    };

    flashcards.push(newCard);
    localStorage.setItem('myFlashcards', JSON.stringify(flashcards));
    cardSubject.value = '';
    cardFront.value = '';
    cardBack.value = '';
    updateFlashcards();
};

function setCardStatus(id, status) {
    for (let i = 0; i < flashcards.length; i++) {
        if (flashcards[i].id === id) {
            if (flashcards[i].status === status) {
                flashcards[i].status = '';
            } else {
                flashcards[i].status = status;
            }
            break;
        }
    }
    localStorage.setItem('myFlashcards', JSON.stringify(flashcards));
    updateFlashcards();
}

function deleteFlashcard(id) {
    let updated = [];
    for (let i = 0; i < flashcards.length; i++) {
        if (flashcards[i].id !== id) {
            updated.push(flashcards[i]);
        }
    }
    flashcards = updated;
    localStorage.setItem('myFlashcards', JSON.stringify(flashcards));
    updateFlashcards();
}

updateFlashcards();