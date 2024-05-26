// Verdenen
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
    }
}

fetchEnergyUseData().then(data => {
    if (!data) {
        return;
    }

    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#Energy")
                  .append("svg")
                  .attr("width", width + margin.left + margin.right)
                  .attr("height", height + margin.top + margin.bottom)
                  .append("g")
                  .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleLinear()
                .domain(d3.extent(data, d => d.date))
                .range([0, width]);

    const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.value)])
                .range([height, 0]);

    const line = d3.line()
                   .x(d => x(d.date))
                   .y(d => y(d.value));

    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
       .call(d3.axisLeft(y));

    svg.append("path")
       .datum(data)
       .attr("class", "line")
       .attr("d", line);

    const tooltip = d3.select("body").append("div")
                      .attr("class", "tooltip")
                      .style("opacity", 0);

    const verticalLine = svg.append("line")
                            .attr("class", "vertical-line")
                            .attr("y1", 0)
                            .attr("y2", height)
                            .style("opacity", 0);

    svg.append("rect")
       .attr("width", width)
       .attr("height", height)
       .attr("class", "overlay")
       .style("fill", "none")
       .style("pointer-events", "all")
       .on("mouseover", function() {
           tooltip.style("opacity", 1);
           verticalLine.style("opacity", 1);
       })
       .on("mousemove", function(event) {
           const bisectDate = d3.bisector(d => d.date).left;
           const mouseX = d3.pointer(event, this)[0];
           const xDate = x.invert(mouseX);
           const index = bisectDate(data, xDate, 1);
           const d0 = data[index - 1];
           const d1 = data[index];
           const d = xDate - d0.date > d1.date - xDate ? d1 : d0;

           verticalLine.attr("x1", x(d.date))
                       .attr("x2", x(d.date))
                       .attr("y1", 0)
                       .attr("y2", height);

           tooltip.html(`Date: ${d.date}<br>Value: ${d3.format(",")(d.value)}`)
                  .style("left", (event.pageX + 5) + "px")
                  .style("top", (event.pageY - 28) + "px");
       })
       .on("mouseout", function() {
           tooltip.style("opacity", 0);
           verticalLine.style("opacity", 0);
       });
}).catch(error => {
    console.error('Error fetching the data:', error);
});
