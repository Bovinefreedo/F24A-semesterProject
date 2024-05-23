// Function to handle chart intersection
function handleChartIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Load the chart when the section is 50% in view
            loadChart();
            // Stop observing after the chart is loaded
            observer.unobserve(entry.target);
        }
    });
}

const getPopulation = (request, response) => {
    pool.query("SELECT year, population FROM populationregion", (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
  };
  

// Function to fetch population data from the server
async function fetchPopulationData() {
    const response = await fetch('/getPopulation');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

// Function to handle chart intersection
function handleChartIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            // Load the chart when the section is 50% in view
            loadChart();
            // Stop observing after the chart is loaded
            observer.unobserve(entry.target);
        }
    });
}

// Function to load the chart
async function loadChart() {
    try {
        const populationData = await fetchPopulationData();
        
        const years = population.map(item => item.year);
        const populations = populationData.map(item => item.population);

        var options = {
            series: [{
                name: "Befolkningstal",
                data: populations
            }],
            chart: {
                width: 700,
                height: 350,
                type: 'line',
                zoom: {
                    enabled: false
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'straight',
            },
            title: {
                text: 'Befolkningstilvækst',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                },
            },
            xaxis: {
                categories: years,
                labels: {
                    style: {
                        fontSize: '10px'
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                        return (value / 1000000000).toFixed(2) + ' milliarder';
                    },
                    style: {
                        fontSize: '10px'
                    }
                }
            },
            tooltip: {
                x: {
                    format: 'yyyy'
                },
                theme: 'dark'
            }
        };

        var chart = new ApexCharts(document.querySelector("#Population"), options);
        chart.render();
    } catch (error) {
        console.error('Error loading the chart:', error);
    }
}

// Create an intersection observer instance for the chart
const chartObserver = new IntersectionObserver(handleChartIntersection, {
    threshold: 0.5 // Trigger when 50% of the section is in view
});

// Observe the section containing the chart
const chartSection = document.querySelector('.two');
chartObserver.observe(chartSection);
