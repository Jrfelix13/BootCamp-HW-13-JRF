// Create the size of the chart
var svgWidth = 960;
var svgHeight = 500;

var margin = {
    top: 20,
    right: 40,
    bottom: 60,
    left: 100
};

// Adjust to fit on the bolck
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Creating the bolck os svg where our chart will end on. 
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {

    // Step 1: Extract the data and parse the data of the file 
    // ==============================
    censusData.forEach(function(data) {
        data.id = +data.id;
        data.poverty = +data.poverty;
        data.povertyMoe = +data.povertyMoe;
        data.age = +data.age;
        data.ageMoe = +data.ageMoe;
        data.income = +data.income;
        data.incomeMoe = +data.incomeMoe;
        data.healthcare = +data.healthcare;
        data.healthcareLow = +data.healthcareLow;
        data.healthcareHigh = +data.healthcareHigh;
        data.obesity = +data.obesity;
        data.obesityLow = +data.obesityLow;
        data.obesityHigh = +data.obesityHigh;
        data.smokes = +data.smokes;
        data.smokesLow = +data.smokesLow;
        data.smokesHigh = +data.smokesHigh;
    });
    // Step 2: Make the scale functions
    // ==============================
    var xScale = d3.scaleLinear()
        .domain([8, d3.max(censusData, d => d.poverty) + 2])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([2, d3.max(censusData, d => d.healthcare) + 3])
        .range([height, 0]);

    // Step 3: Make the axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xScale);
    var sideAxis = d3.axisLeft(yScale);

    // Step 4: Anex axes to the chart
    // ==============================
    chartGroup.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .call(sideAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
        .data(censusData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", "15")
        .attr("fill", "green")
        .attr("opacity", ".5");

    // Step 6: Initialize tool tip
    // ==============================
    // Add state labels to the points
    var circleText = chartGroup.selectAll(null).data(censusData).enter().append("text");

    circleText
        .attr("x", function(d) {
            return xScale(d.poverty);
        })
        .attr("y", function(d) {
            return yScale(d.healthcare);
        })
        .text(function(d) {
            return d.abbr;
        })
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("text-anchor", "middle")
        .attr("fill", "white");

    // Create axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");
});