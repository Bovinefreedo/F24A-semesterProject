function parseCsvToCandlestick(csvData) {
    const rows = csvData.trim().split('\n');
    const data = rows.slice(1).map(row => {
        const [country, year, population] = row.split(',');
        return {
            x: new Date(year),
            y: [parseInt(population), parseInt(population), parseInt(population), parseInt(population)]
        };
    });
    return [{ data }];
}

// Function to handle file input change event
function handleFileInputChange(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (e) {
        const csvData = e.target.result;
        const options = {
            series: parseCsvToCandlestick(csvData),
            chart: {
                type: 'candlestick',
                height: 350
            },
            title: {
                text: 'Population Candlestick Chart',
                align: 'left'
            },
            xaxis: {
                type: 'datetime'
            },
            yaxis: {
                tooltip: {
                    enabled: true
                }
            }
        };
        const chart = new ApexCharts(document.querySelector("#befolkning"), options);
        chart.render();
    };
    reader.readAsText(file);
}

// Add event listener for file input change event
document.getElementById('fileInput').addEventListener('change', handleFileInputChange);