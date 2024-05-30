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
        text: "Hvor tror du vi i Danmark får mest energi fra?",
        answers: [
            { text: "Vores energi kommer mest fra på bæredygtig energi", correct: false, description: "Forkert! Største delen kommer fra fossile brændstoffer" },
            { text: "Vores energi kommer mest af fossile brændstoffer", correct: true, description: "Korrekt! Vi får det meste af vores energi fra fossile brændstoffer"}
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

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.header');
    const firstSection = document.querySelector('.one');

    window.addEventListener('scroll', function() {
        // Get the scroll position
        const scrollPosition = window.scrollY;

        // Get the height of the first section
        const firstSectionHeight = firstSection.offsetHeight;

        // Toggle the visibility of the header based on the scroll position and section visibility
        if (scrollPosition < firstSectionHeight) {
            header.style.display = 'block';
        } else {
            header.style.display = 'none';
        }
    });
});
