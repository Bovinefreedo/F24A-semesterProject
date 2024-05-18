const data = {
    series: [
      {
        data: [
          { x: 'Other Renewables (inc. Geothermal and Biomass)', y: 2413 },
          { x: 'Biofuels', y: 1199 },
          { x: 'Solar', y: 3448 },
          { x: 'Wind', y: 5487.6 },
          { x: 'Hydro', y: 11299.8 },
          { x: 'Nuclear', y: 6702.3 },
          { x: 'Gas', y: 39413 },
          { x: 'Coal', y: 44854 },
          { x: 'Oil', y: 52969.6 },
        ]
      }
    ],
    legend: {
      show: false
    },
    // Farver til hvert datasæt
    colors: [
      '#0000FF',
      '#1F1FFF',
      '#4949FF',
      '#7879FF',
      '#A3A3FF',
      '#BFBFFF'
    ],
    // Størrelse på Treemap
    chart: {
      height: 600,
      type: 'treemap'
    },
    title: {
      text: 'World Energy Consumption By Country 2022',
      align: 'center'
    }
  };
  
  const chart = new ApexCharts(document.querySelector("#chart"), data);
  chart.render();
  