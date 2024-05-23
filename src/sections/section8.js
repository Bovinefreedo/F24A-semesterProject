// set margin, width and height
const width = 1000;
const height = 500;
const margin = { top: 50, right: 50, bottom: 50, left: 100 };

// set x and y scales
const x = d3.scaleTime().range([0, width]);

const y = d3.scaleLinear().range([height, 0]);

// Data from getEnergyUseWorld
const data = [
  { date: new Date("1965"), value: 43307.869491 },
  { date: new Date("1966"), value: 45623.36121999999 },
  { date: new Date("1967"), value: 47341.248466000005 },
  { date: new Date("1968"), value: 50203.3882 },
  { date: new Date("1969"), value: 53570.320537 },
  { date: new Date("1970"), value: 56984.876954 },
  { date: new Date("1971"), value: 59321.212442000004 },
  { date: new Date("1972"), value: 62498.72939 },
  { date: new Date("1973"), value: 66152.347567 },
  { date: new Date("1974"), value: 66572.543126 },
  { date: new Date("1975"), value: 66886.81979200001 },
  { date: new Date("1976"), value: 70454.32714899999 },
  { date: new Date("1977"), value: 73046.036659 },
  { date: new Date("1978"), value: 76009.502364971 },
  { date: new Date("1979"), value: 78627.85507594299 },
  { date: new Date("1980"), value: 77946.874138333 },
  { date: new Date("1981"), value: 77624.550771333 },
  { date: new Date("1982"), value: 77205.68184816299 },
  { date: new Date("1983"), value: 78453.68916542099 },
  { date: new Date("1984"), value: 82178.642776558 },
  { date: new Date("1985"), value: 84306.37807554999 },
  { date: new Date("1986"), value: 86197.38983113 },
  { date: new Date("1987"), value: 89201.510200013 },
  { date: new Date("1988"), value: 92560.12045344301 },
  { date: new Date("1989"), value: 94387.01442234 },
  { date: new Date("1990"), value: 95604.4724825 },
  { date: new Date("1991"), value: 96274.60217140001 },
  { date: new Date("1992"), value: 96821.87972900001 },
  { date: new Date("1993"), value: 97590.49469440001 },
  { date: new Date("1994"), value: 98825.79225530002 },
  { date: new Date("1995"), value: 101077.8755395 },
  { date: new Date("1996"), value: 103972.08091649998 },
  { date: new Date("1997"), value: 105047.6394912 },
  { date: new Date("1998"), value: 105711.14717760001 },
  { date: new Date("1999"), value: 107538.6629546 },
  { date: new Date("2000"), value: 110356.5341164 },
  { date: new Date("2001"), value: 111457.3254784 },
  { date: new Date("2002"), value: 113842.337514 },
  { date: new Date("2003"), value: 117889.01350799999 },
  { date: new Date("2004"), value: 123741.62616299998 },
  { date: new Date("2005"), value: 127801.18815999999 },
  { date: new Date("2006"), value: 131415.59607 },
  { date: new Date("2007"), value: 135446.26037600002 },
  { date: new Date("2008"), value: 137036.11460299997 },
  { date: new Date("2009"), value: 134829.02342599997 },
  { date: new Date("2010"), value: 141325.55716000003 },
  { date: new Date("2011"), value: 144578.91246999998 },
  { date: new Date("2012"), value: 146655.71709 },
  { date: new Date("2013"), value: 149220.31066000002 },
  { date: new Date("2014"), value: 150798.41086 },
  { date: new Date("2015"), value: 152054.08198 },
  { date: new Date("2016"), value: 153884.57384 },
  { date: new Date("2017"), value: 157110.15800000002 },
  { date: new Date("2018"), value: 161402.7497 },
  { date: new Date("2019"), value: 163163.34399999998 },
  { date: new Date("2020"), value: 157357.8056 },
  { date: new Date("2021"), value: 165946.1632 },
  { date: new Date("2022"), value: 167787.67500000002 },
];

// create the svg element and append it to the chart container
const svg = d3
  .select("#energyChart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Create the tooltip
const toolTip = d3.select("body").append("div").attr("class", "toolTip");

// Set the x and y domains
x.domain(d3.extent(data, (d) => d.date));
y.domain([40000, d3.max(data, (d) => d.value)]);

// Add the x axis
svg
  .append("g")
  .attr("transform", `translate(0,${height})`)
  .call(d3.axisBottom(x).ticks(d3.timeYear.every(10)))
  .style("font-size", "12px");

// Add the y axis
svg
  .append("g")
  .style("font-size", "12px")
  .call(d3.axisLeft(y).tickFormat((d) => d + " Twh"));

// created a horizontol grid
svg
  .selectAll("yGrid")
  .data(y.ticks(d3.max(data, (d) => d.value) / 25000).slice(1))
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

  const year = d.date;

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
