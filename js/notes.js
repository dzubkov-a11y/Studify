let notes = JSON.parse(localStorage.getItem('myNotes')) || [];

let noteForm = document.getElementById('noteForm');
let noteSubject = document.getElementById('noteSubject');
let noteText = document.getElementById('noteText');
let notesGrid = document.getElementById('notesGrid');

function showNotes() {
    notesGrid.innerHTML = '';

    for (let i = 0; i < notes.length; i++) {
        let note = notes[i];

        let card = document.createElement('div');
        card.className = 'note-card';

        let header = document.createElement('div');
        header.className = 'note-header';
        header.innerHTML = '<strong>' + note.subject + '</strong>';

        let deleteBtn = document.createElement('button');
        deleteBtn.textContent = '✕';
        deleteBtn.className = 'btn-delete';
        deleteBtn.onclick = function() {
            card.classList.add('removing');
            setTimeout(function() {
                deleteNote(note.id);
            }, 220);
        };

        header.appendChild(deleteBtn);

        let body = document.createElement('p');
        body.textContent = note.text;

        card.appendChild(header);
        card.appendChild(body);
        notesGrid.appendChild(card);
    }
}

noteForm.onsubmit = function(event) {
    event.preventDefault();

    let newNote = {
        id: Date.now(),
        subject: noteSubject.value,
        text: noteText.value
    };

    notes.push(newNote);
    localStorage.setItem('myNotes', JSON.stringify(notes));
    noteSubject.value = '';
    noteText.value = '';
    showNotes();
};

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

showNotes();