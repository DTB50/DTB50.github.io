         
	/////////////////////////////////////////////////////////////////////////////////////////////		
    //INITIAL PAGE SETUP: HAPPENS ON LOAD -------------------------------------------------------
    /////////////////////////////////////////////////////////////////////////////////////////////
            
            //Initial variables
            var year = 2000;
            var newYear;
            displayYear();
            var map;
            var dataPath = "ufo-sightings/complete.csv";
            

            ////////////////////////////////////////////////////////////
            //  BAR CHART  /////////////////////////////////////////////
            ////////////////////////////////////////////////////////////
            d3.csv(dataPath, function(error, data){
                var myData = data;
                console.log("ALL SIGHTINGS");
                console.log(data);
                var myDataByYear = [];
            
            //PARSE DATA
            //calculate number of occurrences per year in the UK
                //for each year in the dataset for the UK (1955-2014), count how many sightings occur
                for (var year = 1955; year < 2015; year++){
                    var sightingCount = 0;
                    myData.forEach(function(d){
                        if (d.country == "gb" && d.datetime.substr(6, 4) == year){
                            sightingCount++;
                        }
                    })
                    //put that into an object and that object into an array
                    var yearObject = {
                        year: year,
                        sightingCount: sightingCount
                        }
                    myDataByYear.push(yearObject);
                }
                //show the complete array of data by year
                console.log("SIGHTINGS BY YEAR:")
                console.log(myDataByYear);
                
            //VISUALISE DATA
                
                //give svg a class and style it
                var svgWidth = 500;
                var svgHeight = 100;
                var svg = d3.select('svg')
                    .attr("width", svgWidth)
                    .attr("height", svgHeight)
                    .attr("class", "bar-chart");
                
                //place div for tooltips
                var div = d3.select("body").append("div")
                .attr("class", "tooltip")
                .style("opacity", 0);
            
                var dataset = myDataByYear;
                
                //make a bar chart based on that data
                var barPadding = 3;
                
                //define width of each bar (depending how many fit into the svg)
                var barWidth = (svgWidth / dataset.length);
                
                //add bar elements - for each element, make the height a factor of the number of sightings
                var barChart = svg.selectAll("rect")
                    .data(dataset)
                    .enter()
                    .append("rect")
                    .attr("y", function(d) {
                        return svgHeight - (d.sightingCount*2)
                    })
                    .attr("height", function(d) {
                        return (d.sightingCount*2);
                    })
                    .attr("width", barWidth - barPadding)
                    .attr("class", "bar")
                    .attr("transform", function (d, i) {
                         var translate = [barWidth * i, 0];
                         return "translate("+ translate +")";
                    })
                    //add tooltip containing year and number of sightings
                    .on("mouseover", function(d) {
                       div.transition()
                         .duration(200)
                         .style("opacity", .9);
                       div.html("Year: " + (d.year) + "<br/>" + "Sightings: " + d.sightingCount)
                         .style("left", (d3.event.pageX) + "px")
                         .style("top", (d3.event.pageY - 28) + "px");
                       })
                     .on("mouseout", function(d) {
                       div.transition()
                         .duration(500)
                         .style("opacity", 0);
                       })
                    //change year on click
                    .on("click", function(d){
                        newYear = d.year
                        reload(newYear);
                    })
                    //change color of bar on mouseover
                });


  
            //////////////////////////////////////////////////////////////
            //  MAP  /////////////////////////////////////////////////////
            //////////////////////////////////////////////////////////////

            //add open street map element to div
                map = L.map('map').setView([55.9531, -3.1889], 5);

                L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png',{
                    attribution: '&copy; <a href="href://osm.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(map);


                var myIcon = L.icon({
                    iconUrl: 'images/ufo.png',
                    iconSize: [30, 30],
                    iconAnchor: [0, 30],
                    popupAnchor: [0, 20],
                });
            
//                reload(year);
            
            //on load, place markers for all UK-based sightings in the year 2000
            var sightings = 0;
            var currentLayer;
            
            //make a new layer group
            var markersLayer = new L.LayerGroup();
            
            //fill the layer with UFO elements for each UK-based UFO sighting
            d3.csv(dataPath, function(error, data){
                var myData = data;
                console.log(data);
                var marker;
                var myDataParsed = [];
                
            //parse the data by the filter category
                myData.forEach(function(d){
                    if (d.country == "gb" && d.datetime.substr(6, 4) == year){
                        sightings+=1;
                        myDataParsed.push(d);
                    }
                });
                
                console.log(myDataParsed);
                
            //update the sightings count
                console.log("INITIAL SIGHTING COUNT: " + sightings)
                displaySightings(sightings);
                
            //place markers for all filtered data elements using UFO icon
                myDataParsed.forEach(function(d){
                    var markerText = "City" + d.city;
                    marker = L.marker([d.latitude, d.longitude], {icon: myIcon}).addTo(map)
                    .bindTooltip("<b>City: </b>"  + d.city.substring(0, d.city.indexOf("("))  + "<br><b>Type: </b>" + d.shape);
                    currentLayer = L.marker([d.latitude, d.longitude], {icon: myIcon});
                    markersLayer.addLayer(marker); 
                    markersLayer.addTo(map);
                })
            });
                
    ////////////////////////////////////////////////////////////////////////////////////////////
    //  SUPPORTING FUNCTIONS -------------------------------------------------------------------
    ////////////////////////////////////////////////////////////////////////////////////////////     
            function reload(inputYear) {
                year = inputYear;
                
                
                //reset data and display layers
                console.log("changing year to " + year);
                displayYear();
                var sightings = 0;
                var currentLayer;
                markersLayer.remove();
                markersLayer.clearLayers(); 

            
                
                d3.csv(dataPath, function(error, data){
                    var myData = data;
                    console.log(data);
                    var myDataParsed = [];
                //parse the data by the filter category
                    myData.forEach(function(d){
                        if (d.country == "gb" && d.datetime.substr(6, 4) == year){
                            sightings+=1;
                            myDataParsed.push(d);
                        }
                    })
                    
                    console.log(myDataParsed);
                //update the sightings count
                    console.log("BEFORE DISPLAYSIGHTINGS, SIGHTINGS = " + sightings);
                    displaySightings(sightings);

                //place markers for all filtered data elements using UFO icon
                    myDataParsed.forEach(function(d){
                        var markerText = "City" + d.city;
                        marker = L.marker([d.latitude, d.longitude], {icon: myIcon}).addTo(map)
                        .bindTooltip("<b>City: </b>"  + d.city.substring(0, d.city.indexOf("("))  + "<br><b>Type: </b>" + d.shape);
                        currentLayer = L.marker([d.latitude, d.longitude], {icon: myIcon});
                        markersLayer.addLayer(marker); 
                        markersLayer.addTo(map);
                    })
                })
            };
            
            //AUGMENT YEAR
            
            function changeYear(direction) {
                if (direction == "plus"){
                    newYear = year+=1;
                    console.log("ADDYEAR ACTIVATED: year is now " + newYear);
                    reload(newYear);
                }
                else if (direction == "minus"){
                    newYear = year-=1;
                    console.log("MINUSYEAR ACTIVATED: year is now " + newYear);
                    reload(newYear);
                }
            };
            
            //UI ELEMENT DISPLAY
            
            function displayYear() {
                console.log("displaying year = " + year);
                document.getElementById("year").innerHTML = year;
            };
            
            function displaySightings(sightings) {
                console.log("sightings: " + sightings);
                document.getElementById("sightings").innerHTML = "Sightings: " + sightings;
            };
            