d3.json('proproj.json').then(data => {
    // Convert population to numbers and sort data by year
    data.forEach(d => {
        d.population = +d.population; // Convert population to number
        d.year = new Date(d.year, 0, 1); // Convert year to Date object
    });
    data.sort((a, b) => d3.ascending(a.year, b.year));
    drawChart(data);
});

function drawChart(data) {
    const margin = { top: 30, right: 0, bottom: 80, left: 80 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#Proj").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.population)])
        .range([height, 0]);

    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.population));

    const estimates = ["Low", "Medium", "High"];

    estimates.forEach(estimate => {
        svg.append("path")
            .datum(data.filter(d => d.estimate === estimate))
            .attr("class", "line " + estimate)
            .attr("d", line);
    });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style("color", "white")
        .call(d3.axisBottom(x).ticks(d3.timeYear.every(5)));

    svg.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y))
        .style("color", "white");
}