//Filtering functionality using Javascript/jQuery
//global variables for javascript/jquery
var filter = "All";


function toggle(filter) {
    var filter = filter;
    var filterText = "Filter sales by region: " + filter;
    $("#countryfilter").html(filterText);
    $("#svg1").empty();
    makeChart(filter);
};

//D3 script
//link to data file

var datapath = "vgsalestop100.csv";

//set up constants
var barWidth = 150;
var marginBars = 3;
var margin = 50;
var leftMargin = 50;
var chartHeight = 250;
var chartWidth = 700;

//The following code is predominantly based on sample code provided in Uta Hinrich's materials for CS5044 tutorials 2 (https://studres.cs.st-andrews.ac.uk/CS5044/Tutorials/D3/d3Tutorial_2_basicVisualization.pdf) and 3 (https://studres.cs.st-andrews.ac.uk/CS5044/Tutorials/D3/d3Tutorial_3_scalesAxes.pdf)
//Exceptions are noted where code is based on other information or code

//////////////////////////////////////////////////////////////////////////////////////////////////
//MAKE BAR CHARTS WITH NO OF GAMES PER PUBLISHER
//////////////////////////////////////////////////////////////////////////////////////////////////
function makeChart(filter){
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

    //Group objects by publisher and get total number of games in the top 100
        //uses code adapted from http://learnjsdata.com/group_data.html (nest) and https://stackoverflow.com/questions/30480981/d3-js-sorting-by-rollup-field (sort)
        var games_volume = d3.nest()
            .key(function(d) {return d.Publisher;})
            .rollup(function(v) {return {
                games: v.length,
                totalunits: d3.sum(v, function(d) {
                    return d.Global_Sales;
                }),
                JPunits: d3.sum(v, function(d) {
                    return d3.format(",.2f")(d.JP_Sales);
                }),
                EUunits: d3.sum(v, function(d) {
                    return d3.format(",.2f")(d.EU_Sales);
                }),
                NAunits: d3.sum(v, function(d) {
                    return d3.format(",.2f")(d.NA_Sales);
                }),
                Otherunits: d3.sum(v, function(d) {
                    return d3.format(",.2f")(d.Other_Sales);
                })
            }
            })
            .entries(data)
            .sort(function(a,b){
                    return d3.descending(a.value.totalunits, b.value.totalunits);
                    })
        console.log(JSON.stringify(games_volume));

        //Set up scales
        //Get X max and min
        var publisherExtent = d3.extent(games_volume, function(d, i){
            return i;
        })
        console.log(publisherExtent)
        //Get y max and min
        var valueExtent = d3.extent(games_volume, function(d){
            return d.value.totalunits;
        })
        console.log(valueExtent);

        minPubs = publisherExtent[0];
        maxPubs = publisherExtent[1];

        minValue = valueExtent[0];
        maxValue = valueExtent[1];

        //BLOCK SCALES
        //Define X scale
        var xScale = d3.scaleLinear()
                        .domain([0, maxPubs])
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
            .domain([0, maxPubs])
            .range([margin, chartWidth]);
        //Apply scale to axis
        var x_axis = d3.axisBottom(xAxisScale);


        //COLOUR SCALE
        var categoricalColourScale = d3.scaleOrdinal(d3.schemeCategory20)

        //DISPLAY BARS
        //Make rectangles based on games_volume
        //Mouseover highlights them and brings up exact sales figures
        d3.select("svg")
         .selectAll("g")
            .data(games_volume)
            .enter()
            .append("g")
            .append("rect")
                .attr("width", function (d){
                    return yScale(barWidth);
                })
                .attr("height", function (d){
                  if (filter == "All") {
                  return yScale(d.value.totalunits);
                  }
                  else if (filter == "Japan"){
                    return yScale(d.value.JPunits);
                  }
                  else if (filter == "NA"){
                    return yScale(d.value.NAunits);
                  }
                  else if (filter == "EU"){
                    return yScale(d.value.EUunits);
                  }
                  else if (filter == "Other"){
                    return yScale(d.value.Otherunits);
                  }
                })
                .attr("x", function (d,i){
                    return margin + xScale(i);
                })
                .attr("y", function (d, i){
                  if (filter == "All") {
                    return chartHeight + margin - yScale(d.value.totalunits);
                  }
                  if (filter == "Japan"){
                    return chartHeight + margin - yScale(d.value.JPunits);
                  }
                  if (filter == "NA"){
                    return chartHeight + margin - yScale(d.value.NAunits);
                  }
                  if (filter == "EU"){
                    return chartHeight + margin - yScale(d.value.EUunits);
                  }
                  if (filter == "Other"){
                    return chartHeight + margin - yScale(d.value.Otherunits);
                  }
                })
                .style("fill", function(d){
                    return categoricalColourScale(d.key)
                })
                .on("mouseenter", function(d, i) {
                    d3.select(this)
                        .style("stroke", "limegreen")
                        .style("stroke-width", "3px");
                    d3.select("svg")
                    .append("text")
                            .attr("class", "tooltiptext")
                            .attr("x", (margin + 400))
                            .attr("y", margin + chartHeight - 200)
                            .text(d.key)
                            .style("font-size", "8pt")
                    d3.select("svg")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 400))
                        .attr("y", margin + chartHeight - 188)
                        .text("Global sales: " + d3.format(",.2f")(d.value.totalunits) + "m units")
                        .style("font-size", "7pt");
                    d3.select("svg")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 400))
                        .attr("y", margin + chartHeight - 176)
                        .text("JP sales: " + d3.format(",.2f")(d.value.JPunits) + "m units")
                        .style("font-size", "7pt");
                    d3.select("svg")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 400))
                        .attr("y", margin + chartHeight - 164)
                        .text("EU sales: " + d3.format(",.2f")(d.value.EUunits) + "m units")
                        .style("font-size", "7pt");
                                d3.select("svg")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 400))
                        .attr("y", margin + chartHeight - 152)
                        .text("NA sales: " + d3.format(",.2f")(d.value.NAunits) + "m units")
                        .style("font-size", "7pt");
                    d3.select("svg")
                    .append("text")
                        .attr("class", "tooltiptext")
                        .attr("x", (margin + 400))
                        .attr("y", margin + chartHeight - 140)
                        .text("Other sales: " + d3.format(",.2f")(d.value.Otherunits) + "m units ")
                        .style("font-size", "7pt");
                })
                .on("mouseout", function(d) {
                    d3.select(this)
                        .style("stroke", "none");

                    d3.selectAll(".tooltiptext")
                        .remove();
                });

        //DISPLAY PUBLISHER NAMES
        d3.select("svg")
            .selectAll("text")
            .data(games_volume)
            .enter().append("text")
            .text(function(d){
                return d.key;
            })
//            .attr("x", function (d, i){
//                return (margin + i*(barWidth + marginBars))
//            })
//           .attr("y", function (d, i){
//                return (chartHeight + margin + 20)
//            })
            .attr("class", "label")
            .attr("transform", function(d, i) {
            return "translate(" + (margin + xScale(i)) + "," + (chartHeight + margin + 20) + ") rotate(90)";
            });

        //DISPLAY AXIS
        d3.select("svg")
            .append("g")
            .attr("class", "yAxis")
            .attr("transform", "translate(" + (margin - marginBars) + ", 0)")
            .call(y_axis);

    });

}
makeChart("All");
//What are the top 100 games by country?


//What year was the best for games?
    //Bar charts for time series

//Which console were the most games sold for out of the top 1000?
