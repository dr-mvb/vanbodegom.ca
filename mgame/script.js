var RANKS = [
[
"Extremely Tortured Slave",
"Tortured Slave",
"Depressed Slave",
"Slave",
"Somewhat Happy Slave",
"Happy Slave",
"Hopeful Slave",
"Very Hopeful Slave",
"Slave Released At Age Of 30",
"Slave Released At The Age Of 25",
"Slave Released At The Age Of 15",
"Slave Released At The Age Of 5",
"Extremely Poor Depressed Pheasant ",
"Poor Depressed Pheasant ",
"Depressed Pheasant ",
"Pheasant ",
"Amazing Pheasant",
"Normal Person",
"Rich Phesant",
"Gentleman",
"Esquire",
"Knight",
"Baron",
"Earl",
"Duke",
"Grand Duke",
"King's Child ",
"Vice King",
"King",
"Emperor",
"Emperor Of Europe",
"Emperor Of Europe And Asia",
"Emperor Of Europe And Asia And Australia ",
"Emperor Of Everywhere But The Americas",
"Emperor Of The World",
"Master Of The Universe"
],
[
0,
250,
500,
1000,
2500,
5000,
6250,
7500,
10000,
12500,
15000,
17500,
20000,
22000,
24000,
26000,
28000,
29000,
30000,
32500,
35000,
40000,
42500,
45000,
50000,
60000,
65000,
70000,
75000,
80000,
90000,
100000,
125000,
175000,
250000,
300000
]
]


var INPUT_BOX =
'<form class="answer-form" onsubmit="return false;"><input type="number" class="answer" autocomplete="off" autocorrect="off" min="0" placeholder="Type the answer." autofocus required spellcheck /><input type="submit" onclick="submitted()" style="width: 75%;" value="Submit"/></form><script>setTimeout(function(){$(".answer").first().focus();}, 0);</script>';

function newText(newText) {
  $("#content").animate({ height: 'toggle', opacity: 'toggle' }, 500, "swing", function () {
    $("#content").html(newText);
    $("#content").animate({ height: 'toggle', opacity: 'toggle' }, 500);
  });
}

var saveFile = localStorage["saveFile"] && localStorage["points"] ? [JSON.parse(localStorage["saveFile"]), parseInt(localStorage["points"], 10)] : function () {
  //generate empty save + return it
  var emptySave = [];
  for (i = 0; i <= 12; i++) {
    emptySave.push([]);
    for (j = 0; j <= 12; j++) {
      emptySave[i].push([]);
      emptySave[i][j] = {ans: i * j, score: 0}
    }
  }
  console.log(emptySave);
  localStorage["saveFile"] = JSON.stringify(emptySave);
  localStorage["points"] = 0;
  return [emptySave, 0];
}();

function save() {
  localStorage["saveFile"] = JSON.stringify(saveFile[0]);
  localStorage["points"] = saveFile[1];
}

function nextQuestion() {
  //find question with lowest score, then return it
  var possible = [];
  var curLowest = Infinity;
  for (i = 0; i <= 12; i++) {
    for (j = 0; j <= 12; j++) {
      if (saveFile[0][i][j].score < curLowest) {
        possible = [[i + " x " + j + " = ", saveFile[0][i][j].ans, i, j]];
        curLowest = saveFile[0][i][j].score;
      } else if (saveFile[0][i][j].score === curLowest) {
        possible.push([i + " x " + j + " = ", saveFile[0][i][j].ans, i, j]);
      }
    }
  }
  var returnQ = possible[Math.floor(Math.random() * possible.length)]
  return returnQ;
}

var question;

jQuery(document).ready(function ($) {
  setRank();
  question = nextQuestion();
  question.answered = false;
  newText("Hi.");
  setTimeout(function () {
    newText(question[0] + INPUT_BOX);
  }, 1000);
});

function submitted(event) {
  question.answered = true;
  console.log("hi")
  var answer = $(".answer").val();
  if (parseInt(answer, 10) === question[1]) {
    //got it right

    //determine points
    saveFile[0][question[2]][question[3]].score += 1;
    saveFile[1] =
    ((question[2] === 0 || question[2] === 1) ||
    (question[3] === 0 || question[3] === 1)) ?
    5 + parseInt(saveFile[1], 10):
    Math.floor(Math.pow(question[2] + question[3], 2) / 100 * 130.2165) //gives a max of 750 points
    + parseInt(saveFile[1], 10);
    //next question
    question = nextQuestion();
    question.answered = false;
    newText(question[0] + INPUT_BOX);
    $(".answer").focus();
  } else if (!question.answered) {
    saveFile[0][question[2]][question[3]].score -= 1;
    $(".answer-form").animate({ color: 'red'}, 500);
  }
  setRank();
  save();
}

function getRank() {
  var currentRank = "Extremely Tortured Slave";
  var currentPoints = -1;
  RANKS[1].forEach(function (pointsNeeded, index) {
    if (pointsNeeded < saveFile[1]) {
      currentRank = RANKS[0][index];
    }
  });
  return currentRank;
}

function setRank() {
  $("#rankDisplay").text(getRank());
}
