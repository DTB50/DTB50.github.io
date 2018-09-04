(function() {


    // Game state variables
    const width = 8, height = 8;
    var player = "X";
    var Xleft = 12;
    var Oleft = 12;
    var turn = 1;
    var currentxpos = 9;
    var currentypos = 9;
    var pieceSelected = false;
    var selectedCellID;
    var selectedxpos;
    var selectedypos;
    var selectedHTML;
    var intendedCellID;
    var intendedxpos;
    var intendedypos;
    var intendedHTML;
    var validMove;
    var jumpedBlue = false;
    var jumpedRed = false;
    var jumpedx;
    var jumpedy;

// MAKE ARRAY OF CELL STATUSES - runs on server side at game start
    function createBoardArray() {
      var boardStatus = [];
        for (var y = 0; y < height; y++){
          var row = [];
          for (var x = 0; x<width; x++){
            //even row, even cell = white (0)
            if ((y%2 == 0) && (x%2 ==0)){
            row.push("0");
            }
            //even row, odd cell = black (1)
            else if ((y%2 == 0) && (x%2 > 0)){
            row.push("1");
            }
            //odd row, even cell = black
            else if ((y%2 > 0) && (x%2 == 0)){
            row.push("1");
            }
            //odd row, odd cell = white
            else if ((y%2 > 0) && (x%2 > 0)){
            row.push("0");
            }
          }
          boardStatus.push(row);
        }
        console.log("Board at array generation:")
        console.log(boardStatus);
        return boardStatus;
      };

//PLACE CHECKERS - also runs serverside at game start
      function startPieces(){
        //make checker objects
        var boardStatus = createBoardArray();
        //amending status of white squares in first 3 rows
        for (var y = 0; y < 3; y++){
          for (var x = 0; x < boardStatus[y].length; x++) {
            if (boardStatus[y][x] == 0){
              boardStatus[y][x] = "X";;
            }
          }
        }
        //and in last 3 rows
        for (var y = 5; y < 8; y++){
          for (var x = 0; x < boardStatus[y].length; x++) {
            if (boardStatus[y][x] == 0){
              boardStatus[y][x] = "O";;
            }
          }
        }
        console.log("board at initial population");
        console.log(boardStatus);
        return boardStatus;
      };


//BUILD TABLE BASED ON ARRAY - happens client side (add GET request for boardStatus as JSON and convert)
function createBoard() {
  validMove = false;
  jumpedBlue = false;
  jumpedRed = false;
  ////////////////////////////////////////////////////////////////////////////////
  //SHOULD MOVE WINCHECK TO SERVER
  ///////////////////////////////////////////////////////////////////////////////
  winCheck(Xleft, Oleft);
  $("#board").empty();
  console.log("turn = " + turn + " and pieceSelected = " + pieceSelected + " and jumpedRed is " + jumpedRed + " and jumpedBlue is " + jumpedBlue);
//set up board according to start conditions or current play state
if (turn == 1){
 boardStatus = startPieces();
}
else {
  /////////////////////////////////////////////////////////////////////////////
  //fetch request goes here in final implementation to bring back new boardstatus
  //ALSO REQUEST TURN, PLAYER, XSCORE, OSCORE BACK
  ////////////////////////////////////////////////////////////////////////////
  boardStatus = boardStatus;
}
console.log("Board status updated at beginning of createboard")
console.log(boardStatus);
//make table
  let table = $('<table></table>').css('border','1px solid black').css('border-collapse', 'collapse');
//make row
var cellID = 1;
  for(let y=0; y < boardStatus.length; y++) {
      let row = $('<tr></tr>');
//make squares to fill rows
      for(let x=0; x < boardStatus[y].length; x++) {
        //make a blank white square
          if (boardStatus[y][x] == 0) {
            let col = $('<td></td>');
            col.attr("id", cellID);
            col.attr("class", "whiteSquare")
            col.html('_');
            col.attr('xpos', x);
            col.attr('ypos', y);
            col.click(function() {
              var currentCellID = $(this).attr("id");
              currentxpos = $(this).attr("xpos");
              currentypos = $(this).attr("ypos");
              var currentHTML = $(this).html();
              move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
            });
            row.append(col);
            cellID++;
          }
        //make a blank black square
          else if (boardStatus[y][x] == 1) {
            let col = $('<td></td>');
            col.attr("id", cellID);
            col.attr("class", "blackSquare")
            col.attr('xpos', x);
            col.attr('ypos', y);
            col.html('_');
            row.append(col);
            cellID++;
          }
        //make a white square with red X checker
         else if (boardStatus[y][x] == "X") {
            let col = $('<td></td>');
            col.attr("id", cellID);
            col.attr("class", "whiteSquareXred");
            col.html('X');
            col.attr('xpos', x);
            col.attr('ypos', y);
            col.click(function() {
              var currentCellID = $(this).attr("id");
              currentxpos = $(this).attr("xpos");
              currentypos = $(this).attr("ypos");
              var currentHTML = $(this).html();
              move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
            });
            row.append(col);
            cellID++;
          }
        //make a white square with blue O checker
          else if (boardStatus[y][x] == "O") {
             let col = $('<td></td>');
             col.attr("id", cellID);
             col.attr("class", "whiteSquareOblue");
             col.html('O');
             col.attr('xpos', x);
             col.attr('ypos', y);
             col.click(function() {
               var currentCellID = $(this).attr("id");
               currentxpos = $(this).attr("xpos");
               currentypos = $(this).attr("ypos");
               var currentHTML = $(this).html();
               move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
             });
             row.append(col);
             cellID++;
           }
           //make a white square with blue king O checker
             else if (boardStatus[y][x] == "|O|") {
                let col = $('<td></td>');
                col.attr("id", cellID);
                col.attr("class", "whiteSquareOkingblue");
                col.html('|O|');
                col.attr('xpos', x);
                col.attr('ypos', y);
                col.click(function() {
                  var currentCellID = $(this).attr("id");
                  currentxpos = $(this).attr("xpos");
                  currentypos = $(this).attr("ypos");
                  var currentHTML = $(this).html();
                  move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
                });
                row.append(col);
                cellID++;
              }
              //make a white square with red king X checker
                else if (boardStatus[y][x] == "|X|") {
                   let col = $('<td></td>');
                   col.attr("id", cellID);
                   col.attr("class", "whiteSquareXkingred");
                   col.html('|X|');
                   col.attr('xpos', x);
                   col.attr('ypos', y);
                   col.click(function() {
                     var currentCellID = $(this).attr("id");
                     currentxpos = $(this).attr("xpos");
                     currentypos = $(this).attr("ypos");
                     var currentHTML = $(this).html();
                     move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus);
                   });
                   row.append(col);
                   cellID++;
                 }
      }
      table.append(row);
  }

  $('#board').append(table);
  $('#Xscore').html("Player X score is " + (12-Oleft));
  $('#Oscore').html("Player O score is " + (12-Xleft));
  $('#playerTurn').html("Current Player: " + player);

}

//MOVE CELLS
function move(currentCellID, currentxpos, currentypos, currentHTML, boardStatus) {

//IF A CHECKER IS SELECTED, USER CHOOSES WHERE TO PLACE IT
  if (pieceSelected == true) {
    //assign variables for intended cell
    intendedCellID = currentCellID;
    intendedxpos = currentxpos;
    intendedypos = currentypos;
    intendedHTML = currentHTML;

  //check position
    console.log("AFTER choosing intended cell, selected cell " + selectedCellID + " is at x = " + selectedxpos + ", y=" + selectedypos + ". It contains the html " + selectedHTML)
    console.log("value of intended space is: " + boardStatus[intendedypos][intendedxpos]);

//VALIDATE MOVE - if valid, update board. If not, unselect square;
  console.log("checking validity using selectedHTML = " + selectedHTML + ", intendedHTML =:" + intendedHTML + ", selectedxpos = " + selectedxpos + " and selectedypos = " + selectedypos);

  selectedxpos = parseInt(selectedxpos);
  selectedypos = parseInt(selectedypos);
  intendedxpos = parseInt(intendedxpos);
  intendedypos = parseInt(intendedypos);


  //for red X checkers -
  if (selectedHTML == "X") {
    //normal move
      validxL = selectedxpos-1;
      validxR = selectedxpos+1;
      validy = selectedypos+1;

      validjumpxR = selectedxpos+2;
      validjumpxL = selectedxpos-2;
      validjumpy = selectedypos+2;

        //normal move
        if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validy) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
          validMove = true;
        }
        //jump right over blue square
        else if (((intendedxpos == validjumpxR && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O") && (boardStatus[validy][validxR] == "O" || boardStatus[validy][validxR] == "|O|")) {
          jumpedBlue = true;
          jumpedx = validxR;
          jumpedy = validy;
          validMove = true;
        }
        //jump left over blue square
        else if (((intendedxpos == validjumpxL && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O") && (boardStatus[validy][validxL] == "O" || boardStatus[validy][validxL] == "|O|")) {
          jumpedBlue = true;
          jumpedx = validxL;
          jumpedy = validy;
          validMove = true;
        }
/////////deselect piece - DOES NOT WORK - NEED WAY TO CANCEL OUT OF FUNCTION/////////////////////////////////////
        else if ((intendedxpos == selectedxpos) && (intendedypos == selectedypos)){
            pieceSelected == false;
            console.log("piece deselected: select again");
            return;
//NEED TO RESET SELECTEDXPOS AND SELECTEDYPOS?
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
          }
        else {
          validMove = false;
        }
    }
  //for red X kings
  if (selectedHTML == "|X|") {
    //normal move
      validxL = selectedxpos-1;
      validxR = selectedxpos+1;
      validy = selectedypos+1;
      validyup = selectedypos-1;

      validjumpxR = selectedxpos+2;
      validjumpxL = selectedxpos-2;
      validjumpy = selectedypos+2;
      validjumpyup = selectedypos-2;

        //normal move down one square left or right
        if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validy) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
          validMove = true;
        }
        //normal move up one square left or right
        else if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validyup) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
          validMove = true;
        }
        //jump right down over blue piece - if intended space is two y away and two x away, AND there's nothing in the intended space AND there's a blue piece in between the selected piece and intended space
        else if (((intendedxpos == validjumpxR && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validy][validxR] == "O" || boardStatus[validy][validxR] == "|O|")) {
          jumpedBlue = true;
          jumpedx = validxR;
          jumpedy = validy;
          validMove = true;
        }
        //jump left down over blue piece
        else if (((intendedxpos == validjumpxL && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validy][validxL] == "O" || boardStatus[validy][validxL] == "|O|")) {
          jumpedBlue = true;
          jumpedx = validxL;
          jumpedy = validy;
          validMove = true;
        }
        //jump right up over blue piece or king
        else if (((intendedxpos == validjumpxR && intendedypos == validjumpyup)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validyup][validxR] == "O" || boardStatus[validyup][validxR] == "|O|")) {
          jumpedBlue = true;
          jumpedx = validxR;
          jumpedy = validyup;
          validMove = true;
        }
        //jump left up over blue piece
        else if (((intendedxpos == validjumpxL && intendedypos == validjumpyup)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validyup][validxL] == "O" || boardStatus[validyup][validxL] == "|O|")) {
          jumpedBlue = true;
          jumpedx = validxL;
          jumpedy = validyup;
          validMove = true;
        }
        else if ((intendedxpos == selectedxpos) && (intendedypos == selectedypos)){
            pieceSelected == false;
            console.log("piece deselected: select again");
            return;
          }
        else {
          validMove = false;
        }
    }
  //for blue checkers
    else if (selectedHTML == "O") {
        validxL = selectedxpos-1;
        validxR = selectedxpos+1;
        validy = selectedypos-1;

        validjumpxR = selectedxpos+2;
        validjumpxL = selectedxpos-2;
        validjumpy = selectedypos-2;

          if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validy) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
            validMove = true;
          }
          //jump right over red square
          else if (((intendedxpos == validjumpxR && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O") && (boardStatus[validy][validxR] == "X" || boardStatus[validy][validxR] == "|X|")) {
            jumpedRed = true;
            jumpedx = validxR;
            jumpedy = validy;
            validMove = true;
          }
          //jump left over red square
          else if (((intendedxpos == validjumpxL && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O") && (boardStatus[validy][validxL] == "X" || boardStatus[validy][validxL] == "|X|")) {
            jumpedRed = true;
            jumpedx = validxL;
            jumpedy = validy;
            validMove = true;
          }
          else if ((intendedxpos == selectedxpos) && (intendedypos == selectedypos)){
              pieceSelected == false;
              console.log("piece deselected: select again");
              return;
            }
          else {
            validMove = false;
          }
        }
    //for blue kings
    else if (selectedHTML == "|O|") {
    validxL = selectedxpos-1;
    validxR = selectedxpos+1;
    validy = selectedypos-1;
    validydown = selectedypos+1;

    validjumpxR = selectedxpos+2;
    validjumpxL = selectedxpos-2;
    validjumpy = selectedypos-2;
    validjumpydown = selectedypos+2;

    //regular move up left or right by one square
      if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validy) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
        validMove = true;
      }
      //jump up right over red piece or king
      else if (((intendedxpos == validjumpxR && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O"  && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validy][validxR] == "X" || boardStatus[validy][validxR] == "|X|")) {
        jumpedRed = true;
        jumpedx = validxR;
        jumpedy = validy;
        validMove = true;
      }
      //jump up left over red piece or king
      else if (((intendedxpos == validjumpxL && intendedypos == validjumpy)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validy][validxL] == "X" || boardStatus[validy][validxL] == "|X|")) {
        jumpedRed = true;
        jumpedx = validxL;
        jumpedy = validy;
        validMove = true;
      }
     //jump down right over red piece or king
      else if (((intendedxpos == validjumpxR && intendedypos == validjumpydown)) && (intendedHTML != "X" && intendedHTML !="O"  && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validydown][validxR] == "X" || boardStatus[validydown][validxR] == "|X|")) {
        jumpedRed = true;
        jumpedx = validxR;
        jumpedy = validydown;
        validMove = true;
      }
      //jump down left over red piece or king
      else if (((intendedxpos == validjumpxL && intendedypos == validjumpydown)) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|") && (boardStatus[validydown][validxL] == "X" || boardStatus[validydown][validxL] == "|X|")) {
        jumpedRed = true;
        jumpedx = validxL;
        jumpedy = validydown;
        validMove = true;
      }
    //regular move down left or right by one square
      else if ((intendedxpos == validxR || intendedxpos == validxL) && (intendedypos == validydown) && (intendedHTML != "X" && intendedHTML !="O" && intendedHTML != "|O|" && intendedHTML != "|X|")){
        validMove = true;
      }
      else if ((intendedxpos == selectedxpos) && (intendedypos == selectedypos)){
          pieceSelected == false;
          console.log("piece deselected: select again");
          return;
        }
      else {
        validMove = false;
      }
    }

    if(validMove == true){
    boardUpdate(boardStatus, selectedHTML, intendedHTML, selectedxpos, selectedypos, intendedxpos, intendedypos, jumpedRed, jumpedBlue);
    }
    else {
    console.log("invalid move");
    }
  }

  //USER PICKS UP A CHECKER TO PLACE IT
  else if (pieceSelected == false){
    //assign variables for selected cell
    selectedCellID = currentCellID;
    selectedxpos = currentxpos;
    selectedypos = currentypos;
    selectedHTML = currentHTML;
    //only proceed if player has selected own piece - if not, require them to choose again
    if (player == "X" && (selectedHTML == "X" || selectedHTML == "|X|")) {
        console.log("correct player X piece selected");
    }
    else if (player == "O" && (selectedHTML == "O" || selectedHTML == "|O|")){
        console.log("correct player O piece selected");
    }
    else if (player == "O" && (selectedHTML == "X" || selectedHTML == "|X|")){
        console.log("player O has chosen an invalid piece");
        pieceSelected = false;
        console.log("You cannot select this piece");
        return;
    }
    else if (player == "X" && (selectedHTML == "O" || selectedHTML == "|O|")){
        console.log("player O has chosen an invalid piece");
        pieceSelected = false;
        console.log("You cannot select this piece");
        return;
    }
    else if (selectedHTML == '_') {
          pieceSelected = false;
          console.log("Square without piece selected");
          return;
      }
    var selectedChecker = "#" + selectedCellID;
      console.log(selectedChecker);
    $(selectedChecker).css("background-color", "yellow");
    console.log("selected cell" + selectedCellID + " is at x = " + selectedxpos + ", y=" + selectedypos + ". It contains the html " + selectedHTML);
    console.log("value of selected space is: " + boardStatus[selectedypos][selectedxpos]);
    pieceSelected = true;
    console.log("piece selected: " + pieceSelected);
  }
};

//UPDATE BOARD CONTROL ARRAYS AFTER PLAYER MOVE
function boardUpdate(boardStatus, selectedHTML, intendedHTML, selectedxpos, selectedypos, intendedxpos, intendedypos, jumpedRed, jumpedBlue) {
//switch pieces as player specifies
  var tempStore = boardStatus[intendedypos][intendedxpos];
  console.log("value to be moved is: " + tempStore);
  console.log("it will be replaced with" + boardStatus[selectedypos][selectedxpos]);
  boardStatus[intendedypos][intendedxpos] = boardStatus[selectedypos][selectedxpos];
  boardStatus[selectedypos][selectedxpos] = tempStore;
//remove any jumped pieces
  if (jumpedRed == true){
    boardStatus[jumpedy][jumpedx] = "0";
    Xleft--;
    jumpedRed = false;
  }
  if (jumpedBlue == true){
    boardStatus[jumpedy][jumpedx] = "0";
    Oleft--;
    jumpedBlue = false;
  }
//check for newly crowned kings
  checkKing(boardStatus);
  console.log("at turn " + turn + " the board is:");
  console.log(boardStatus);
//update round control variables - new turn, swap active player
  turn++;
    if (player == "X") {
        player = "O";
    }
    else if (player == "O") {
        player = "X";
    }
console.log("on turn " + turn + ", player = " + player);
  pieceSelected = false;
////////////////////////////////////////////////////////////////////////
//PUT REQUEST TO SERVER - SEND NEW BOARDSTATUS TO BOARDSTATUS ENDPOINT
//AND ALSO SEND VARIABLES TURN, PLAYER, XSCORE, OSCORE TO SERVER
//////////////////////////////////////////////////////////////////////////
  createBoard();
}

//CHECK IF ANY CHECKERS SHOULD BECOME KINGS
function checkKing(boardStatus) {
    //if there is a piece of the opposite side in the back row of one side, change that piece to a king
    //scan bottom row for red Xs and replace with kings
    for (var i = 7; i < height; i++) {
        for (var j = 0; j < width; j++) {
            if (boardStatus[i][j] == "X") {
                boardStatus[i][j] = "|X|";
            }
        }
    }
    //scan top row for blue Os and replace with kings
    for (var i = 0; i < 1; i++) {
        for (var j = 0; j < width; j++) {
            if (boardStatus[i][j] == "O") {
                boardStatus[i][j] = "|O|";
            }
        }
    }
};


//CHECK IF PLAYER HAS WON
function winCheck (Xleft, Oleft) {
    if(Xleft == 0){
        $('#board').empty();
        $('#Xscore').html("Player X score is " + (12-Oleft));
        $('#Oscore').html("Player X score is " + (12-Xleft));
        $('#playerTurn').html("Player O wins!");
    }
    else if (Oleft == 0){
        $('#board').empty();
        $('#Xscore').html("Player X score is " + (12-Oleft));
        $('#Oscore').html("Player X score is " + (12-Xleft));
        $('#playerTurn').html("Player X wins!");
    }
    else {
        console.log("no winners yet at X: " + Xleft + "and O: " + Oleft);
        return;
    }
};

/////////////////////////////////////////////////////
//  SETUP
/////////////////////////////////////////////////////
$( function() {
  createBoard();
});

}());
