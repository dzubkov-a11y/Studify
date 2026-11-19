let savedTheme = localStorage.getItem('studifyTheme') || 'purple';
let themeButtons = document.querySelectorAll('.theme-btn');

function applyTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('studifyTheme', themeName);

    for (let i = 0; i < themeButtons.length; i++) {
        let btn = themeButtons[i];
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    }
}

for (let i = 0; i < themeButtons.length; i++) {
    themeButtons[i].onclick = function() {
        let chosenTheme = this.getAttribute('data-theme');
        applyTheme(chosenTheme);
    };
}

applyTheme(savedTheme);