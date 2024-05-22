import {createSection5} from "./sections/section5.js"
import {createSection8 } from "./sections/section8.js";

createSection5();
createSection8();


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

function handleIntersection(entries) {
    entries.forEach(entry => {
        // Check if the target is one of the sections we are interested in
        if (entry.target.classList.contains('one') || entry.target.classList.contains('two') || entry.target.classList.contains('three') || entry.target.classList.contains('four') || entry.target.classList.contains('five') || entry.target.classList.contains('six') || entry.target.classList.contains('seven')) {
            // Get the corresponding baggrund div within the section
            const baggrundDiv = entry.target.querySelector('.baggrund');
            // Check if 50% of the section is in view
            if (entry.intersectionRatio >= 0.5) {
                // If 50% or more is in view, add a class to the baggrund div
                baggrundDiv.classList.add('swipe-in');
            } 
        }
    });
}

// Create an intersection observer instance
const observer = new IntersectionObserver(handleIntersection, {
    threshold: 0.5 // Trigger when 50% of the section is in view
});

// Get all the sections from class one to seven
const sections = document.querySelectorAll('.one, .two, .three, .four, .five, .six, .seven');

// Observe each section
sections.forEach(section => {
    observer.observe(section);
});

/* QUIZ FUNCTIONS*/
let descriptionAdded = false; 



const options = document.querySelectorAll('.option');
options.forEach(option => {
    option.addEventListener('click', () => {
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        checkAnswer(option.id); 
    });
});

function checkAnswer(selectedOption) {
    const quizContainer = document.getElementById('quiz');
    const correctAnswer = "a"; 

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
    
            descriptionAdded = true; 
        }
    }
}