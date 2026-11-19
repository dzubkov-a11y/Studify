let circle = document.getElementById('breathingCircle');
let text = document.getElementById('breathingText');
let btn = document.getElementById('startBreathBtn');

btn.onclick = function() {
    btn.disabled = true;
    text.textContent = 'Вдих... (4с)';
    circle.className = 'breathing-circle inhale';

    setTimeout(function() {
        text.textContent = 'Затримка... (2с)';

        setTimeout(function() {
            text.textContent = 'Видих... (4с)';
            circle.className = 'breathing-circle exhale';

            setTimeout(function() {
                text.textContent = 'Готово!';
                btn.disabled = false;
            }, 4000);
        }, 2000);
    }, 4000);
};