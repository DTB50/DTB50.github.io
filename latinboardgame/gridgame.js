

$( function() {
  ///////////////////////////////////////////////////////////////////
  //  GAME CONTROL VARIABLES  ///////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  var gameNotYetWon = true;

  var lives;
  var targets;
  var currentSessionStage;
  var playerLevel;

  var roundScore = 0;
  var sessionScore = 0;

  var currentRoundTime;

  var wordsUsedThisGame = [];
  var wordsUsedThisRound = [];

  var matchesThisSession = [];

  var needToRevise = [];

  var lastBGClassAdded;


var userDirectionHeadWord;


  var checkDuplicateArray = [];

// Board game global variables //////////////////////////////////////////////////

var grid;

var boardHeight = 7;
var boardWidth = 7;

var playerx;
var playery;


var swapToX;
var swapToY;

var currentBoardHeadWordArray;

var boardWordBank = data;

var miniGameWon = false;

var currentBoardGrid;


  ////////////////////////////////////////////////////////////////////
  //  INITIALISE GAME  ///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  function displayButton () {
    $('#taskBar').hide();
    addPadding();


    var headerText = $("<div></div>");
    headerText.addClass("titles");
    headerText.html("ROMANI ITE DOMUM");
    $("#content").append(headerText);
    //display rules, and make clickable to change language
    var introText = $("<div></div>");
    introText.attr("id", "introText");
    introText.addClass("introText");
    introText.attr("language", "latin");
    introText.html("Maximus regressus est ab itinere. Inter eum et domum silva iacet multos lacus continens quae impedit quominus domum redeat. Iuva eum domum redire antequam nox eveniat. </br> </br> Spatia moveri adrepit eligit flavis quadratum quadrato quod pluma canos sermonem trahunt synonyma tum verbi rectangulum rhoncus eu. Vos can non occurrerint errata in hoc ludum. </br> </br> Illico duo spatia eligere rhoncus cinereo tegulis quadratum impar apud aurantia in quibus continentur verba referuntur. Tu potes facere duo errata in hoc ludum.</br> </br>  Conare ante noctem domum pervenire. Tempus perdis si iocum non bene perficis! </br></br> <b>(Click this text to see English translation)</b>");

    introText.click(function() {
      var language = $(this).attr("language");
      changeLanguage(language,
                      $(this).attr("id"),
                      "Maximus regressus est ab itinere. Inter eum et domum silva iacet multos lacus continens quae impedit quominus domum redeat. Iuva eum domum redire antequam nox eveniat. </br> </br> Spatia moveri adrepit eligit flavis quadratum quadrato quod pluma canos sermonem trahunt synonyma tum verbi rectangulum rhoncus eu. Vos can non occurrerint errata in hoc ludum. </br> </br> Illico duo spatia eligere rhoncus cinereo tegulis quadratum impar apud aurantia in quibus continentur verba referuntur. Tu potes facere duo errata in hoc ludum.</br> </br>  Conare ante noctem domum pervenire. Tempus perdis si iocum non bene perficis! </br></br> <b>(Click this text to see English translation)</b>",
                      "Maximus has returned from his journey. </br>  He is separated from his home by a forest full of lakes that block his path. </br> Help him get home to his wife before nightfall. </br> </br> To move to an adjacent space, select a yellow square with a word in it, then drag the grey squares which feature synonyms of that word onto the orange rectangle. You cannot make any mistakes in this game. </br> </br> To jump two spaces, select an orange square and match words in the grey squares to the words in the orange squares to which they are related. You can make two mistakes in this game. </br> </br> Failed games result in lost time. Try to get home before nightfall! </br></br> <b>(Click this text to return to Latin)</b>"
                    )});
    // introText.click(function() {
    //   if ($('.introText').attr("language") == "latin") {
    //     $('.introText').attr("language", "english")
    //     $('.introText').html("Maximus has returned from his journey. </br>  He is separated from his home by a forest full of lakes that block his path. </br> Help him get home to his wife before nightfall. </br> </br> To move to an adjacent space, select a yellow square with a word in it, then drag the grey squares which feature synonyms of that word onto the orange rectangle. You cannot make any mistakes in this game. </br> </br> To jump two spaces, select an orange square and match words in the grey squares to the words in the orange squares to which they are related. You can make two mistakes in this game. </br> </br> Failed games result in lost time. Try to get home before nightfall! </br></br> <b>(Click this text to return to Latin)</b>");
    //   }
    //   else if ($('.introText').attr("language") == "english") {
    //     $('.introText').attr("language", "latin")
    //     $('.introText').html("Maximus iter suum habet a rediit. </br> Conare ante noctem domum pervenire. Tempus perdis si iocum non bene perficis! </br> </br> Spatia moveri adrepit eligit flavis quadratum quadrato quod pluma canos sermonem trahunt synonyma tum verbi rectangulum rhoncus eu. Vos can non occurrerint errata in hoc ludum. </br> </br> Illico duo spatia eligere rhoncus cinereo tegulis quadratum impar apud aurantia in quibus continentur verba referuntur. Tu potes facere duo errata in hoc ludum.</br> </br>  Conare ante noctem domum pervenire. Tempus perdis si iocum non bene perficis! </br></br> <b>(Click this text to see English translation)</b>");
    //   }
    // })
    $("#content").append(introText);

    var startButton = $('<div></div>');
    startButton.html("Incipe!");
    startButton.addClass("startButton");
    startButton.click(startGame);
    $("#content").append(startButton);

    addPadding();
  }


  function startGame() {
    //pick a wordset
    currentBoardHeadWordArray = pickInitialWordBank();
    //start the game
    initBoard();
    dayTimer(300);
  }

  //ACTUALLY START THE GAME
  displayButton();

  //////////////////////////////////////////////////////////////////////////////////
  // HELPER FUNCTIONS  ////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////
  //  BOARD GENERATING FUNCTIONS  ////////////////////////////////////
  ////////////////////////////////////////////////////////////////////

  //SET UP UNDERLYING CONTROL GRID
    function initBoard() {
      //clear the window
      $("#content").empty();
      var boardGrid = [];
    //push 62 points of data into an array, shuffle them
      for (let i = 0; i < 55; i++) {
        boardGrid.push("ground")
      }
      for (let j = 1; j < 8; j++) {
        boardGrid.push("water")
      }
      var unfinishedGridLength = boardGrid.length;
      var keyPointsBlocked = true;
      var startEndSpaces = [0, 0+boardHeight, 1+boardHeight, unfinishedGridLength-boardHeight-1, unfinishedGridLength-boardHeight, unfinishedGridLength-1];
      console.log(startEndSpaces);
        //randomise order of entries to create terrain
        while (keyPointsBlocked == true) {
          boardGrid = shuffle(boardGrid);
          // console.log("After being shuffled, gridArray is: ");
          // console.log(boardGrid);
          var blockCheckArray = [];
            for (let l = 0; l < startEndSpaces.length; l++){
              blockCheckArray.push(boardGrid[startEndSpaces[l]]);
            }
            console.log(blockCheckArray);
            if (blockCheckArray.includes("water")){
                keyPointsBlocked = true;
              }
            else {
              keyPointsBlocked = false;
            }
          }

        boardGrid.unshift("player")
        boardGrid.push("end");

        //then split that array into arrays of 3 this will be the minigame grid
        let finalBoardGrid = [];
        for (var split = 0; split < 8; split++){
          let temp = boardGrid.splice(0, 8);
          finalBoardGrid.push(temp);
        }
        // console.log("finalGridArray is: ");
        // console.log(finalBoardGrid)
        finalGrid = finalBoardGrid.slice();

        //SAVE THE GRID TO GLOBAL STATUS - NEEDED TO REBUILD AFTER MINIGAME
        currentBoardGrid = finalGrid.slice();

    //FINALLY, MAKE THE GRID USING THE ABOVE
      makeBoard(finalGrid);
    }

  //show the grid
  function makeBoard (grid) {
    $("#content").empty();

    // let boardHeight = 7;
    // let boardWidth = 7;
    //make a new row
    for (row = 0; row <= boardHeight; row++){
      let newRow = $('<tr></tr>');
      //fill it with cells
      for (col = 0; col <= boardWidth; col++){
        //fill each cell with a tile containing an image element
        //for a movable tile (grass)
        if (grid[row][col] == "ground"){
          let newTile= $('<td></td>').addClass("ground");
          newTile.attr("x", col);
          newTile.attr("y", row);
          let cellId = "cell" + row + col;
          newTile.attr("id", cellId);
          newRow.append(newTile);
        }
        //for a non-movable tile (water)
        else if (grid[row][col] == "water") {
          let newTile = $('<div></div>').addClass("water");
          newTile.attr("x", col);
          newTile.attr("y", row);
          let cellId = "cell" + row + col;
          newTile.attr("id", cellId);
          newRow.append(newTile);
        }
        //for the player tile
        else if (grid[row][col] == "player"){
          let newTile = $('<div></div>').addClass("player");
          newTile.attr("playerx", col);
          newTile.attr("playery", row);
          let cellId = "cell" + row + col;
          newTile.attr("id", cellId);
          newRow.append(newTile);

        }
        //for the goal
        else if (grid[row][col] == "end"){
          let newTile = $('<div></div>').addClass("endpoint");
          newTile.attr("x", col);
          newTile.attr("y", row);
          newTile.attr("endx", col);
          newTile.attr("endy", row);
          let cellId = "cell" + row + col;
          newTile.attr("id", cellId);
          newRow.append(newTile);
        }
      }
    $('#content').append(newRow);
    }

    //update the UI text helper
  showTask("selectSpace");

  //put the player on the board
  locatePlayer(grid);
  };

  // DETERMINE PLAYER COORDINATES THIS TURN
  function locatePlayer (grid) {
    for (row = 0; row <= boardHeight; row++){
      for (col = 0; col <= boardWidth; col++){
        if (grid[row][col] == "player"){
          playerx = col;
          playery = row;
          // console.log("Player is at column " + playerx);
          // console.log("Player is at column " + playerx);
          boardGameWinCheck();
        }
      }
    }
    setTimeout(function(){
      placeWords(grid, playery, playerx);
    }, 500);

  };

  // PLACE HEADWORDS AROUND PLAYER
  //scan for valid squares around player (within board and not water)
  function placeWords(grid, playery, playerx) {
      // console.log("player is at col " + playerx + " and row " + playery);

      // X and Y offsets for all 8 neighbours
      //Uses code snippet for finding valid squares from "CS5003-W4-Minesweeper.js" example provided by Dr Kasim Terzic (2018);
      let offsetx = [ -1, 0, 1, -1, 1, -1, 0, 1 ];
      let offsety = [ -1, -1, -1, 0, 0, 1, 1, 1 ];

      var squareCount = 0;
      var movableCellArray = [];

      for(let i=0; i<8; i++) {
          let newx = playerx+offsetx[i];
          let newy = playery+offsety[i];

          // Check that we are not indexing outside the array
          if(newx < 0 || newx > boardWidth || newy < 0 || newy > boardHeight )
              continue;
          //check that the tile isn't water
          if(grid[newy][newx] != "water" ) {
            //grab random word and assign it to the square
            squareCount++;
            let cellToReplace = "#cell" + newy + newx;
            // console.log("safe to place word in cell " + cellToReplace);
            movableCellArray.push(cellToReplace);
            placeGambleTiles(grid, playery, playerx, offsetx[i], offsety[i]);
          }
          else if (grid[newy][newx] == "water"){
            let cellNotToReplace = "#cell" + newy + newx;
            // console.log("not placing word in cell " + cellNotToReplace);
          }
      }
      // console.log(movableCellArray);
      // console.log("squarecount is: " + squareCount);
      var wordsToPlace = pickMovableHeadWordsAtRandom(currentBoardHeadWordArray, squareCount);
      // console.log("words to place are: ");
      // console.log(wordsToPlace);
      // console.log("AVAILABLE WORDS");
      // console.log(currentBoardHeadWordArray);
      for (let j = 0; j < movableCellArray.length; j++) {
        var cellToReplace = movableCellArray[j];
        let wordToPlace = wordsToPlace[j];
        // console.log(wordToPlace);
        // console.log(wordToPlace.synonyms);
        // console.log("placing word in cell " + cellToReplace);
        $(cellToReplace).addClass("headWordSquare");
        $(cellToReplace).html(wordToPlace.headWord);
        $(cellToReplace).attr("headWord", wordToPlace.headWord);
        $(cellToReplace).data("synonyms", wordToPlace.synonyms);
        $(cellToReplace).data("chosenWordObject", wordToPlace)
        $(cellToReplace).click(pickDirection);
      }
  }


//DETERMINE TILES TO PLACE GAMBLE SPOT FOR ONE
function placeGambleTiles (grid, playery, playerx, offsetx, offsety) {
  // console.log("now trying to place gamble tiles");
  // console.log("player is at col " + playerx + " and row " + playery);
  // console.log("square being assessed is at col " + (playerx+offsetx) + " and row " + (playery+offsety));
  var newoffsetx;
  var newoffsety;

  var xArray = [];
  var yArray = [];
  //if the square if not water, push its corrdinates into a new set of arrays

  //diagonal top left
  if (offsetx == -1 && offsety == -1){
    newoffsetx = -2;
    newoffsety = -2;
    xArray.push(newoffsetx);
    yArray.push(newoffsety);
  }
  //top
  else if (offsetx == 0 && offsety == -1){
      newoffsetx = 0;
      newoffsety = -2;
      xArray.push(newoffsetx);
      yArray.push(newoffsety);
    }
  // diagonal top right
  else if (offsetx == 1 && offsety == -1){
      newoffsetx = 2;
      newoffsety = -2;
      xArray.push(newoffsetx);
      yArray.push(newoffsety);
    }
  // right
  else if (offsetx == 1 && offsety == 0){
      newoffsetx = 2;
      newoffsety = 0;
      xArray.push(newoffsetx);
      yArray.push(newoffsety);
    }
  // diagonal bottom right
  else if (offsetx == 1 && offsety == 1){
      newoffsetx = 2;
      newoffsety = 2;
      xArray.push(newoffsetx);
      yArray.push(newoffsety);
    }
  // bottom
  else if (offsetx == 0 && offsety == 1){
      newoffsetx = 0;
      newoffsety = 2;
      xArray.push(newoffsetx);
      yArray.push(newoffsety);
    }
  // diagonal bottom left
  else if (offsetx == -1 && offsety == 1){
      newoffsetx = -2;
      newoffsety = 2;
      xArray.push(newoffsetx);
      yArray.push(newoffsety);
    }
  // left
  else if (offsetx == -1 && offsety == 0){
      newoffsetx = -2;
      newoffsety = 0;
      xArray.push(newoffsetx);
      yArray.push(newoffsety);
    }

  var gambleSquareCount = 0;
  var gambleCellArray = [];

//iterate through the arrays (in this case arrays of just one values) to place gamble tiles
  for(let i=0; i<1; i++) {
      let newerx = playerx+xArray[i];
      let newery = playery+yArray[i];

      // console.log("trying to place gamble tile at x=" + newerx + " and y=" + newery);
      // Check that we are not indexing outside the array
      // Check that we are not indexing outside the array
      if(newerx < 0 || newerx > boardWidth || newery < 0 || newery > boardHeight )
          continue;
      //check that the tile isn't water
      if(grid[newery][newerx] != "water" ) {
        //grab random word and assign it to the square
        gambleSquareCount++;
        let cellToReplace = "#cell" + newery + newerx;
        // console.log("safe to place gamble tile in cell " + cellToReplace);
        gambleCellArray.push(cellToReplace);
      }
      else if (grid[newery][newerx] == "water"){
        let cellNotToReplace = "#cell" + newery + newerx;
        // console.log("not placing gamble tile in cell " + cellNotToReplace);
      }
    }
//now put the tiles down to allow the player to play the jump minigame
  for (let j = 0; j < gambleCellArray.length; j++) {
      var cellToReplace = gambleCellArray[j];
      // console.log("placing gamble square in cell " + cellToReplace);
      $(cellToReplace).addClass("gambleSquare");
      $(cellToReplace).html("Salire");
      $(cellToReplace).click(pickJumpDirection);
    }
  };


  // START GAME BASED ON USER DIRECTION
  function pickDirection() {

    var chosenTile = $(this).attr("id");
    // console.log("chosenTile =  " + chosenTile);
    var chosenWord = $(this).attr("headWord");
    // console.log(chosenWord);
    var chosenWordSyns = $(this).data("synonyms");
    // console.log(chosenWordSyns);
    var chosenWordObject = $(this).data("chosenWordObject");
    // console.log(chosenWordObject);

    swapToX = $(this).attr("x");
    swapToY = $(this).attr("y");

    playMiniGame(chosenWord, chosenWordSyns, currentBoardHeadWordArray);
  };


  // START JUMP GAME BASED ON USER DIRECTION
  function pickJumpDirection() {

    swapToX = $(this).attr("x");
    swapToY = $(this).attr("y");

    playSingleRoundGame(currentBoardHeadWordArray);
  };


//IF PLAYER PASSES THE MINIGAME, MAKE THEIR DESIRED MOVE
    function makeTheMove(){
      currentBoardGrid[swapToY][swapToX] = "player";
      currentBoardGrid[playery][playerx] = "ground";
      // console.log(currentBoardGrid);
      makeBoard(currentBoardGrid);
    }



 function playMiniGame (chosenWord, chosenWordSyns, currentBoardHeadWordArray) {
   //for currentBoard - clear the board and set up necessary UI
   $("#content").empty();
   addPadding();

   //select words and display tiles
   miniGamePickWords(chosenWord, chosenWordSyns, currentBoardHeadWordArray);
 }


  //////////////////////////////////////////////////////////////////////////////
  //  BOARD  DATA SETUP FUNCTIONS  /////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  function pickInitialWordBank () {
        // make array of objects associating synonyms with headwords (matchArray)
        var wordBank = data;

        var gridArray;
        var grid;

        //group words by number of synonyms:
        var initialWordBank1syn = [];
        var initialWordBank2syn = [];
        var initialWordBank3syn = [];
        var initialWordBank4plussyn = [];

        for (let i = 0; i < wordBank.length; i++) {
          if (wordBank[i].answers.length == 1) {
            let currentWord = wordBank[i];
            initialWordBank1syn.push(currentWord);
          }
          else if (wordBank[i].answers.length == 2) {
            let currentWord = wordBank[i];
            initialWordBank2syn.push(currentWord);
          }
          else if (wordBank[i].answers.length == 3) {
            let currentWord = wordBank[i];
            initialWordBank3syn.push(currentWord);
          }
          else if (wordBank[i].answers.length >= 4) {
            let currentWord = wordBank[i];
            initialWordBank4plussyn.push(currentWord);
          }
        }

        //now out of each of those arrays, pull a specified number of random ones into the actual workBankSyn
        //that the game will be based on
        //
        var wordBank1or2syn = pickInitialHeadWordsAtRandom(initialWordBank1syn.concat(initialWordBank2syn), 3);
        var wordBank3syn = pickInitialHeadWordsAtRandom(initialWordBank3syn, 3);
        var wordBank4plussyn = pickInitialHeadWordsAtRandom(initialWordBank4plussyn, 2);

        //now concatenate them all into another array
        var thisGameWordBank = wordBank1or2syn.concat(wordBank3syn, wordBank4plussyn)
        // console.log("initial words are: ");
        // console.log(thisGameWordBank);

        return thisGameWordBank;
      }

  function miniGamePickWords(chosenWord, chosenWordSyns, currentBoardHeadWordArray) {
    //display word to match
    //display chosen word

    var headWordBox = $("<div></div>");
    headWordBox.addClass("headWordBox");
    headWordBox.append(chosenWord);
    $("#content").append(headWordBox);

    currentBoardHeadWordArray;

    //pick 3 headwords from around the player including the player's chosen word (if less than three, pick 2 and add more words)

    //
    showTermsMiniGame(currentBoardHeadWordArray, chosenWord, chosenWordSyns);
  };

  //For initial board word setup
    function pickInitialHeadWordsAtRandom(words, numberNeeded){
      //copy original wordBank in full and make new storage array for chosen words
      let tempWordBank = words.slice();
      var outputArray = [];
      // console.log("When selecting words for the game, tempWordBank is: ");
      // console.log(tempWordBank);
      // console.log("at start of pickWordsAtRandom, original wordBank is")
      // console.log(words);
      //get as many numbers as needed from the copied wordBank into that array
      for (var i = 0; i < numberNeeded; i++){
        //define length of workbank array as it stands
        let tempWordBankLength = tempWordBank.length;
        //initialise duplicate checking variable;
        var headWordClear = false;
        //select random word entry from current array - looping until it is
        var randomIndex;
        //definitely true that no synonyms in the array are already in the array of synonyms used in this game
        while (headWordClear == false)
        {
          //pick a random word
          randomIndex = Math.floor(Math.random()*tempWordBankLength);
          //check that it will not result in duplicate tiles
          //for each synonym of that headword, check if it appears in the synonym array
          var chosenWord = tempWordBank[randomIndex];
          var wordClear = true;
          for (let j = 0; j < chosenWord.answers.length; j++)
          {
              if (checkDuplicateArray.includes(chosenWord.answers[j]))
              {
                synonymClear = false;
                headWordClear = false;
                // console.log(chosenWord.answers[j] + "is already used: picking again");
              }
              else
              {
                wordClear = true;
                // console.log("synonym is clear for use!")
              }
          }
            headWordClear = true;
            // console.log("headword is clear for use!");
      }
        //stick that entry into the output array
        chosenWord.wordType = "headWord";
        outputArray.push(chosenWord);
        //and put its synonyms into the checkDuplicateArray array for future comparison
        checkDuplicatearray = checkDuplicateArray.concat(chosenWord.answers);
        //remove chosen item from initial word bank array
        //splice usage from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        tempWordBank.splice(randomIndex, 1);
        }
        // console.log("At end of pickWordsAtRandom, outputArray is: ");
        // console.log(outputArray);
        // console.log("and original wordBank is: ");
        // console.log(words);
        return outputArray;
    };

    //For initial board word setup
      function pickMovableHeadWordsAtRandom(words, numberNeeded){
        //copy original wordBank in full and make new storage array for chosen words
        let tempWordBank = words.slice();
        var outputArray = [];
        // console.log("When selecting words for the movable squares, tempWordBank is: ");
        // console.log(tempWordBank);
        // console.log("at start of pickWordsAtRandom, original wordBank is")
        // console.log(words);
        //get as many numbers as needed from the copied wordBank into that array
        for (var i = 0; i < numberNeeded; i++){
          //define length of workbank array as it stands
          let tempWordBankLength = tempWordBank.length;
          //initialise duplicate checking variable;
          var headWordClear = false;
          //select random word entry from current array - looping until it is
          var randomIndex;
          //definitely true that no synonyms in the array are already in the array of synonyms used in this game
          while (headWordClear == false)
          {
            //pick a random word
            randomIndex = Math.floor(Math.random()*tempWordBankLength);
            //check that it will not result in duplicate tiles
            //for each synonym of that headword, check if it appears in the synonym array
            var chosenWord = tempWordBank[randomIndex];
            var wordClear = true;
            for (let j = 0; j < chosenWord.answers.length; j++)
            {
                if (checkDuplicateArray.includes(chosenWord.answers[j]))
                {
                  synonymClear = false;
                  headWordClear = false;
                  // console.log(chosenWord.answers[j] + "is already used: picking again");
                }
                else
                {
                  wordClear = true;
                  // console.log("synonym is clear for use!")
                }
            }
              headWordClear = true;
              // console.log("headword is clear for use!");
        }
          //stick that entry into the output array
          chosenWord.wordType = "headWord";
          outputArray.push(chosenWord);
          //and put its synonyms into the checkDuplicateArray array for future comparison
          checkDuplicatearray = checkDuplicateArray.concat(chosenWord.answers);
          //remove chosen item from initial word bank array
          //splice usage from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
          tempWordBank.splice(randomIndex, 1);
          }
          // console.log("At end of pickWordsAtRandom, outputArray is: ");
          // console.log(outputArray);
          // console.log("and original wordBank is: ");
          // console.log(words);
          return outputArray;
      };

  function showTermsMiniGame(headArray, chosenWord, chosenWordSyns, grid) {
    // console.log("at showtermsminigame, headArray is: ");
    // console.log(headArray)
    // console.log("at showtermsminigame, chosenWord is: ");
    // console.log(chosenWord)
    // console.log("at showtermsminigame, chosenWordSyns are: ");
    // console.log(chosenWordSyns);

    var headArray = headArray;
    var miniGameGrid = selectMiniGameWords(headArray, chosenWord, chosenWordSyns);

      //print head words and answers on screen in divs for a certain amount of time
      let header = $("<div></div>");
      header.html("DISCE HAEC VERBA");
      header.addClass("titles");
      $("#content").append(header);

      for (let i = 0; i < headArray.length; i++) {
        let newDiv = $("<div></div>");
        var headWordText = headArray[i].headWord;
        var answersArray = headArray[i].answers;
        var answersText = answersArray.toString();
        answersText = answersText.replace(/,/g, ", ");
        newDiv.html(headWordText + " : " + answersText);
        $("#content").append(newDiv);
      }

      //display button to start round
      var skipButton = $('<div></div>');
      skipButton.html("Incipe!");
      skipButton.addClass("startButton");
      skipButton.click(function(){
        displayMiniGameGrid(chosenWord, chosenWordSyns, miniGameGrid)
      });
      $("#content").append(skipButton);

      showTask("learnWords");
    };

    //show the grid and start the timer
    function displayMiniGameGrid (chosenWord, chosenWordSyns, grid) {
      //empty content box
      $("#content").empty();
      addPadding();
      //place the headWord box and make it droppable
      var headWordBox = $("<div></div>");
      headWordBox.addClass("headWordBox");
      headWordBox.data("headWord", chosenWord);
      //determine how many "hits" it has
      var chosenSynsNum = chosenWordSyns.length;
      var matchesLeft;
      if (chosenSynsNum == 1) {
        matchesLeft = 1;
      }
      else if (chosenSynsNum == 2) {
        matchesLeft = 2;
      }
      else if (chosenSynsNum == 3) {
        matchesLeft = 3;
      }
      else if (chosenSynsNum > 3){
        matchesLeft = 3;
      }
      // console.log("matches needed = " + matchesLeft);
      headWordBox.attr("matchesLeft", matchesLeft);
      //print content in the box
      headWordBox.html(chosenWord + " - " + matchesLeft + " matches left");
      //put it on the grid
      $("#content").append(headWordBox);

      let gridHeight = 3;
      let gridWidth = 3;
      //make a box to put the new grid into
      var miniGameBox = $("<div></div>");
      miniGameBox.addClass("miniGameBox");

      // make a new row
      for (row = 0; row < gridHeight; row++){
        let newRow = $('<tr></tr>');
        //fill it with cells
        for (col = 0; col < gridWidth; col++){
          var newCell = $('<td></td>').addClass("grid");
          //fill each cell with a card containing relevant data
          //for a draggable synonym answer cell
            let newCard = $('<div></div>').addClass("makeMeDraggable");
            // Centres text in cells - uses CSS styling from stackoverflow user Jason Gennaro
            //in response to stackoverflow user Jose Faeti's query located  at https://stackoverflow.com/questions/7453868/how-can-i-make-my-text-appear-in-the-center-of-this-div-both-vetically-and-horiz
            let newCardText = $('<div></div>');
            newCardText.text(grid[row][col].syn);
            newCardText.attr("class", "centredText");
            newCard.append(newCardText);
            newCard.data("value", grid[row][col].syn);
            newCard.data("matchesAttempted", 0);
            newCard.data("matchingHead", grid[row][col].head);
            newCell.append(newCard);
            newRow.append(newCell);
          }
      //put it onto the table
      miniGameBox.append(newRow);
    }
    $("#content").append(miniGameBox);

    //Assign draggable and droppable qualities to tiles
    //Source -  code for making squares draggable and droppable modified from https://www.elated.com/articles/drag-and-drop-with-jquery-your-essential-guide/
      //make synonym squares draggable, appear on top, and revert to position if not accepted by box
        $('.makeMeDraggable').draggable({
          revert: true,
          revertDuration: 100,
          containment: "#content",
          cursor: "move",
          //For making draggables stack: http://www.pureexample.com/jquery-ui/draggable-options-stack.html
          stack: ".makeMeDraggable",
          start: idSquare,
          hover: "makeMeDraggable-hover"
        });

      //make headwords droppable
        $('.headWordBox').droppable( {
          drop: miniGameDropCheck
        } );


      //show the UI HELPER
      showTask("playMiniGame");
    };

  function idSquare(event) {
    var draggedValue = $(this).data("matchingHead");
    draggedValue = "'" + draggedValue + "'"
    // console.log("on pickup, dragged item's headword is' " + draggedValue);
  };


//SELECT WORDS FOR MINIGAME
function selectMiniGameWords (headArray, chosenWord, chosenWordSyns) {
  let tempHeadArray = headArray.slice();
  // console.log("Going into selectMiniGameWords");
  // console.log(tempHeadArray);
  var tileSyns = [];

  var otherSynsNeeded;
  var answersNeeded;
  var chosenSynsNum = chosenWordSyns.length;
  chosenSynsNum;
  // console.log("answersNeeded = " + answersNeeded);
  // console.log("chosenSynsNum = " + chosenSynsNum);
  // console.log(chosenWordSyns);
  if (chosenSynsNum == 1) {
    answersNeeded = 1;
    otherSynsNeeded = 8;
  }
  else if (chosenSynsNum == 2) {
    answersNeeded = 2;
    otherSynsNeeded = 7;
  }
  else if (chosenSynsNum == 3) {
    answersNeeded = 3;
    otherSynsNeeded = 6;
  }
  else {
    answersNeeded = 3;
    otherSynsNeeded = 6;
  }

  var answersArray = [];
  //isolate the headword, push in the required number of synonyms from it, and delete it from the array
  for (let i = 0; i < tempHeadArray.length; i++){
    if (tempHeadArray[i].headWord == chosenWord) {
      answersArray.push(headArray[i]);
      tempHeadArray.splice(i, 1);
    }
  }
  var correctSyns = miniGamePickRandomSyns(answersArray[0].synonyms, answersNeeded, answersArray[0].headWord);
  // console.log("remaining words to pick from are...");
  // console.log(tempHeadArray);

  //pick the rest of the tiles from the others in the arrays
  var wrongSyns = [];
  for (let j = 0; j < tempHeadArray.length; j++) {
    for (let k = 0; k < tempHeadArray[j].synonyms.length; k++) {
      var newRedHerringTileData = new redHerringTileObject(tempHeadArray[j].synonyms[k], tempHeadArray[j].headWord);
      wrongSyns.push(newRedHerringTileData);
    }
  }
  //now randomise the wrongsyns array and cut it down to length of otherSynsNeeded;
  shuffle(wrongSyns);
  wrongSyns = wrongSyns.slice(0, otherSynsNeeded);
  //take array of right and wrong tiles and put them together - this will make the round play
  tileSyns = correctSyns.concat(wrongSyns);
  //now shuffle everything again to randomise the order of tileSyns
  shuffle(tileSyns);
  // console.log("this round will be played with the following synonyms");
  // console.log(tileSyns);

  //then split that array into 3 arrays of 3: this will be the grid
  let finalGridArray = [];
  for (var split = 0; split < 3; split++){
    let temp = tileSyns.splice(0, 3);
    finalGridArray.push(temp);
  }
  // console.log("finalGridArray is: ");
  // console.log(finalGridArray)
  // console.log("and original wordBank is: ");
  // console.log(wordBank);
  let miniGameGrid = finalGridArray.slice();

  return miniGameGrid;
}

  //SELECT RANDOM WORDS - BUT REMOVE FROM ARRAY
    function miniGamePickRandomSyns(words, numberNeeded, head){
      // console.log("pickAndRemoveRandomWords is active");
      // console.log(words);
      //make new storage array for chosen words
      let synTileHead = head;
      var tempBank = words.slice();
      var outputArray = [];
      // console.log("for head: ");
      // console.log(head);
      // console.log("at pick and removRandomWords: ");
      // console.log("numberNeeded = " + numberNeeded);
      // console.log("and tempbank is");
      // console.log(tempBank);
      //get as many words as needed into that array
      for (var i = 0; i < numberNeeded; i++){
        //define length of workbank array as it stands
        let tempWordBankLength = tempBank.length;
        //select random word entry from current array
        let randomIndex = Math.floor(Math.random()*tempWordBankLength);
        //put it into an object
        let randomSyn = tempBank[randomIndex].slice();
        // console.log("before going into object, randomSyn is: " + randomSyn + "and head is: " + head);
        var newSynTileData = new SynonymTileObject(randomSyn, synTileHead);
        //stick that entry into the output array
        // console.log(newSynTileData);
        outputArray.push(newSynTileData);
        //remove chosen item from initial word bank array
        //splice usage from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        tempBank.splice(randomIndex, 1);
        }
        return outputArray;
    };

    //Package up synonym tile data into synonym tile object (for unpacking when board is created)
    function SynonymTileObject(syn, head) {
      this.syn = syn;
      this.head = head;
      this.wordType = "synonym";
    };


  //Package up synonym tile data into synonym tile object (for unpacking when board is created)
  function SynonymTileObject(syn, head) {
    this.syn = syn;
    this.head = head;
    this.wordType = "synonym";
  };

  //Package up synonym tile data into synonym tile object (for unpacking when board is created)
  function redHerringTileObject(syn, head) {
    this.syn = syn;
    this.head = head;
    this.wordType = "redHerring";
  };

  //add padding element to push minigame box down
  function addPadding(){
    var padding = $("<div></div>");
    padding.addClass("padding");
    $("#content").append(padding);
  }

    //Note: The Fisher-Yates shuffle algorithm snippet used below was written by Mike Bostock, sourced from https://bost.ocks.org/mike/shuffle/
    function shuffle(array) {
      var m = array.length, t, i;
      // While there remain elements to shuffle…
      while (m) {
        // Pick a remaining element…
        i = Math.floor(Math.random() * m--);
        // And swap it with the current element.
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }

      return array;
    }

  /////////////////////////////////////////////////////////////////////////
  // CORE GAME LOGIC  /////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////

  //DROPPABLE ITEM EVENT HANDLER - ACCEPT OR REJECT USER ANSWER
  function miniGameDropCheck(event, ui) {
    var draggable = ui.draggable;
    var droppable = $(this);

    var draggedHeadWord = draggable.data("matchingHead");
    var draggedAnswer = draggable.data("value");
    var droppableAnswers = droppable.data("synonyms");
    var droppableHeadWord = droppable.data("headWord");
    // console.log("headWord is = " + droppableHeadWord);
    // console.log("user's synonym is = " + draggedHeadWord);
    // console.log("acceptable synonyms are = " + droppableAnswers);

    //check if draggable is a valid answer for the droppable
    //if yes, update droppable's hits remaining, make draggable disappear, update player score
    if (droppableHeadWord == draggedHeadWord) {
      var matchesLeftNow = $(this).attr("matchesLeft");
      matchesLeftNow--;
      $(this).attr("matchesLeft", matchesLeftNow);
      // console.log("Matches left = " + $(this).attr("matchesLeft"));
      $(this).html(droppableHeadWord + " - " + matchesLeftNow + " matches left");
      draggable.fadeOut(500, function() {
        if (draggable.data("matchesAttempted") < 1) {
          chime.play();
          correctChoiceFeedbackUpdate(droppableHeadWord, draggedAnswer);
        }
      })
      //and if the hit counter on the droppable is depleted, make it disappear and check if game is won
      if ($(this).attr("matchesLeft") == 0){
        // draggable.attr("revert", false);
        $(this).fadeOut(500, function() {
          giveFeedback("win");
        });
      };
    }
    //if not a match, decrease player lives and increase matchesAttempted on the dragged tile
    else {
      incorrectChoiceFeedbackUpdate (draggedAnswer);
      // loseLife();
      mistakeSound.play();
      giveFeedback("lose");
    }

  };

  //////////////////////////////////////////////////////////////////////////////
  //  FEEDBACK FUNCTIONS  //////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////

  //UPDATE ARRAY OF CORRECT WORDS
  function correctChoiceFeedbackUpdate (headWord, answer) {
    var rightHeadWord = headWord;
    var rightSynonym = answer;
    var newRightArray = [];
    newRightArray.push(rightHeadWord);
    newRightArray.push(rightSynonym);
    matchesThisSession.push(newRightArray);
    // console.log(matchesThisSession);
  };

  //UPDATE ARRAY OF WORDS THAT WEREN'T CORRECT FIRST TIME
  function incorrectChoiceFeedbackUpdate (answer) {
    var wrongSynonym = answer;
    if (!needToRevise.includes(wrongSynonym)){
    needToRevise.push(wrongSynonym);
    }
    // console.log(needToRevise);
  }

  //FEEDBACK - SHOW TILES CORRECTLY MATCHES FIRST TIME AND PROMPT USER WITH SOLUTIONS TO WRONG MATCHES
  function giveFeedback (outcome) {
    $("#content").empty();
    addPadding();
      //Create necessary box for displaying feedback
      var feedbackBox = $("<div></div>");
      feedbackBox.attr("id", "feedbackBox");
      //Words to revise - if these are any words to revise
      //Put up a header saying to revise these words
      if (needToRevise.length > 0) {
        let wrongHeadRow = $('<div></div>');
        wrongHeadRow.html("HAEC ITERUM INSPICE");
        wrongHeadRow.attr("id", "wrongHeadRow");
        feedbackBox.append(wrongHeadRow);

        //then for each word in needToRevise, make a new feedback row
        for (let row = 0; row < needToRevise.length; row++){
          let newRow = $('<tr></tr>');
          //first find matching headWord from the words used in this round
          for (let i = 0; i < currentBoardHeadWordArray.length; i++){
            if (currentBoardHeadWordArray[i].answers.includes(needToRevise[row])) {
              var correctHeadWord = currentBoardHeadWordArray[i].headWord;
            }
          }
          //fill it with cells  "answer" "is in fact a synonym of" "headword"
          let newCellLeft = $('<td></td>').addClass("feedbackRight");
          newCellLeft.html(needToRevise[row]);
          let newCellMiddle = $('<td></td>').html("==>");
          let newCellRight = $('<td></td>').addClass("feedbackRight");
          newCellRight.html(correctHeadWord);

          newRow.append(newCellLeft);
          newRow.append(newCellMiddle);
          newRow.append(newCellRight);

          feedbackBox.append(newRow);
          }
        }

      //Correct matches
        //Align matches by headword (group in alphabetical order)
        //Sort function taken from StackOverflow user Martin Milan's answer to the query at https://stackoverflow.com/questions/5435228/sort-an-array-with-arrays-in-it-by-string
        if (matchesThisSession.length > 0){
        function Comparator(headWordA, headWordB) {
           if (headWordA[0] < headWordB[0]) return -1;
           if (headWordA[0] > headWordB[0]) return 1;
           return 0;
        }
        matchesThisSession.sort(Comparator);
        //make a header
        let rightHeadRow = $('<div></div>');
        rightHeadRow.attr("id", "rightHeadRow");
        rightHeadRow.html("PRIMUM HAEC BEN FECISTI");
        feedbackBox.append(rightHeadRow);

        var headWordsPrinted = [];
        //go through the various correctly chosen words, printing feedback boxes for them
        for (let row = 0; row < matchesThisSession.length; row++){
          let newRow = $('<tr></tr>');
          //fill it with cells in order "headword" followed by "synonym"
          if (!(headWordsPrinted.includes(matchesThisSession[row][0]))){
          var newCellLeft = $('<td></td>').addClass("feedbackRight");
          newCellLeft.html(matchesThisSession[row][0]);
          let displayedHeadWord = matchesThisSession[row][0];
          headWordsPrinted.push(displayedHeadWord);
          }
          else {
            var newCellLeft = $('<td></td>').addClass("feedbackLeftHidden");
          }
          let newCellMiddle = $('<td></td>').html("<==");
          let newCellRight = $('<td></td>').addClass("feedbackRight");
          newCellRight.html(matchesThisSession[row][1]);
          //put it all together
          newRow.append(newCellLeft);
          newRow.append(newCellMiddle);
          newRow.append(newCellRight);

          feedbackBox.append(newRow);
          }
      }
      //render a button to move depending on win or lose
      var nextButton = $("<div></div>");
      nextButton.addClass("startButton");
      var nextButton = $("<div></div>");
      nextButton.addClass("startButton");
      if (outcome == "win"){
        nextButton.html("vade")
        nextButton.click(function () {
          matchesThisSession = [];
          needToRevise = [];
          feedbackBox.remove();
          makeTheMove();
        });
      }
      else if (outcome == "lose") {
        nextButton.html("iterum conare")
        nextButton.click(function () {
          matchesThisSession = [];
          needToRevise = [];
          feedbackBox.remove();
          makeBoard(currentBoardGrid);
        });
      }
      feedbackBox.append(nextButton);
      //Put the completed feedback box into the main screen
      $("#content").append(feedbackBox);
      feedbackBox.hide()
      feedbackBox.fadeIn(1000);

      // update the task UI box
      showTask("proceed");
  }

  /////////////////////////////////////////////////////////////////
  // MINIGAME AND BOARD GAME/ROUND END CONDITIONS /////////////////
  /////////////////////////////////////////////////////////////////

  // MINIGAME ENDPOINTS
  //Determine if minigame has been won, and if board game has been won

  function boardGameWinCheck() {
    if (playerx == 7 && playery == 7){
      gameNotYetWon = false;
      $("#content").empty();
      //add a padding box to push the image down
      addPadding();
      //start win music
      winMusic.play();
      //display win screen text and image
      var winMessage = $("<div></div>");
      winMessage.addClass("winMessage");
      var winText = "Maximus domum pervenit! (Click to translate)";
      winMessage.attr("id", "winMessage");
      winMessage.attr("language", "latin");
      winMessage.unbind('click');
      winMessage.click(function() {changeLanguage($(this).attr("language"),
        $(this).attr("id"),
        "Maximus domum pervenit! (Click to translate)",
        "Maximus reached his home! (Click for Latin)")});
      winMessage.append(winText);
      $("#content").append(winMessage);
      //add a box to display win image
      var winImage = $("<div></div>");
      winImage.addClass("winImage");
      $("#content").append(winImage);
      //add a restart button
      makeResetButton();

      //update UI helper text
      showTask("replay");
    }
  };

  function boardGameLose() {
    $("#content").empty();
    //add a padding box to push the image down
    addPadding();
    //play victory music
    loseMusic.play();
    //Add a status box displaying the win message
    var winMessage = $("<div></div>");
    winMessage.addClass("winMessage");
    var loseText = "Necesse erit Maximo hac nocte sub divo pernoctare. (Click to translate)";
    winMessage.attr("id", "winMessage");
    winMessage.attr("language", "latin");
    winMessage .unbind('click');
    winMessage .click(function() {changeLanguage($(this).attr("language"),
      $(this).attr("id"),
      "Necesse erit Maximo hac nocte sub divo pernoctare. (Click to translate)",
      "Maximus must camp outside tonight. (Click for Latin)")});
    winMessage.append(loseText);
    $("#content").append(winMessage);
    //add a box to display win image
    var winImage = $("<div></div>");
    winImage.addClass("loseImage");
    $("#content").append(winImage);
    //add a restart button
    makeResetButton();

    //update UI helper text
    showTask("replay");
  }


////////////////////////////////////////////////////////////////////////////
// MAIN GAME UI FUNCTIONS //////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////

// TIMER/////////////////////////////////////////////////////////

//PLACE AND ACTIVATE TIMER BAR FOR MAINGAME
function dayTimer (time) {
  //place timer elements in UI bar
  var gridGameTimerBox = $("<div></div>");
  gridGameTimerBox.attr("id", "gridGameTimerBox");
  gridGameTimerBox.addClass("gridGameTimerBox");

  var timeTable = $("<table></table>");
  timeTable.attr("id", "timeTable");
  // timeTable.addClass(timeTable);

  var timeRow = $("<tr></tr>");
  timeRow.addClass("timeRow");
  var sunCell = $("<td></td>");

  //put sun, timer, and moon box into row in the UI bar
  var dayBox = $("<div></div>");
  dayBox.addClass("dayBox");
  sunCell.append(dayBox);
  timeRow.append(sunCell);
  // gridGameTimerBox.append(dayBox);

  //make cell for progressBarBox
  var timerCell = $("<td></td>");
  //make box for progress bar
  var progressBarBox = $("<div></div>");
  progressBarBox.attr("id", "progressBarBox");
  progressBarBox.addClass("progressBarBox");
  //make timerbar div to go inside the progressbar div and to alter
  var timerBar = $("<div></div>");
  timerBar.addClass("timerBar");
  timerBar.attr("id", "timerBar");
  //now append it to the progress bar
  progressBarBox.append(timerBar);

  timerCell.append(progressBarBox);
  timeRow.append(timerCell);

  //now make a box for the night and place it in the row
  var nightCell = $("<td></td>");
  var nightBox = $("<div></div>");
  nightBox.addClass("nightBox");
  nightCell.append(nightBox);
  timeRow.append(nightCell);

  //now place the row in the table and place the table on the page
  timeTable.append(timeRow);
  gridGameTimerBox.append(timeTable);
  $("#gameBoard").append(gridGameTimerBox)

  //now start the timer - runs only while game is not yet won
  //Code adapted from w3Schools tutorial "How TO - Javascript Progress Bar", located at https://www.w3schools.com/howto/howto_js_progressbar.asp
  var progressBar = document.getElementById("timerBar");
  var width = 0;
  var id = setInterval(updateBar, 1000);
  function updateBar() {
    if (gameNotYetWon == true){
      if (width >= 100) {
        clearInterval(id);
        boardGameLose();
      } else {
        width+=((1/time)*100);
        progressBar.style.width = width + '%';
      }
    }
    else if (gameNotYetWon == false) {
      console.log("game has been won");
      clearInterval(id);
    }
  }
}

// UI VARIABLES AT ROUND END /////////////////////////////////////////////

//RESET FOR NEXT ROUND - timer and music
  function resetGameVarsForNextRound() {
      lives = 3;
      gameNotYetWon = true;
      $("#gridGameTimerBox").remove();
      winMusic.pause();
      winMusic.currentTime = 0;
      loseMusic.pause();
      loseMusic.currentTime = 0;
    }


//RESET BUTTON
  function makeResetButton() {
      var resetButton = $('<div></div>');
      resetButton.html("iterum conare");
      resetButton.addClass("startButton");
      resetButton.click(function () {
        resetGameVarsForNextRound();
        startGame();
      });
      $("#content").append(resetButton);
    }



//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
// SINGLE ROUND GAME CODE ////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////


  ////////////////////////////////////////////////////////////////////
  //  INITIALISE GAME  ///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////
  function playSingleRoundGame (currentBoardHeadWordArray) {

    //make the UI appear
    $("#content").empty();
    addPadding();
    //main game box
    var singleGameContentBox = $("<div></div>");
    //give it an ID
    singleGameContentBox.attr("id", "singleGameContentBox");
    var newItemId = singleGameContentBox.attr("id");
    //give it a class
    singleGameContentBox.addClass("singleGameContentBox");
    //stick it onto the element above it
    $("#content").append(singleGameContentBox);



    //set up UI variables
    lives = 3;

    //get the game going
    selectSingleGameWords(currentBoardHeadWordArray);
  }


    //////////////////////////////////////////////////////////////////////////////////
    // HELPER FUNCTIONS  ////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////
    //  BOARD GENERATING FUNCTIONS  ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////


  //SET UP UNDERLYING CONTROL GRID USING CHOSEN WORDS
  function selectSingleGameWords(thisGameWordBank) {
    //reset relevant variables and variables
    $("#singleGameContent").empty();
    wordsUsedThisGame.length = 0;
    matchesThisSession.length = 0;
    needToRevise.length = 0;

    thisGameWordBank = thisGameWordBank;

    thisGameWordBank1syn = [];
    thisGameWordBank2syn = [];
    thisGameWordBank3syn = [];
    thisGameWordBank4plussyn = [];

    //now split these out
    for (let i = 0; i < thisGameWordBank.length; i++) {
      if (thisGameWordBank[i].answers.length == 1) {
        let currentWord = thisGameWordBank[i];
        thisGameWordBank1syn.push(currentWord);
      }
      else if (thisGameWordBank[i].answers.length == 2) {
        let currentWord = thisGameWordBank[i];
        thisGameWordBank2syn.push(currentWord);
      }
      else if (thisGameWordBank[i].answers.length == 3) {
        let currentWord = thisGameWordBank[i];
        thisGameWordBank3syn.push(currentWord);
      }
      else if (thisGameWordBank[i].answers.length >= 4) {
        let currentWord = thisGameWordBank[i];
        thisGameWordBank4plussyn.push(currentWord);
      }
    }

      var difficultyLevel = {
        difficulty: "single",
        wordPool: thisGameWordBank4plussyn.concat(thisGameWordBank3syn),
        rows: 3,
        headwordsAtThisLevel: 3,
        synsneeded: [3, 3, 3],
        firstwordsyns: 4,
        secondwordsyns: 3,
        thirdwordsyns: 3,
        fourthwordsyns: 2
        }

      targets = difficultyLevel.headwordsAtThisLevel;

      //SELECT RANDOM HEADWORDS ACCORDING TO DIFFICULTY LEVEL
      var headArray = [];

      //generate an output array given an input set and a required number of elements in the output array
      headArray = pickHeadWordsAtRandom(difficultyLevel.wordPool, difficultyLevel.headwordsAtThisLevel);

      //PUSH RANDOM WORDS INTO GRID ARRAY - make different versions of this for different difficulties
      //copy headArray and push into gridArray
      gridArray = headArray.slice();
      //turn headArray into an array of 16 objects containing either a headWord and its related synonyms, or a synonym
      //then push in a few synonyms for each from the remaining headArray

      for (var i = 0; i < headArray.length; i++) {
        headArray[i].matchesLeft = difficultyLevel.synsneeded[i];
        let synonyms = gridArray[i].synonyms;
        let head = gridArray[i].headWord.slice();
        // console.log("before pickandremoverandoms, synonyms is: ");
        // console.log(synonyms);
          var randomSynonyms = pickRandomSyns(synonyms, difficultyLevel.synsneeded[i], head);
          gridArray = gridArray.concat(randomSynonyms);
          // console.log("After randomSynonyms added for word" + i + ", gridArray is:")
          // console.log(gridArray);
      }


      //now that gridArray is completed, randomise order of entries
      gridArray = shuffle(gridArray);
      // console.log("After being shuffled, gridArray is: ");
      // console.log(gridArray);

      //then split that array into 4 arrays of 4: this will be the grid
      let finalGridArray = [];
      for (var split = 0; split < difficultyLevel.rows; split++){
        let temp = gridArray.splice(0, 4);
        finalGridArray.push(temp);
      }
      // console.log("finalGridArray is: ");
      // console.log(finalGridArray)
      // console.log("and original wordBank is: ");
      // console.log(wordBank);
      grid = finalGridArray.slice();
  //for rounds after that, pick round sets using repeated and new information

//show user the words for the coming round for a number of seconds
  showTerms(headArray, grid, difficultyLevel);
  };

//DISPLAY THE TERMS
    function showTerms(headArray, grid, difficultyLevel) {
      $("#content").removeClass(lastBGClassAdded);
      $("#content").addClass("noBG");
      var headArray = headArray;
      var grid = grid;
      //print head words and answers on screen in divs for a certain amount of time

      let header = $("<div></div>");
      header.html("haec scire");
      header.addClass("titles");
      $("#singleGameContentBox").append(header);

      for (let i = 0; i < headArray.length; i++) {
        let newDiv = $("<div></div>");
        var headWordText = headArray[i].headWord;
        var answersArray = headArray[i].answers;
        var answersText = answersArray.toString();
        answersText = answersText.replace(/,/g, ", ");
        newDiv.html(headWordText + " : " + answersText);
        $("#singleGameContentBox").append(newDiv);
      }

      //display button to start round
      var skipButton = $('<div></div>');
      skipButton.html("Incipe!");
      skipButton.addClass("startButton");
      skipButton.click(function(){
        displayGrid(grid, difficultyLevel)
      });
      $("#singleGameContentBox").append(skipButton);

    //update UI helper
      showTask("learnWords");
    }

    //show the grid and start the timer
    function displayGrid (grid, difficultyLevel) {
      $("#singleGameContentBox").empty();

      let gridHeight = difficultyLevel.rows;
      let gridWidth = 4;
      //make rows to pad the grid window

      makePaddingRow(difficultyLevel);
      //make a new row
      for (row = 0; row < gridHeight; row++){
        let newRow = $('<tr></tr>');
        newRow.addClass("singleGameRow");
        //fill it with cells
        for (col = 0; col < gridWidth; col++){
          let newCell = $('<td></td>').addClass("grid");
          //fill each cell with a card containing relevant data
          //for a draggable synonym answer cell
          if (grid[row][col].wordType == "synonym"){
            let newCard = $('<div></div>').addClass("makeMeDraggable");
            // Centres text in cells - uses CSS styling from stackoverflow user Jason Gennaro
            //in response to stackoverflow user Jose Faeti's query located  at https://stackoverflow.com/questions/7453868/how-can-i-make-my-text-appear-in-the-center-of-this-div-both-vetically-and-horiz
            //put a new div within the draggable element and give it the centered class
            let newCardText = $('<div></div>');
            newCardText.text(grid[row][col].syn);
            newCardText.attr("class", "centredText");
            newCard.append(newCardText);
            newCard.data("value", grid[row][col].syn);
            newCard.data("matchesAttempted", 0);
            newCard.data("matchingHead", grid[row][col].head);
            newCell.append(newCard);
          }
          //for a droppable headWord cell
          else if (grid[row][col].wordType == "headWord") {
            let newCard = $('<div></div>').addClass("makeMeDroppable");
            let newCardText = $('<div></div>');
            newCardText.text(grid[row][col].headWord);
            newCardText.attr("class", "centredText");
            newCard.append(newCardText);
            newCard.data("headWord", grid[row][col].headWord);
            newCard.data("synonyms", grid[row][col].answers);
            newCard.attr("matchesLeft", (grid[row][col].matchesLeft));
            newCell.append(newCard);
          }
        newRow.append(newCell);
        }
      $("#singleGameContentBox").append(newRow);
      }
      makePaddingRow(difficultyLevel);

    //Assign draggable and droppable qualities to tiles
      //Source -  code for making squares draggable and droppable modified from https://www.elated.com/articles/drag-and-drop-with-jquery-your-essential-guide/
      //make synonym squares draggable, appear on top, and revert to position if not accepted by box
        $('.makeMeDraggable').draggable({
          revert: true,
          revertDuration: 100,
          containment: "#content",
          cursor: "move",
          stack: ".makeMeDraggable",
          start: idSquare,
          hover: "makeMeDraggable-hover"
        });

      //make headwords droppable
        $('.makeMeDroppable').droppable( {
          drop: dropCheck
        } );
        // console.log($('.makeMeDroppable').attr("matchesLeft"));

        //display the stage background and start the stage timer
        // BGchange();
        //UI
        var statusBox = $("<div></div>");
        //give it an ID
        statusBox.attr("id", "statusData");
        var newItemId = statusBox.attr("id");
        //given it a class
        statusBox.addClass("statusData");
        //stick it onto the element above it
        $("#content").append(statusBox);

        //UI ELEMENTS
        var livesText = $("<div></div>");
        //give it an ID
        livesText.attr("id", "livesText");
        livesText.html("Vitae: ");
        var newItemId = livesText.attr("id");
        //given it a class
        livesText.addClass("livesText");
        //stick it onto the element above it
        $("#statusData").append(livesText);

        var livesBox = $("<div></div>");
        //give it an ID
        livesBox.attr("id", "livesBox");
        var newItemId = livesBox.attr("id");
        //given it a class
        livesBox.addClass("livesBox");
        //stick it onto the element above it
        $("#statusData").append(livesBox);
        initLives();

      //also update the UI HELPER
      showTask("playSingleRoundGame");
    };

    function idSquare(event) {
      var draggedValue = $(this).data("matchingHead");
      draggedValue = "'" + draggedValue + "'"
      // console.log("on pickup, dragged item's headword is' " + draggedValue);
    };

  //keep screen size stable between levels by padding rows
    function makePaddingRow(difficultyLevel) {
      // console.log("in makePaddingRow, difficulty is: " + difficultyLevel.difficulty)
      //depending on difficulty, make a new row and fill it with 4 padding cards
      if (difficultyLevel.difficulty == "easy"){
        let padRow = $('<tr></tr>');
        for (let i = 0; i < 4; i++){
          let padCard = $('<div></div>').addClass("grid");
          padRow.append(padCard);
        }
        $("#singleGameContentBox").append(padRow);
        // console.log("blank row made");
        }
      if (difficultyLevel.difficulty == "medium"){
        let padRow = $('<tr></tr>');
        for (let i = 0; i < 4; i++){
          let padCard = $('<div></div>').addClass("halfheight");
          padRow.append(padCard);
        }
        $("#singleGameContentBox").append(padRow);
        }
      };

    //////////////////////////////////////////////////////////////////////////////
    //  BOARD  DATA SETUP FUNCTIONS  /////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    // SELECT RANDOM WORDS

  //For initial setup
    //
    function pickHeadWordsAtRandom(words, numberNeeded){
      //copy original wordBank in full and make new storage array for chosen words
      let tempWordBank = words.slice();
      var outputArray = [];
      // console.log("at start of pickWordsAtRandom, original wordBank is")
      // console.log(words);
      //get as many numbers as needed from the copied wordBank into that array
      for (var i = 0; i < numberNeeded; i++){
        //define length of workbank array as it stands
        let tempWordBankLength = tempWordBank.length;
        //select random word entry from current array
        let randomIndex = Math.floor(Math.random()*tempWordBankLength);
        //stick that entry into the output array
        var chosenWord = tempWordBank[randomIndex];
        chosenWord.wordType = "headWord";
        outputArray.push(chosenWord);
        //remove chosen item from initial word bank array
        //splice usage from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        tempWordBank.splice(randomIndex, 1);
        }
        // console.log("At end of pickWordsAtRandom, outputArray is: ");
        // console.log(outputArray);
        // console.log("and original wordBank is: ");
        // console.log(words);
        return outputArray;
    };

    //SELECT RANDOM WORDS - BUT REMOVE FROM ARRAY
    function pickRandomSyns(words, numberNeeded, head){
      // console.log("pickAndRemoveRandomWords is active");
      // console.log(words);
      //make new storage array for chosen words
      let synTileHead = head;
      var tempBank = words.slice();
      var outputArray = [];
      // console.log("for head: ");
      // console.log(head);
      // console.log("at pick and removRandomWords: ");
      // console.log("numberNeeded = " + numberNeeded);
      // console.log("and tempbank is");
      // console.log(tempBank);
          //get as many numbers as needed into that array
      for (var i = 0; i < numberNeeded; i++){
        //define length of workbank array as it stands
        let tempWordBankLength = tempBank.length;
        //select random word entry from current array
        let randomIndex = Math.floor(Math.random()*tempWordBankLength);
        //put it into an object
        let randomSyn = tempBank[randomIndex].slice();
        // console.log("before going into object, randomSyn is: " + randomSyn + "and head is: " + head);
        var newSynTileData = new SynonymTileObject(randomSyn, synTileHead);
        //stick that entry into the output array
        // console.log(newSynTileData);
        outputArray.push(newSynTileData);
        //remove chosen item from initial word bank array
        //splice usage from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice
        tempBank.splice(randomIndex, 1);
        }
        // console.log("At end of pickWordsAtRandom, outputArray is: ");
        // console.log(outputArray);
        return outputArray;
    };

    //Package up synonym tile data into synonym tile object (for unpacking when board is created)
    function SynonymTileObject(syn, head) {
      this.syn = syn;
      this.head = head;
      this.wordType = "synonym";
    };

      //Note: The Fisher-Yates shuffle algorithm snippet used below was written by Mike Bostock, sourced from https://bost.ocks.org/mike/shuffle/
      function shuffle(array) {
        var m = array.length, t, i;
        // While there remain elements to shuffle…
        while (m) {
          // Pick a remaining element…
          i = Math.floor(Math.random() * m--);
          // And swap it with the current element.
          t = array[m];
          array[m] = array[i];
          array[i] = t;
        }
        return array;
      }

    /////////////////////////////////////////////////////////////////////////
    // CORE SINGLE GAME LOGIC  //////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    //DROPPABLE ITEM EVENT HANDLER - ACCEPT OR REJECT USER ANSWER
    function dropCheck(event, ui) {
      var draggable = ui.draggable;
      var droppable = $(this);

      var draggedHeadWord = draggable.data("matchingHead");
      var draggedAnswer = draggable.data("value");
      var droppableAnswers = droppable.data("synonyms");
      var droppableHeadWord = droppable.data("headWord");

      //check if draggable is a valid answer for the droppable
      //if yes, update droppable's hits remaining, make draggable disappear with animation and sound, update player score
      if (droppableHeadWord == draggedHeadWord) {
        var matchesLeftNow = $(this).attr("matchesLeft");
        matchesLeftNow--;
        $(this).attr("matchesLeft", matchesLeftNow);
        // console.log("Matches left = " + $(this).attr("matchesLeft"));
        draggable.hide("explode", {pieces: 9}, 500, function() {
          chime.play();
          if (draggable.data("matchesAttempted") < 1) {
            singleGameCorrectChoiceFeedbackUpdate(droppableHeadWord, draggedAnswer);
          }
        })
        //and if the hit counter on a droppable is depleted, make it disappear with animation and sound and check if game is won
        if ($(this).attr("matchesLeft") == 0){
          // draggable.attr("revert", false);
          $(this).hide("explode", {pieces: 9}, 500, function() {
            chime.play();
            targets--;
            // console.log("Targets remaining: " + targets);
            singleGameWinCheck();
          });
        };
      }
      //if not a match, decrease player lives and increase matchesAttempted on the dragged tile
      else {
        // console.log("Matches left = " + $(this).attr("matchesLeft"));
        var draggableMatchesAttempted = draggable.data("matchesAttempted");
        draggableMatchesAttempted++;
        draggable.data("matchesAttempted", draggableMatchesAttempted);
        // console.log("matches attempts on this item is now: " + draggable.data("matchesAttempted"));
        singleGameIncorrectChoiceFeedbackUpdate (draggedAnswer, draggedHeadWord);
        mistakeSound.play();
        loseLife();
      }

    };

    //////////////////////////////////////////////////////////////////////////////
    //  FEEDBACK FUNCTIONS  //////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    //UPDATE ARRAY OF CORRECT WORDS
    function singleGameCorrectChoiceFeedbackUpdate (headWord, answer) {
      var rightHeadWord = headWord;
      var rightSynonym = answer;
      var newRightArray = [];
      newRightArray.push(rightHeadWord);
      newRightArray.push(rightSynonym);
      matchesThisSession.push(newRightArray);
      // console.log(matchesThisSession);
    };

    //UPDATE ARRAY OF WORDS THAT WEREN'T CORRECT FIRST TIME
    function singleGameIncorrectChoiceFeedbackUpdate (answer, head) {
      //make a new wrong choice object
      function wrongSynonymObject(syn, head) {
        this.syn = syn;
        this.head = head;
      };
      var wrongSynonym = new wrongSynonymObject(answer, head);
      // console.log(wrongSynonym);
      //scan through all the words on the list to see if that synonym is already there
      var alreadyOnReviseList = false;
      for (let i = 0; i < needToRevise.length; i++){
      if (needToRevise[0].syn == wrongSynonym.syn){
        alreadyOnReviseList = true;
      }
    }
      if (alreadyOnReviseList == false) {
        needToRevise.push(wrongSynonym);
      }
      // console.log(needToRevise);
    }

    //FEEDBACK - SHOW TILES CORRECTLY MATCHES FIRST TIME AND PROMPT USER WITH SOLUTIONS TO WRONG MATCHES
    function singleGameGiveFeedback (outcome) {
      // console.log("giveFeedback is active");
      // console.log(needToRevise);
        //Create necessary box for displaying feedback
        var feedbackBox = $("<div></div>");
        feedbackBox.attr("id", "feedbackBox");
          //Words to revise - if these are any words to revise
          //Put up a header saying to revise these words
          if (needToRevise.length > 0) {
            let wrongHeadRow = $('<div></div>');
            wrongHeadRow.html("HAEC ITERUM INSPICE");
            wrongHeadRow.attr("id", "wrongHeadRow");
            feedbackBox.append(wrongHeadRow);

            //then for each word in needToRevise, make a new feedback row
            for (let row = 0; row < needToRevise.length; row++){
              let newRow = $('<tr></tr>');
              //fill it with cells  "answer" "is in fact a synonym of" "headword"
              let newCellLeft = $('<td></td>').addClass("feedbackRight");
              newCellLeft.html(needToRevise[row].syn);
              let newCellMiddle = $('<td></td>').html("==>");
              let newCellRight = $('<td></td>').addClass("feedbackRight");
              newCellRight.html(needToRevise[row].head);

              newRow.append(newCellLeft);
              newRow.append(newCellMiddle);
              newRow.append(newCellRight);

              feedbackBox.append(newRow);
              }
            }
            else {
              let wrongHeadRow = $('<div></div>');
              wrongHeadRow.html("Score perfectam");
              wrongHeadRow.attr("id", "wrongHeadRow");
              feedbackBox.append(wrongHeadRow);
            }

        //Correct matches
            //Align matches by headword (group in alphabetical order)
            //Sort function taken from StackOverflow user Martin Milan's answer to the query at https://stackoverflow.com/questions/5435228/sort-an-array-with-arrays-in-it-by-string
            function Comparator(headWordA, headWordB) {
               if (headWordA[0] < headWordB[0]) return -1;
               if (headWordA[0] > headWordB[0]) return 1;
               return 0;
            }
            matchesThisSession.sort(Comparator);

            let rightHeadRow = $('<div></div>');
            rightHeadRow.attr("id", "rightHeadRow");
            rightHeadRow.html("PRIMUM HAEC BENE FECISTI");
            feedbackBox.append(rightHeadRow);

            var headWordsPrinted = [];

            for (let row = 0; row < matchesThisSession.length; row++){
              let newRow = $('<tr></tr>');
              //fill it with cells in order "headword" followed by "synonym"
              if (!(headWordsPrinted.includes(matchesThisSession[row][0]))){
              var newCellLeft = $('<td></td>').addClass("feedbackRight");
              newCellLeft.html(matchesThisSession[row][0]);
              let displayedHeadWord = matchesThisSession[row][0];
              headWordsPrinted.push(displayedHeadWord);
              }
              else {
                var newCellLeft = $('<td></td>').addClass("feedbackLeftHidden");
              }
              let newCellMiddle = $('<td></td>').html("<==");
              let newCellRight = $('<td></td>').addClass("feedbackRight");
              newCellRight.html(matchesThisSession[row][1]);
              //put it all together
              newRow.append(newCellLeft);
              newRow.append(newCellMiddle);
              newRow.append(newCellRight);

              feedbackBox.append(newRow);
              }
        //generate a button to trigger the next move
        var nextButton = $("<div></div>");
        nextButton.addClass("startButton");
        if (outcome == "win"){
          nextButton.html("salire!")
          nextButton.click(function () {
            matchesThisSession = [];
            needToRevise = [];
            feedbackBox.remove();
            makeTheMove();
          });
        }
        else if (outcome == "lose") {
          nextButton.html("iterum conare")
          nextButton.click(function () {
            matchesThisSession = [];
            needToRevise = [];
            feedbackBox.remove();
            makeBoard(currentBoardGrid);
          });
        }
        feedbackBox.append(nextButton);
        //Put the completed feedback box into the main screen
        $("#singleGameContentBox").append(feedbackBox);
        feedbackBox.hide()
        feedbackBox.fadeIn(1000);

    //UI helper updated
    showTask("proceed");
    }
    /////////////////////////////////////////////////////////////////
    // SINGLE ROUND GAME END CONDITIONS /////////////////////////////
    /////////////////////////////////////////////////////////////////

    //ENDPOINTS

    //WIN
    function singleGameWinCheck() {
      if (targets == 0) {
        $("#singleGameContentBox").empty();
        $("#statusData").hide();
        //start victory music
        // winMusic.play();
        //display result
        displayResult("win");
      //show feedback
        singleGameGiveFeedback("win");
      }
    }

    //LOSE (NOT BY TIMEOUT)
    function singleGameLoseCheck() {
      if (lives == 0) {
        $("#singleGameContentBox").empty();
        //
        // loseMusic.play();
        //display result
        displayResult("lose");
        //display feedback
        singleGameGiveFeedback("lose");
        }
    }

    //SHOW RESULT OF GAME
    function displayResult (result) {
      var result = result;
      var resultBox = $("<div></div>");
      resultBox.addClass("resultBox");
      switch(result) {
        case "win":
            resultBox.html("Per hunc vobis vincere!");
            break;
        case "lose":
            resultBox.html("Et maxima culpa");
            break;
      }
      $("#singleGameContentBox").append(resultBox);
    };


  ////////////////////////////////////////////////////////////////////////////
  // UI FUNCTIONS ////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////

  // HEALTH //////////////////////////////////////////////////////////

  //SET UP LIVES
    function initLives () {
      $("#livesBox").empty();
      for (var l = 0; l < lives; l++){
        let heartBox = $("<div></div>");
        heartBox.addClass("heartBox");
        let heartID = "heart"+l;
        //Public domain heart image uploaded by wikimedia commons user Policesheep: https://commons.wikimedia.org/wiki/Category:Heart_symbols#/media/File:HeartPic.png
        let newHeart = $('<img class="heart" src="Heart-icon.png" />');
        newHeart.attr("id", heartID);
        heartBox.prepend(newHeart);
        $("#livesBox").append(heartBox);
        // console.log("created heart with id: " + newHeart.attr("id"));
      }
    };

  //REMOVE LAST HEART IN ROW
    function loseLife () {
      lives--;
      // console.log("lives remaining: " + lives);
      $("#heart" + lives).hide("explode", {pieces: 9}, 1000, function() {
        singleGameLoseCheck();
      });
    };



  // VISUALS AND SOUNDS ///////////////////////////////////////////////////

  //code to play sound sourced from w3Schools - https://www.w3schools.com/jsref/met_audio_play.asp
  var chime = document.getElementById("chime");
  var winMusic = document.getElementById("winMusic");
  var mistakeSound = document.getElementById("mistakeSound");
  var loseMusic = document.getElementById("loseMusic");
 

// LANGUAGES /////////////////////////////////////////////////////////////

//Toggle text of selected element between English and Latin
  function changeLanguage (language, element, latinText, englishText) {
    // console.log("changeLanguage activated on element " + element);
    var currentElementID = "#" + element;
    if (language == "latin") {
      $(currentElementID).attr("language", "english")
      $(currentElementID).html(englishText);
      // console.log("current language is " + language);
      // console.log("changing text to " + englishText);
    }
    else if (language == "english") {
      $(currentElementID).attr("language", "latin")
      $(currentElementID).html(latinText);
      // console.log("current language is " + language);
      // console.log("changing text to " + latinText);
    }
  };

// TEXT PROMPTS //////////////////////////////////////////////////////////

function showTask(currentTask) {

  var taskBar = $('#taskBar');

  taskBar.show();
  taskBar.empty();
  taskBar.unbind('click');

  if (currentTask == "selectSpace"){
    taskBar.attr("language", "latin");
    taskBar.html("Delige nunc flavum aut flammeum spatium ut progrediaris. (Click text for translation)");
    taskBar.click(function() {
      changeLanguage($(this).attr("language"),
      $(this).attr("id"),
      "Delige nunc flavum aut flammeum spatium ut progrediaris. (Click text for translation)",
      "Please select a yellow or orange space to move to. (Click text to return to Latin)")});
  }
  else if (currentTask == "learnWords") {
    taskBar.attr("language", "latin");
    taskBar.html("Disce haec verba. (Click text for translation)");
    taskBar.click(function() {changeLanguage($(this).attr("language"),
    $(this).attr("id"),
    "Disce haec verba. (Click text for translation)",
    "Learn these words. (Click text to return to Latin)")});
  }
  else if (currentTask == "playMiniGame") {
    taskBar.attr("language", "latin");
    taskBar.html("Trahe cinerea quadra quae monstrant vocabula huic in flammeo orthogonio synonyma ad flammeum orthonogium ipsum. (Click text for translation)");
    taskBar.click(function() {changeLanguage($(this).attr("language"),
    $(this).attr("id"),
    "Trahe cinerea quadra quae monstrant vocabula huic in flammeo orthogonio synonyma ad flammeum orthonogium ipsum. (Click text for translation)",
    "Drag the grey squares which feature synonyms of the word in the orange rectangle to the orange rectangle. (Click text to return to Latin)")});
  }
  else if (currentTask == "playSingleRoundGame"){
    taskBar.attr("language", "latin");
    taskBar.html("Trahe cinerea quadra quae monstrant vocabula his in flammeis quadris synonyma ad convenientia flammea quadra. (Click text for translation)");
    taskBar.click(function() {changeLanguage($(this).attr("language"),
    $(this).attr("id"),
    "Trahe cinerea quadra quae monstrant vocabula his in flammeis quadris synonyma ad convenientia flammea quadra. (Click text for translation)",
    "Drag the gray squares which feature synonyms of the words in the orange squares to their corresponding orange squares. (Click text to return to Latin)")});
  }
  else if (currentTask == "proceed"){
    taskBar.attr("language", "latin");
    taskBar.html("Preme cineream clavem ut progrediaris. (Click text for translation)");
    taskBar.click(function() {changeLanguage($(this).attr("language"),
    $(this).attr("id"),
    "Preme cineream clavem ut progrediaris. (Click text for translation)",
    "Press the grey button to proceed. (Click text to return to Latin)")});
  }
  else if (currentTask == "replay"){
    taskBar.attr("language", "latin");
    taskBar.html("Preme cineream clavem ut iterum ludum perficias. (Click text for translation)");
    taskBar.click(function() {changeLanguage($(this).attr("language"),
    $(this).attr("id"),
    "Preme cineream clavem ut iterum ludum perficias. (Click text for translation)",
    "Press the grey button to replay (Click text to return to Latin)")});
  }
}

});
