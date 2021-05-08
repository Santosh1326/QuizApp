const question = document.getElementById("question");
const choices = Array.from (document.getElementsByClassName("choice-text"));
//const questionCounterText = document.getElementById("questionCounter");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestion = [];

let questions  = [];
// use opentdb.com website to generate API for questions
fetch(
    "https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple"
    )
    .then( res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions.results);
        questions = loadedQuestions.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question
            };

            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            })

            return formattedQuestion;
        });
        //game.classList.remove("hidden");
        //loader.classList.add("hidden");
        //questions = loadedQuestions;
        startGame();
    })
    .catch(err => {
        console.error(err);
    });


//CONSTANTS
const CORRECT_BOUNS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestion = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};

getNewQuestion = () => {

    if (availableQuestion.length == 0 || questionCounter >= MAX_QUESTIONS) {
        localStorage.setItem("mostRecentScore", score);
        //goto the end page
        return window.location.assign("/end.html");
    }

    questionCounter++;
    //questionCounterText.innerText = `${questionCounter}/${MAX_QUESTIONS}`;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // Update Progress Bar
    progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

    const questionIndex = Math.floor(Math.random() * availableQuestion.length);
    currentQuestion = availableQuestion[questionIndex];
    question.innerText = currentQuestion.question;

    choices.forEach( choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    });

    availableQuestion.splice(questionIndex, 1);

    acceptingAnswers = true;
};

choices.forEach(choice =>{
    choice.addEventListener("click", e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        /*const classToApply = "incorrect";
        if (selectedAnswer == currentQuestion.answer) {
            classToApply = "correct";
        }*/

        const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if(classToApply == "correct") {
            incrementScore(CORRECT_BOUNS);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
};
