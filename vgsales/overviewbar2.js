//D3 script
var colortoggle = "Genre";

function toggle(filter) {
    colortoggle = filter;
    console.log(colortoggle);
    var filterText = "Colour games by: " + filter;
    filterData();
    $("#filterSelect").html(filterText);
    $("#svg1").empty();
    makeChart();
};

//link to data file

var datapath = "vgsalestop100.csv";

//set up constants
var barWidth = 2.5;
var marginBars = 2;
var margin = 50;
var leftMargin = 50;
var chartHeight = 250;
var chartWidth = 800;

//The following code is predominantly based on sample code provided in Uta Hinrich's materials for CS5044 tutorials 2 (https://studres.cs.st-andrews.ac.uk/CS5044/Tutorials/D3/d3Tutorial_2_basicVisualization.pdf) and 3 (https://studres.cs.st-andrews.ac.uk/CS5044/Tutorials/D3/d3Tutorial_3_scalesAxes.pdf)
//Exceptions are noted where code is based on other information or code

function filterData () {
  console.log("filterData is active")
  console.log(datapath);
}

    /////////////////////////////////////////
    // ALL GAMES
    /////////////////////////////////////////
function makeChart() {
    //Pull in data and convert all numeric strings to integers
    //Uses code adapted from https://stackoverflow.com/questions/17601105/how-do-i-convert-strings-from-csv-in-d3-js-and-be-able-to-use-them-as-a-dataset?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
    d3.csv(datapath, function(error, data)  {
        data.forEach(function(d){
            d["Global_Sales"] = +d["Global_Sales"];
            d["EU_Sales"] = +d["EU_Sales"];
            d["NA_Sales"] = +d["NA_Sales"];
            d["JP_Sales"] = +d["JP_Sales"];
            d["Other_Sales"] = +d["Other_Sales"];
            d["Rank"] = +d["Rank"];
            d["Year"] = +d["Year"];
        });
        console.log(data);
        console.log(data.length)

        //Set up scales
        //Get X max and min
        var gamesExtent = d3.extent(data, function(d, i){
            return i;
        })
        console.log(gamesExtent)
        //Get y max and min
        var valueExtent = d3.extent(data, function(d){
            return d.Global_Sales;
        })
        console.log(valueExtent);

        minGames = gamesExtent[0];
        maxGames = gamesExtent[1];

        minValue = valueExtent[0];
        maxValue = valueExtent[1];

        //BLOCK SCALES
        //Define X scale
        var xScale = d3.scaleLinear()
                        .domain([0, maxGames])
                        .range([0, chartWidth]);
        //Define Y scale
        var yScale = d3.scaleLinear()
                        .domain([0, maxValue])
                        .range([0, chartHeight]);

        //AXIS SCALES
        //Define scale for y axis
        var yAxisScale = d3.scaleLinear()
            .domain([0, maxValue])
            .range([chartHeight + margin, margin]);
        //Apply scale to axis
        var y_axis = d3.axisLeft(yAxisScale);

        //Define x axis scale
        var xAxisScale = d3.scaleLinear()
            .domain([0, maxGames])
            .range([margin, chartWidth]);
        //Apply scale to axis
        var x_axis = d3.axisBottom(xAxisScale);


        //COLOUR SCALE
        var categoricalColourScale = d3.scaleOrdinal(d3.schemeCategory20)

        //DISPLAY BARS
        //Make rectangles based on games_volume
        //Mouseover highlights them and brings up exact sales figures
        d3.select("#svg1")
         .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .append("rect")
                .attr("width", function (d){
                    return yScale(barWidth);
                })
                .attr("height", function (d){
                    return yScale(d.Global_Sales);
                })
                .attr("x", function (d,i){
                    return margin + xScale(i);
                })
                .attr("y", function (d, i){
                    return chartHeight + margin - yScale(d.Global_Sales);
                })
                .style("fill", function(d, i){
                  if (colortoggle == "Genre"){
                    return categoricalColourScale(d.Genre);
                  }
                  else if (colortoggle == "Publisher"){
                    return categoricalColourScale(d.Publisher);
                  }
                  else if (colortoggle == "System"){
                    return categoricalColourScale(d.Platform);
                  }
                })
                .on("mouseenter", function(d, i) {
                    d3.select(this)
                        .style("stroke", "limegreen")
                        .style("stroke-width", "3px");
                    d3.select("#svg1")
                    .append("text")
                            .attr("class", "tooltiptext")
                            .attr("x", (margin + 200))
                            .attr("y", margin + chartHeight - 260)
                            .text(d.Name)
                            .style("font-size", "10pt")
                            .style("color", "limegreen");
                    d3.select("#svg1")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 200))
                        .attr("y", margin + chartHeight - 240)
                        .text("Publisher: " + d.Publisher)
                        .style("font-size", "9pt");
                    d3.select("#svg1")
                      .append("text")
                          .attr("class", "tooltiptext")
                          .attr("x", (margin + 200))
                          .attr("y", margin + chartHeight - 228)
                          .text("Released: " + d.Year)
                          .style("font-size", "9pt");
                    d3.select("#svg1")
                      .append("text")
                          .attr("class", "tooltiptext")
                          .attr("x", (margin + 200))
                          .attr("y", margin + chartHeight - 214)
                          .text("Genre: " + d.Genre)
                          .style("font-size", "9pt");
                    d3.select("#svg1")
                      .append("text")
                          .attr("class", "tooltiptext")
                          .attr("x", (margin + 200))
                          .attr("y", margin + chartHeight - 200)
                          .text("System: " + d.Platform)
                          .style("font-size", "9pt");
                    d3.select("#svg1")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 200))
                        .attr("y", margin + chartHeight - 188)
                        .text("Global sales: " + d3.format(",.2f")(d.Global_Sales) + "m units")
                        .style("font-size", "7pt");
                    d3.select("#svg1")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 200))
                        .attr("y", margin + chartHeight - 176)
                        .text("JP sales: " + d3.format(",.2f")(d.JP_Sales) + "m units")
                        .style("font-size", "7pt");
                    d3.select("#svg1")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 200))
                        .attr("y", margin + chartHeight - 164)
                        .text("EU sales: " + d3.format(",.2f")(d.EU_Sales) + "m units")
                        .style("font-size", "7pt");
                                d3.select("#svg1")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 200))
                        .attr("y", margin + chartHeight - 152)
                        .text("NA sales: " + d3.format(",.2f")(d.NA_Sales) + "m units")
                        .style("font-size", "7pt");
                    d3.select("#svg1")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 200))
                        .attr("y", margin + chartHeight - 140)
                        .text("Other sales: " + d3.format(",.2f")(d.Other_Sales) + "m units ")
                        .style("font-size", "7pt");
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                        .style("stroke", "none");

                    d3.selectAll(".tooltiptext")
                        .remove();
                });

        //DISPLAY NAMES
        d3.select("#svg1")
            .selectAll("text")
            .data(data)
            .enter().append("text")
            .text(function(d){
                return d.key;
            })
            .attr("class", "label")
            .attr("transform", function(d, i) {
            return "translate(" + (margin + xScale(i)) + "," + (chartHeight + margin + 20) + ") rotate(90)";
            });

        //DISPLAY Y-AXIS (units sold)
        d3.select("#svg1")
            .append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + (margin - marginBars) + ", 0)")
            .call(y_axis);

    });
}
makeChart("Genre");
