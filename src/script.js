let lastScrollTop = 0;

window.addEventListener("scroll", function() {
    let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    // Check if scrolling down from the top of the page
    if (currentScroll > lastScrollTop && window.scrollY > window.innerHeight) {
        document.querySelector("header").style.display = "none"; // Hide navbar
    } else {
        document.querySelector("header").style.display = "block"; // Show navbar
    }

    lastScrollTop = currentScroll;
    
});

let descriptionAdded = false; // Flag to track if description has been added

// Add event listeners for option selection
const options = document.querySelectorAll('.option');
options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        checkAnswer(option.id); // Call checkAnswer with the selected option ID
    });
});

function checkAnswer(selectedOption) {
    const quizContainer = document.getElementById('quiz');
    const correctAnswer = "a"; // Change this to your correct answer

    if (selectedOption === correctAnswer) {
        quizContainer.classList.remove('false');
        quizContainer.classList.add('green');
        document.querySelector('.quiz-detail').innerHTML = 'Correct!';
    } else {
        if (!descriptionAdded) {
            quizContainer.classList.remove('green');
            quizContainer.classList.add('false');
            document.querySelector('.quiz-detail').innerHTML = 'Incorrect!';
    
            const answerDescription = document.createElement('p');
            answerDescription.classList.add('answer-description');
            answerDescription.textContent = 'Correct answer is Paris.';
            quizContainer.appendChild(answerDescription);
    
            descriptionAdded = true; // Set flag to true
        }
    }
}
