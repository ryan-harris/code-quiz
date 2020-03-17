// questions for the quiz
var questions = [
  {
    question: "Commonly used data types DO NOT include:",
    answers: ["numbers", "strings", "booleans", "alerts"],
    correctAnswer: 3
  },
  {
    question: "Arrays in JavaScript can be used to store ______.",
    answers: ["numbers and strings", "other arrays", "booleans", "objects", "All of the above"],
    correctAnswer: 4
  },
  {
    question: "A very useful tool used during development and debugging for printing content to the debugger is:",
    answers: ["console.log", "terminal / bash", "for loops", "JavaScript"],
    correctAnswer: 0
  },
  {
    question: "String values must be enclosed within ______ when being assigned to variables.",
    answers: ["commas", "curly brackets", "quotes", "parenthesis"],
    correctAnswer: 2
  },
  {
    question: "The condition in an if / else statement is enclosed within ______.",
    answers: ["quotes", "parenthesis", "curly brackets", "square brackets"],
    correctAnswer: 1
  }
];

// references to elements on page
var timerDisplay = document.getElementById("time");
var intro = document.getElementById("introduction");
var questionArea = document.getElementById("questionArea");
var questionDisplay = document.getElementById("question");
var answerList = document.getElementById("answers");
var finishedArea = document.getElementById("quizFinished");
var statusArea = document.getElementById("statusArea");
var statusDisplay = document.getElementById("lastQuestionStatus");
var finalScoreDisplay = document.getElementById("finalScore");
var submitScoreBtn = document.getElementById("submitScore");
var startQuizBtn = document.getElementById("startQuiz");
var nameInput = document.getElementById("name");

// constants for game functionality and local storage
const NEW_GAME_TIME = 75;
const NEW_HIGHSCORE_KEY = "newHighscore";
const QUESTION_STATUS_TIME = 2000;

// variable declaration
var secondsLeft;
var timerInterval;
var statusTimeout;
var questionIndex;
var currentQuestion;

init();

// initialize page by showing/hiding certain elements
function init() {
  intro.style.display = "block";
  questionArea.style.display = "none";
  finishedArea.style.display = "none";
  statusArea.style.display = "none";
}

// called when user clicks start quiz button
function startQuiz() {
  // initialize variables
  secondsLeft = NEW_GAME_TIME;
  questionIndex = 0;

  // render the time left
  renderTime();

  // shuffle the questions 3 times so they are in a more random order
  questions = shuffle(shuffle(shuffle(questions)));

  // start an interval for the timer
  timerInterval = setInterval(function() {
    // reduce secondsLeft
    secondsLeft--;
    renderTime();

    // if time is up, clear our interval and finish the quiz
    if (secondsLeft <= 0) {
      clearInterval(timerInterval);
      finishQuiz();
    }
  }, 1000);

  // hide introduction and show question area
  intro.style.display = "none";
  questionArea.style.display = "block";

  displayNextQuestion();
}

// this function is called when the time is up or there are no more questions
function finishQuiz() {
  // clear our timer interval
  clearInterval(timerInterval);

  // render the time they had left
  renderTime();

  // hide question area and show finished quiz area
  questionArea.style.display = "none";
  finishedArea.style.display = "block";

  // update final score on page
  finalScoreDisplay.textContent = secondsLeft;
}

// display the next question
function displayNextQuestion() {
  // if no more questions left, finish quiz
  if (questionIndex >= questions.length) {
    finishQuiz();
    return;
  }

  // get next question, clear previous answer list
  currentQuestion = questions[questionIndex];
  questionDisplay.textContent = currentQuestion.question;
  answerList.innerHTML = "";

  // create a button for each answer
  for (var i = 0; i < currentQuestion.answers.length; i++) {
    var liElement = document.createElement("li");
    liElement.setAttribute("class", "mt-1");

    var btn = document.createElement("button");
    btn.setAttribute("class", "btn btn-primary");
    // set a dataIndex attribute so we can tell which answer they selected later
    btn.setAttribute("dataIndex", i);
    btn.textContent = `${i + 1}. ${currentQuestion.answers[i]}`;

    liElement.appendChild(btn);
    answerList.appendChild(liElement);
  }

  questionIndex++;
}

// called when user clicks a button in the answer list
function questionAnswered(event) {
  // check user actually clicked a button
  if (event.target.matches("button")) {
    var answerIndex = parseInt(event.target.getAttribute("dataIndex"));

    // check for correct answer, set status display text
    if (answerIndex === currentQuestion.correctAnswer) {
      statusDisplay.textContent = "Correct!";
    } else {
      // if wrong, subtract from time left.
      secondsLeft >= 10 ? (secondsLeft -= 10) : (secondsLeft = 0);
      statusDisplay.textContent = "Wrong!";
    }

    // show the status area
    showStatusArea(QUESTION_STATUS_TIME);

    if (secondsLeft > 0) {
      // display the next question
      displayNextQuestion();
    } else {
      finishQuiz();
    }
  }
}

// shows the status area for time milliseconds
function showStatusArea(time) {
  // display status area
  statusArea.style.display = "block";

  // hide status area after certain amount of time
  clearTimeout(statusTimeout);
  statusTimeout = setTimeout(function() {
    statusArea.style.display = "none";
  }, time);
}

// called when user hits submit after quiz is finished
function submitScore(event) {
  event.preventDefault();

  // check the user filled out the name input
  var name = nameInput.value;
  if (name === null || name.trim() === "") {
    statusDisplay.textContent = "Must input initials!";
    showStatusArea(10000);
    return;
  }

  // save the high score from this game into local storage
  var highscore = {
    name: nameInput.value.trim(),
    score: secondsLeft
  };
  localStorage.setItem(NEW_HIGHSCORE_KEY, JSON.stringify(highscore));

  // redirect to highscores page
  window.location.href = "highscores.html";
}

// render time left on page
function renderTime() {
  if (secondsLeft < 0) {
    secondsLeft = 0;
  }
  timerDisplay.textContent = secondsLeft;
}

// this function shuffles an array and returns the shuffled array
// used for mixing the question order every time
function shuffle(arr) {
  var j, x, i;
  for (i = arr.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
  }
  return arr;
}

// event listeners for clicking Start Quiz, clicking on an answer, and clicking the Submit button
startQuizBtn.addEventListener("click", startQuiz);
answerList.addEventListener("click", questionAnswered);
submitScoreBtn.addEventListener("click", submitScore);
