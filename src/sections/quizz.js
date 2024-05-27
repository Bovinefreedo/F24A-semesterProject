        // JavaScript code for the quiz
        document.addEventListener("DOMContentLoaded", () => {
            const questionElement = document.getElementById('question');
            const answerButtonsElement = document.getElementById('answer-buttons');

            const question = {
                text: "Is the Earth round?",
                answers: [
                    { text: "Ja", correct: true },
                    { text: "Nej", correct: false }
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
                button.addEventListener('click', selectAnswer);
                answerButtonsElement.appendChild(button);
            });

            function selectAnswer(e) {
                const selectedButton = e.target;
                const correct = selectedButton.dataset.correct;
                if (correct) {
                    selectedButton.classList.add('correct');
                } else {
                    selectedButton.classList.add('wrong');
                }
                Array.from(answerButtonsElement.children).forEach(button => {
                    button.disabled = true;
                    setTimeout(() => {
                        if (button.dataset.correct) {
                            button.classList.add('correct');
                        } else {
                            button.classList.add('wrong');
                        }
                    }, 200); // Delay to show the answer after selection
                });
            }
        });