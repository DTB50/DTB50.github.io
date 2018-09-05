
//FUNCTION TO PRINT UNMODIFIED TABLE
function printTable(albums) {
       var albums = albums;
        var table = document.getElementById("hitsTable");

        //for each object in the array, add a row
        for (var albumIdx = 0; albumIdx < albums.length; albumIdx++) {
            tableFill(albums, albumIdx);
        }
}

//FUNCTION TO FILL TABLE FOR PRINTING
//This function uses an an adaptation an exercise demonstrated by David Morrison for CS5002
//This code can be found at https://studres.cs.st-andrews.ac.uk/CS5002/Examples/MoviesExample/movies-worked.js
function tableFill(albums, albumIdx) {
    var albums = albums;
    var albumIdx = albumIdx;
    // create a new row
    var newRow = document.createElement("tr");

    // make function that fills a new cell with a value taken from the property and append the cell to the table row
    var addCell = function(value) {
      var newCell = document.createElement("td");
      var cellContent = document.createTextNode(value);
      newCell.appendChild(cellContent);
      newRow.appendChild(newCell);
    };
    //run the above function for each property of each album
    addCell(albums[albumIdx].year);
    addCell(albums[albumIdx].artist);
    addCell(albums[albumIdx].nationality);
    addCell(albums[albumIdx].album);
    //attach the newly-made row to the table
    hitsTable.appendChild(newRow)
}

//FUNCTION TO LOAD UNMODIFIED TABLE AND POPULATE SELECTS WITH OPTIONS
window.onload = function() {
    var albums = JSON.parse(albumJSON);
        for (var i = 0; i < albums.length; i++) {
            if (albums[i].nationality === null) {
                albums[i].nationality = "N/A";
            }
        }
    printTable(albums);

    //POPULATE YEAR SELECT
    //make array of years
    yearSelectList = [];

    //scan through JSON object and push years into array
    for (var yr = 0; yr < albums.length; yr++) {
    year = albums[yr].year.toString();
    yearSelectList.push(year);
    }
    yearSelectList.unshift("All");

    //append list contents to new options tags and append these to the select tag
    var yearsDropDown = document.getElementById("selectYear");
    for (var i = 0; i < yearSelectList.length; i++) {
        var newOpt = document.createElement("option");
        var optContent = document.createTextNode(yearSelectList[i]);
        newOpt.appendChild(optContent);
        yearsDropDown.appendChild(newOpt);
    }


    //POPULATE COUNTRY SELECT
    //make array of years
    countrySelectListTemp = [];
    //scan through JSON object and push countries into temporary array with duplicates (but if value is null, put N/A)
    //change all null values in JSON data to N/A
    for (var i = 0; i < albums.length; i++) {
            if (albums[i].nationality === null) {
                albums[i].nationality = "N/A";
            }
        }
    //run through JSON data to populate intermediary country list
    for (var yr = 0; yr < albums.length; yr++) {
        if (albums[yr].nationality != null) {
            country = albums[yr].nationality.toString();
            countrySelectListTemp.push(country);
        }
        else if (albums[yr].nationality == null) {
            country = "N/A";
            countrySelectListTemp.push(country);
        }
    }
    countrySelectListTemp.unshift("All");
    //refine country list by pushing unique countries into final country array
    var countrySelectList = [];
    for (var listIdx = 0; listIdx < countrySelectListTemp.length; listIdx++) {
        if (!countrySelectList.includes(countrySelectListTemp[listIdx])){
            countrySelectList.push(countrySelectListTemp[listIdx]);
        }
    }
    //append new option to countrySelectList from year array
       var countryDropDown = document.getElementById("selectCountry");
    for (var i = 0; i < countrySelectList.length; i++) {
        var newOpt = document.createElement("option");
        var optContent = document.createTextNode(countrySelectList[i]);
        newOpt.appendChild(optContent);
        countryDropDown.appendChild(newOpt);
    }

     //POPULATE ARTIST SELECT
    //make array of years
    artistSelectListTemp = [];

    //scan through JSON object and push years into array
    for (var yr = 0; yr < albums.length; yr++) {
    artist = albums[yr].artist.toString();
    artistSelectListTemp.push(artist);
    }
    artistSelectListTemp.unshift("All");
    //push unique countries into country array
    var artistSelectList = [];
    for (var listIdx = 0; listIdx < artistSelectListTemp.length; listIdx++) {
        if (!artistSelectList.includes(artistSelectListTemp[listIdx])){
            artistSelectList.push(artistSelectListTemp[listIdx]);
        }
    }
    //append list contents to new options tags and append these to the select tag
    var artistDropDown = document.getElementById("selectArtist");
    for (var i = 0; i < artistSelectList.length; i++) {
        var newOpt = document.createElement("option");
        var optContent = document.createTextNode(artistSelectList[i]);
        newOpt.appendChild(optContent);
        artistDropDown.appendChild(newOpt);
    }
}


//FUNCTION TO PRINT BY ARTIST, COUNTRY AND YEAR
function printByFilter(albums, userCountry, userYear, userArtist){
    var albums = albums;
    var userCountry = userCountry;
    var userYear = userYear;
    var userArtist = userArtist;
    var table = document.getElementById("hitsTable");

    if (userYear == "All" && userCountry == "All" && userArtist == "All") {
        printTable(albums);
    }
    else if (userYear != "All" && userCountry == "All" && userArtist == "All") {
        for (var albumIdx = 0; albumIdx < albums.length; albumIdx++) {
            if (albums[albumIdx].year == userYear) {
            tableFill(albums, albumIdx)
            }
        }
    }
    else if (userYear == "All" && userCountry == "All" && userArtist != "All") {
        for (var albumIdx = 0; albumIdx < albums.length; albumIdx++) {
            if (albums[albumIdx].artist == userArtist) {
            tableFill(albums, albumIdx);
            }
        }
    }
    else if (userYear == "All" && userCountry != "All" && userArtist == "All") {
            for (var albumIdx = 0; albumIdx < albums.length; albumIdx++) {
                if (albums[albumIdx].nationality == userCountry) {
                tableFill(albums, albumIdx);
            }
        }
    }
    else if (userYear == "All" && userCountry != "All" && userArtist != "All") {
        for (var albumIdx = 0; albumIdx < albums.length; albumIdx++) {
            if ((albums[albumIdx].artist == userArtist) && (albums[albumIdx].nationality == userCountry)) {
               tableFill(albums, albumIdx);
            }
        }
    }
    else if (userYear != "All" && userCountry != "All" && userArtist == "All") {
        for (var albumIdx = 0; albumIdx < albums.length; albumIdx++) {
            if ((albums[albumIdx].year == userYear) && (albums[albumIdx].nationality == userCountry)) {
               tableFill(albums, albumIdx);
            }
        }
    }
    else if(userYear != "All" && userCountry != "All" && userArtist != "All") {
        for (var albumIdx = 0; albumIdx < albums.length; albumIdx++) {
            if ((albums[albumIdx].year == userYear) && (albums[albumIdx].nationality == userCountry) && (albums[albumIdx].artist == userArtist)) {
                tableFill(albums, albumIdx);
            }
        }
    }
    else if(userYear != "All" && userCountry == "All" && userArtist != "All") {
        for (var albumIdx = 0; albumIdx < albums.length; albumIdx++) {
            if ((albums[albumIdx].year == userYear) && (albums[albumIdx].artist == userArtist)) {
                tableFill(albums, albumIdx);
            }
        }
    }
}

//RESET FUNCTION - RESETS TABLE ON RESET BUTTON PRESS
function reset(albums) {
    console.log("User pressed Reset");
    //DELETE CURRENT TABLE
    var rows = document.getElementById("hitsTable").rows.length;
    while (rows > 1) {
        document.getElementById("hitsTable").deleteRow(1);
        rows = document.getElementById("hitsTable").rows.length;
    }
    //REBUILD TABLE
    var albums = JSON.parse(albumJSON);
        for (var i = 0; i < albums.length; i++) {
            if (albums[i].nationality === null) {
                albums[i].nationality = "N/A";
            }
        }
    printTable(albums);
    //RESET SELECT BARS
    var selYr = document.getElementById("selectYear");
    selYr.selectedIndex = 0;
    var selCo = document.getElementById("selectCountry");
    selCo.selectedIndex = 0;
    var selArt = document.getElementById("selectArtist");
    selArt.selectedIndex = 0;
}


//MAIN FUNCTION TO ACTIVATE FILTERS ON SELECT BUTTON PRESS
function collectToFilter(album) {
    //Pull in JSON data
    var albums = JSON.parse(albumJSON);
    for (var i = 0; i < albums.length; i++) {
            if (albums[i].nationality === null) {
                albums[i].nationality = "N/A";
            }
        }
    //get search criteria from user input to dropdowns
    var selYr = document.getElementById("selectYear");
    var userYear = selYr.options[selYr.selectedIndex].text;
    var selCo = document.getElementById("selectCountry");
    var userCountry = selCo.options[selCo.selectedIndex].text;
    var selArt = document.getElementById("selectArtist");
    var userArtist = selArt.options[selArt.selectedIndex].text;
    console.log("User selected " + userYear + ", " + userCountry + ", " + userArtist + ".");
    //delete table by removing rows from table until only the header row remains (row 0)
    var rows = document.getElementById("hitsTable").rows.length;
    while (rows > 1) {
        document.getElementById("hitsTable").deleteRow(1);
        rows = document.getElementById("hitsTable").rows.length;
    }
    //rebuild table
    printByFilter(albums, userCountry, userYear, userArtist);

}
