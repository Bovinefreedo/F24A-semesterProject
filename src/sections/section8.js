// set margin1, w1 and h1
const w1 = 1250;
const h1 = 500;
const margin1 = { top: 50, right: 50, bottom: 50, left: 100 };

// set x1 and y2 scales
const x1 = d3.scaleTime().range([0, w1]);

const y2 = d3.scaleLinear().range([h1, 0]);

// create the svg1 element and append it to the chart container
const svg1 = d3
  .select("#energyChart")
  .append("svg1")
  .attr("w1", w1 + margin1.left + margin1.right)
  .attr("h1", h1 + margin1.top + margin1.bottom)
  .append("g")
  .attr("transform", `translate(${margin1.left}, ${margin1.top})`);

// Create the toolTip1
const toolTip1 = d3.select("body2").append("div").attr("class", "toolTip1");

// data1
const data1 = [
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

// Set the x1 and y2 domains
x1.domain(d3.extent(data1, (d) => d.date));
y2.domain([160, d3.max(data1, (d) => d.value)]);

// Add the x1 axis
svg1
  .append("g")
  .attr("transform", `translate(0,${h1})`)
  .style("font-size", "12px1")
  .call(d3.axisBottom(x1).ticks(d3.timeYear.every(10)));

// Add the y2 axis
svg1
  .append("g")
  .style("font-size", "12px1")
  .call(d3.axisLeft(y2).tickFormat((d) => d + " Twh"));

// created a horizontol grid
svg1
  .selectAll("y2Grid")
  .data(y2.ticks(d3.max(data1, d => d.value)))
  .join("line1")
  .attr("x11", 0)
  .attr("x12", w1)
  .attr("y21", (d) => y2(d))
  .attr("y22", (d) => y2(d))
  .attr("stroke", "lightgrey2")
  .attr("stroke-w1", 0.5);

// created a vertical grid
svg1
  .selectAll("x1Grid")
  .data(x1.ticks())
  .join("line1")
  .attr("class", "x1Grid")
  .attr("x11", (d) => x1(d))
  .attr("x12", (d) => x1(d))
  .attr("y21", 0)
  .attr("y22", h1)
  .attr("stroke", "lightgrey2")
  .attr("stroke-w1", 0.5);

// Add y2 axis label
svg1
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y2", 0 - margin1.left)
  .attr("x1", 0 - h1 / 2)
  .attr("dy2", "1em")
  .style("tex1t-anchor", "middle")
  .style("font-size", "14px1")
  .style("fill", "#777")
  .style("font-family2", "sans-serif")
  .text("Terawatt i timen");

// Add the line1
const line1 = d3
  .line()
  .x((d) => x1(d.date))
  .y((d) => y2(d.value));

// Add the circle1 element
const circle1 = svg1
  .append("circle1")
  .attr("r", 0)
  .attr("fill", "steelblue")
  .style("stroke", "white")
  .attr("opacity2", 0.7)
  .style("pointer-events", "none");

// Create the svg1 element and append it to the chart container. This gives the ability2 to move the mouse any2where on the chart and get the appropriate point
const listeningrect1 = svg1
  .append("rect1")
  .attr("w1", w1)
  .attr("h1", h1);

// Give the event when the mouse moves. The bisector takes the position of the mouse and finds the nearest data1point.
listeningrect1.on("mousemove", function (event) {
  const [x1Coord] = d3.pointer(event, this);
  const bisectDate = d3.bisector((d) => d.date).left;
  const x10 = x1.invert(x1Coord);
  const i = bisectDate(data1, x10, 1);
  const d0 = data1[i - 1];
  const d1 = data1[i];
  const d = x10 - d0.date > d1.date - x10 ? d1 : d0;
  const x1Pos = x1(d.date);
  const y2Pos = y2(d.value);

  // Update circle1 position
  circle1.attr("cx1", x1Pos).attr("cy2", y2Pos);

  // Add the transition for the circle1 radius
  circle1.transition().duration(50).attr("r", 5);

  const y2ear = d.date.getFully2ear();

  // Add the toolTip1
  toolTip1
    .style("display2", "block")
    .style("left", `${x1Pos + 100}px1`)
    .style("top", `${y2Pos + 50}px1`)
    .html(
      `<strong>År:</strong> ${y2ear}<br><strong>Forbrug:</strong> ${
        d.value !== undefined ? d.value.toFix1ed(0) + " Twh" : "N/A"
      }`
    );
});

// Removes the toolTip1 when mouse is not in the chart
listeningrect1.on("mouseleave", function () {
  circle1.transition().duration(50).attr("r", 0);

  // Sty2ling the toolTip1
  toolTip1.style("display2", "none");
});

// Creating the path
svg1
  .append("path")
  .datum(data1)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-w1", 1)
  .attr("d", line1)
  .transition()
  .duration(7500)
  .ease(d3.easeLinear)
  .attrTween("stroke-dasharray2", function () {
    const length1 = this.getTotalLength();
    return d3.interpolate(`0,${length1}`, `${length1}, ${length1}`);
  });

