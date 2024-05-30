// Define the API URL to fetch energy mix data for countries
const apiUrlRadar = 'http://localhost:4000/getEnergyMixCountry';

// Create a tooltip display element
let toolTipDisplay = document.createElement('div');
toolTipDisplay.id = "toolTips";
toolTipDisplay.style.position = "absolute";
toolTipDisplay.style.backgroundColor = "white";
toolTipDisplay.style.border = "1px solid #d3d3d3";
toolTipDisplay.style.padding = "5px";
toolTipDisplay.style.boxShadow = "0px 0px 6px #aaa";
toolTipDisplay.style.pointerEvents = "none"; // Ensures the tooltip does not interfere with mouse events
toolTipDisplay.style.opacity = 0;
toolTipDisplay.style.transition = "opacity 0.3s"; // Adds a transition effect to the tooltip
document.body.appendChild(toolTipDisplay); // Adds the tooltip to the document body

let rawData;

// Fetch data from the API
fetch(apiUrlRadar)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok'); // Throws an error if the network request failed
        }
        return response.json(); // Parses the JSON response
    })
    .then(data => {
        rawData = data; // Save the fetched data to a global variable
        updateChart(); // Initial chart rendering
    })
    .catch(error => console.error('Error fetching data:', error)); // Log an error if data fetching fails

// Function to update the radar chart based on selected countries
function updateChart() {
    const form = document.getElementById('countryForm');
    const formData = new FormData(form);
    const selectedCountries = formData.getAll('country');

    // Structure the data for the selected countries
    let structuredData = selectedCountries.map(country => {
        // Filter data for the current country and restructure it
        const countryData = rawData.filter(d => d.countryname === country);
        const totalValue = d3.sum(countryData, d => d.value); // Calculate the total value for the country
        return countryData.map(d => ({
            axis: d.axis,
            value: (d.value / totalValue) * 100, // Calculate the percentage for each energy source
            countryname: d.countryname
        }));
    });

    // Set up options for the radar chart
    var radarChartOptions = {
        w: 400, // Width of the chart
        h: 500, // Height of the chart
        margin: { top: 100, right: 100, bottom: 100, left: 100 }, // Margins around the chart
        maxValue: 60, // Maximum value for the scale
        levels: 3, // Number of levels/circles in the background
        roundStrokes: true, // Use rounded strokes for the lines
        color: d3.scaleOrdinal().range(["#EDC951", "#CC333F", "#00A0B0", "#FF00FF"]) // Color scale
    };

    // Render the radar chart
    RadarChart(".radarChart", structuredData, radarChartOptions);
}

// Function to render the radar chart
function RadarChart(id, data, options) {
    // Default configuration settings for the chart
    var cfg = {
        w: 400, // Width of the chart
        h: 400, // Height of the chart
        margin: { top: 20, right: 20, bottom: 20, left: 20 }, // Margins around the chart
        levels: 3, // Number of concentric circles/levels
        maxValue: 0, // Maximum value for the scale (will be calculated later)
        labelFactor: 1.25, // How far the labels are from the outer circle
        wrapWidth: 60, // Width for text wrapping
        opacityArea: 0.35, // Opacity of the filled areas
        dotRadius: 4, // Radius of the dots
        opacityCircles: 0.1, // Opacity of the circles
        strokeWidth: 2, // Width of the strokes
        roundStrokes: false, // Use rounded strokes for the lines
        color: d3.schemeCategory10 // Color scheme
    };

    // Override default configuration with user options
    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
        }
    }

    // Calculate the maximum value among the data
    var maxValue = Math.max(cfg.maxValue, d3.max(data, function (i) {
        return d3.max(i.map(function (o) { return o.value; }));
    }));

    // Get all the axes (energy sources) for the chart
    var allAxis = (data[0].map(function (i) { return i.axis; })),
        total = allAxis.length, // Total number of axes
        radius = Math.min(cfg.w / 2, cfg.h / 2), // Radius of the outermost circle
        angleSlice = Math.PI * 2 / total; // Angle for each slice

    // Scale for the radius
    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    // Remove any previous chart (if exists) and append a new SVG element
    d3.select(id).select("svg").remove();
    var svg = d3.select(id).append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar" + id);

    // Append a group element for the chart
    var g = svg.append("g")
        .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left) + "," + (cfg.h / 2 + cfg.margin.top) + ")");

    // Filter for the glow effect
    var filter = g.append('defs').append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    var feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Draw the background circles
    var axisGrid = g.append("g").attr("class", "axisWrapper");
    axisGrid.selectAll(".levels")
        .data(d3.range(0, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", function (d) { return radius / cfg.levels * d; })
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

    // Draw the axis labels
    axisGrid.selectAll(".axisLabel")
        .data(d3.range(0, (cfg.levels + 1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", function (d) { return -d * radius / cfg.levels; })
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(function (d) { return (maxValue * d / cfg.levels).toFixed(2) + "%"; });

    // Draw the axes (lines and labels)
    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    // Append the lines for each axis
    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", function (d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    // Append labels for each axis
    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
        .text(function (d) { return d; })
        .call(wrap, cfg.wrapWidth);

    // Line function to draw the radar chart blobs
    var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(function (d) { return rScale(d.value); })
        .angle(function (d, i) { return i * angleSlice; });

    // Apply curve cardinal closed interpolation if roundStrokes is true
    if (cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }

    // Create a wrapper for the blobs
    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    // Append the background blobs
    blobWrapper
        .append("path")
        .attr("class", "radarArea")
        .attr("d", function (d) { return radarLine(d); })
        .style("fill", function (d, i) { return cfg.color(i); })
        .style("fill-opacity", cfg.opacityArea)
        .on('mouseover', function (d, i) {
            // Dim all blobs and highlight the current one
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', function () {
            // Restore all blobs to original opacity
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });

    // Create the outlines for the blobs
    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", function (d) { return radarLine(d); })
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", function (d, i) { return cfg.color(i); })
        .style("fill", "none")
        .style("filter", "url(#glow)");

    // Append circles for each data point
    blobWrapper.selectAll(".radarCircle")
        .data(function (d) { return d; })
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill", function (d, i, j) { return cfg.color(j); })
        .style("fill-opacity", 0.8);

    // Create invisible circles for tooltip interactivity
    var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarCircleWrapper");

    // Append invisible circles for tooltip interactivity
    blobCircleWrapper.selectAll(".radarInvisibleCircle")
        .data(function (d) { return d; })
        .enter().append("circle")
        .attr("class", "radarInvisibleCircle")
        .attr("r", cfg.dotRadius * 1.5)
        .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        .style("fill", "none")
        .style("pointer-events", "all")
        .on("mouseover", function (event, d) {
            toolTipDisplay.style.opacity = 1;
            toolTipDisplay.innerHTML = `Country: ${d.countryname}<br>Source: ${d.axis}<br>Value: ${d.value.toFixed(2)}%`;
        })
        .on("mousemove", function (event) {
            toolTipDisplay.style.left = (event.pageX + 5) + "px";
            toolTipDisplay.style.top = (event.pageY - 28) + "px";
        })
        .on("mouseout", function () {
            toolTipDisplay.style.opacity = 0;
        });

    // Function to wrap SVG text (labels) if too long
    function wrap(text, width) {
        text.each(function () {
            var text = d3.select(this),
                words = text.text().split(/\s+/).reverse(),
                word,
                line = [],
                lineNumber = 0,
                lineHeight = 1.4, // ems
                y = text.attr("y"),
                x = text.attr("x"),
                dy = parseFloat(text.attr("dy")),
                tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("dy", dy + "em");

            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                if (tspan.node().getComputedTextLength() > width) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
                }
            }
        });
    }
}
