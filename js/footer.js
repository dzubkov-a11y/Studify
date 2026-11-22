let faqItems = document.querySelectorAll('.faq-item');

for (let i = 0; i < faqItems.length; i++) {
    let questionBtn = faqItems[i].querySelector('.faq-question');
    if (questionBtn) {
        questionBtn.onclick = function() {
            faqItems[i].classList.toggle('open');
        };
    }
}