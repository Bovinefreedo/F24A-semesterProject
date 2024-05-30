document.addEventListener('DOMContentLoaded', () => {
    function handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('swipe-in');
            } else {
                entry.target.classList.remove('swipe-in');
            }
        });
    }

    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.5
    });

    const sections = document.querySelectorAll('.one, .two, .three, .four, .five, .six, .seven, .eight, .nine');
    sections.forEach(section => {
        observer.observe(section);
    });

    // JavaScript code for the quiz
    const questionElement = document.getElementById('question');
    const answerButtonsElement = document.getElementById('answer-buttons');
    const descriptionElement = document.getElementById('description');

    const question = {
        text: "Vil vi i verden kunne have nok energi, hvis vi alle brugte så meget energi som en dansker?",
        answers: [
            { text: "Ja, vi ville have nok energi i verden", correct: true, description: "Korrekt! " },
            { text: "Nej, vi ville ikke have nok energi i verden", correct: false, description: "Forkert! En gennemsnitlig person i verden brugte 167 Twh i år 2022, sammenlignet med en dansker som brugte 189 Twh"}
        ]
    };

    questionElement.textContent = question.text;

    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.textContent = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', () => selectAnswer(answer));
        answerButtonsElement.appendChild(button);
    });

    function selectAnswer(answer) {
        const selectedButton = event.target;
        const correct = selectedButton.dataset.correct;
        descriptionElement.textContent = answer.description;
        answerButtonsElement.classList.add('fade-out');
        setTimeout(() => {
            answerButtonsElement.style.display = 'none';
            descriptionElement.style.display = 'block';
            descriptionElement.classList.add('fade-in');
        }, 750);
        if (correct) {
            selectedButton.classList.add('correct');
        } else {
            selectedButton.classList.add('wrong');
        }
    }
});
