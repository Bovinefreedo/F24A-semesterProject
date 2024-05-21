const width = 1000;
const height = 300;
const margin = { top: 20, right: 30, bottom: 30, left: 100 };


const x = d3.scaleTime().range([0, width]);

const y = d3.scaleLinear().range([height, 0]);

const svg = d3.select("#animated-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const data = [
    { date: new Date("1960"), value: 3031474234 },
    { date: new Date("1961"), value: 3072421801 },
    { date: new Date("1962"), value: 3126849612},
    { date: new Date("1963"), value: 3193428894},
    { date: new Date("1964"), value: 3260441925},
    { date: new Date("1965"), value: 3328209022},
    { date: new Date("1966"), value: 3398480280},
    { date: new Date("1967"), value: 3468370526},
    { date: new Date("1968"), value: 3540164023},
    { date: new Date("1969"), value: 3614572835},
    { date: new Date("1970"), value: 3690209960},
    { date: new Date("1971"), value: 3767930001},
    { date: new Date("1972"), value: 3843607574},
    { date: new Date("1973"), value: 3920017410},
    { date: new Date("1974"), value: 3995888368},
    { date: new Date("1975"), value: 4070022249},
    { date: new Date("1976"), value: 4143091942},
    { date: new Date("1977"), value: 4215826364},
    { date: new Date("1978"), value: 4289795862},
    { date: new Date("1979"), value: 4365742277},
    { date: new Date("1980"), value: 4442348279},
    { date: new Date("1981"), value: 4520917350},
    { date: new Date("1982"), value: 4602701335},
    { date: new Date("1983"), value: 4684875627},
    { date: new Date("1984"), value: 4766640881},
    { date: new Date("1985"), value: 4850076923},
    { date: new Date("1986"), value: 4936006502},
    { date: new Date("1987"), value: 5024289346},
    { date: new Date("1988"), value: 5113387878},
    { date: new Date("1989"), value: 5202582534},
    { date: new Date("1990"), value: 5293395467},
    { date: new Date("1991"), value: 5382536929},
    { date: new Date("1992"), value: 5470164577},
    { date: new Date("1993"), value: 5556623321},
    { date: new Date("1994"), value: 5642046034},
    { date: new Date("1995"), value: 5726736488},
    { date: new Date("1996"), value: 5811580202},
    { date: new Date("1997"), value: 5896055962},
    { date: new Date("1998"), value: 5979726559},
    { date: new Date("1999"), value: 6062288850},
    { date: new Date("2000"), value: 6144321462},
    { date: new Date("2001"), value: 6226348086},
    { date: new Date("2002"), value: 6308140970},
    { date: new Date("2003"), value: 6389462496},
    { date: new Date("2004"), value: 6470924346},
    { date: new Date("2005"), value: 6552700448},
    { date: new Date("2006"), value: 6635110367},
    { date: new Date("2007"), value: 6717567584},
    { date: new Date("2008"), value: 6801440971},
    { date: new Date("2009"), value: 6885663352},
    { date: new Date("2010"), value: 6969985525},
    { date: new Date("2011"), value: 7054044372},
    { date: new Date("2012"), value: 7141386257},
    { date: new Date("2013"), value: 7229303088},
    { date: new Date("2014"), value: 7317040295},
    { date: new Date("2015"), value: 7403850164},
    { date: new Date("2016"), value: 7490415449},
    { date: new Date("2017"), value: 7576441961},
    { date: new Date("2018"), value: 7660371127},
    { date: new Date("2019"), value: 7741774583},
    { date: new Date("2020"), value: 7820205606},
    { date: new Date("2021"), value: 7888305693},
    { date: new Date("2022"), value: 7950946801 },
];

x.domain(d3.extent(data, d => d.date));
y.domain([0, d3.max(data, d => d.value)]);

// Append x axis and change color to blue
svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(2)))
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
    const bisectDate = d3.bisector(d => d.date.getFullYear).left;
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
