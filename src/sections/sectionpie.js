const data = [
  { "value": 0.038200554, "year": 2022, "axis": "Hydro", "countryname": "DENMARK" },
  { "value": 2.9534056, "year": 2022, "axis": "Biofuels", "countryname": "DENMARK" },
  { "value": 78.893745, "year": 2022, "axis": "Oil", "countryname": "DENMARK" },
  { "value": 11.995051, "year": 2022, "axis": "Coal", "countryname": "DENMARK" },
  { "value": 5.055607, "year": 2022, "axis": "Solar", "countryname": "DENMARK" },
  { "value": 16.985794, "year": 2022, "axis": "Gas", "countryname": "DENMARK" },
  { "value": 23.934357, "year": 2022, "axis": "otherRenewables", "countryname": "DENMARK" },
  { "value": 0, "year": 2022, "axis": "Nuclear", "countryname": "DENMARK" },
  { "value": 49.540455, "year": 2022, "axis": "Wind", "countryname": "DENMARK" }
];

const width = 1300;
const height = 400;
const radius = Math.min(width, height) / 2;
const innerRadius = radius * 0.5; // Set the inner radius for the donut chart

const customColors = ['#9c755f', '#b38f74', '#8f8974', '#6f9474', '#73947e', '#75948a', '#747f94', '#766794', '#947495'];
const color = d3.scaleOrdinal(customColors);

const svg = d3.select("#donutchart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 2 + 50}, ${height / 2})`); // Adjust this value to move it more to the right

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
  .on("mouseover", function(event, d) {
      d3.select(this).select("path")
          .style("stroke", "black")
          .style("stroke-width", "3px");
      
      const percentage = d3.format(".1%")(d.data.value / d3.sum(data, d => d.value));
      const [x, y] = d3.pointer(event);
      d3.select(".tooltip")
          .style("opacity", 1)
          .style("left", `${x}px`)
          .style("top", `${y}px`)
          .html(`<strong>${d.data.axis}:</strong> ${percentage}`);

      // Update value display to the right of the donut chart
      d3.select(".value-display")
          .text(`${d.data.axis}: ${d3.format(".2f")(d.data.value)}`);
  })
  .on("mouseout", function() {
      d3.select(this).select("path")
          .style("stroke", "white")
          .style("stroke-width", "2px");
      
      d3.select(".tooltip").style("opacity", 0);

      // Clear value display
      d3.select(".value-display").text('');
  });

arcs.append("path")
  .attr("d", arc)
  .attr("fill", d => color(d.data.axis))
  .attr("stroke", "white")
  .style("stroke-width", "2px");

arcs.append("text")
  .attr("transform", d => `translate(${arc.centroid(d)})`)
  .attr("text-anchor", "middle")
  .attr("fill", "white") // Set text color to white
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

// Calculate the total value
const totalValue = d3.sum(data, d => d.value);

// Add text in the center of the donut chart
svg.append("text")
  .attr("class", "country-name")
  .attr("text-anchor", "middle")
  .attr("y", -20)
  .attr("fill", "white") // Set text color to white
  .text(data[0].countryname);

svg.append("text")
  .attr("class", "total-value")
  .attr("text-anchor", "middle")
  .attr("y", 10)
  .attr("fill", "white") // Set text color to white
  .text(d3.format(".1f")(totalValue));

svg.append("text")
  .attr("class", "total-label")
  .attr("text-anchor", "middle")
  .attr("y", 30)
  .attr("fill", "white") // Set text color to white
  .text("Total Value");

// Add a text element for displaying the hovered value
svg.append("text")
  .attr("class", "value-display")
  .attr("x", radius + 40) // Adjust this value to position it to the right of the chart
  .attr("y", 0)
  .attr("text-anchor", "start")
  .attr("fill", "white") // Set text color to white
  .style("font-size", "16px")
  .style("font-family", "poppins");

// Tooltip setup
d3.select("body").append("div")
  .attr("class", "tooltip")
  .style("position", "absolute")
  .style("background-color", "white")
  .style("border", "1px solid #d3d3d3")
  .style("padding", "5px")
  .style("box-shadow", "0px 0px 6px #aaa")
  .style("pointer-events", "none")
  .style("opacity", 0);
