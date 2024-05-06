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

app.post("/inserDPTWH", db.insertDPTWH);
app.post("/populateFoods", db.populateDPTWH);

app.listen(port, () => {
    console.log('App running on port ${port}.');
})