// set margin, width and height
const width = 1250;
const height = 500;
const margin = { top: 50, right: 50, bottom: 50, left: 100 };

// set x and y scales
const x = d3.scaconstime().range([0, width]);

const y = d3.scaleLinear().range([height, 0]);

// create the svg element and append it to the chart container
const svg = d3
  .select("#denmarkEnergy")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create the tooltip
const toolTip = d3.select("body").append("div").attr("class", "toolTip");

// Data
const data = [
  { date: new Date("1965"), value: 166.20826872 },
  { date: new Date("1966"), value: 189.05940166 },
  { date: new Date("1967"), value: 190.12346472000002 },
  { date: new Date("1968"), value: 198.66685966699998 },
  { date: new Date("1969"), value: 228.04658789 },
  { date: new Date("1970"), value: 242.98941677 },
  { date: new Date("1971"), value: 229.63516177 },
  { date: new Date("1972"), value: 242.34226477 },
  { date: new Date("1973"), value: 234.46956477 },
  { date: new Date("1974"), value: 213.31388576999998 },
  { date: new Date("1975"), value: 210.23947666700002 },
  { date: new Date("1976"), value: 231.44317277599998 },
  { date: new Date("1977"), value: 236.18926765999998 },
  { date: new Date("1978"), value: 239.618583581 },
  { date: new Date("1979"), value: 239.138624723 },
  { date: new Date("1980"), value: 232.96088166700002 },
  { date: new Date("1981"), value: 209.247351383 },
  { date: new Date("1982"), value: 199.994370833 },
  { date: new Date("1983"), value: 190.113586385 },
  { date: new Date("1984"), value: 193.292690826 },
  { date: new Date("1985"), value: 217.8157011 },
  { date: new Date("1986"), value: 222.64347924999998 },
  { date: new Date("1987"), value: 214.6407237 },
  { date: new Date("1988"), value: 212.30624447 },
  { date: new Date("1989"), value: 195.81452697999998 },
  { date: new Date("1990"), value: 201.96101393 },
  { date: new Date("1991"), value: 232.85370569999998 },
  { date: new Date("1992"), value: 218.136789906 },
  { date: new Date("1993"), value: 231.30373301999998 },
  { date: new Date("1994"), value: 248.05591808 },
  { date: new Date("1995"), value: 243.61966967 },
  { date: new Date("1996"), value: 243.61966967 },
  { date: new Date("1997"), value: 262.99795685945 },
  { date: new Date("1998"), value: 253.6913200285 },
  { date: new Date("1999"), value: 246.0488783504 },
  { date: new Date("2000"), value: 236.5193922986 },
  { date: new Date("2001"), value: 237.2164963832 },
  { date: new Date("2002"), value: 236.7554476083 },
  { date: new Date("2003"), value: 255.23254668299998 },
  { date: new Date("2004"), value: 241.6517519175 },
  { date: new Date("2005"), value: 227.5990561063 },
  { date: new Date("2006"), value: 251.5625387385 },
  { date: new Date("2007"), value: 238.63370215830003 },
  { date: new Date("2008"), value: 226.6213594088 },
  { date: new Date("2009"), value: 214.5770196565 },
  { date: new Date("2010"), value: 227.93804901800002 },
  { date: new Date("2011"), value: 214.15298283700002 },
  { date: new Date("2012"), value: 199.192198536 },
  { date: new Date("2013"), value: 207.78352041 },
  { date: new Date("2014"), value: 200.00195200000002 },
  { date: new Date("2015"), value: 194.821310932 },
  { date: new Date("2016"), value: 197.83895819999998 },
  { date: new Date("2017"), value: 198.832132254 },
  { date: new Date("2018"), value: 196.31110973 },
  { date: new Date("2019"), value: 192.071242873 },
  { date: new Date("2020"), value: 171.1597073 },
  { date: new Date("2021"), value: 188.206108008 },
  { date: new Date("2022"), value: 189.396615154 },
];

// Set the x and y domains
x.domain(d3.extent(data, (d) => d.date));
y.domain([160, d3.max(data, (d) => d.value)]);

// Add the x axis
svg
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .style("font-size", "12px")
  .call(d3.axisBottom(x).ticks(d3.timeYear.every(10)));

// Add the y axis
svg
  .append("g")
  .style("font-size", "12px")
  .call(d3.axisLeft(y).tickFormat((d) => d + " Twh"));

// created a horizontol grid
svg
  .selectAll("yGrid")
  .data(y.ticks(d3.max(data, (d) => d.value) / 25).slice(1))
  .join("line")
  .attr("x1", 0)
  .attr("x2", width)
  .attr("y1", (d) => y(d))
  .attr("y2", (d) => y(d))
  .attr("stroke", "lightgrey")
  .attr("stroke-width", 0.5);

// created a vertical grid
svg
  .selectAll("xGrid")
  .data(x.ticks())
  .join("line")
  .attr("class", "xGrid")
  .attr("x1", (d) => x(d))
  .attr("x2", (d) => x(d))
  .attr("y1", 0)
  .attr("y2", height)
  .attr("stroke", "lightgrey")
  .attr("stroke-width", 0.5);

// Add y axis label
svg
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x", 0 - height / 2)
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .style("font-size", "14px")
  .style("fill", "#777")
  .style("font-family", "sans-serif")
  .text("Terawatt i timen");

// Add the line
const line = d3
  .line()
  .x((d) => x(d.date))
  .y((d) => y(d.value));

// Add the circle element
const circle = svg
  .append("circle")
  .attr("r", 0)
  .attr("fill", "steelblue")
  .style("stroke", "white")
  .attr("opacity", 0.7)
  .style("pointer-events", "none");

// Create the svg element and append it to the chart container. This gives the ability to move the mouse anywhere on the chart and get the appropriate point
const listeningRect = svg
  .append("rect")
  .attr("width", width)
  .attr("height", height);

// Give the event when the mouse moves. The bisector takes the position of the mouse and finds the nearest datapoint.
listeningRect.on("mousemove", function (event) {
  const [xCoord] = d3.pointer(event, this);
  const bisectDate = d3.bisector((d) => d.date).left;
  const x0 = x.invert(xCoord);
  const i = bisectDate(data, x0, 1);
  const d0 = data[i - 1];
  const d1 = data[i];
  const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
  const xPos = x(d.date);
  const yPos = y(d.value);

  // Update circle position
  circle.attr("cx", xPos).attr("cy", yPos);

  // Add the transition for the circle radius
  circle.transition().duration(50).attr("r", 5);

  const year = d.date.getFullYear();

  // Add the tooltip
  toolTip
    .style("display", "block")
    .style("left", `${xPos + 100}px`)
    .style("top", `${yPos + 50}px`)
    .html(
      `<strong>År:</strong> ${year}<br><strong>Forbrug:</strong> ${
        d.value !== undefined ? d.value.toFixed(0) + " Twh" : "N/A"
      }`
    );
});

// Removes the tooltip when mouse is not in the chart
listeningRect.on("mouseleave", function () {
  circle.transition().duration(50).attr("r", 0);

  // Styling the tooltip
  toolTip.style("display", "none");
});

// Creating the path
svg
  .append("path")
  .datum(data)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1)
  .attr("d", line)
  .transition()
  .duration(7500)
  .ease(d3.easeLinear)
  .attrTween("stroke-dasharray", function () {
    const length = this.getTotalLength();
    return d3.interpolate(`0,${length}`, `${length}, ${length}`);
  });
