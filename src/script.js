

const width = 1250
const height = 500
const margin = {top: 50, right: 50, bottom: 50, left: 100};

const x = d3.scaleTime()
.range([0, width]);

const y = d3.scaleLinear()
.range([height, 0]);


const svg = d3.select("#three")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left}, ${margin.top})`);

const toolTip = d3.select("body")
.append("div")
.attr("class", "toolTip");



const data = [
    { date: new Date("1965"), value: 166.20826872},
    { date: new Date("1966"), value: 189.05940166},
    { date: new Date("1967"), value: 190.12346472000002},
    { date: new Date("1968"), value: 198.66685966699998},
    { date: new Date("1969"), value: 228.04658789},
    { date: new Date("1970"), value: 242.98941677},
    { date: new Date("1971"), value: 229.63516177},
    { date: new Date("1972"), value: 242.34226477},
    { date: new Date("1973"), value: 234.46956477},
    { date: new Date("1974"), value: 213.31388576999998},
    { date: new Date("1975"), value: 210.23947666700002},
    { date: new Date("1976"), value: 231.44317277599998},
    { date: new Date("1977"), value: 236.18926765999998},
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
    { date: new Date("2022"), value: 189.396615154 }
];

                                  
x.domain(d3.extent(data, d => d.date));
y.domain([160, d3.max(data, d => d.value)]);

svg.append("g")
.attr("transform", `translate(0,${height})`)
.style("font-size", "12px")
.call(d3.axisBottom(x)
.ticks(d3.timeYear.every(10)));


svg.append("g")
.style("font-size", "12px")
.call(d3.axisLeft(y).tickFormat(d => d + " Twh"));

// created a horizontol grid 
svg.selectAll("yGrid")
.data(y.ticks((d3.max(data, d => d.value) / 25)).slice(1))
.join("line")
.attr("x1", 0)
.attr("x2", width)
.attr("y1", d => y(d))
.attr("y2", d => y(d))
.attr("stroke", "lightgrey")
.attr("stroke-width", .5)

// created a vertical grid 
svg.selectAll("xGrid")
    .data(x.ticks())
    .join("line")
    .attr("class", "xGrid")
    .attr("x1", d => x(d))
    .attr("x2", d => x(d))
    .attr("y1", 0)
    .attr("y2", height)
    .attr("stroke", "lightgrey")
    .attr("stroke-width", .5);


// Add y axis label
svg.append("text")
.attr("transform", "rotate(-90)")
.attr("y", 0 - margin.left)
.attr("x", 0 - (height / 2))
.attr("dy", "1em")
.style("text-anchor", "middle")
.style("font-size", "14px")
.style("fill", "#777")
.style("font-family", "sans-serif")
.text("Terawatt i timen");



const line = d3.line()
.x(d => x(d.date))
.y(d => y(d.value));




const circle = svg.append("circle")
    .attr("r", 0)
    .attr("fill", "steelblue")
    .style("stroke", "white")
    .attr("opacity", .70)
    .style("pointer-events", "none");




const listeningRect = svg.append("rect")
    .attr("width", width)
    .attr("height", height);


    listeningRect.on("mousemove", function (event) {
        const [xCoord] = d3.pointer(event, this);
        const bisectDate = d3.bisector(d => d.date).left;
        const x0 = x.invert(xCoord);
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
        const xPos = x(d.date);
        const yPos = y(d.value);


circle.attr("cx", xPos)
.attr("cy", yPos);


    
circle.transition()
.duration(50)
.attr("r", 5);

const year = d.date.getFullYear();

toolTip
.style("display", "block")
.style("left", `${xPos + 100}px`)
.style("top", `${yPos + 50}px`)
.html(`<strong>År:</strong> ${year}<br><strong>Forbrug:</strong> ${d.value !== undefined ? (d.value).toFixed(0) + ' Twh' : 'N/A'}`)

});


listeningRect.on("mouseleave", function () {
    circle.transition()
      .duration(50)
      .attr("r", 0);

    toolTip.style("display", "none");
  });


svg.append("path")
.datum(data)
.attr("fill", "none")
.attr("stroke", "steelblue")
.attr("stroke-width", 1)
.attr("d", line)
.transition()
.duration(7500)
.ease(d3.easeLinear)
.attrTween("stroke-dasharray", function(){
    const length = this.getTotalLength();
    return d3.interpolate(`0,${length}`, `${length}, ${length}`);
});



/*
// BAR CHART

const data = [
    
        { "date": new Date("1965"), "value": 43307.869491 },
        { "date": new Date("1966"), "value": 45623.36121999999 },
        { "date": new Date("1967"), "value": 47341.248466000005 },
        { "date": new Date("1968"), "value": 50203.3882 },
        { "date": new Date("1969"), "value": 53570.320537 },
        { "date": new Date("1970"), "value": 53570.320537 },
        { "date": new Date("1971"), "value": 59321.212442000004 },
        { "date": new Date("1972"), "value": 62498.72938999999 },
        { "date": new Date("1973"), "value": 66152.347567 },
        { "date": new Date("1974"), "value": 66572.543126 },
        { "date": new Date("1975"), "value": 66886.819792 },
        { "date": new Date("1976"), "value": 70454.32714899999 },
        { "date": new Date("1977"), "value": 73046.036659 },
        { "date": new Date("1978"), "value": 76009.502364971 },
        { "date": new Date("1979"), "value": 78627.85507594299 },
        { "date": new Date("1980"), "value": 77946.874138333 },
        { "date": new Date("1981"), "value": 77624.550771333 },
        { "date": new Date("1982"), "value": 77205.68184816299 },
        { "date": new Date("1983"), "value": 78453.689165421 },
        { "date": new Date("1984"), "value": 82178.642776558 },
        { "date": new Date("1985"), "value": 84306.37807554999 },
        { "date": new Date("1986"), "value": 86197.38983113 },
        { "date": new Date("1987"), "value": 89201.510200013 },
        { "date": new Date("1988"), "value": 92560.120453443 },
        { "date": new Date("1989"), "value": 94387.01442234 },
        { "date": new Date("1990"), "value": 95604.4724825 },
        { "date": new Date("1991"), "value": 96274.60217140001 },
        { "date": new Date("1992"), "value": 96821.879729 },
        { "date": new Date("1993"), "value": 97590.4946944 },
        { "date": new Date("1994"), "value": 98825.79225530001 },
        { "date": new Date("1995"), "value": 101077.8755395 },
        { "date": new Date("1996"), "value": 103972.0809165 },
        { "date": new Date("1997"), "value": 105047.63949120001 },
        { "date": new Date("1998"), "value": 105711.1471776 },
        { "date": new Date("1999"), "value": 107538.6629546 },
        { "date": new Date("2000"), "value": 110356.5341164 },
        { "date": new Date("2001"), "value": 111457.32547839999 },
        { "date": new Date("2002"), "value": 113842.33751400001 },
        { "date": new Date("2003"), "value": 117889.013508 },
        { "date": new Date("2004"), "value": 123741.62616300001 },
        { "date": new Date("2005"), "value": 127801.18816 },
        { "date": new Date("2006"), "value": 131415.59607 },
        { "date": new Date("2007"), "value": 135446.26037600002 },
        { "date": new Date("2008"), "value": 137036.114603 },
        { "date": new Date("2009"), "value": 134829.02342599997 },
        { "date": new Date("2010"), "value": 141325.55716 },
        { "date": new Date("2011"), "value": 144578.91247 },
        { "date": new Date("2012"), "value": 146655.71709 },
        { "date": new Date("2013"), "value": 149220.31066000002 },
        { "date": new Date("2014"), "value": 150798.41086 },
        { "date": new Date("2015"), "value": 152054.08198 },
        { "date": new Date("2016"), "value": 153884.57384 },
        { "date": new Date("2017"), "value": 157110.158 },
        { "date": new Date("2018"), "value": 161402.7497 },
        { "date": new Date("2019"), "value": 163163.34399999998 },
        { "date": new Date("2020"), "value": 157357.8056 },
        { "date": new Date("2021"), "value": 165946.1632 },
        { "date": new Date("2022"), "value": 167787.675 }
    ]

    // SET THE WIDTH, HEIGHT AND MARGIN FOR THE D3
    const margin = {top: 70, right: 40, bottom: 60, left: 175};
    const width = 1000 - margin.left - margin.right
const height = 750 - margin.top - margin.bottom


// CREATE A SVG
const svg = d3.select("#div8").append("svg") 
.attr("height", height + margin.top + margin.bottom)
.attr("width", width + margin.left + margin.right)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// SET X AND Y SCALES
const x = d3.scaleBand()
    .domain(data.map(function(d) { return d.date.getFullYear(); }))
    .range([0, width])
    .padding(0.3);

const y = d3.scaleLinear()
    .domain([0, d3.max(data, function(d) { return d.value; })])
    .range([height, 0]);


// CREATE THE X AND Y AXES
const yAxis = d3.axisLeft(y)
.ticks(15)
.tickSize(5)

const xAxis = d3.axisBottom(x)
.tickSize(0)
.tickPadding(5)

// ADD A HORIZONTOL GRID LINE
svg.selectAll("line.horizontol-grid")
.data(y.ticks(15))
.enter()
.append("line")
.attr("class", "horizontol-grid")
.attr("x1", 0)
.attr("y1", function (d) { return y(d); })
.attr("x2", width)
.attr("y2", function (d) { return y(d); })
.style("stroke", "gray")
.style("stroke-width", 0.5)
.style("stroke-dasharray", "3 3");

// CREATING THE BAR
svg.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return x(d.date.getFullYear()); })
    .attr("y", function(d) { return y(d.value); })
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return height - y(d.value); })
    .style("fill", "royalblue");


// ADD THE AXES TO THE CHART
svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis)
.style("font-size", "10 px")

svg.append("g")
.call(yAxis)
.attr("class", "y axis")
.style("font-size", "10px")


*/

