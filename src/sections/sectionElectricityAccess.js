function loadElectricityChart() {
    var options = {
        series: [{
            name: 'With electricity access',
            data: [
                4326061660, 4473758747, 4814184845, 4844792716, 4980415784, 5082062674, 5155564934, 5219911681,
                5356668964, 5486509499, 5559968636, 5660777400, 5765921664, 5750257896, 6004382234, 6095576514,
                6205159204, 6352965447, 6512346366, 6653490191, 6789116852, 6912458804
            ]
        }, {
            name: 'Without electricity access',
            data: [
                1627944246, 1560732873, 1300147672, 1348878978, 1292337225, 1269819711, 1275986787, 1291836592,
                1236065595, 1187694198, 1197052189, 1178796833, 1155955407, 1252623019, 1081408204, 1074098683,
                1049133644, 986111206.9, 912138375.4, 855920037.1, 803358762.5, 760886587
            ]
        }],
        chart: {
            height: 350,
            type: 'area'
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'smooth'
        },
        xaxis: {
            type: 'year',
            categories: [
                1998, 1999, 2000, 2001, 2002, 2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013,
                2014, 2015, 2016, 2017, 2018, 2019,
            ]
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return (value / 1000000000).toFixed(1) + ' millioner';
                }
            }
        },
        tooltip: {
            x: {
                format: 'year'
            },
            theme: 'dark'
        },
    };

    var chart = new ApexCharts(document.querySelector("#adgang"), options);
    chart.render();
}

document.addEventListener('DOMContentLoaded', function() {
    loadElectricityChart();
});