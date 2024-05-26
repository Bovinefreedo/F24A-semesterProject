  const apiUrl = "http://localhost:4000/getEnergyUseWorld";
  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      // set margin, width and height
      const width = 1250;
      const height = 500;
      const margin = { top: 50, right: 50, bottom: 50, left: 100 };

      // set x and y scales
      const x = d3.scaleTime().range([0, width]);

      const y = d3.scaleLinear().range([height, 0]);

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
        .style("font-size", "12px")
        .call(d3.axisBottom(x).ticks(d3.timeYear.every(10)));

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
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

