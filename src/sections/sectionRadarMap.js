/* Radar chart design created by Nadieh Bremer - VisualCinnamon.com */
  
////////////////////////////////////////////////////////////// 
//////////////////////// Set-Up ////////////////////////////// 
////////////////////////////////////////////////////////////// 

var margin = {top: 100, right: 100, bottom: 100, left: 100},  /* Marginer omkring diagrammet */
     width = Math.min(700, window.innerWidth - 10) - margin.left - margin.right, /* Beregner bredden af diagrammet */
    height = Math.min(width, window.innerHeight - margin.top - margin.bottom - 20); /* Beregner højden af diagrammet */

let contries =["GERMANY"];
    /*               

*/            
////////////////////////////////////////////////////////////// 
//////////////////// Draw the Chart ////////////////////////// 
////////////////////////////////////////////////////////////// 

var color = d3.scale.ordinal()
.range(["#EDC951","#CC333F","#00A0B0"]);        //Farver for de forskellige datasæt 
            
var radarChartOptions = {
    w: width,                                             // Bredde af diagrammet
    h: height,                                            // Højde af diagrammet 
    margin: margin,                                       // Margener omkring diagrammet
    maxValue: 0.5,                                         // Maksimumsværdi på akserne
    levels: 4,                                           // Antal niveauer (gitterlinjer)
    roundStrokes: true,                                   // Afrundede streger på polygonerne
    color: color                                          // Farveskala for datasættene 
};

const apiUrl = 'http://localhost:4000/getEnergyMixCountry';
fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
	.then(rawData => {
        // Strukturér data for hvert land
  let structuredData = contries.map(country => {
    // Filtrer data for det aktuelle land og omform til den ønskede struktur
    const countryData = rawData.filter(d => d.countryname === country);
    const totalValue = d3.sum(countryData, d => d.value);
    return countryData.map(d => ({
      axis: d.axsis,
      value: (d.value / totalValue) * 100
            }));
        });

	
        // Kontroller struktureret data
        console.log(structuredData);

        // Kald funktionen til at tegne RadarChart med den strukturerede data
        RadarChart(".radarChart", structuredData, radarChartOptions);
    })
    .catch(error => {
        console.error('Error:', error);
    });
	/*
    then(data => {
      for(let i=0; i< contries.length; i++){
        contries.push([])
      }
      for(let i=0; i<contries.length; i++){
        for(let j=0; j<data.length; j++){
            if(data[j].countryname == contries[i]){
                data[i].push(data[j]);
            }
        }
      }
      console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
*/
//Call function to draw the Radar chart
RadarChart(".radarChart", data, radarChartOptions);  /* Kalder funktionen til at tegne diagrammet */


function RadarChart(id, data, options) { // Definerer funktionen RadarChart, som tager tre argumenter: id (et string, der angiver ID'et på det HTML-element, hvor diagrammet skal placeres), data (et array af arrays, der indeholder dataene for diagrammet), og options (et objekt, der indeholder konfigurationsindstillinger for diagrammet).

    var cfg = {                         // Definerer et objekt kaldet cfg, der indeholder standardkonfigurationen for diagrammet.
        w: 600,                        // Bredde af diagrammet i pixels (standardværdi: 600).
        h: 600,                        // Højde af diagrammet i pixels (standardværdi: 600).
        margin: { top: 20, right: 20, bottom: 20, left: 20 }, // Margener omkring diagrammet i pixels (standardværdi: 20 pixels på alle sider).
        levels: 3,                     // Antallet af niveauer (cirkler) i diagrammet (standardværdi: 3).
        maxValue: 0,                   // Maksimumsværdien for dataene (standardværdi: 0). Dette vil blive beregnet senere baseret på de faktiske data.
        labelFactor: 1.25,             // Hvor langt væk fra den yderste cirkel akse-labels skal placeres (standardværdi: 1.25).
        wrapWidth: 60,                 // Antallet af pixels, hvor en akse-label skal ombrydes til en ny linje (standardværdi: 60).
        opacityArea: 0.35,             // Opacitet (gennemsigtighed) af polygon-områderne (standardværdi: 0.35).
        dotRadius: 4,                  // Radius af datapunkterne (cirkler) i pixels (standardværdi: 4).
        opacityCircles: 0.1,           // Opacitet af datapunkterne (cirkler) (standardværdi: 0.1).
        strokeWidth: 2,                // Tykkelse af stregen omkring polygonerne i pixels (standardværdi: 2).
        roundStrokes: false,           // Angiver, om stregerne omkring polygonerne skal være runde (true) eller ej (false). Standardværdien er false.
        color: d3.scale.category10()   // Farveskala til at tildele farver til forskellige datasæt. D3's category10-skala bruges som standard.
    };

	
	//Put all of the options into a variable called cfg
	if('undefined' !== typeof options){			// Tjekker om `options` (brugerdefinerede indstillinger) er defineret (ikke 'undefined')
	  for(var i in options){					// Looper gennem alle nøgler (egenskabsnavne) i `options` objektet
		if('undefined' !== typeof options[i]){ cfg[i] = options[i]; } // Tjekker om værdien for den aktuelle nøgle er defineret
	  }//for i
	}//if
	
	//If the supplied maxValue is smaller than the actual one, replace by the max in the data
	var maxValue = Math.max(cfg.maxValue, d3.max(data, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		
	var allAxis = (data[0].map(function(i, j){return i.axis})),	//Names of each axis
		total = allAxis.length,					//The number of different axes
		radius = Math.min(cfg.w/2, cfg.h/2), 	//Radius of the outermost circle
		Format = d3.format('%'),			 	//Percentage formatting
		angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
	
	//Scale for the radius
	var rScale = d3.scale.linear()
		.range([0, radius])						// Output range (pixels)
		.domain([0, maxValue]);					// Input domain (data values)
		
	/////////////////////////////////////////////////////////
	//////////// Create the container SVG and g /////////////
	/////////////////////////////////////////////////////////

	//Remove whatever chart with the same id/class was present before
	d3.select(id).select("svg").remove();
	
	//Initiate the radar chart SVG
	var svg = d3.select(id).append("svg")
			.attr("width",  cfg.w + cfg.margin.left + cfg.margin.right)
			.attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom)
			.attr("class", "radar"+id);
	//Append a g element		
	var g = svg.append("g")
			.attr("transform", "translate(" + (cfg.w/2 + cfg.margin.left) + "," + (cfg.h/2 + cfg.margin.top) + ")");
	
	/////////////////////////////////////////////////////////
	////////// Glow filter for some extra pizzazz ///////////
	/////////////////////////////////////////////////////////
	
	//Filter for the outside glow
	var filter = g.append('defs').append('filter').attr('id','glow'),
		feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','2.5').attr('result','coloredBlur'),
		feMerge = filter.append('feMerge'),
		feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
		feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

	/////////////////////////////////////////////////////////
	/////////////// Draw the Circular grid //////////////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the grid & axes
	var axisGrid = g.append("g").attr("class", "axisWrapper");
	
	//Draw the background circles
	axisGrid.selectAll(".levels")
	   .data(d3.range(1,(cfg.levels+1)).reverse())		
	   .enter()
		.append("circle")
		.attr("class", "gridCircle")
		.attr("r", function(d, i){return radius/cfg.levels*d;})
		.style("fill", "#CDCDCD")
		.style("stroke", "#CDCDCD")
		.style("fill-opacity", cfg.opacityCircles)
		.style("filter" , "url(#glow)");

	//Text indicating at what % each level is
	axisGrid.selectAll(".axisLabel")
	   .data(d3.range(1,(cfg.levels+1)).reverse())
	   .enter().append("text")
	   .attr("class", "axisLabel")
	   .attr("x", 4)
	   .attr("y", function(d){return -d*radius/cfg.levels;})
	   .attr("dy", "0.4em")
	   .style("font-size", "10px")
	   .attr("fill", "#737373")
	   .text(function(d,i) { return d.value; });
	/////////////////////////////////////////////////////////
	//////////////////// Draw the axes //////////////////////
	/////////////////////////////////////////////////////////
	
	//Create the straight lines radiating outward from the center
	var axis = axisGrid.selectAll(".axis")
		.data(allAxis)
		.enter()
		.append("g")
		.attr("class", "axis");
	//Append the lines
	axis.append("line")
		.attr("x1", 0)
		.attr("y1", 0)
		.attr("x2", function(d, i){ return rScale(maxValue*1.1) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y2", function(d, i){ return rScale(maxValue*1.1) * Math.sin(angleSlice*i - Math.PI/2); })
		.attr("class", "line")
		.style("stroke", "white")
		.style("stroke-width", "2px");

	//Append the labels at each axis
	axis.append("text")
		.attr("class", "legend")
		.style("font-size", "11px")
		.attr("text-anchor", "middle")
		.attr("dy", "0.35em")
		.attr("x", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice*i - Math.PI/2); })
		.attr("y", function(d, i){ return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice*i - Math.PI/2); })
		.text(function(d){return d})
		.call(wrap, cfg.wrapWidth);

	/////////////////////////////////////////////////////////
	///////////// Draw the radar chart blobs ////////////////
	/////////////////////////////////////////////////////////
	
	//The radial line function
	var radarLine = d3.svg.line.radial()
		.interpolate("linear-closed")
		.radius(function(d) { return rScale(d.value); })
		.angle(function(d,i) {	return i*angleSlice; });
		
	if(cfg.roundStrokes) {
		radarLine.interpolate("cardinal-closed");
	}
				
	//Create a wrapper for the blobs	
	var blobWrapper = g.selectAll(".radarWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarWrapper");
			
	//Append the backgrounds	
	blobWrapper
		.append("path")
		.attr("class", "radarArea")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("fill", function(d,i) { return cfg.color(i); })
		.style("fill-opacity", cfg.opacityArea)
		.on('mouseover', function (d,i){
			//Dim all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", 0.1); 
			//Bring back the hovered over blob
			d3.select(this)
				.transition().duration(200)
				.style("fill-opacity", 0.7);	
		})
		.on('mouseout', function(){
			//Bring back all blobs
			d3.selectAll(".radarArea")
				.transition().duration(200)
				.style("fill-opacity", cfg.opacityArea);
		});
		
	//Create the outlines	
	blobWrapper.append("path")
		.attr("class", "radarStroke")
		.attr("d", function(d,i) { return radarLine(d); })
		.style("stroke-width", cfg.strokeWidth + "px")
		.style("stroke", function(d,i) { return cfg.color(i); })
		.style("fill", "none")
		.style("filter" , "url(#glow)");		
	
	// Append the circles
blobWrapper.selectAll(".radarCircle")
.data(function(d, i) { return d; })
.enter().append("circle")
.attr("class", "radarCircle")
.attr("r", cfg.dotRadius)
.attr("cx", function(d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
.attr("cy", function(d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
.style("fill", function(d, i, j) { return cfg.color(j); })
.style("fill-opacity", 0.8)
.style("pointer-events", "all")
.on("mouseover", function(d, i) {
  // Show the tooltip with the data value
  tooltip.text(d.value.toFixed(1) + "%")
	.style("opacity", 1);
})
.on("mouseout", function() {
  // Hide the tooltip
  tooltip.style("opacity", 0);
});

// Set up the tooltip
var tooltip = d3.select("body")
.append("div")
.attr("class", "tooltip")
.style("opacity", 0);

		

////////////////////////////////////
	//////// Append invisible circles for tooltip ///////////
	/////////////////////////////////////////////////////////
	
	//Wrapper for the invisible circles on top
	var blobCircleWrapper = g.selectAll(".radarCircleWrapper")
		.data(data)
		.enter().append("g")
		.attr("class", "radarCircleWrapper");
		
		//Append a set of invisible circles on top for the mouseover pop-up
		blobCircleWrapper.selectAll(".radarInvisibleCircle")
			.data(function(d,i) { return d; })
			.enter().append("circle")
			.attr("class", "radarInvisibleCircle")
			.attr("r", cfg.dotRadius*1.5)
			.attr("cx", function(d,i){ return rScale(d.value) * Math.cos(angleSlice*i - Math.PI/2); })
			.attr("cy", function(d,i){ return rScale(d.value) * Math.sin(angleSlice*i - Math.PI/2); })
			.style("fill", "none")
			.style("pointer-events", "all")
			.on("mouseover", function(d,i) {
				newX =  parseFloat(d3.select(this).attr('cx')) - 10;
				newY =  parseFloat(d3.select(this).attr('cy')) - 10;
						
				tooltip
					.attr('x', newX)
					.attr('y', newY)
					.text(Format(d.value))
					.transition().duration(200)
					.style('opacity', 1);
			})
			.on("mouseout", function(){
				tooltip.transition().duration(200)
					.style("opacity", 0);
			});
		
		//Set up the small tooltip for when you hover over a circle
		var tooltip = g.append("text")
			.attr("class", "tooltip")
			.attr("x", 10)
			.attr("y", 10)
			.attr("text-anchor", "left")
			.attr("font-family", "sans-serif")
			.attr("font-size", 10)
			.attr("pointer-events", "none")
			.style("opacity", 0);
	/////////////////////////////////////////////////////////
	/////////////////// Helper Function /////////////////////
	/////////////////////////////////////////////////////////

	//Taken from http://bl.ocks.org/mbostock/7555321
	//Wraps SVG text	
	function wrap(text, width) {
	  text.each(function() {
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
	}//wrap	
	
}//RadarChart