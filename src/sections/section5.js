export function createSection5(){
  const section5 = document.getElementById("section5Content");
  const canvas5 = document.createElement("div");
  section5.appendChild(canvas5);
  canvas5.id="canvas5";
  canvas5.className = "background";
  const gauge = document.createElement("div");
  gauge.className = "chart-gauge";
  canvas5.appendChild(gauge);
  

  const apiUrl = 'http://localhost:4000/getEnergyUseSuperType';
  fetch(apiUrl)
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
      })
      .then(data => {
        console.log(data)
        function createGauge(id, needleLength, needleWidth) {
            var needle, ref;
            let i;
            let barWidth = 40;
            let numSections = 3;
        
            // / 2 for HALF circle
            let sectionPerc = 1 / numSections / 2;  
            let padRad = 0.05;
            let chartInset = 10;
          
            // start at 270deg
            let totalPercent = .75;
          
            let el = d3.select('#chart-gauge');
          
            let margin = {
              top: 20,
              right: 20,
              bottom: 30,
              left: 20
            };
          
            let width = el[0][0].offsetWidth - margin.left - margin.right;
          
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
          
            let svg = el.append('svg').attr('width', width + margin.left + margin.right).attr('height', height + margin.top + margin.bottom);
          
            let chart = svg.append('g').attr('transform', `translate(${(width + margin.left) / 2}, ${(height + margin.top) / 2})`);
          
          // build gauge bg
            for (let sectionIndx = i = 1, ref = numSections; (1 <= ref ? i <= ref : i >= ref); sectionIndx = 1 <= ref ? ++i : --i) {
              let arcStartRad = percToRad(totalPercent);
              let arcEndRad = arcStartRad + percToRad(sectionPerc);
              totalPercent += sectionPerc;
              let startPadRad = sectionIndx === 0 ? 0 : padRad / 2;
              let endPadRad = sectionIndx === numSections ? 0 : padRad / 2;
              arc = d3.svg.arc().outerRadius(radius - chartInset).innerRadius(radius - chartInset - barWidth).startAngle(arcStartRad + startPadRad).endAngle(arcEndRad - endPadRad);
              chart.append('path').attr('class', `arc chart-color${sectionIndx}`).attr('d', arc);
            }
          
            const Needle = class Needle {
              constructor(len, radius1) {
                this.len = len;
                this.radius = radius1;
              
          
              this.drawOn = (el, perc) => {
                el.append('circle').attr('class', 'needle-center').attr('cx', 0).attr('cy', 0).attr('r', this.radius);
                return el.append('path').attr('class', 'needle').attr('d', this.mkCmd(perc));
              }
          
              this.animateOn = (el, perc) => {
                var self;
                self = this;
                return el.transition().delay(500).ease('elastic').duration(3000).selectAll('.needle').tween('progress', function() {
                  return function(percentOfPercent) {
                    var progress;
                    progress = percentOfPercent * perc;
                    return d3.select(this).attr('d', self.mkCmd(progress));
                  };
                
                
                });
              }
          
              this.mkCmd = (perc) => {
                var centerX, centerY, leftX, leftY, rightX, rightY, thetaRad, topX, topY;
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
          
            let needle = new Needle(needleLength, needleWidth);
          
            needle.drawOn(chart, 0);          
          }
          createGauge(1, 90, 10)

      })
      .catch(error => {
          console.error('Error:', error);
      });
}
 