export function createSection5(){
  const section5 = document.getElementById("section5Content");
  const canvas5 = document.createElement("div");
  section5.appendChild(canvas5);
  canvas5.id="canvas5";
  canvas5.className = "background";
  let gaugeContainer = document.createElement("div");
  gaugeContainer.id = "gaugeContainer";
  canvas5.appendChild(gaugeContainer);
  gaugeContainerStyle(gaugeContainer);

  const apiUrl = 'http://localhost:4000/getEnergyUseSuperType';
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
        console.log(data);
        gauge = new createGauge(1, gaugeContainer, 70, 7, 0, 0, 200);
        gauge.needle.animateOn(gauge.chart, .70);
      })
      .catch(error => {
          console.error('Error:', error);
      });
}

function createGauge(id, parrentDiv, needleLength, needleWidth, positionTop, positionLeft, width) {
    
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
    this.el = d3.select('.chart-gauge');
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
        .attr('height', height + margin.top + margin.bottom);

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