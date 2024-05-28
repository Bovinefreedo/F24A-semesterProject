const apiUrlRadar = 'http://localhost:4000/getEnergyMixCountry';

fetch(apiUrlRadar)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(rawData => {
        // Definer de lande, du ønsker at inkludere i diagrammet
        const countries = ['DENMARK', 'GERMANY', 'SWEDEN'];

        // Strukturér data for hvert land
        let structuredData = countries.map(country => {
            // Filtrer data for det aktuelle land og omform til den ønskede struktur
            const countryData = rawData.filter(d => d.countryname === country);
            const totalValue = d3.sum(countryData, d => d.value);
            return countryData.map(d => ({
                axis: d.axsis,
                value: (d.value / totalValue) * 100
            }));
        });

        console.log('Structured Data:', data);

        // Sæt op options til radardiagrammet
        var radarChartOptions = {
            w: 600,
            h: 600,
            margin: { top: 100, right: 100, bottom: 100, left: 100 },
            maxValue: 100,
            levels: 5,
            roundStrokes: true,
            color: d3.scaleOrdinal().range(["#EDC951", "#CC333F", "#00A0B0"])
        };

        // Render radardiagrammet
        RadarChart(".radarChart", structuredData, radarChartOptions);
    })
    .catch(error => console.error('Error fetching data:', error));

// Rest of your code...

function RadarChart(id, data, options) {
    var cfg = {
        w: 600,
        h: 600,
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        levels: 3,
        maxValue: 0,
        labelFactor: 1.25,
        wrapWidth: 60,
        opacityArea: 0.35,
        dotRadius: 4,
        opacityCircles: 0.1,
        strokeWidth: 2,
        roundStrokes: false,
        color: d3.schemeCategory10
    };

    if ('undefined' !== typeof options) {
        for (var i in options) {
            if ('undefined' !== typeof options[i]) { cfg[i] = options[i]; }
        }
    }

    console.log('Data received by RadarChart:', data);

    var maxValue = Math.max(cfg.maxValue, d3.max(data, d => d3.max(d, o => o.value)));

    var allAxis = data[0].map(d => d.axis),
        total = allAxis.length,
        radius = Math.min(cfg.w / 2, cfg.h / 2),
        angleSlice = Math.PI * 2 / total;

    var rScale = d3.scaleLinear()
        .range([0, radius])
        .domain([0, maxValue]);

    d3.select(id).select("svg").remove();

    var svg = d3.select(id).append("svg")
        .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
        .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
        .attr("class", "radar" + id);

    var g = svg.append("g")
        .attr("transform", `translate(${cfg.w / 2 + cfg.margin.left},${cfg.h / 2 + cfg.margin.top})`);

    var filter = g.append('defs').append('filter').attr('id', 'glow');
    filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur');
    var feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    var axisGrid = g.append("g").attr("class", "axisWrapper");

    axisGrid.selectAll(".levels")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter()
        .append("circle")
        .attr("class", "gridCircle")
        .attr("r", d => radius / cfg.levels * d)
        .style("fill", "#CDCDCD")
        .style("stroke", "#CDCDCD")
        .style("fill-opacity", cfg.opacityCircles)
        .style("filter", "url(#glow)");

    axisGrid.selectAll(".axisLabel")
        .data(d3.range(1, (cfg.levels + 1)).reverse())
        .enter().append("text")
        .attr("class", "axisLabel")
        .attr("x", 4)
        .attr("y", d => -d * radius / cfg.levels)
        .attr("dy", "0.4em")
        .style("font-size", "10px")
        .attr("fill", "#737373")
        .text(d => (d * maxValue / cfg.levels).toFixed(2));

    var axis = axisGrid.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", (d, i) => rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y2", (d, i) => rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2))
        .attr("class", "line")
        .style("stroke", "white")
        .style("stroke-width", "2px");

    axis.append("text")
        .attr("class", "legend")
        .style("font-size", "11px")
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("x", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("y", (d, i) => rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2))
        .text(d => d)
        .call(wrap, cfg.wrapWidth);

    var radarLine = d3.lineRadial()
        .curve(d3.curveLinearClosed)
        .radius(d => rScale(d.value))
        .angle((d, i) => i * angleSlice);

    if (cfg.roundStrokes) {
        radarLine.curve(d3.curveCardinalClosed);
    }

    var blobWrapper = g.selectAll(".radarWrapper")
        .data(data)
        .enter().append("g")
        .attr("class", "radarWrapper");

    // Finn alle radarområder og legg til hover-effekter
    d3.selectAll(".radarArea")
        .on('mouseover', function (event, d) {
            // Oppdater et HTML-element med data
            const tooltip = document.getElementById('tooltip');
            tooltip.innerHTML = `Axis: ${d.axis}<br>Value: ${d.value.toFixed(2)}`;

            // Posisjonerer tooltip i forhold til musepekeren
            tooltip.style.left = event.pageX + 'px';
            tooltip.style.top = event.pageY + 'px';

            // Vis tooltip
            tooltip.style.display = 'block';

            // Reduser fyllfargeopasiteten til andre radarområder
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", 0.1);

            // Øk fyllfargeopasiteten til det spesifikke radarområdet
            d3.select(this)
                .transition().duration(200)
                .style("fill-opacity", 0.7);
        })
        .on('mouseout', function () {
            // Skjul tooltip når musepekeren forlater området
            const tooltip = document.getElementById('tooltip');
            tooltip.style.display = 'none';

            // Gjenopprett fyllfargeopasiteten til alle radarområder
            d3.selectAll(".radarArea")
                .transition().duration(200)
                .style("fill-opacity", cfg.opacityArea);
        });



    blobWrapper.append("path")
        .attr("class", "radarStroke")
        .attr("d", d => radarLine(d))
        .style("stroke-width", cfg.strokeWidth + "px")
        .style("stroke", (d, i) => cfg.color(i))
        .style("fill", "none")
        .style("filter", "url(#glow)");

    blobWrapper.selectAll(".radarCircle")
        .data(d => d)
        .enter().append("circle")
        .attr("class", "radarCircle")
        .attr("r", cfg.dotRadius)
        .attr("cx", (d, i) => rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2))
        .attr("cy", (d, i) => rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2))
        .style("fill", (d, i, j) => cfg.color(j))
        .style("fill-opacity", 0.8);
}

function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1,
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
