// Fetch energy use data from the server
async function fetchEnergyUseData() {
    try {
        const response = await fetch('http://localhost:4000/getEnergyUseWorld');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching the data:', error);
        return null; // Return null if there's an error
    }
}

fetchEnergyUseData().then(data => {
    if (!data) {
        return;
    }

    const margin = { top: 50, right: 10, bottom: 80, left: 100 };
    const width = 1000 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Append SVG to the container
    const svg = d3.select("#worldEnergy")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create scales for x and y axes
    const x = d3.scaleLinear()
                .domain(d3.extent(data, d => d.date))
                .range([0, width]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([height, 0]);

    // Create a line generator
    const line = d3.line()
                   .x(d => x(d.date))
                   .y(d => y(d.value));

    // Append x and y axes
    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .style("color", "white")
       .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
       .style("color", "white")
       .call(d3.axisLeft(y));

    // Append the line path
    const path = svg.append("path")
                   .datum(data)
                   .attr("class", "line")
                   .attr("d", line)
                   .attr("stroke", "steelblue")
                   .attr("fill", "none");

    // Get the total length of the line for animation
    const totalLength = path.node().getTotalLength();

    // Animate the line path
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    // Append tooltip to the chart container
    const tooltip = d3.select("#worldEnergy")
                      .append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    // Add an invisible rect to detect mouse events for the tooltip
    svg.append("rect")
       .attr("width", width)
       .attr("height", height)
       .style("fill", "none")
       .style("pointer-events", "all")
       .on("mousemove", function(event) {
           const mouseX = d3.pointer(event)[0];
           const x0 = x.invert(mouseX);
           const bisectDate = d3.bisector(d => d.date).left;
           const index = bisectDate(data, x0, 1);
           const d = data[index];
           tooltip.transition()
                  .duration(200)
                  .style("opacity", 0.9);
           tooltip.html(`Date: ${d.date}<br>Value: ${d3.format(",")(d.value)}`)
                  .style("left", (event.pageX) + "px")
                  .style("top", (event.pageY - 28) + "px");
       })
       .on("mouseout", function() {
           tooltip.transition()
                  .duration(500)
                  .style("opacity", 0);
       });
}).catch(error => {
    console.error('Error fetching the data:', error);
});
