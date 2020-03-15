// References to elements on high score page
var scoreList = document.getElementById("scores");
var clearBtn = document.getElementById("clearScores");

var highScores = [];
const newHighscoreKey = "newHighscore";
const highscoresKey = "highscores";

initScores();

function initScores() {
  // load all high scores already saved
  highScores = JSON.parse(localStorage.getItem(highscoresKey));

  // if no high scores in local storage, set high scores to empty array
  if (highScores === null) {
    highScores = [];
  }

  // check to see if theres a new high score to add
  var newHighscore = JSON.parse(localStorage.getItem(newHighscoreKey));
  if (newHighscore !== null) {
    // add it to highscores array
    highScores.push(newHighscore);
    // sort the array with our compare function
    highScores.sort(scoreCompare);
    // remove the new high score to add from local storage
    localStorage.removeItem(newHighscoreKey);
  }

  // add the high scores to the page
  scoreList.innerHTML = "";
  for (var i = 0; i < highScores.length; i++) {
    // create an li element
    var liElement = document.createElement("li");
    liElement.setAttribute("class", "mt-1 px-1");
    liElement.style = "background-color: lightblue;";
    // set the text content to display the score
    liElement.textContent =
      (i + 1) +
      ". " +
      highScores[i].name +
      " - " +
      highScores[i].score;

    // append li element to the score list
    scoreList.appendChild(liElement);
  }

  // save the new score list in localStorage
  localStorage.setItem(highscoresKey, JSON.stringify(highScores));
}

function clearScores() {
  // clear the high score array
  highScores = [];
  // clear the page of the items in the list
  scoreList.innerHTML = "";
  // clear the high scores saved in local storage
  localStorage.removeItem(highscoresKey);
}

// our compare function for sorting the array of scores
function scoreCompare(first, second) {
  if (first.score > second.score) {
    return -1;
  } else if (first.score < second.score) {
    return 1;
  } else {
    return 0;
  }
}

clearBtn.addEventListener("click", clearScores);
