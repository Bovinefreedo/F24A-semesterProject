const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./dataQuery");
const port = process.env.PORT || 4000;

require("dotenv").config();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true, 
    })
);

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
      })
      .catch(error => {
          console.error('Error:', error);
      });

app.get("/", (request, response) =>{
    response.json({info : "Node.js, Express, and Postgres API"});    
});

app.get("/getEnergyUseSuperType", db.getEnergyUseSuperType);
app.get("/getPopulation", db.getPopulation);
app.get("/getPopProj", db.getPopProj);
app.get("/getEnergyUseWorld", db.getEnergyUseWorld);
app.get("/getPopProj", db.getPopProj)
app.post("insertPopulationRegion",db.insertPopulationRegion);
app.post("/populatePopulation",db.populatePopulation);
app.post("/insertCountry",db.insertCountry);
app.post("/insertEnergyUseRegion", db.insertEnergyUseRegion);
app.post("/insertPopulation",db.insertPopulationCountry);
app.post("/populateCountry", db.populateCountry);
app.post("/populateEnergyType",db.populateEnergyType);
app.post("/populateCountryEnergryUse", db.populateCountryEnergryUse);
app.post("/populateRegion", db.populateRegion);
app.post("/populatePopulationRegion",db.populatePopulationRegion);
app.post("/populateRegionEnergryUse", db.populateRegionEnergryUse);


app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})