// questions for the quiz
var questions = [
  {
    question: "What is the answer to this queston?",
    answers: ["First answer", "second answer", "third answer", "fourth answer"],
    correctAnswer: 0
  },
  {
    question: "What is your name?",
    answers: ["John", "Mary", "George", "Ryan"],
    correctAnswer: 3
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

// variable declaration
var score;
var secondsLeft;
var timerInterval;
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

// start quiz
function startQuiz() {
  // initialize variables
  secondsLeft = 10;
  score = 0;
  questionIndex = 0;
  renderTime();

  // start an interval for the timer
  timerInterval = setInterval(function() {
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

function finishQuiz() {
  // clear our timer interval
  clearInterval(timerInterval);

  // hide question area and show finished quiz area
  questionArea.style.display = "none";
  finishedArea.style.display = "block";

  // update final score
  finalScoreDisplay.textContent = score;
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
    btn.textContent = i + 1 + ". " + currentQuestion.answers[i];

    liElement.appendChild(btn);
    answerList.appendChild(liElement);
  }

  questionIndex++;
}

// called when user clicks a button in the answer list
function questionAnswered(event) {
  // check user actually clicked a button
  var isButton = event.target.matches("button");
  if (isButton) {
    var answerIndex = parseInt(event.target.getAttribute("dataIndex"));

    // if answer is correct, add 10 to score
    // if incorrect, subtract 5 from score (or 0 out score)
    // also update status display on page
    if (answerIndex === currentQuestion.correctAnswer) {
      score += 10;
      statusDisplay.textContent = "Correct!";
    } else {
      score >= 5 ? (score -= 5) : (score = 0);
      statusDisplay.textContent = "Wrong!";
    }

    // display status area
    statusArea.style.display = "block";

    // hide status area after certain amount of time
    setTimeout(function() {
      statusArea.style.display = "none";
    }, 2000);

    // display the next question
    displayNextQuestion();
  }
}

// render time left on page
function renderTime() {
  timerDisplay.textContent = secondsLeft;
}

// call startQuiz() when "Start Quiz" button pressed
startQuizBtn.addEventListener("click", startQuiz);
answerList.addEventListener("click", questionAnswered);
