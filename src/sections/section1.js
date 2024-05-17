/*
let year = [];
let energyUse = [];
let start = 500;
let data = [];

for(let i=1970; i<2025; i++){
    year.push(i);
    start+=(Math.floor(Math.random()*10)-2);
    energyUse.push(start);
}

for(let i = 0; i < year.lenth; i++){
    let dataPoint={date:year[i], value:energyUse[i]}
}
*/


const width = 1800
const height = 500
const margin = {top: 20, right: 30, bottom: 30, left: 40};

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


console.log(data)
                                  
x.domain(d3.extent(data, d => d.date));
y.domain([160, d3.max(data, d => d.value)]);

svg.append("g")
.attr("transform", `translate(0,${height})`)
.call(d3.axisBottom(x)
.ticks(d3.timeYear.every(10)));


svg.append("g")
.call(d3.axisLeft(y))


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
        const yPos = y(d.population);


circle.attr("cx", xpos)
.attr("cy", ypos);
console.log(xpos)

});
    
circle.transition()
.duration(50)
.attr("r", 5);

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

const toolTip = d3.select("body")
.append("div")
.attr("class", "toolTip");

/*
const path = svg.select("path");
const totalLength = path.node().getTotalLength();

path.attr("stroke-dasharray", totalLength + "" + totalLength)
.attr("stroke-dashoffset", totalLength)
.transition()
.duration(7000)
.ease(d3.easeLinear)
.attr("stroke-dashoffset", 0);

*/
/*
const xAxis = (g) =>
    g.attr("transform", `translate(0,${height - margin.bottom})`).call(
        d3
        .axisBottom(x)
        .ticks(width / 80)
        .ticksSizeOuter(0)
    )


    const yAxis = g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y))
    .call(g => g.select("domain").remove())
    .call(g => g.select(".tick:last-of-type text").clone()
    .attr("x", 3)
    .attr("text-anchor", "start")
    .attr("font-weight", "bold")
    .text(data.y))


    line = d3.line()
    .defined(d => !isNaN(d.value))
    .x(d => x(d.date))
    .y(d => y(d.value))

    function transition(path){
        path.transition()
        .duration(7500)
        .attrTween("stroke-dasharray", tweenDash)
        .on("end", () => {d3.select(this).call(transition);});
    }

    function tweenDash(){
        const l = this.getTotalLenght(),
        i = d3.interPolateString("0" + l, l + "," + l);
        return function(t) {return i (t)};
    }

*/

/*
const data2 = [];
for(let i= 0; i<data.length; i++){
    point = {"date": i, value: data[i].value};
    data2.push(point);
}
*/


    

