/*
const yearsFromApi = "http://localhost:4000/getYearEnergyUseRegion";

//Keys are where we put the years
const data = { keys : [], group :{ 
        "vedvarnde" : {"sol" : [], "vind" : [], "vand" : [], "biofuel" :[] , "andreVedvarende": []},
        "atom" :{"atom":[]},
        "forsil" : {"kul" :[], "olie":[], "gas":[]}}}

fetch(yearsFromApi)
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(yearData => {
  console.log(yearData)
})
.catch(error => {
    console.error('Error:', error);
});
*/