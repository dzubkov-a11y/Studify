let notes = JSON.parse(localStorage.getItem('myNotes')) || [];

let noteForm = document.getElementById('noteForm');
let noteSubject = document.getElementById('noteSubject');
let noteText = document.getElementById('noteText');
let notesGrid = document.getElementById('notesGrid');
let filterSubject = document.getElementById('filterSubject');
let searchNoteInput = document.getElementById('searchNoteInput');

function showNotes() {
    notesGrid.innerHTML = '';

    let selectedSubject = filterSubject ? filterSubject.value : 'all';
    let query = searchNoteInput ? searchNoteInput.value.trim().toLowerCase() : '';

    let filtered = [];
    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];
        let matchesSubject = (selectedSubject === 'all' || note.subject === selectedSubject);
        let matchesQuery = (
            query === '' ||
            note.text.toLowerCase().indexOf(query) !== -1 ||
            note.subject.toLowerCase().indexOf(query) !== -1
        );

        if (matchesSubject && matchesQuery) {
            filtered.push(note);
        }
    }

    // Закріплені нотатки — першими
    filtered.sort(function(a, b) {
        let pinA = a.pinned ? 1 : 0;
        let pinB = b.pinned ? 1 : 0;
        return pinB - pinA;
    });

    if (filtered.length === 0) {
        notesGrid.innerHTML = '<p class="empty-filter-msg">За вибраним фільтром або запитом нотаток не знайдено.</p>';
        return;
    }

    for (let i = 0; i < filtered.length; i++) {
        let note = filtered[i];

        let card = document.createElement('div');
        card.className = 'note-card';
        if (note.pinned) {
            card.classList.add('is-pinned');
        }

        let header = document.createElement('div');
        header.className = 'note-header';

        let subjectBadge = document.createElement('strong');
        subjectBadge.textContent = (note.pinned ? '📌 ' : '') + note.subject;

        let rightActions = document.createElement('div');
        rightActions.className = 'note-card-actions';

        let pinBtn = document.createElement('button');
        pinBtn.type = 'button';
        pinBtn.className = 'mini-icon-btn' + (note.pinned ? ' active' : '');
        pinBtn.title = 'Закріпити нотатку';
        pinBtn.textContent = '📌';
        pinBtn.onclick = function() {
            togglePinNote(note.id);
        };

        let copyBtn = document.createElement('button');
        copyBtn.type = 'button';
        copyBtn.className = 'mini-copy-btn';
        copyBtn.textContent = 'Копіювати';
        copyBtn.onclick = function() {
            copyNoteText(note.text, copyBtn);
        };

        let deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'btn-delete';
        deleteBtn.onclick = function() {
            card.classList.add('removing');
            setTimeout(function() {
                deleteNote(note.id);
            }, 250);
        };

        rightActions.appendChild(pinBtn);
        rightActions.appendChild(copyBtn);
        rightActions.appendChild(deleteBtn);

        header.appendChild(subjectBadge);
        header.appendChild(rightActions);

        let text = document.createElement('p');
        text.textContent = note.text;

        card.appendChild(header);
        card.appendChild(text);
        notesGrid.appendChild(card);
    }
}

function copyNoteText(text, btnEl) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function() {
            let oldLabel = btnEl.textContent;
            btnEl.textContent = 'Скопійовано!';
            setTimeout(function() {
                btnEl.textContent = oldLabel;
            }, 1300);
        });
    }
}

noteForm.onsubmit = function(event) {
    event.preventDefault();

    let newNote = {
        id: Date.now(),
        subject: noteSubject.value,
        text: noteText.value.trim(),
        pinned: false
    };

    notes.push(newNote);
    localStorage.setItem('myNotes', JSON.stringify(notes));
    noteText.value = '';
    showNotes();
};

function togglePinNote(id) {
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === id) {
            notes[i].pinned = !notes[i].pinned;
            break;
        }
    }
    localStorage.setItem('myNotes', JSON.stringify(notes));
    showNotes();
}

function deleteNote(id) {
    let updatedNotes = [];
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id !== id) {
            updatedNotes.push(notes[i]);
        }
    }
    notes = updatedNotes;
    localStorage.setItem('myNotes', JSON.stringify(notes));
    showNotes();
}

if (filterSubject) {
    filterSubject.onchange = showNotes;
}

if (searchNoteInput) {
    searchNoteInput.oninput = showNotes;
}

showNotes();