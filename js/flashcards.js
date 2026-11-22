let flashcards = JSON.parse(localStorage.getItem('myFlashcards')) || [];

let flashcardForm = document.getElementById('flashcardForm');
let cardSubject = document.getElementById('cardSubject');
let cardFront = document.getElementById('cardFront');
let cardBack = document.getElementById('cardBack');
let flashcardsGrid = document.getElementById('flashcardsGrid');
let flashcardsStats = document.getElementById('flashcardsStats');
let boardSection = document.querySelector('.board-section');

let cardFilter = 'all'; // 'all' | 'repeat' | 'known'

function ensureCardToolbar() {
    if (!boardSection || !flashcardsStats || document.getElementById('cardToolbar')) {
        return;
    }

    let toolbar = document.createElement('div');
    toolbar.id = 'cardToolbar';
    toolbar.className = 'card-toolbar';
    toolbar.innerHTML =
        '<div class="card-filter-group">' +
            '<button type="button" class="pace-btn active" data-filter="all">Усі</button>' +
            '<button type="button" class="pace-btn" data-filter="repeat">Повторити</button>' +
            '<button type="button" class="pace-btn" data-filter="known">Знаю</button>' +
        '</div>' +
        '<button type="button" class="secondary-btn" id="shuffleCardsBtn">🔀 Перемішати</button>';

    flashcardsStats.insertAdjacentElement('afterend', toolbar);

    let filterBtns = toolbar.querySelectorAll('.pace-btn');
    for (let i = 0; i < filterBtns.length; i++) {
        filterBtns[i].onclick = function() {
            cardFilter = this.getAttribute('data-filter');
            for (let j = 0; j < filterBtns.length; j++) {
                filterBtns[j].classList.remove('active');
            }
            this.classList.add('active');
            renderFlashcards();
        };
    }

    let shuffleBtn = document.getElementById('shuffleCardsBtn');
    shuffleBtn.onclick = function() {
        for (let i = flashcards.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let tmp = flashcards[i];
            flashcards[i] = flashcards[j];
            flashcards[j] = tmp;
        }
        localStorage.setItem('myFlashcards', JSON.stringify(flashcards));
        renderFlashcards();
    };
}

function renderFlashcards() {
    ensureCardToolbar();
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

    let masterPct = flashcards.length > 0 ? Math.round((knownCount / flashcards.length) * 100) : 0;
    flashcardsStats.textContent =
        'Всього: ' + flashcards.length +
        ' · Знаю: ' + knownCount + ' (' + masterPct + '%)' +
        ' · Повторити: ' + repeatCount;

    let visibleCards = [];
    for (let i = 0; i < flashcards.length; i++) {
        let c = flashcards[i];
        if (cardFilter === 'all' || c.status === cardFilter) {
            visibleCards.push(c);
        }
    }

    if (visibleCards.length === 0) {
        flashcardsGrid.innerHTML = '<p class="empty-filter-msg">Немає карток у вибраній категорії.</p>';
        return;
    }

    for (let i = 0; i < visibleCards.length; i++) {
        let card = visibleCards[i];

        let item = document.createElement('div');
        item.className = 'flashcard-item';
        if (card.status === 'known') {
            item.classList.add('status-known');
        } else if (card.status === 'repeat') {
            item.classList.add('status-repeat');
        }

        let scene = document.createElement('div');
        scene.className = 'flashcard-scene';
        scene.onclick = function() {
            scene.classList.toggle('is-flipped');
        };

        let inner = document.createElement('div');
        inner.className = 'flashcard-inner';

        let front = document.createElement('div');
        front.className = 'flashcard-face flashcard-front';
        front.innerHTML =
            '<span class="flashcard-subject">' + card.subject + '</span>' +
            '<div class="flashcard-text">' + card.front + '</div>' +
            '<div class="flashcard-hint">Натисни, щоб перевернути</div>';

        let back = document.createElement('div');
        back.className = 'flashcard-face flashcard-back';
        back.innerHTML =
            '<span class="flashcard-subject">' + card.subject + ' · Відповідь</span>' +
            '<div class="flashcard-text">' + card.back + '</div>' +
            '<div class="flashcard-hint">Натисни, щоб повернути</div>';

        inner.appendChild(front);
        inner.appendChild(back);
        scene.appendChild(inner);

        let actions = document.createElement('div');
        actions.className = 'flashcard-actions';

        let repeatBtn = document.createElement('button');
        repeatBtn.type = 'button';
        repeatBtn.className = 'card-status-btn repeat' + (card.status === 'repeat' ? ' active' : '');
        repeatBtn.textContent = 'Повторити';
        repeatBtn.onclick = function() {
            setCardStatus(card.id, 'repeat');
        };

        let knownBtn = document.createElement('button');
        knownBtn.type = 'button';
        knownBtn.className = 'card-status-btn known' + (card.status === 'known' ? ' active' : '');
        knownBtn.textContent = 'Знаю';
        knownBtn.onclick = function() {
            setCardStatus(card.id, 'known');
        };

        let deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '✕';
        deleteBtn.onclick = function() {
            item.classList.add('removing');
            setTimeout(function() {
                deleteFlashcard(card.id);
            }, 220);
        };

        actions.appendChild(repeatBtn);
        actions.appendChild(knownBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(scene);
        item.appendChild(actions);
        flashcardsGrid.appendChild(item);
    }
}

flashcardForm.onsubmit = function(event) {
    event.preventDefault();

    let newCard = {
        id: Date.now(),
        subject: cardSubject.value,
        front: cardFront.value.trim(),
        back: cardBack.value.trim(),
        status: 'new'
    };

    flashcards.push(newCard);
    localStorage.setItem('myFlashcards', JSON.stringify(flashcards));

    cardFront.value = '';
    cardBack.value = '';
    renderFlashcards();
};

function setCardStatus(id, status) {
    for (let i = 0; i < flashcards.length; i++) {
        if (flashcards[i].id === id) {
            flashcards[i].status = (flashcards[i].status === status) ? 'new' : status;
            break;
        }
    }
    localStorage.setItem('myFlashcards', JSON.stringify(flashcards));
    renderFlashcards();
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
    renderFlashcards();
}

renderFlashcards();