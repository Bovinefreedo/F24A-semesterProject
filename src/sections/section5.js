export function createSection5(){
  const section5 = document.getElementById("section5Content");
  const canvas5 = document.createElement("div");
  section5.appendChild(canvas5);
  canvas5.id="canvas5";
  section5BackgroundStyle(canvas5);
  let gaugeContainer = document.createElement("div");
  gaugeContainer.id = "gaugeContainer";
  canvas5.appendChild(gaugeContainer);
  gaugeContainerStyle(gaugeContainer);
  let sliderContainer = document.createElement("div")
  sliderContainer.id = "sliderContainer";
  sliderContainer.width = "250px"
  gaugeContainer.appendChild(sliderContainer);
  let slider = document.createElement("input");
  inputSettings(slider);
  sliderContainer.appendChild(slider);
  let gaugesList = [];

  const apiUrl = 'http://localhost:4000/getEnergyUseSuperType';
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
        for(let i =1; i<data.length; i++){
          if(data[i].energysupertype==data[i-1].energysupertype){
            data[i].change = data[i].usedenergy - data[i-1].usedenergy;
          }
        }
        for(let i=2; i<data.length; i++){
          if(data[i].energysupertype==data[i-1].energysupertype){
            data[i].rateOfChange = data[i].change - data[i-1].change;
          }
        }  
        console.log(data);
        
        for(let i=0; i<3; i++){
          for(let j=0; j<2; j++){
            const gauge = new Gauge(""+j+i, gaugeContainer, 70, 7, j*200, i*200, 200);
            gaugesList.push(gauge)
          }
        }
        gaugesList[0].needle.animateOn(gaugesList[0].chart, .70);
        gaugesList[1].needle.animateOn(gaugesList[1].chart, .20);
        slider.oninput = function() {
          output.innerHTML = this.value;
        }
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

//modified from https://codepen.io/jaketrent/pen/DzWyZM
function Gauge(id, parrentDiv, needleLength, needleWidth, positionTop, positionLeft, width) {
    // options for the gauge
    let ref;
    let i;
    let barWidth = 40;
    let numSections = 3;
    let sectionPerc = 1 / numSections / 2;  
    let padRad = 0.1;
    let chartInset = 10;
    let totalPercent = .75;
    let margin = {
        top: 20,
        right: 20,
        bottom: 30,
        left: 20
    };

    //creation of the div where it lives
    let barometerDiv = document.createElement("div");
    barometerDiv.id = "gauge"+id;
    parrentDiv.appendChild(barometerDiv);
    this.el = d3.select("#gauge"+id);
    
    //mandatory settings
    width = width - margin.left - margin.right;
    let height = width;
    let radius = Math.min(width, height) / 2;
    let percToDeg = function(perc) {
        return perc * 360;
    };
    let percToRad = function(perc) {
        return degToRad(percToDeg(perc));
    };

    let degToRad = function(deg) {
        return deg * Math.PI / 180;
    };

    let svg = this.el.append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('top',""+positionTop+"px")
        .attr('left',""+positionLeft+"px")
        .attr('position', "absolute");

    this.chart = svg.append('g')
        .attr('transform', `translate(${(width + margin.left) / 2}, ${(height + margin.top) / 2})`);

    // build gauge bg
    for (let sectionIndx = i = 1, ref = numSections; (1 <= ref ? i <= ref : i >= ref); sectionIndx = 1 <= ref ? ++i : --i) {
        let arcStartRad = percToRad(totalPercent);
        let arcEndRad = arcStartRad + percToRad(sectionPerc);
        totalPercent += sectionPerc;
        let startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
        let endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
        const arc = d3.arc().outerRadius(radius - chartInset)
            .innerRadius(radius - chartInset - barWidth)
            .startAngle(arcStartRad + startPadRad)
            .endAngle(arcEndRad - endPadRad);
        this.chart.append('path')
            .attr('class', `arc chart-color${sectionIndx}`)
            .attr('d', arc);
    }

    const Needle = class Needle {
        constructor(len, radius1) {
        this.len = len;
        this.radius = radius1;
    
        this.drawOn = (el, perc) => {
            el.append('circle')
                .attr('class', 'needle-center')
                .attr('cx', 0)
                .attr('cy', 0)
                .attr('r', this.radius);
        return el.append('path')
            .attr('class', 'needle')
            .attr('d', this.mkCmd(perc));
    }

    this.animateOn = (el, perc) => {
        let self;
        self = this;
        return el.transition().duration(1000).selectAll('.needle').tween('progress', function() {
            return function(percentOfPercent) {
                let progress;
                progress = percentOfPercent * perc;
                return d3.select(this).attr('d', self.mkCmd(progress));
        };      
      });
    }

    this.mkCmd = (perc) => {
        let centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
        thetaRad = percToRad(perc / 2); // half circle
        centerX = 0;
        centerY = 0;
        topX = centerX - this.len * Math.cos(thetaRad);
        topY = centerY - this.len * Math.sin(thetaRad);
        leftX = centerX - this.radius * Math.cos(thetaRad - Math.PI / 2);
        leftY = centerY - this.radius * Math.sin(thetaRad - Math.PI / 2);
        rightX = centerX - this.radius * Math.cos(thetaRad + Math.PI / 2);
        rightY = centerY - this.radius * Math.sin(thetaRad + Math.PI / 2);
        return `M ${leftX} ${leftY} L ${topX} ${topY} L ${rightX} ${rightY}`;
    }
    }
  };

  this.needle = new Needle(needleLength, needleWidth);

  this.needle.drawOn(this.chart, 0);        
}

function gaugeContainerStyle(div){
    div.style.diplay = "stretch";
    div.style.position= "relative";
    div.style.top ="30px";
    div.style.left ="30px";
    div.style.width = "700px";
    div.style.height = "400px";
    div.style.gap = '20px';
    div.style.padding = '20px';
    div.style.backgroundColor = 'green';
    div.style.borderRadius = '10px';
    div.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
}

function section5BackgroundStyle(div){
  div.style.display = "unset";
  div.style.width = '100%';
  div.style.height = '80%';
  div.style.padding = '35px';
  div.style.boxSizing = 'border-box';
  div.style.backgroundColor = '#f0f0f0';
  div.style.background = 'rgb(26,29,50)';
}

function inputSettings(input){
  let rangeInput = input;
  rangeInput.type = 'range';
  rangeInput.min = '1964';
  rangeInput.max = '2022';
  rangeInput.value = '2022';
  rangeInput.classList.add('slider');
  rangeInput.id = 'myRange';
  rangeInput.addEventListener('mouseover', function() {
    rangeInput.style.opacity = '1';
  });
  rangeInput.addEventListener('mouseout', function() {
    rangeInput.style.opacity = '0.7';
  });
}