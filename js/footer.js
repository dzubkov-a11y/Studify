let faqQuestions = document.querySelectorAll('.faq-question');

for (let i = 0; i < faqQuestions.length; i++) {
    faqQuestions[i].onclick = function() {
        let item = this.parentElement;
        let isOpen = item.classList.contains('open');

        if (isOpen) {
            item.classList.remove('open');
        } else {
            item.classList.add('open');
        }
    };
}s