async function fetchPopulationData() {
    const response = await fetch('http://localhost:4000/getPopulation');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

async function loadChart() {
    try {
        const populationData = await fetchPopulationData();
        
        // Sort populationData by year
        populationData.sort((a, b) => a.year - b.year);

        const years = populationData.map(item => item.year);
        const populations = populationData.map(item => item.population);

        // Chart dimensions
        const margin = { top: 20, right: 10, bottom: 80, left: 100 };
        const width = 700 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        // Scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(years))
            .range([0, width]);

        const maxYValue = 9000000000; // Set the maximum y-axis value
        const yScale = d3.scaleLinear()
            .domain([0, maxYValue])
            .nice()
            .range([height, 0]);

        // Area generator
        const area = d3.area()
            .x(d => xScale(d.year))
            .y0(yScale(0))
            .y1(d => yScale(d.population));

        // Line generator
        const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.population));

        // SVG container
        const svg = d3.select("#Population")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat("")
            )
            .selectAll("line")
            .attr("stroke-opacity", 0.2); // Adjust the opacity here

        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat("")
            )
            .selectAll("line")
            .attr("stroke-opacity", 0.2); // Adjust the opacity here

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

        svg.append("g")
            .call(d3.axisLeft(yScale));

        // Animated text
        const text = svg.append("text")
            .attr("x", width - 125) // Position the text at the end of the x axis
            .attr("y", height - -50) // Position the text just above the x axis
            .attr("fill", "black")
            .attr("font-size", "14px")
            .attr("text-anchor", "middle");

        let previousPopulation = populations[0];
        let previousYear = years[0];

        // Function to interpolate the text values
        const updateText = (startValue, endValue, startTime, duration) => {
            const interpolatePopulation = d3.interpolateNumber(startValue, endValue);
            const interpolateYear = d3.interpolateNumber(previousYear, previousYear + 1);

            d3.transition()
                .duration(duration)
                .tween("text", function() {
                    return function(t) {
                        text.text(`Year: ${Math.round(interpolateYear(t))}, Population: ${Math.round(interpolatePopulation(t)).toLocaleString()}`);
                    };
                });

            previousYear += 1;
        };

        // Animate through each population data point
        for (let i = 1; i < populationData.length; i++) {
            setTimeout(() => {
                updateText(previousPopulation, populations[i], i * (10000 / populationData.length), 10000 / populationData.length);
                previousPopulation = populations[i];
            }, i * (10000 / populationData.length));
        }

        // Draw the line path with loading animation
        svg.append("path")
            .datum(populationData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 2)
            .attr("d", line)
            .call(animatePath);

        function animatePath(path) {
            const length = path.node().getTotalLength();
            path.attr("stroke-dasharray", length + " " + length)
                .attr("stroke-dashoffset", length)
                .transition()
                .duration(10000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0);
        }

    } catch (error) {
        console.error('Error loading the chart:', error);
    }
}

// Intersection Observer to trigger the chart loading
const sectionThree = document.querySelector('.three');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            loadChart();
            observer.unobserve(sectionThree); // Unobserve once the chart is loaded
        }
    });
}, {
    threshold: 0.5
});

// Start observing the section with class 'two'
observer.observe(sectionThree);
