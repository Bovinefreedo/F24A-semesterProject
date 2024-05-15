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

app.get("/", (request, response) =>{
    response.json({info : "Node.js, Express, and Postgres API"});    
});

app.post("/insertPopGrowth", db.insertPopGrowth);
app.post("/inserDPTWH", db.insertDPTWH);
app.post("insertPopulationRegion",db.insertPopulationRegion);
app.post("/insertConsumptionCountry", db.insertConsumptionCountry);
app.post("/populateDPTWH", db.populateDPTWH);
app.post("/populateConsumptionCountry", db.populateConsumptionCountry);
app.post("/populatePopGrowth",db.populatePopGrowth);
app.post("/populatePopProjection", db.populatePopProjection);
app.post("/insertPopProjection", db.insertPopProjection);
app.post("/populatePopulation",db.populatePopulation);
app.post("/insertCountry",db.insertCountry);
app.post("/insertEnergyUseRegion", db.insertEnergyUseRegion);
app.post("/insertPopulation",db.insertPopulationCountry);
app.post("/populateCountry", db.populateCountry);
app.post("/populateEnergyType",db.populateEnergyType);
app.post("/populateCountryEnergryUse", db.populateCountryEnergryUse);
app.post("/populateRegion", db.populateRegion);
app.post("/populatePopulationRegion",db.populatePopulationRegion);
app.post("/populateRegionEnergryUse", db.populateRegionEnergryUse)

app.listen(port, () => {
    console.log(`App running on port ${port}.`);
})