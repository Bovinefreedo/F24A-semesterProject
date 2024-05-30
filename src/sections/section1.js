document.addEventListener("DOMContentLoaded", function() {
    // Function to animate the counter
    const animateCounter = (elementId, targetNumber, unit) => {
        const duration = 3000; // Duration of the animation in milliseconds
        const frameDuration = 1000 / 60; // Approximate frame duration for 60fps
        const totalFrames = Math.round(duration / frameDuration); // Total frames needed for the animation
        const easeOutQuad = t => t * (2 - t); // Easing function for smooth animation
  
        let frame = 0;
        const counter = document.getElementById(elementId); // Get the counter element by ID
        const updateCounter = () => {
            frame++;
            const progress = easeOutQuad(frame / totalFrames); // Calculate progress with easing
            const currentNumber = Math.round(targetNumber * progress); // Calculate current number to display
  
            counter.innerText = `+ ${currentNumber.toLocaleString()} ${unit}`; // Update counter text
  
            if (frame < totalFrames) { // Continue animation until all frames are rendered
                requestAnimationFrame(updateCounter);
            }
        };
  
        requestAnimationFrame(updateCounter); // Start the animation
    };
  
    // Function to load and render the chart
    const loadChart = () => {
        const apiUrl = "http://localhost:4000/getEnergyUseWorld"; // API URL to fetch data
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok"); // Handle network errors
                }
                return response.json(); // Parse JSON data
            })
            .then((data) => {
                console.log(data);
  
                const margin = { top: 50, right: 10, bottom: 80, left: 100 }; // Margin for the SVG container
                const width = 650 - margin.left - margin.right; // Calculate width
                const height = 400 - margin.top - margin.bottom; // Calculate height
  
                // Append SVG to the container
                const svg = d3.select("#worldEnergy")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", `translate(${margin.left},${margin.top})`);
  
                // Create scales for x and y axes
                const x = d3.scaleLinear()
                    .domain(d3.extent(data, d => d.date)) // Set x-axis domain based on data
                    .range([0, width]);
  
                const y = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.value)]) // Set y-axis domain based on data
                    .range([height, 0]);
  
                // Create a line generator
                const line = d3.line()
                    .x(d => x(d.date)) // Set x-coordinate for the line
                    .y(d => y(d.value)); // Set y-coordinate for the line
  
                // Add y axis label
                svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - margin.left)
                    .attr("x", 0 - height / 2)
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .style("font-size", "14px")
                    .style("fill", "white")
                    .style("font-family", "sans-serif")
                    .text("Terawatt i timen");
  
                // Append x and y axes
                svg.append("g")
                    .attr("transform", `translate(0,${height})`)
                    .style("color", "white")
                    .call(d3.axisBottom(x).tickFormat(d3.format("d")));
  
                svg.append("g")
                    .style("color", "white")
                    .call(d3.axisLeft(y));
  
                // Append the line path
                const path = svg.append("path")
                    .datum(data)
                    .attr("class", "line")
                    .attr("d", line)
                    .attr("stroke", "steelblue")
                    .attr("fill", "none");
  
                // Get the total length of the line for animation
                const totalLength = path.node().getTotalLength();
  
                // Animate the line path
                path.attr("stroke-dasharray", totalLength + " " + totalLength)
                    .attr("stroke-dashoffset", totalLength)
                    .transition()
                    .duration(5000)
                    .ease(d3.easeLinear)
                    .attr("stroke-dashoffset", 0);
  
                // Append tooltip to the chart container
                const tooltip = d3.select("#worldEnergy")
                    .append("div")
                    .attr("class", "tooltip")
                    .style("opacity", 0);
  
                // Add a point for showing data on hover
                const focus = svg.append("g")
                    .append("circle")
                    .style("fill", "white")
                    .attr("stroke", "black")
                    .attr("r", 5)
                    .style("opacity", 0);
  
                // Add an invisible rect to detect mouse events for the tooltip
                svg.append("rect")
                    .attr("width", width)
                    .attr("height", height)
                    .style("fill", "none")
                    .style("pointer-events", "all")
                    .on("mousemove", function(event) {
                        const mouseX = d3.pointer(event)[0];
                        const x0 = x.invert(mouseX); // Invert x scale to get data value
                        const bisectDate = d3.bisector(d => d.date).left; // Bisector to find closest data point
                        const index = bisectDate(data, x0, 1); // Get index of the closest data point
                        const d = data[index];
  
                        // Update focus circle position and tooltip
                        focus.attr("cx", x(d.date))
                             .attr("cy", y(d.value))
                             .style("opacity", 1);
  
                        tooltip.transition()
                            .duration(200)
                            .style("opacity", 0.9);
                        tooltip.html(`Date: ${d.date}<br>Value: ${d3.format(",")(d.value)}`)
                            .style("left", (event.pageX + -50) + "px")
                            .style("top", (event.pageY - 28) + "px");
                    })
                    .on("mouseout", function() {
                        focus.style("opacity", 0);
                        tooltip.transition()
                            .duration(100)
                            .style("opacity", 0);
                    });
            }).catch(error => {
                console.error('Error fetching the data:', error); // Handle fetch errors
            });
    };
  
    // Options for the IntersectionObserver
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.5 // 50% of the element must be visible
    };
  
    // Create an IntersectionObserver
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Start both the chart and counter animations
                loadChart();
                animateCounter("energyConsumption", 846343, "TWh");
                animateCounter("energyConsumptionProcent", 404, "%");
                observer.unobserve(entry.target); // Stop observing once animations are started
            }
        });
    }, observerOptions);
  
    const target = document.querySelector('#worldEnergy'); // Target element to observe
    observer.observe(target); // Start observing the target element
  });
  