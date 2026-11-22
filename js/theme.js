let themeButtons = document.querySelectorAll('.theme-btn');
let savedTheme = localStorage.getItem('studifyTheme') || 'purple';

function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('studifyTheme', themeName);

    for (let i = 0; i < themeButtons.length; i++) {
        let btnTheme = themeButtons[i].getAttribute('data-theme');
        if (btnTheme === themeName) {
            themeButtons[i].classList.add('active');
        } else {
            themeButtons[i].classList.remove('active');
        }
    }
}

for (let i = 0; i < themeButtons.length; i++) {
    themeButtons[i].onclick = function() {
        let chosen = this.getAttribute('data-theme');
        applyTheme(chosen);
        if (typeof renderAccountOverview === 'function') {
            renderAccountOverview();
        }
    };
}

applyTheme(savedTheme);