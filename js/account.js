let profileForm = document.getElementById('profileForm');
let profileName = document.getElementById('profileName');
let profileGroup = document.getElementById('profileGroup');
let profileFavSubject = document.getElementById('profileFavSubject');
let profileGoal = document.getElementById('profileGoal');
let accountHero = document.getElementById('accountHero');
let accountStatsGrid = document.getElementById('accountStatsGrid');
let exportDataBtn = document.getElementById('exportDataBtn');
let importDataInput = document.getElementById('importDataInput');
let clearAllDataBtn = document.getElementById('clearAllDataBtn');
let accountStatusMsg = document.getElementById('accountStatusMsg');

let STORAGE_KEYS = [
    'studifyProfile',
    'myTasks',
    'myNotes',
    'myGrades',
    'myLessons',
    'myFlashcards',
    'myQuizQuestions',
    'studifyTargetScore',
    'studifyTheme'
];

let THEME_LABELS = {
    purple: '🌌 Нічний аметист',
    orange: '🍂 Теплий бурштин',
    blue: '🧊 Північний фйорд',
    cream: '📜 Льон і шафран',
    emerald: '🌿 Мох і м’ята',
    rose: '🌸 Сутінкова сакура',
    cyan: '🌊 Океанський бриз'
};

function safeParse(key, fallback) {
    try {
        let raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}

function setStatus(msg) {
    if (accountStatusMsg) {
        accountStatusMsg.textContent = msg;
    }
}

function loadProfileForm() {
    let profile = safeParse('studifyProfile', {});
    if (profileName) profileName.value = profile.name || '';
    if (profileGroup) profileGroup.value = profile.group || '';
    if (profileFavSubject) profileFavSubject.value = profile.favSubject || '';
    if (profileGoal) profileGoal.value = profile.goal || '';
}

function renderAccountOverview() {
    let profile = safeParse('studifyProfile', {});
    let tasks = safeParse('myTasks', []);
    let notes = safeParse('myNotes', []);
    let grades = safeParse('myGrades', []);
    let lessons = safeParse('myLessons', []);
    let flashcards = safeParse('myFlashcards', []);
    let quiz = safeParse('myQuizQuestions', []);
    let targetScore = localStorage.getItem('studifyTargetScore') || 'не задано';
    let currentTheme = localStorage.getItem('studifyTheme') || 'purple';

    let displayName = (profile.name && profile.name.trim()) ? profile.name.trim() : 'Учень Studify';
    let initials = displayName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map(function(part) { return part[0].toUpperCase(); })
        .join('') || 'ST';

    let groupText = (profile.group && profile.group.trim()) ? profile.group.trim() : 'Вільний напрям';
    let favText = profile.favSubject ? profile.favSubject : 'Не обрано';
    let goalText = (profile.goal && profile.goal.trim()) ? profile.goal.trim() : 'Вкажи головну мету на тиждень у формі вище';

    let doneTasks = tasks.filter(function(t) { return t.done; }).length;

    let weightedSum = 0;
    let weightTotal = 0;
    for (let i = 0; i < grades.length; i++) {
        let g = Number(grades[i].grade);
        let w = grades[i].weight ? Number(grades[i].weight) : 1;
        if (!isNaN(g)) {
            weightedSum += g * w;
            weightTotal += w;
        }
    }
    let avgGrade = weightTotal > 0 ? (Math.round((weightedSum / weightTotal) * 100) / 100) : 0;

    let knownCards = flashcards.filter(function(c) { return c.status === 'known'; }).length;
    let rightQuiz = quiz.filter(function(q) { return q.picked !== null && q.picked !== undefined && q.picked === q.correct; }).length;

    if (accountHero) {
        accountHero.innerHTML =
            '<div class="account-avatar">' + initials + '</div>' +
            '<div class="account-hero-info">' +
                '<div class="account-name-row">' +
                    '<h3>' + displayName + '</h3>' +
                    '<span class="account-badge">' + groupText + '</span>' +
                '</div>' +
                '<div class="account-chips">' +
                    '<span class="account-chip">❤️ ' + favText + '</span>' +
                    '<span class="account-chip">🎨 ' + (THEME_LABELS[currentTheme] || currentTheme) + '</span>' +
                    '<span class="account-chip">🎯 Ціль: ' + targetScore + '</span>' +
                '</div>' +
                '<p class="account-goal">✨ Мета тижня: ' + goalText + '</p>' +
            '</div>';
    }

    let statsItems = [
        { icon: '📅', label: 'Завдання тижня', value: doneTasks + ' / ' + tasks.length, sub: 'виконано в розкладі' },
        { icon: '🎯', label: 'Середній бал', value: String(avgGrade), sub: 'оцінок додано: ' + grades.length },
        { icon: '📚', label: 'Нотатки', value: String(notes.length), sub: 'шпаргалок у базі' },
        { icon: '🔔', label: 'Уроки', value: String(lessons.length), sub: 'занять у розкладі' },
        { icon: '🃏', label: 'Картки', value: knownCards + ' / ' + flashcards.length, sub: 'вже вивчено' },
        { icon: '🧠', label: 'Квіз', value: rightQuiz + ' / ' + quiz.length, sub: 'вірних відповідей' }
    ];

    if (accountStatsGrid) {
        accountStatsGrid.innerHTML = '';
        for (let i = 0; i < statsItems.length; i++) {
            let st = statsItems[i];
            let card = document.createElement('div');
            card.className = 'account-stat-card';
            card.innerHTML =
                '<div class="account-stat-top">' +
                    '<span class="account-stat-label">' + st.label + '</span>' +
                    '<span class="account-stat-icon">' + st.icon + '</span>' +
                '</div>' +
                '<strong class="account-stat-value">' + st.value + '</strong>' +
                '<span class="account-stat-sub">' + st.sub + '</span>';
            accountStatsGrid.appendChild(card);
        }
    }
}

if (profileForm) {
    profileForm.onsubmit = function(event) {
        event.preventDefault();
        let profileData = {
            name: profileName ? profileName.value.trim() : '',
            group: profileGroup ? profileGroup.value.trim() : '',
            favSubject: profileFavSubject ? profileFavSubject.value : '',
            goal: profileGoal ? profileGoal.value.trim() : ''
        };
        localStorage.setItem('studifyProfile', JSON.stringify(profileData));
        renderAccountOverview();
        setStatus('✓ Профіль оновлено та збережено у браузері.');
    };
}

if (exportDataBtn) {
    exportDataBtn.onclick = function() {
        let backup = {
            app: 'Studify',
            exportedAt: new Date().toISOString(),
            data: {}
        };

        for (let i = 0; i < STORAGE_KEYS.length; i++) {
            let key = STORAGE_KEYS[i];
            backup.data[key] = localStorage.getItem(key);
        }

        let blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
        let url = URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'studify-backup-' + new Date().toISOString().slice(0, 10) + '.json';
        a.click();
        URL.revokeObjectURL(url);
        setStatus('✓ Резервну копію JSON успішно завантажено.');
    };
}

if (importDataInput) {
    importDataInput.onchange = function(event) {
        let file = event.target.files && event.target.files[0];
        if (!file) {
            return;
        }

        let reader = new FileReader();
        reader.onload = function(e) {
            try {
                let parsed = JSON.parse(e.target.result);
                let payload = parsed.data ? parsed.data : parsed;

                for (let i = 0; i < STORAGE_KEYS.length; i++) {
                    let key = STORAGE_KEYS[i];
                    if (payload[key] !== undefined && payload[key] !== null) {
                        let valToSave = typeof payload[key] === 'string'
                            ? payload[key]
                            : JSON.stringify(payload[key]);
                        localStorage.setItem(key, valToSave);
                    }
                }

                loadProfileForm();
                renderAccountOverview();
                if (typeof applyTheme === 'function') {
                    applyTheme(localStorage.getItem('studifyTheme') || 'purple');
                }
                setStatus('✓ Дані успішно відновлено з файлу JSON.');
            } catch (err) {
                setStatus('✕ Не вдалося прочитати файл JSON. Перевір формат файлу.');
            }
        };
        reader.readAsText(file);
        importDataInput.value = '';
    };
}

if (clearAllDataBtn) {
    clearAllDataBtn.onclick = function() {
        let confirmed = confirm('Видалити всі завдання, нотатки, оцінки, уроки, картки, питання квізу та дані профілю?');
        if (!confirmed) {
            return;
        }
        for (let i = 0; i < STORAGE_KEYS.length; i++) {
            localStorage.removeItem(STORAGE_KEYS[i]);
        }
        loadProfileForm();
        renderAccountOverview();
        if (typeof applyTheme === 'function') {
            applyTheme('purple');
        }
        setStatus('✓ Усі локальні дані Studify очищено.');
    };
}

loadProfileForm();
renderAccountOverview();