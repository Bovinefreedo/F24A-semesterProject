function loadElectricityChart() {
    const data = [
        { year: 1998, withElectricity: 4326061660, withoutElectricity: 1627944246 },
        { year: 1999, withElectricity: 4473758747, withoutElectricity: 1560732873 },
        { year: 2000, withElectricity: 4814184845, withoutElectricity: 1300147672 },
        { year: 2001, withElectricity: 4844792716, withoutElectricity: 1348878978 },
        { year: 2002, withElectricity: 4980415784, withoutElectricity: 1292337225 },
        { year: 2003, withElectricity: 5082062674, withoutElectricity: 1269819711 },
        { year: 2004, withElectricity: 5155564934, withoutElectricity: 1275986787 },
        { year: 2005, withElectricity: 5219911681, withoutElectricity: 1291836592 },
        { year: 2006, withElectricity: 5356668964, withoutElectricity: 1236065595 },
        { year: 2007, withElectricity: 5486509499, withoutElectricity: 1187694198 },
        { year: 2008, withElectricity: 5559968636, withoutElectricity: 1197052189 },
        { year: 2009, withElectricity: 5660777400, withoutElectricity: 1178796833 },
        { year: 2010, withElectricity: 5765921664, withoutElectricity: 1155955407 },
        { year: 2011, withElectricity: 5750257896, withoutElectricity: 1252623019 },
        { year: 2012, withElectricity: 6004382234, withoutElectricity: 1081408204 },
        { year: 2013, withElectricity: 6095576514, withoutElectricity: 1074098683 },
        { year: 2014, withElectricity: 6205159204, withoutElectricity: 1049133644 },
        { year: 2015, withElectricity: 6352965447, withoutElectricity: 986111206.9 },
        { year: 2016, withElectricity: 6512346366, withoutElectricity: 912138375.4 },
        { year: 2017, withElectricity: 6653490191, withoutElectricity: 855920037.1 },
        { year: 2018, withElectricity: 6789116852, withoutElectricity: 803358762.5 },
        { year: 2019, withElectricity: 6912458804, withoutElectricity: 760886587 }
    ];

    // Calculate percentages
    data.forEach(d => {
        d.total = d.withElectricity + d.withoutElectricity;
        d.percentWithElectricity = (d.withElectricity / d.total) * 100;
        d.percentWithoutElectricity = (d.withoutElectricity / d.total) * 100;
    });

    // Chart dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Scales
    const xScale = d3.scaleBand()
        .domain(data.map(d => d.year))
        .range([0, width])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height, 0]);

    // SVG container
    const svg = d3.select("#adgang")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Axes
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));

    svg.append("g")
        .call(d3.axisLeft(yScale).tickFormat(d => d + '%'));

    // Tooltip
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip");

    // Bars for percentage without electricity
    svg.selectAll(".bar-without")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar-without")
        .attr("x", d => xScale(d.year))
        .attr("y", height) // Start from the bottom of the chart
        .attr("width", xScale.bandwidth())
        .attr("height", 0) // Start with height 0
        .attr("fill", "red")
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1)
                .html(`Year: ${d.year}<br>Without Electricity: ${d.percentWithoutElectricity.toFixed(2)}%`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        })
        .transition()
        .duration(1000) // 1 second animation
        .delay((d, i) => i * 500) // Delay each bar by 0.5 seconds
        .attr("y", d => yScale(d.percentWithoutElectricity))
        .attr("height", d => height - yScale(d.percentWithoutElectricity));

    // Bars for percentage with electricity
    svg.selectAll(".bar-with")
        .data(data)
        .enter()
        .append("rect")
        .attr("class", "bar-with")
        .attr("x", d => xScale(d.year))
        .attr("y", height) // Start from the bottom of the chart
        .attr("width", xScale.bandwidth())
        .attr("height", 0) // Start with height 0
        .attr("fill", "steelblue")
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1)
                .html(`Year: ${d.year}<br>With Electricity: ${d.percentWithElectricity.toFixed(2)}%`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function() {
            tooltip.style("opacity", 0);
        })
        .transition()
        .duration(1000) // 1 second animation
        .delay((d, i) => i * 500) // Delay each bar by 0.5 seconds
        .attr("y", d => yScale(d.percentWithoutElectricity + d.percentWithElectricity))
        .attr("height", d => height - yScale(d.percentWithElectricity));
}

document.addEventListener('DOMContentLoaded', function() {
    // Set up the Intersection Observer
    const observerOptions = {
        root: null, // Use the viewport as the root
        rootMargin: '0px',
        threshold: 0.5 // 50% of the element must be visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                loadElectricityChart();
                observer.unobserve(entry.target); // Stop observing once the chart is loaded
            }
        });
    }, observerOptions);

    const target = document.querySelector('#adgang');
    observer.observe(target);
});
