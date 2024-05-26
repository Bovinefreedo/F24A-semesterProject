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
        text: "Is the Earth round?",
        answers: [
            { text: "Ja", correct: true, description: "Correct! The Earth is indeed round." },
            { text: "Nej", correct: false, description: "Incorrect! The Earth is actually round." }
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
        }, 200);
        if (correct) {
            selectedButton.classList.add('correct');
        } else {
            selectedButton.classList.add('wrong');
        }
    }
});
