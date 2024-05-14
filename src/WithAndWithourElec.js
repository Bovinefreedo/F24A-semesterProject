const width = 800;
const height = 300;
const margin = { top: 20, right: 30, bottom: 30, left: 100 };


const x = d3.scaleTime().range([0, width]);

const y = d3.scaleLinear().range([height, 0]);

const svg = d3.select("#without")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const data = [
        { year: 2000, withoutAccess: 1300147672 },
        { year: 2001, withoutAccess: 1348878978 },
        { year: 2002, withoutAccess: 1292337225 },
        { year: 2003, withoutAccess: 1269819711 },
        { year: 2004, withoutAccess: 1275986787 },
        { year: 2005, withoutAccess: 1291836592 },
        { year: 2006, withoutAccess: 1236065595 },
        { year: 2007, withoutAccess: 1187694198 },
        { year: 2008, withoutAccess: 1197052189 },
        { year: 2009, withoutAccess: 1178796833 },
        { year: 2010, withoutAccess: 1155955407 },
        { year: 2011, withoutAccess: 1252623019 },
        { year: 2012, withoutAccess: 1081408204 },
        { year: 2013, withoutAccess: 1074098683 },
        { year: 2014, withoutAccess: 1049133644 },
        { year: 2015, withoutAccess: 986111206.9 },
        { year: 2016, withoutAccess: 912138375.4 },
        { year: 2017, withoutAccess: 855920037.1 },
        { year: 2018, withoutAccess: 803358762.5 },
        { year: 2019, withoutAccess: 760886587 },
    ];

x.domain(d3.extent(data, d => d.date));
y.domain([0, d3.max(data, d => d.value)]);

// Append x axis and change color to blue
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(5)))
    .selectAll("path")
    .style("stroke", "blue");

// Append y axis and change color to blue
svg.append("g")
    .call(d3.axisLeft(y))
    .selectAll("path")
    .style("stroke", "blue");

const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.value));

svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "steelblue")
    .attr("stroke-width", 1)
    .attr("d", line)
    .transition()
    .duration(1500)
    .ease(d3.easeLinear)
    .attrTween("stroke-dasharray", function () {
        const length = this.getTotalLength();
        return d3.interpolate(`0,${length}`, `${length}, ${length}`);
    });


    
const path = svg.select("path");
const totalLength = path.node().getTotalLength();

// Add tooltip
const tooltip = d3.select("#tooltip");

// Set up the circle for displaying data
const circle = svg.append("circle")
    .attr("r", 0)
    .attr("fill", "steelblue")
    .style("stroke", "white")
    .attr("opacity", .70)
    .style("pointer-events", "none");

const listeningRect = svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("pointer-events", "all");

// Add a text SVG element to display circle data
const circleDataText = svg.append("text")
    .attr("class", "circle-data")
    .attr("x", 10)
    .attr("y", 10)
    .style("font-size", "12px");

// Define a function to handle mousemove events on the chart
function handleChartMouseMove(event) {
    const [xCoord] = d3.pointer(event, this);
    const bisectDate = d3.bisector(d => d.date).left;
    const x0 = x.invert(xCoord);
    const i = bisectDate(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    const xPos = x(d.date);
    const yPos = y(d.value);

    // Update the circle position
    circle.attr("cx", xPos)
        .attr("cy", yPos);

    // Update the text content with circle data
    const textContent = `Date: ${d.date.toLocaleDateString()}, Population: ${d.value !== undefined ? (d.value / 1000).toFixed(0) + 'k' : 'N/A'}`;
    circleDataText.text(textContent);

    // Determine text position based on circle position and chart boundaries
    const textWidth = circleDataText.node().getBBox().width;
    let textX, textAnchor;

    if (xPos < width / 1.25) {
        textX = xPos + 20; // Adjusted to maintain consistent distance
        textAnchor = "start";
    } else {
        textX = xPos - textWidth - -150; // Adjusted to maintain consistent distance
        textAnchor = "end";
    }

    // Set text position
    circleDataText.attr("x", textX)
        .attr("y", yPos - 10)
        .attr("text-anchor", textAnchor);

    // Add transition for the circle radius
    circle.transition()
        .duration(250)
        .attr("r", 5);
}

// Add mousemove event listener to the chart area
listeningRect.on("mousemove", handleChartMouseMove);

// Remove the event listener when the cursor moves out of the chart area
listeningRect.on("mouseleave", function () {
    circle.attr("r", 0); // Hide the circle
    circleDataText.text(""); // Clear the circle data text
    svg.on("mousemove", null); // Remove the mousemove event listener
});

// Reattach the event listener when the cursor enters the chart area
listeningRect.on("mouseenter", function () {
    svg.on("mousemove", handleChartMouseMove); // Reattach the mousemove event listener
});
