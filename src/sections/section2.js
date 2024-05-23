document.addEventListener('DOMContentLoaded', function () {
    // Create an intersection observer instance for the chart
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
                loadChart();
                chartObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    // Observe the section containing the chart
    const chartSection = document.querySelector('.two');
    chartObserver.observe(chartSection);
});

async function fetchPopulationData() {
    const response = await fetch('http://localhost:4000/getPopulation');
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}

async function loadChart() {
    try {
        const populationData = await fetchPopulationData();
        const years = populationData.map(item => item.year);
        const populations = populationData.map(item => item.population);

        var options = {
            series: [{
                name: "Befolkningstal",
                data: populations
            }],
            chart: {
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
                curve: 'straight'
            },
            title: {
                text: 'Befolkningstilvækst',
                align: 'left'
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
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

