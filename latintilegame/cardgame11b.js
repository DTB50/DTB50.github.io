//Unless otherwise noted, all code was developed by myself.


$( function() {
  ///////////////////////////////////////////////////////////////////
  //  GAME CONTROL VARIABLES  ///////////////////////////////////////
  ///////////////////////////////////////////////////////////////////

  var lives;
  var targets;
  var currentSessionStage;
  var playerLevel;
  var playerexp;

  var roundScore = 0;
  var sessionScore = 0;

  var currentRoundTime;

  var wordsUsedThisGame = [];
  var wordsUsedThisRound = [];

  var matchesThisSession = [];

  var needToRevise = [];

  var lastBGClassAdded;

  var checkDuplicateArray = [];


  // USER ACCOUNT STATE DATA ////////////////////////////////////////////////////////////////
  var currentUserName = undefined;
  var currentUserPassword = undefined;
  var currentUserWordList = undefined;
  var currentUserExp = undefined;
  var currentUserLevel = [];
  var playerLoggedIn = false;

  var expToNextLevel;



  ////////////////////////////////////////////////////////////////////
  //  INITIALISE GAME  ///////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////

  function displayButton () {

    //hide status data
    $('#statusData').hide();
    //hide task Bar
    $('#taskBar').hide();

    var headerText = $("<div></div>");
    headerText.addClass("gameTitleBox");
    headerText.html("AENIGMA MUSIVORUM");
    $("#content").append(headerText);
    $("#content").addClass("titleScreen");
    lastBGClassAdded = "titleScreen";

    var introText = $("<div></div>");
    introText.attr("id", "introText");
    introText.addClass("introText");
    introText.html("CLARISSIMUS PROFESSOR STAN BROWN ES.TUIS LITTERARUM STUDIIS COMPERISTI VERMICULATA EMBLEMATA DECEM SUB ORNATO PAVIMENTO ABSCONDITA. </br></br> LAMINAS LAPIDEAS CUM AENEIS LAMELLIS, QUAE SYNONIMIS ORNATAE SUNT, COMBINA UT MUSIVUM PATEFIAT. </br></br> CAVE AUTEM NE LAMINAE. TRES MENDOSE DISPOSITAS SUPERPOSITAE MUSIVUM DIRUANT. </br></br>  DEBES QUOQUE CURSUM STATIONIS ALLOCATO TEMPORE PERFICERE. </br></br> <b>(CLICK THIS TEXT TO SEE INSTRUCTIONS IN ENGLISH)</b>");
    introText.attr("language", "latin");
    //clickable function to change language
    introText.click(function() {
      var language = $(this).attr("language");
      changeLanguage(language,
                      $(this).attr("id"),
                      "CLARISSIMUS PROFESSOR STAN BROWN ES.TUIS LITTERARUM STUDIIS COMPERISTI VERMICULATA EMBLEMATA DECEM SUB ORNATO PAVIMENTO ABSCONDITA. </br></br> LAMINAS LAPIDEAS CUM AENEIS LAMELLIS, QUAE SYNONIMIS ORNATAE SUNT, COMBINA UT MUSIVUM PATEFIAT. </br></br> CAVE AUTEM NE LAMINAE. TRES MENDOSE DISPOSITAS SUPERPOSITAE MUSIVUM DIRUANT. </br></br>  DEBES QUOQUE CURSUM STATIONIS ALLOCATO TEMPORE PERFICERE. </br></br><b>(CLICK THIS TEXT TO SEE INSTRUCTIONS IN ENGLISH)</b>",
                      "YOU ARE NOTED LATIN SCHOLAR STAN BROWN. IN YOUR STUDIES YOU HAVE LEARNED OF TEN IMPORTANT MOSAICS HIDDEN UNDER SPECIALLY TILED FLOORS. </br></br> UNCOVER THE MOSAICS BY DRAGGING THE MARBLE TILES ONTO THE COPPER TILES ENGRAVED WITH WORDS THAT THEY ARE SYNONYMS OF. </br></br>  BUT BE CAREFUL! THREE INCORRECTLY PLACED MARBLE TILES WILL RUIN THE MOSAIC BELOW! </br></br> YOU MUST ALSO COMPLETE EACH ROUND WITHIN THE TIME LIMIT. </br></br><b>(CLICK THIS TEXT TO RETURN TO LATIN)</b>"
                    )});
    $("#content").append(introText);

    var startButton = $('<div></div>');
    startButton.html("Incipio!");
    startButton.addClass("startButton");
    startButton.click(startGame);
    $("#content").append(startButton);


    //update UI helper TEXT
    showTask("proceed");

  }

    function nextStage () {
      resetGameVarsForNextStage();
      selectWords();
      initStage();
      initLives();
      updateScore(roundScore);
    }

    function startGame() {
      $('#taskBar').show();
      $('#statusData').show();
      resetGameVarsCompletely();
      selectWords();
      initStage();
      initLives();
      updateScore(roundScore);
    }

    displayButton();

    //////////////////////////////////////////////////////////////////////////////////
    // HELPER FUNCTIONS  ////////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////
    //  BOARD GENERATING FUNCTIONS  ////////////////////////////////////
    ////////////////////////////////////////////////////////////////////

    //SET UP UNDERLYING CONTROL GRID
      function selectWords() {
        //reset relevant variables and variables
        $("#content").empty();
        //How to clear array - https://appendto.com/2016/02/empty-array-javascript/
        wordsUsedThisGame.length = 0;
        matchesThisSession.length = 0;
        needToRevise.length = 0;

        //set up variables to pick word
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

      if (currentSessionStage == 1) {
      thisGameWordBank = pickInitialWordBank();
      }
      else {
        thisGameWordBank = thisGameWordBank;
      }

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
        // console.log("words for this game are: ")
        // console.log(thisGameWordBank1syn);
        // console.log(thisGameWordBank2syn);
        // console.log(thisGameWordBank3syn);
        // console.log(thisGameWordBank4plussyn);

          // console.log("wordsUsedThisGame are:")
          // console.log(wordsUsedThisGame);

          //SELECT 3 RANDOM WORDS
          //set up intermediate array used to fill blocks

          var difficultyLevel;
          if (currentSessionStage >= 1 && currentSessionStage <= 3){
            difficultyLevel = {
            difficulty: "easy",
            wordPool: thisGameWordBank4plussyn,
            rows: 2,
            headwordsAtThisLevel: 2,
            synsneeded: [3, 3],
            firstwordsyns: 4,
            secondwordsyns: 3,
            thirdwordsyns: 3,
            fourthwordsyns: 2
            }
          }
          else if (currentSessionStage >= 4 && currentSessionStage <= 7){
            difficultyLevel = {
            difficulty: "medium",
            wordPool: thisGameWordBank4plussyn.concat(thisGameWordBank3syn),
            rows: 3,
            headwordsAtThisLevel: 3,
            synsneeded: [3, 3, 3],
            firstwordsyns: 4,
            secondwordsyns: 3,
            thirdwordsyns: 3,
            fourthwordsyns: 2
            }
          }
          else if (currentSessionStage >= 1 && currentSessionStage <= 10){
            difficultyLevel = {
            difficulty: "hard",
            wordPool: thisGameWordBank4plussyn.concat(thisGameWordBank3syn, thisGameWordBank2syn, thisGameWordBank1syn),
            rows: 4,
            headwordsAtThisLevel: 8,
            synsneeded: [1, 1, 1, 1, 1, 1, 1, 1],
            firstwordsyns: 1,
            secondwordsyns: 1,
            thirdwordsyns: 1,
            fourthwordsyns: 1
            }
          }
          targets = difficultyLevel.headwordsAtThisLevel;
          // console.log("targets is now = " + targets);

        //SELECT RANDOM HEADWORDS ACCORDING TO DIFFICULTY LEVEL
          var headArray = [];

          //generate an output array given an input set and a required number of elements in the output array
          headArray = pickHeadWordsAtRandom(difficultyLevel.wordPool, difficultyLevel.headwordsAtThisLevel);
          // console.log("at pickheadwords, headWords are:");
          // console.log(headArray);
          // console.log("and they are being chosen from ");
          // console.log(difficultyLevel.wordPool);

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
          // console.log("After being concatenated, gridArray is: ");
          // console.log(gridArray);
          // }

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
      }

    function showTerms(headArray, grid, difficultyLevel) {
      $("#content").removeClass(lastBGClassAdded);
      $("#content").addClass("noBG");
      var headArray = headArray;
      var grid = grid;

      //push text down
      addPadding(difficultyLevel);

      //print head words and answers on screen in divs for a certain amount of time
      let stageHeader = $("<div></div>");
      var stageHeaderNumRoman = new XIII(currentSessionStage);
      stageHeaderNumRoman = stageHeaderNumRoman.getRomanNumerals();
      stageHeader.html("PLANUM "+ stageHeaderNumRoman);
      stageHeader.addClass("gameTitleBox");
      $("#content").append(stageHeader);

      let header = $("<div></div>");
      header.html("DISCE HAEC VERBA");
      header.addClass("gameTitleBox");
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
      skipButton.html("Incipio");
      skipButton.addClass("startButton");
      skipButton.click(function(){displayGrid(grid, difficultyLevel)});
      $("#content").append(skipButton);

      //update UI helper TEXT
      showTask("learnWords");
    }

    //show the grid and start the timer
    function displayGrid (grid, difficultyLevel) {
      $("#content").empty();

      let gridHeight = difficultyLevel.rows;
      let gridWidth = 4;
      //make rows to pad the grid window

      makePaddingRow(difficultyLevel);
      //make a new row
      for (row = 0; row < gridHeight; row++){
        let newRow = $('<tr></tr>');
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
            // Centres text in cells - uses CSS styling from stackoverflow user Jason Gennaro
            //in response to stackoverflow user Jose Faeti's query located  at https://stackoverflow.com/questions/7453868/how-can-i-make-my-text-appear-in-the-center-of-this-div-both-vetically-and-horiz
            //put a new div within the draggable element and give it the centered class
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
      $('#content').append(newRow);
      }
      makePaddingRow(difficultyLevel);

    //Assign draggable and droppable qualities to tiles
    //Code for making squares draggable and droppable modified from https://www.elated.com/articles/drag-and-drop-with-jquery-your-essential-guide/ - sections Using A Helper,
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
        $('.makeMeDroppable').droppable( {
          drop: dropCheck
        } );
        // console.log($('.makeMeDroppable').attr("matchesLeft"));

        //display the stage background and start the stage timer
        BGchange();
        startTimer();

        //update UI helper TEXT
        showTask("playRound");
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
        $("#content").append(padRow);
        // console.log("blank row made");
        }
      if (difficultyLevel.difficulty == "medium"){
        let padRow = $('<tr></tr>');
        for (let i = 0; i < 4; i++){
          let padCard = $('<div></div>').addClass("halfheight");
          padRow.append(padCard);
        }
        $("#content").append(padRow);
        }
      };

    //////////////////////////////////////////////////////////////////////////////
    //  BOARD  DATA SETUP FUNCTIONS  /////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////

    // SELECT RANDOM WORDS

  //For initial setup
    function pickInitialHeadWordsAtRandom(words, numberNeeded){
      //copy original wordBank in full and make new storage array for chosen words
      let tempWordBank = words.slice();
      var outputArray = [];
      // console.log("at start of pickWordsAtRandom, original wordBank is")
      // console.log(words);
      //get as many numbers as needed from the copied wordBank into that array
      for (var i = 0; i < numberNeeded; i++)
      {
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
    // CORE GAME LOGIC  /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////////////////////

    //DROPPABLE ITEM EVENT HANDLER - ACCEPT OR REJECT USER ANSWER
    function dropCheck(event, ui) {
      var draggable = ui.draggable;
      var droppable = $(this);

      var draggedHeadWord = draggable.data("matchingHead");
      var draggedAnswer = draggable.data("value");
      var droppableAnswers = droppable.data("synonyms");
      var droppableHeadWord = droppable.data("headWord");
      // console.log("headWord is = " + droppableHeadWord);
      // console.log("user's synonym is = " + draggedAnswer);
      // console.log("acceptable synonyms are = " + droppableAnswers);

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
            correctChoiceFeedbackUpdate(droppableHeadWord, draggedAnswer);
          }
        })
        //and if the hit counter on a droppable is depleted, make it disappear with animation and sound and check if game is won
        if ($(this).attr("matchesLeft") == 0){
          $(this).hide("explode", {pieces: 9}, 500, function() {
            chime.play();
            targets--;
            // console.log("Targets remaining: " + targets);
            winCheck();
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
        incorrectChoiceFeedbackUpdate (draggedAnswer, draggedHeadWord);
        mistakeSound.play();
        loseLife();
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
      roundScore+=10;
      updateScore(roundScore);
    };

    //UPDATE ARRAY OF WORDS THAT WEREN'T CORRECT FIRST TIME
    function incorrectChoiceFeedbackUpdate (answer, head) {
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
      console.log(needToRevise);
    }

    //FEEDBACK - SHOW TILES CORRECTLY MATCHES FIRST TIME AND PROMPT USER WITH SOLUTIONS TO WRONG MATCHES
    function giveFeedback () {
      // console.log("giveFeedback is active");
      // console.log(needToRevise);
        //Create necessary box for displaying feedback
        var feedbackBox = $("<div></div>");
        feedbackBox.attr("id", "feedbackBox");
          if (needToRevise.length == 0 && matchesThisSession.length == 0){
            let timeUpHeadRow = $('<div></div>');
            timeUpHeadRow.html("quaeso excitare");
            timeUpHeadRow.attr("id", "timeUpHeadRow");
            feedbackBox.append(timeUpHeadRow);
          }
          //Words to revise - if these are any words to revise
          //Put up a header saying to revise these words
          else if (needToRevise.length > 0) {
            let wrongHeadRow = $('<div></div>');
            wrongHeadRow.html("HAEC CORRIGE");
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
              wrongHeadRow.html("SCORE PERFECTAM");
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
        //Put the completed feedback box into the main screen
        $("#content").append(feedbackBox);
        feedbackBox.hide()
        feedbackBox.fadeIn(1000);
    }
    /////////////////////////////////////////////////////////////////
    // GAME/ROUND END CONDITIONS ////////////////////////////////////
    /////////////////////////////////////////////////////////////////

    //ENDPOINTS

    //WIN
    function winCheck() {
      if (targets == 0) {
        stopClock();
        currentSessionStage++;
        endGameCheck();
      }
    }

    //LOSE (NOT BY TIMEOUT)
    function loseCheck() {
      if (lives == 0) {
        stopClock();
        $("#content").empty();
        //
        loseMusic.play();
        //display result
        displayResult("lose");
        //display feedback
        giveFeedback();
        //make a reset button
          makeResetButton();

        //update UI helper TEXT
        showTask("replay");
        }
    }

    //END GAME IF 10 LEVELS HAVE BEEN PLAYED - otherwise reset targets and restart
    function endGameCheck () {
      //user has reached the end of this game session
      if (currentSessionStage == 11) {
        $("#content").empty();
        //start victory music
        winMusic.play();
        //display result
        displayResult("endgame");
        //reset game
        makeResetButton();
        //update UI helper text
        showTask("replay");
      }
      //user has reached the next stage, but not the end
      else if (currentSessionStage < 11) {
        $("#content").empty();
        //start victory music
        winMusic.play();
        //display result
        displayResult("win");
      //show feedback
        giveFeedback();
      //make a next stage button
        var nextStageButton = $('<div></div>');
        nextStageButton.html("deinde gradu");
        nextStageButton.addClass("startButton");
        nextStageButton.click(function () {
          nextStage();
        });
        $("#content").append(nextStageButton);

      //update UI helper text
      showTask("proceed");
      }
    };

    //TIME UP
    function timeUp(){
      //stop the timer
      stopClock();
      //play music for failure
      loseMusic.play();
      $("#content").empty();
      //display result
      displayResult("timeup");
      //show feedbackBox
      giveFeedback();
      //make a reset button
      makeResetButton();

      //update  UI helper text
      showTask("replay");
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
        let newHeart = $('<img class="heart" src="imgs/Heart-icon.png" />');
        newHeart.attr("id", heartID);
        heartBox.prepend(newHeart);
        $("#livesBox").append(heartBox);
        // console.log("created heart with id: " + newHeart.attr("id"));
      }
    };

  //REMOVE LAST HEART IN ROW
    function loseLife () {
      lives--;
      console.log("lives remaining: " + lives);
      $("#heart" + lives).hide("explode", {pieces: 9}, 1000, function() {
        loseCheck();
      });
    };


  // TIMER/////////////////////////////////////////////////////////

    //Start - count down each second
    function startTimer() {
      var timeLeft;
      switch(currentSessionStage) {
        case 1:
            timeLeft = 360;
            break;
        case 2:
            timeLeft = 330;
            break;
        case 3:
            timeLeft = 300;
            break;
        case 4:
          timeLeft = 270;
          break;
        case 5:
          timeLeft = 240;
          break;
        case 6:
          timeLeft = 210;
          break;
        case 7:
          timeLeft = 180;
          break;
        case 8:
          timeLeft = 150;
          break;
        case 9:
          timeLeft = 120;
          break;
        case 10:
          timeLeft = 90;
      }
      currentRoundTime = timeLeft;
      var timeLeftRomanNumerals = new XIII(timeLeft);
      timeLeftRomanNumerals = timeLeftRomanNumerals.getRomanNumerals();
      $("#timeText").html("Tempus: " + timeLeftRomanNumerals);
      timer = setInterval(function() {
            timeLeft-=1;
            timeLeftRomanNumerals = new XIII(timeLeft);
            timeLeftRomanNumerals = timeLeftRomanNumerals.getRomanNumerals();
            $("#timeText").html("Tempus: " + timeLeftRomanNumerals);
            if (timeLeft < 1) {
                clearInterval(timer);
                timeUp();
              }
          }, 1000);
    };

    //Stop clock
    function stopClock() {
      clearInterval(timer);
    }

  // STAGE //////////////////////////////////////////////////////////////////

    //STAGE INDICATOR IN LATIN
      function initStage () {
        var stageRomanNumerals = new XIII(currentSessionStage);
        stageRomanNumerals = stageRomanNumerals.getRomanNumerals();
        let stageTextContent = "Planum: " + stageRomanNumerals + " / X";
        $("#stageText").html(stageTextContent);
      };

    //ALTER BACKGROUND DEPENDING ON LEVEL
      function BGchange () {
        //background transparency CSS class idea from css-tricks.com user Tom in response to
        //the thread located at https://css-tricks.com/non-transparent-elements-inside-transparent-elements/
        var stageNo = currentSessionStage;
        stageClass = "lvl" + currentSessionStage + "BG";
        $("#content").removeClass("noBG");
        $("#content").addClass(stageClass);
        // console.log($("#content").attr("class"));
        //log latest class added to be able to remove later
        lastBGClassAdded = stageClass;
      };

      function displayResult (result) {
        var result = result;
        var resultBox = $("<div></div>");
        resultBox.attr("id", "resultBox");
        resultBox.addClass("resultBox");
        switch(result) {
          case "win":
              resultBox.html("PER HUNC VOBIS VINCERE! (Click for English)");
              resultBox.attr("language", "latin");
              resultBox.unbind('click');
              resultBox.click(function() {changeLanguage($(this).attr("language"),
                $(this).attr("id"),
                "PER HUNC VOBIS VINCERE! (Click to translate)",
                "You won this round! (Click for Latin)")});
              break;
          case "endgame":
              resultBox.html("EUGE! MUSIVA OMNIA DETEXISTI! PRAECLARUM ASTRUM IN ARCHAEOLOGICA SCIENTIA FACTUS ES! (Click to translate)");
              resultBox.attr("language", "latin");
              resultBox.unbind('click');
              resultBox.click(function() {changeLanguage($(this).attr("language"),
                $(this).attr("id"),
                "EUGE! MUSIVA OMNIA DETEXISTI! PRAECLARUM ASTRUM IN ARCHAEOLOGICA SCIENTIA FACTUS ES! (Click to translate)",
                "Congratulations! You have found all of the mosaics! You have become a superstar in the archaeological world! (Click text to return to Latin)")});
              break;
          case "lose":
              resultBox.html("FINEM LUDUM. IN INSIDIAS INDUCTUS ES, ET MUSIVUM DIRUTUM EST. (Click to translate)");
              resultBox.attr("language", "latin");
              resultBox.unbind('click');
              resultBox.click(function() {changeLanguage($(this).attr("language"),
                $(this).attr("id"),
                "FINEM LUDUM. IN INSIDIAS INDUCTUS ES, ET MUSIVUM DIRUTUM EST. (Click to translate)",
                "Game over! The tile was destroyed. (Click for Latin)")});
              break;
          case "timeup":
            resultBox.html("TEMPUS FUGIT. IN INSIDIAS INDUCTUS ES, ET MUSIVUM DIRUTUM EST. (Click to translate)");
            resultBox.attr("language", "latin");
            resultBox.unbind('click');
            resultBox.click(function() {changeLanguage($(this).attr("language"),
              $(this).attr("id"),
              "TEMPUS FUGIT. IN INSIDIAS INDUCTUS ES, ET MUSIVUM DIRUTUM EST. (Click to translate)",
              "Time flies! The tile was destroyed. (Click for Latin)")});
            break;
        }
        $("#content").append(resultBox);
      };


  // SCORE //////////////////////////////////////////////////////////////////

    //UPDATE SCORE WHEN POINTS ARE SCORED
      function updateScore (newScore) {
        var scoreRomanNumerals = new XIII(newScore);
        scoreRomanNumerals = scoreRomanNumerals.getRomanNumerals();
         $('#scoreText').html("Puncta: " + scoreRomanNumerals);
      }


  // UI VARIABLES AT ROUND END /////////////////////////////////////////////

  //RESET FOR NEXT ROUND
    function resetGameVarsForNextStage() {
        lives = 3;
        winMusic.pause();
        winMusic.currentTime = 0;
      }

  //RESET FOR NEXT STAGE
    function resetGameVarsCompletely() {
        loseMusic.pause();
        loseMusic.currentTime = 0;
        winMusic.pause();
        winMusic.currentTime = 0;
        roundScore = 0;
        sessionScore = 0;
        currentSessionStage = 1;
        lives = 3;
        $("#timeText").html("Tempus:");
      };

  //RESET BUTTON
    function makeResetButton() {
        var resetButton = $('<div></div>');
        resetButton.html("iterum conare");
        resetButton.addClass("startButton");
        resetButton.click(function () {
          startGame();
        });
        $("#content").append(resetButton);
      };

  // VISUALS AND SOUNDS ///////////////////////////////////////////////////

  //code to play sound sourced from w3Schools - https://www.w3schools.com/jsref/met_audio_play.asp
  var chime = document.getElementById("chime");
  var winMusic = document.getElementById("winMusic");
  var mistakeSound = document.getElementById("mistakeSound");
  var loseMusic = document.getElementById("loseMusic");
  function playAudio() {
      chime.play();
  }



// LANGUAGES /////////////////////////////////////////////////////////////

//Toggle text between English and Latin
  function changeLanguage (language, element, latinText, englishText) {
    // console.log(language);
    // console.log(typeof language);
    // console.log(element);
    // console.log(latinText);
    // console.log(englishText);
    var currentElementID = "#" + element;
    if (language == "latin") {
      $(currentElementID).attr("language", "english")
      $(currentElementID).html(englishText);
    }
    else if (language == "english") {
      $(currentElementID).attr("language", "latin")
      $(currentElementID).html(latinText);
    }
  };

  // TEXT PROMPTS //////////////////////////////////////////////////////////

  function showTask(currentTask) {
    // $('#taskBar').remove();
    //
    // var taskBar = $("<div></div>");
    // taskBar.attr("id", "taskBar");
    // taskBar.addClass("taskBar");
    // $("#gameBoard").append(taskBar)
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
    else if (currentTask == "playRound"){
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


  function addPadding(difficultyLevel){
    console.log(difficultyLevel.difficulty);
    if(difficultyLevel.difficulty == "easy" || difficultyLevel.difficulty == "medium"){
        var padding = $("<div></div>");
        padding.addClass("padding");
      }
    else if (difficultyLevel.difficulty == "hard"){
          var padding = $("<div></div>");
          padding.addClass("halfPadding");
    }
    $("#content").append(padding);
  };

});
