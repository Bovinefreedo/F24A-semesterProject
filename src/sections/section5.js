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
  gaugeContainerElements(gaugeContainer)
  let sliderContainer = document.createElement("div")
  sliderContainer.id = "sliderContainer";
  sliderContainer.width = "400px"
  gaugeContainer.appendChild(sliderContainer);
  let slider = document.createElement("input");
  inputSettings(slider);
  sliderContainer.appendChild(slider);
  let gaugesList = [];
  let counterList = [];
  let yearDiv = document.createElement('div');
  yearDiv.innerHTML = "2022"
  gaugeContainer.appendChild(yearDiv); 
  let infoContainer = document.createElement('div');
  infoContainerStyle(infoContainer);
  canvas5.appendChild(infoContainer);
  infoContent(infoContainer);
  



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
       
        //To make percentarge for the yearly change of speedometer, we need to know the max and min values.
        let usedEnergy = data.map(x => x.usedenergy);
        usedEnergy = usedEnergy.map(item=> item===undefined ? 0 : item)
        let usedEnergyMax = Math.max(...usedEnergy);
        let usedEnergyMin = Math.min(...usedEnergy);

        let change = data.map(x => x.change);
        change = change.map(item=> item===undefined ? 0 : item)
        let maxChange = Math.max(...change);
        let minChange = Math.min(...change);

        console.log(usedEnergyMin);
        console.log(usedEnergyMax);
        console.log(maxChange);
        console.log(minChange);

        for(let i=0; i<3; i++){
          for(let j=0; j<2; j++){
            const gauge = new Gauge(""+j+i, gaugeContainer, 70, 7, (j*30+30).toString()+"%", (i*25+25).toString()+"%", 200);
            gaugesList.push(gauge)
          }
        }

        for(let i=0; i<3; i++){
            for(let j=0; j<2; j++){
                const counter = new RollingCounter( ""+i+j,gaugeContainer, (j*30+50).toString()+"%", (i*25+34.5).toString()+"%", 0)
                counterList.push(counter);
            }
        }

        console.log((Number.parseFloat(data[2].usedenergy)));
        gaugesList[0].needle.animateOn(gaugesList[0].chart, .70);
        gaugesList[1].needle.animateOn(gaugesList[1].chart, .20);
        slider.oninput = function() {
            let value = Number(this.value)            
            yearDiv.innerHTML = value;
            let yearlyChange; 
            for(let i=0; i<data.length; i++){
            if(data[i].year == value){
                if(data[i].energysupertype === "renewable"){
                    yearlyChange = calculateYearlyChange(data[i].change);
                    gaugesList[0].needle.animateOn(gaugesList[0].chart, data[i].usedenergy/140000);
                    gaugesList[1].needle.animateOn(gaugesList[1].chart, yearlyChange)
                    counterList[0].changeNumber(data[i].usedenergy);
                    counterList[1].changeNumber(data[i].change);
                }
                if(data[i].energysupertype === "nuclear"){
                    yearlyChange = calculateYearlyChange(data[i].change);
                    gaugesList[2].needle.animateOn(gaugesList[2].chart, data[i].usedenergy/140000);
                    gaugesList[3].needle.animateOn(gaugesList[3].chart, yearlyChange)
                    counterList[2].changeNumber(data[i].usedenergy);
                    counterList[3].changeNumber(data[i].change);
                }
                if(data[i].energysupertype === "fossil"){
                    yearlyChange = calculateYearlyChange(data[i].change);
                    gaugesList[4].needle.animateOn(gaugesList[4].chart, data[i].usedenergy/140000);
                    gaugesList[5].needle.animateOn(gaugesList[5].chart, yearlyChange)
                    counterList[4].changeNumber(data[i].usedenergy);
                    counterList[5].changeNumber(data[i].change);
                }
            }
          }
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
        .style('top',positionTop)
        .style('left',positionLeft)
        .style('position', "absolute");

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

//id require #, it is made to take a div. Initial value is a number
function RollingCounter(ID, parentDiv, positionTop, positionLeft, intialValue){
    this.start = intialValue;
    let counter = document.createElement('div');
    this.counter = counter
    counter.style.fontSize = "25px"
    parentDiv.appendChild(counter);
    counter.style.left = positionLeft;
    counter.style.top = positionTop;
    counter.style.position = "absolute";
    counter.style.transform = "translate(-50%,-50%)";
    counter.id = "counter"+ID;
    counter.innerHTML = intialValue;
    this.changeNumber = (newValue) => {
        console.log("this far OK")
        d3.select(this.counter).transition()
        .tween("text", () => {
        const interpolator = d3.interpolateNumber(this.start, newValue);
        return function(t) {
            d3.select(this).text(Math.round(interpolator(t))) 
    }
    })
    .duration(1000);
  }
}

function gaugeContainerStyle(div){
    div.style.position= "absolute";
    div.style.top ="4%";
    div.style.left ="3%";
    div.style.width = "56%";
    div.style.height = "92%";
    div.style.gap = '4%';
    div.style.padding = '4%';
    div.style.backgroundColor = 'lightblue';
    div.style.borderRadius = '10px';
    div.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
}

function section5BackgroundStyle(div){
    div.style.position= "relative";
    div.style.width = '100%';
    div.style.height = '80%';
    div.style.padding = '35px';
    div.style.boxSizing = 'border-box';
    div.style.backgroundColor = '#f0f0f0';
    div.style.background = 'rgb(26,29,50)';
    div.style.display = "flex";
}

function inputSettings(input){
  let rangeInput = input;
  rangeInput.type = 'range';
  rangeInput.min = '1966';
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

function infoContainerStyle(div){
    div.style.position= "absolute";
    div.style.top ="4%";
    div.style.left ="61%";
    div.style.width = "37%";
    div.style.height = "92%";
    div.style.gap = '2%';
    div.style.padding = '20px';
    div.style.backgroundColor = 'lightblue';
    div.style.borderRadius = '10px';
    div.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
}

function infoContent(div){
    let infoContainer = div;
    let infoHeadline = document.createElement('h1');
    infoHeadline.innerHTML="Udviklingen i verdens energi forbrug";
    infoContainer.appendChild(infoHeadline);
    let infoContent = document.createElement('p');
    infoContainer.appendChild(infoContent);
    infoContent.innerHTML = "HER ER DEN GODE HISTORIE"
}
function gaugeContainerElements(div){
    let gaugeContainer = div;
    let row1Label = document.createElement('div');
    labelStyle(row1Label);
    gaugeContainer.appendChild(row1Label);
    row1Label.style.top = "37%"
    row1Label.style.left = "5%"
    row1Label.style.fontSize = "15px"
    row1Label.innerHTML = "Totalt energi forbrug"
    let row2Label = document.createElement('div');
    labelStyle(row2Label);
    gaugeContainer.appendChild(row2Label);
    row2Label.style.top = "70%"
    row2Label.style.left = "5%"
    row2Label.innerHTML = "Øgning i forbrug siden sidste år"
    row2Label.style.fontSize = "15px"
    let column1Label = document.createElement('div');
    labelStyle(column1Label);
    gaugeContainer.appendChild(column1Label);
    column1Label.style.top = "24%";
    column1Label.style.left = "28%";
    column1Label.innerHTML = "Vedvarende Energi"
    column1Label.style.fontSize = "15px"
    let column2Label = document.createElement('div');
    labelStyle(column2Label);
    gaugeContainer.appendChild(column2Label);
    column2Label.style.top = "24%";
    column2Label.style.left = "53%";
    column2Label.innerHTML = "Atomkraft"
    column2Label.style.fontSize = "15px"
    let column3Label = document.createElement('div');
    gaugeContainer.appendChild(column3Label);
    labelStyle(column3Label);
    column3Label.style.top = "24%";
    column3Label.style.left = "78%";
    column3Label.innerHTML = "Forsil energi"
    column3Label.style.fontSize = "15px"
    let yearLabel = document.createElement('div');
    labelStyle(yearLabel);
    gaugeContainer.appendChild(yearLabel);
    yearLabel.style.top = "12%";
    yearLabel.style.left = "28%";
    yearLabel.innerHTML = "Vælg år"
    yearLabel.style.fontSize = "15px"
}

function labelStyle(div){
    div.style.position = "absolute";
    div.style.width = "12%";
    div.style.height = "5%";
}

function calculateYearlyChange(data){
    if(data>4000){
        return 1;
    } else if(data<-500){
        return 0;
    } else {
        return ((data+500)/4500)
    }

}