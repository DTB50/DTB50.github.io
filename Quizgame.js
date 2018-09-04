//JS code for Ye Olde Pub Quiz

//GAME STATE VARIABLES/////////////////////////////////////////
var score = 0;
var losses = 0;
var questionNo = 1;
var currentQ;
var currentRightA;
var userA;
var progress;
var response;
var cash = 0;
var loseCash = 0;
var Qarray = [];
var fiftyUsed = false;
var timeOut = false;
var timeLeft = 10;
var timer = 10;
var getURL;
var winner;
var hiScore = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////HELPER FUNCTIONS////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////
//PLAYER ACTIONS
////////////////////////////////////////////////////////////////////

//LET PLAYER ANSWER QUESTION AND TRIGGER NEXT STAGE/FAIL STATE
var playerChoice = function(userA, currentRightA, response) {
    clearInterval(timer);
    console.log("Score = " + score + " and Losses = " + losses);
    console.log(userA + " (" + typeof userA + ") vs " + currentRightA + " (" + typeof currentRightA + ")");
  //GET PROGRESS STATUS
    if (userA === currentRightA) {
            console.log("CORRECT");
            progress = true;
            questionNo++;
            score++;
            cash+=100;
        }
    else if (userA !== currentRightA){
        losses++;
        if (losses <= 2) {
            console.log("WRONG");
            progress = true;
            questionNo++;
        }
        else {
            if (losses == 3) {
                console.log("FAIL");
                progress = false;
               }
            }
        }
    console.log("progress to next question: " + progress);
    console.log("score: " + score);
    console.log("questionNo: " + questionNo);
    console.log("losses: " + losses);
  //DETERMINE WHETHER USER GOES TO NEXT STAGE OR NOT
    if (progress == true) {
        if (score == 10){
            winGame(score);
        }
        else {
            leaveChoice(response, questionNo, score, losses, fiftyUsed, cash);
        }
    }
     else if (progress == false) {
        endCash(cash);
     };
};


//50:50 FUNCTION
var fifty = function(response, currentQ, questionNo, buttonsNo) {
  //IF 50:50 IS USABLE (>2 OPTIONS), CUT DOWN NUMBER OF BUTTONS (REMAKE BUTTONS)
    console.log(response);
        $("#fifty").remove();
    if (buttonsNo > 3) {
        $("#buttons").empty();
      //MAKE AN ARRAY IN RANDOM ORDER FOR THE REMAINING ANSWERS
        var ansArray = [];
        ansArray.push(currentQ.correct_answer);
        var randomNo = Math.random();
        if (randomNo <= 0.5) {
            ansArray.push(currentQ.incorrect_answers[0]);
        }
        else {
            ansArray.unshift(currentQ.incorrect_answers[0]);
        }
     //PUT ANSWERS FROM ARRAY INTO BUTTONS
        for (k = 0; k < ansArray.length; k++) {
            var newButton = document.createElement("button");
            newButton.innerHTML = ansArray[k];
            newButton.setAttribute("class", "answerButton");
            newButton.setAttribute("id", k);
            newButton.setAttribute("value", ansArray[k]);
            $("#buttons").append(newButton);
            }
        $(".answerButton").click(function() {
        userA = this.value;
        playerChoice(userA, currentRightA, response);
        });
            fiftyUsed = true;
        }
    else {
        alert("You can't use this on this question, it's already a 50:50 chance! You'll get it back next round!");
    }

    console.log("Available answers: " + ansArray);
};

//LEAVE WITH CASH
var leaveChoice = function(response, questionNo, score, losses, fiftyUsed, cash) {
  //UPDATE STATS AND CLEAR BUTTONS
    console.log("Current Question is: " + questionNo)
    statusUpdate(score, losses, cash);
    $("#buttons").empty();
    $("#fifty").remove();
    $("#question").text("Would you like to walk away with £" + cash + "?");
  //MAKE CONTINUE BUTTON
    var newButton = document.createElement("button");
    newButton.innerHTML = "Continue";
    newButton.setAttribute("id", "continue");
    $("#playeroptions").append(newButton);
    $("#continue").click(function() {
    gamePlay(response, questionNo, score, losses, fiftyUsed);
    });
  //MAKE WALK BUTTON
    var newButton = document.createElement("button");
    newButton.innerHTML = "Walk Away";
    newButton.setAttribute("id", "walk");
    $("#playeroptions").append(newButton);
        $("#walk").click(function() {
        walk(score);
    });
};

//////////////////////////////////////////////////////////////////////
//END GAME FUNCTIONS
//////////////////////////////////////////////////////////////////////

//CALCULATE CASH AT GAME OVER - REDUCE CASH TO LAST CHECKPOINT AT 400 OR 700
var endCash = function(cash) {
    console.log("Player was up to £" + cash);
    if (cash < 400){
        loseCash = 0;
    }
    else if (cash >= 400 && cash < 700) {
        loseCash = 400;
    }
    else if (cash >= 700 && cash < 1000) {
        loseCash = 700;
    }
    console.log("Player is down to £" + cash);
    loseGame(score, loseCash);
};

//WALK AWAY OPTION ENDGAME
var walk = function(score) {
  //PRINT CURRENT MONEY
    $("#buttons").empty();
    $("#playeroptions").empty();
    $("#question").text("You walked away with £" + cash);
    console.log("Upon walk, cash = " + cash + " and hiScore = " + hiScore);
  //DEPENDING ON SCORE, GIVE OPTION TO RESTART OR INPUT USERNAME
    if (cash > hiScore) {
        champEntry(cash, hiScore);
    }
    else{
    var newButton = document.createElement("button");
    newButton.innerHTML = "Try again?";
    newButton.setAttribute("id", "reset");
    $("#buttons").append(newButton);
        $("#reset").click(function() {
            start();
    })
    }
};

//TIME OUT FAILSTATE
//DETERMINE WHETHER PLAYER CAN PASS TO NEXT QUESTION AFTER TIMEOUT OR NOT
var timeUp = function(response) {
  $("#timer").text("Time's up!");
  timeOut = true;
  losses++;
  if (losses <= 2) {
      console.log("WRONG");
      progress = true;
      questionNo++;
  }
  else {
      if (losses == 3) {
          console.log("FAIL");
          progress = false;
         }
      }
  if (progress == true) {
      leaveChoice(response, questionNo, score, losses, fiftyUsed, cash);
  }
  else if (progress == false) {
    console.log("progress is: " + progress)
    endCash(cash);
  }
};


//WIN CONDITION
//WHEN PLAYER REACHES 1000 CASH, LET THEM ENTER USERNAME
var winGame = function(score) {
    console.log("Upon win, cash = " + cash + " and hiScore = " + hiScore);
    $("#playerabilities").empty();
    $("#buttons").empty();
    statusUpdate(score, losses, cash);
    $("#question").text("You win! You win £" + cash + "!");
    if ((cash > hiScore) || (cash == 1000)) {
        champEntry(cash, hiScore);
    }
    else{
    var newButton = document.createElement("button");
    newButton.innerHTML = "Try again?";
    newButton.setAttribute("id", "reset");
    $("#buttons").append(newButton);
        $("#reset").click(function() {
            start();
        })
    }
};

//USERNAME ENTRY FUNCTION
var champEntry = function(cash, hiScore) {
  //UPDATE MESSAGE TO USER
    hiScore = cash;
    console.log("cash is " + cash + " and hiscore is " + hiScore);
    $("#buttons").empty;
    $("#buttons").html("You are the top scorer! Please enter your name (5 letters max): ");
  //CREATE TEXTBOX AND CONFIRM BUTTON  - ONLY ACCEPT FIRST 5 LETTERS OF USERNAME
    var newTextBox = document.createElement("input");
    newTextBox.setAttribute("id", "nameBox");
    newTextBox.setAttribute("type", "text");
    $("#buttons").append(newTextBox);
    var newButton = document.createElement("button");
    newButton.innerHTML = "Confirm name";
    newButton.setAttribute("id", "playerName");
    $("#buttons").append(newButton);
    $("#playerName").click(function() {
        winner = $("#nameBox").val();
        console.log(winner);
        if (winner.length > 5) {
            winner = winner.substring(0,5);
        }
        $("#winner").html("Current champion is " + winner + " with £");
        $("#hiScore").html(hiScore);
         start();
     });
}
//////////////////////////////////////////////////////////////////////////
// SETUP FUNCTIONS
//////////////////////////////////////////////////////////////////////////

//PULL DATA FROM SERVER
var pullData = function(getURL) {
    $.ajax({url: getURL, type:"GET",
                success: function(response){
                        score = 0;
                        questionNo = 1;
                        cash = 0;
                        losses = 0;
                        fiftyUsed = false;
                        console.log(response);
                        response = response;
                        questionCheck(response, questionNo);
                }
    });
    console.log("fiftyUsed at end of pullData: " + fiftyUsed);
};

//CHECK ARRAY FOR DUPLICATES - PULL NEW BATCH IF SO
var questionCheck = function(response, questionNo){
    for (i = 0; i < response.results.length; i++) {
        if (!Qarray.includes(response.results[i].question)) {
            i++;
        }
        else {
            console.log("Includes question already asked: pulling new questions")
            pullData();
        }
    }
    console.log("All new questions loaded");
    for (i = 0; i < response.results.length; i++) {
        Qarray.push(response.results[i].question);
    }
    gamePlay(response, questionNo, score, losses, fiftyUsed);
}

//MAIN LOOP
var gamePlay = function(response, questionNo, score, losses, fiftyUsed) {
  //UPDATE STATS
    console.log("cash is: " + cash);
    console.log("questionNo: " + questionNo);
    console.log(response);
    currentQ = response.results[questionNo];
    currentRightA = currentQ.correct_answer;
 //SET UP QUESTION SCREEN AND AWAIT PLAYER INPUT
    setupQ(currentQ, fiftyUsed, response);
    console.log("Right answer is: " + currentRightA);
    $(".answerButton").click(function() {
        userA = this.value;
        playerChoice(userA, currentRightA, response);
    });
};

//REFRESH AFTER LOSS
var loseGame = function(score) {
  //UPDATE SCREEN
    $("#buttons").empty();
    statusUpdate(score, losses, cash);
    $("#playeroptions").empty();
    $("#playerabilities").empty();
    console.log("Cash at end is £" + loseCash);
    $("#question").text("You leave with £" + loseCash + "! Try again for more!");
  //DEPENDING ON SCORE, SEND PLAYER TO HI SCORE SCREEN OR RELOAD GAME
    if (loseCash > hiScore) {
        cash = loseCash;
        champEntry(cash, hiScore);
    }
    else{
        var newButton = document.createElement("button");
        newButton.innerHTML = "Try again?";
        newButton.setAttribute("id", "reset");
        $("#buttons").append(newButton);
            $("#reset").click(function() {
              document.ready();
        })
    }
};

//UPDATE STATUS DATA
var statusUpdate = function(score, losses, cash) {
    console.log("In statusupdate, cash = " + cash + "and hiScore = " + hiScore);
    $("#score").text("Score: " + score);
    $("#cash").text("Cash: £" + cash);
    $("#losses").text("Losses: " + losses);
};

//HIDE STATUS BAR
var statusHide = function() {
    $("#score").hide();
    $("#cash").hide();
    $("#losses").hide();
    $("#timer").hide();
};

//REVEAL STATUS BAR
var statusShow = function() {
    $("#score").show();
    $("#cash").show();
    $("#losses").show();
    $("#timer").show();
};


//SET UP QUESTIONS AND ANSWERS
var setupQ = function(currentQ, fiftyUsed, response) {

  //CLEAR CURRENT STAGE
    $("#buttons").empty();
    $("#playeroptions").empty();
    $("#playerabilities").empty();
    statusUpdate(score, losses, cash);
    statusShow();

  //PRINT QUESTION IN QUESTION BOX
    console.log("Now at question " + questionNo);
    $("#question").html("Q: " + currentQ.question);

  //PUSH ANSWERS INTO ARRAY IN RANDOM ORDER
    var ansArray = [];
    ansArray.push(currentQ.correct_answer);
    for (j = 0; j < currentQ.incorrect_answers.length; j++){
        var randomNo = Math.random();
        if (randomNo <= 0.5) {
        ansArray.push(currentQ.incorrect_answers[j]);
        }
        else {
            ansArray.unshift(currentQ.incorrect_answers[j]);}
        };
    console.log("Available answers: " + ansArray);

  //PUT ANSWERS FROM ARRAY INTO BUTTONS
    for (k = 0; k < ansArray.length; k++) {
        var newButton = document.createElement("button");
        newButton.innerHTML = ansArray[k];
        newButton.setAttribute("class", "answerButton");
        newButton.setAttribute("id", k);
        newButton.setAttribute("value", ansArray[k]);
        $("#buttons").append(newButton);
        }
    var buttonsNo = buttons.childNodes.length;

  //REPLACE 50:50 BUTTON IF AVAILABLE
    if (fiftyUsed == false){
        var newButton = document.createElement("button");
        newButton.innerHTML = "50:50";
        newButton.setAttribute("id", "fifty");
        $("#playerabilities").append(newButton);
        $("#fifty").click(function() {
            fifty(response, currentQ, questionNo, buttonsNo);
        })
    };

  //START TIMER
    reduceTime(response);
};

//SET UP TIMER - COUNT DOWN FOR 10 SECONDS
var reduceTime =  function(response) {
    timeLeft = 10;
    $("#timer").html("Time: " + timeLeft);
    timer = setInterval(function() {
          timeLeft-=1;
          $("#timer").html("Time: " + timeLeft);
          if (timeLeft < 1) {
              clearInterval(timer);
              timeUp(response);
            }
        }, 1000);
};


//////////////////////////////////////////////////////////////////////////////////////////////////////////////
////INITIALISE GAME///////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.ready = function(){
    start();

};

var start = function () {
  //CLEAR SCREEN OF LAST ROUND'S DATA (EXCEPT HI SCORE)
    hiScore = $("#hiScore").html();
    statusHide();
    $("#buttons").empty();
    $("#playeroptions").empty();
    $("#playerabilities").empty();

  //MAKE BUTTONS TO SELECT QUIZ THEME
    $("#question").text("Select a topic!");
    var newButton = document.createElement("button");
    newButton.innerHTML = "Everything";
    newButton.setAttribute("class", "start");
    newButton.setAttribute("value", "https://opentdb.com/api.php?amount=13");
    $("#buttons").append(newButton);

    var newButton = document.createElement("button");
    newButton.innerHTML = "General knowledge";
    newButton.setAttribute("class", "start");
    newButton.setAttribute("value", "https://opentdb.com/api.php?amount=13&category=9");
    $("#buttons").append(newButton);

    var newButton = document.createElement("button");
    newButton.innerHTML = "Science and nature";
    newButton.setAttribute("class", "start");
    newButton.setAttribute("value", "https://opentdb.com/api.php?amount=13&category=17");
    $("#buttons").append(newButton);

    var newButton = document.createElement("button");
    newButton.innerHTML = "Sports";
    newButton.setAttribute("class", "start");
    newButton.setAttribute("value", "https://opentdb.com/api.php?amount=13&category=21");
    $("#buttons").append(newButton);

    $(".start").click(function() {
        console.log(this.value);
        getURL = this.value;
        console.log(getURL);
            pullData(getURL);
    })
}
