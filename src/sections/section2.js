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
        const margin = { top: 30, right: 10, bottom: 80, left: 80 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

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
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .style("background-color", "white"); // Set background color to white

        // Remove the top and left axis lines
        svg.select(".domain").remove();

        // Gridlines
        svg.append("g")
            .attr("class", "grid")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat("")
            )
            .selectAll("line")
            .style("color", "white")
            .attr("stroke-opacity", 0.2); // Adjust the opacity here

        svg.append("g")
            .attr("class", "grid")
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat("")
            )
            .selectAll("line")
            .style("color", "white")
            .attr("stroke-opacity", 0.2); // Adjust the opacity here

        // Axes
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickFormat(d3.format("d"))
                .tickSize(0)
                .tickPadding(10)
            )
            .selectAll("text")
            .attr("fill", "white"); // Adjust the color of the x-axis labels

        svg.append("g")
            .call(d3.axisLeft(yScale)
                .tickSize(0)
                .tickPadding(10)
            )
            .selectAll("text")
            .attr("fill", "white"); // Adjust the color of the y-axis labels

        // Animated text
        const text = svg.append("text")
            .attr("x", width - 125) // Position the text at the end of the x axis
            .attr("y", height - -50) // Position the text just above the x axis
            .attr("fill", "white")
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
            }, i * (5000 / populationData.length));
        }

        // Draw the line path with loading animation
        svg.append("path")
            .datum(populationData)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 4)
            .attr("d", line)
            .call(animatePath);

        function animatePath(path) {
            const length = path.node().getTotalLength();
            path.attr("stroke-dasharray", length + " " + length)
                .attr("stroke-dashoffset", length)
                .transition()
                .duration(5000)
                .ease(d3.easeLinear)
                .attr("stroke-dashoffset", 0)
                .on("end", () => {
                    startCountUpAnimation(30); // Start tælleren, når diagrammet er færdig med at indlæse
                });
        }

    } catch (error) {
        console.error('Error loading the chart:', error);
    }
}

function startCountUpAnimation(durationInSeconds) {
    const countElement = document.getElementById("animatedCount");
    let count = 0;
    const targetCount = 10800000000; // Målet er 10,8 milliarder
    const totalIncrements = targetCount - count;
    const incrementsPerSecond = totalIncrements / (durationInSeconds * 500); // Antal tælleforøgelser pr. millisekund

    let startTime = null;
    let previousTime = null;

    function updateCount(timestamp) {
        if (!startTime) startTime = timestamp;
        if (!previousTime) previousTime = timestamp;

        const elapsedTime = timestamp - previousTime;

        count += elapsedTime * incrementsPerSecond; // Inkrementer tælleren med passende beløb

        if (count >= targetCount) {
            count = targetCount; // Sikre, at tælleren ikke overstiger målet
        } else {
            requestAnimationFrame(updateCount); // Planlæg opdatering af tælleren til næste animation frame
        }

        // Juster farven baseret på tallets størrelse
        const colorIntensity = Math.min(255, Math.floor(((count - 5000000000) / (targetCount - 5000000000)) * 255)); // Starter farveændringen senere
        const textColor = `rgb(255, ${255 - colorIntensity * 2}, ${255 - colorIntensity * 2})`; // Neon-rød farvegradient


        countElement.textContent = Math.floor(count).toLocaleString(); // Opdater teksten i elementet med den nuværende tæller værdi
        countElement.style.color = textColor; // Indstil tekstfarven baseret på gradienten

        // Opdater forrige tid for næste iteration
        previousTime = timestamp;
    }

    requestAnimationFrame(updateCount); // Start animationen
}

// Eksempel på brug:
// startCountUpAnimation(30); // Starter tællingen op og angiver, at det skal tage 30 sekunder


// Intersection Observer til at starte diagramindlæsningen
const sectionThree = document.querySelector('.three');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            loadChart();
            observer.unobserve(sectionThree); // Stop observationen, når diagrammet er indlæst
        }
    });
}, {
    threshold: 0.5
});

// Start observationen
observer.observe(sectionThree);
