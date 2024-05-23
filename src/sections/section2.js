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
function loadChart() {
    var options = {
        series: [{
            name: "Befolkningstal",
            data: [3031474234, 3072421801, 3126849612, 3193428894, 3260441925, 3328209022, 3398480280, 3468370526, 3540164023, 3614572835, 3690209960, 3767930001, 3843607574, 3920017410, 3995888368, 4070022249, 4143091942, 4215826364, 4289795862, 4365742277, 4442348279, 4520917350, 4602701335, 4684875627, 4766640881, 4850076923, 4936006502, 5024289346, 5113387878, 5202582534, 5293395467, 5382536929, 5470164577, 5556623321, 5642046034, 5726736488, 5811580202, 5896055962, 5979726559, 6062288850, 6144321462, 6226348086, 6308140970, 6389462496, 6470924346, 6552700448, 6635110367, 6717567584, 6801440971, 6885663352, 6969985525, 7054044372, 7141386257, 7229303088, 7317040295, 7403850164, 7490415449, 7576441961, 7660371127, 7741774583, 7820205606, 7888305693, 7950946801]
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
            categories: [1960, 1961, 1962, 1963, 1964, 1965, 1966, 1967, 1968, 1969, 1970, 1971, 1972, 1973, 1974, 1975, 1976, 1977, 1978, 1979, 1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989, 1990, 1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
            labels: {
                style: {
                    fontSize: '10px' // Set the font size for x-axis labels
                }
            }
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return (value / 1000000000).toFixed(2) + ' milliarder';
                },
                style: {
                    fontSize: '10px' // Set the font size for y-axis labels
                }
            }
        },
        tooltip: {
            x: {
                format: 'yyyy' // Corrected format
            },
            theme: 'dark' // Change this to 'light' if you want a light-colored tooltip
        }
    };

    var chart = new ApexCharts(document.querySelector("#Population"), options);
    chart.render();
}

// Create an intersection observer instance for the chart
const chartObserver = new IntersectionObserver(handleChartIntersection, {
    threshold: 0.5 // Trigger when 50% of the section is in view
});

// Observe the section containing the chart
const chartSection = document.querySelector('.two');
chartObserver.observe(chartSection);
