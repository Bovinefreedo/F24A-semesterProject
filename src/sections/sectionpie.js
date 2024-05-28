const data = [

  {
      "value": 0.038200554,
      "year": 2022,
      "axis": "Hydro",
      "countryname": "DENMARK"
  },
  {
      "value": 2.9534056,
      "year": 2022,
      "axis": "Biofuels",
      "countryname": "DENMARK"
  },
  {
      "value": 78.893745,
      "year": 2022,
      "axis": "Oil",
      "countryname": "DENMARK"
  },
  {
      "value": 11.995051,
      "year": 2022,
      "axis": "Coal",
      "countryname": "DENMARK"
  },
  {
      "value": 5.055607,
      "year": 2022,
      "axis": "Solar",
      "countryname": "DENMARK"
  },
  {
      "value": 16.985794,
      "year": 2022,
      "axis": "Gas",
      "countryname": "DENMARK"
  },
  {
      "value": 23.934357,
      "year": 2022,
      "axis": "otherRenewables",
      "countryname": "DENMARK"
  },
  {
      "value": 0,
      "year": 2022,
      "axis": "Nuclear",
      "countryname": "DENMARK"
  },
  {
      "value": 49.540455,
      "year": 2022,
      "axis": "Wind",
      "countryname": "DENMARK"
  }
];

const width = 1000;
const height = 500;
const radius = Math.min(width, height) / 2;
const innerRadius = radius * 0.5; // Set the inner radius for the donut chart

const customColors = ['#ff5733', '#ffa933', '#ffdb33', '#a3ff33', '#33ff73', '#33ffdd', '#337bff', '#7633ff', '#e933ff'];

const color = d3.scaleOrdinal(customColors);


const svg = d3.select("#donutchart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2 + 200}, ${height / 2})`); // Adjust the value to move it less to the right


const arc = d3.arc()
  .innerRadius(innerRadius) // Set the inner radius
  .outerRadius(radius);

const pie = d3.pie()
  .value(d => d.value)
  .sort(null);

const arcs = svg.selectAll("arc")
  .data(pie(data))
  .enter()
  .append("g")
  .attr("class", "arc")
  .on("mouseover", function(d) {
      const percentage = d3.format(".1%")(d.data.value / d3.sum(data, d => d.value));
      const [x, y] = d3.pointer(d3.event, svg.node());
      d3.select(".tooltip")
          .style("opacity", 1)
          .style("left", `${x}px`)
          .style("top", `${y}px`)
          .html(`<strong>${d.data.axis}:</strong> ${percentage}`);
  })
  .on("mouseout", function() {
      d3.select(".tooltip").style("opacity", 0);
  });

arcs.append("path")
  .attr("d", arc)
  .attr("fill", d => color(d.data.axis))
  .attr("stroke", "white")
  .style("stroke-width", "2px");

arcs.append("text")
  .attr("transform", d => `translate(${arc.centroid(d)})`)
  .attr("text-anchor", "middle")
  .text(d => d.data.axis);

// Add legend items
const legendItems = d3.select(".legend-items")
  .selectAll(".legend-item")
  .data(data)
  .enter()
  .append("div")
  .attr("class", "legend-item");

legendItems.append("div")
  .attr("class", "legend-color")
  .style("background-color", d => color(d.axis));

legendItems.append("div")
  .attr("class", "legend-label")
  .text(d => `${d.axis}: ${d3.format(".1%")(d.value / d3.sum(data, d => d.value))}`);

  
