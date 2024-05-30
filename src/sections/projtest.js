// Load the JSON data file
d3.json('proproj.json').then(data => {
    // Convert population to numbers and sort data by year
    data.forEach(d => {
        d.population = +d.population; // Convert population to number
        d.year = new Date(d.year, 0, 1); // Convert year to Date object
    });
    data.sort((a, b) => d3.ascending(a.year, b.year)); // Sort data by year in ascending order
    drawChart(data); // Call the function to draw the chart
});

function drawChart(data) {
    // Set the dimensions and margins of the chart
    const margin = { top: 30, right: 0, bottom: 80, left: 80 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append the SVG object to the body of the page and set its dimensions
    const svg = d3.select("#Proj").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up the x-axis scale using a time scale
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.year)) // Set the domain to the extent of the years in the data
        .range([0, width]); // Set the range to the width of the chart

    // Set up the y-axis scale using a linear scale
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population)]) // Set the domain from 0 to the max population in the data
        .range([height, 0]); // Set the range to the height of the chart

    // Define the line generator function
    const line = d3.line()
        .x(d => x(d.year)) // Set the x-coordinate based on the year
        .y(d => y(d.population)); // Set the y-coordinate based on the population

    // Array of estimate types to be plotted
    const estimates = ["Low", "Medium", "High"];

    // Loop through each estimate type and append a path to the SVG for each line
    estimates.forEach(estimate => {
        svg.append("path")
            .datum(data.filter(d => d.estimate === estimate)) // Filter data for the current estimate type
            .attr("class", "line " + estimate) // Assign a class to the path for styling
            .attr("d", line); // Set the "d" attribute using the line generator
    });

    // Append the x-axis to the SVG
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")") // Position the x-axis at the bottom of the chart
        .style("color", "white") // Set the color of the axis text
        .call(d3.axisBottom(x).ticks(d3.timeYear.every(5))); // Create the axis with ticks every 5 years

    // Append the y-axis to the SVG
    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y)) // Create the y-axis
        .style("color", "white"); // Set the color of the axis text
}
