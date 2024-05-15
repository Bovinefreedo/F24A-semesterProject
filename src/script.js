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

const quizData = [
    {
        question: "What is the capital of France?",
    a: "Paris",
    b: "Aarhus",
    correct: "b",
    },

    {
        question: "Hvad hedder Berkant til fornavn",
    a: "John",
    b: "Jon",
    correct: "a",
    },
]

const quiz = document.querySelector(".quiz-body");
const answerEl = document.querySelector(".answer")
const quiestionEl = document.getElementById("quiestion");
const footerEl = document.querySelector (".quizfooter");
const quizDetailEl = documentquerySelector(".quiz-details");

const a_txt = document.getElementById ("a_txt");
const b_txt = document.getElementById ("b_txt");

let currentQuiz = 0;
let score = 0;

loadQuiz ();

function loadQuiz (){
    deselectAnswer ();
    const currentQuizData = quizData [currentQuiz];

    quiestionEl.innerText = currentQuizData.question;
    a_txt.innerText = currentQuizData.a;
    b_txt.innerText = currentQuizData.b;

    quizDetailEl.innerHTML = `<p>${currentQuiz + 1} of ${quizData.length}</p>`;
}


function deselectAnswer (){
    answerEl.forEach ((answerEl)=>{
        (answerEl.checked) = false;
    });
}