const { Pool } = require("pg");
require("dotenv").config();
const csvtojson = require("csvtojson");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const insertDPTWH = (request, response) => {
    const { entity, year, deathsPrTWH } = request.body;
    pool.query(
      `INSERT INTO deathsPrTWH_temp (entity,year,deathsPrTWH) VALUES ($1, $2, $3)`,
      [entity, year, deathsPrTWH],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Food added`);
      }
    );
  }
  
  
  //route for /populateDPTWH
  const populateDPTWH = (request, response) => {
    const caldata = "./data/death-rates-from-energy-production-per-twh.csv"; 
    const options = {
        delimiter: ','
      };
    csvtojson().fromFile(caldata, options).then(source => {
        //Fetching the data from each row 
        //and inserting to the table food_tmp
        for (let i = 0; i < source.length; i++) {
          let Entity = source[i]["Entity"];
          let Code = source[i]["Code"];
          let Year = source[i]["Year"];
          let DeathsPrTWH = source[i]["DeathsPrTWH"];
          let insertStatement = `INSERT INTO deathsPrTWH_tmp (entity,year,deathsPrTWH) VALUES ($1, $2, $3)`;
          let items = [Entity, Year, DeathsPrTWH];
    
            //Inserting data of current row into database
            pool.query(insertStatement, items, (err, results, fields) => {
                if (err) {
                    console.log("Unable to insert item at row " + i+1);
                    return console.log(err);
                }
            });
        }
        response.status(201).send('all rows added');
    })
  }

  const insertConsumptionCountry = (request, response) => {
    const { Entity, Year, otherRenewables, biofuels, solar,wind, hydro, nuclear, gas, coal, oil, unit } = request.body;
    pool.query(
      `INSERT INTO consumptionCountry_tmp (Entity,Code,year,otherRenewables,biofuels,solar,wind,hydro,nuclear,gas,coal,oil) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [Entity, Year, otherRenewables, biofuels, solar,wind, hydro, nuclear, gas, coal, oil, unit],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Food added`);
      }
    );
  }
  
  
  //route for /populateDPTWH
  const populateConsumptionCountry = (request, response) => {
    const caldata = "./data/energy-consumption-by-source-and-country.csv"; 
    const options = {
        delimiter: ','
      };
    csvtojson().fromFile(caldata, options).then(source => {
        //Fetching the data from each row 
        //and inserting to the table consumptionCountry_tmp
        for (let i = 0; i < source.length; i++) {
          let Entity = source[i]["Entity"];
          let Code = source[i]["Code"];
          let Year = source[i]["Year"];
          let otherRenewables = source[i]["Other renewables (including geothermal and biomass) - TWh"];
          let biofuels = source[i]["Biofuels consumption - TWh"];
          let solar = source[i]["Solar consumption - TWh"];
          let wind = source[i]["Wind consumption - TWh"];
          let hydro = source[i]["Hydro consumption - TWh"];
          let nuclear = source[i]["Nuclear consumption - TWh"];
          let gas = source[i]["Gas consumption - TWh"];
          let coal = source[i]["Coal consumption - TWh"];
          let oil = source[i]["Oil consumption - TWh"];
          let unit = "Twh";
          let insertStatement = `INSERT INTO consumptionCountry_tmp (entity,year,otherRenewables,biofuels,solar,wind,hydro,nuclear,gas,coal,oil,unit) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
          let items = [Entity, Year, otherRenewables, biofuels, solar,wind, hydro, nuclear, gas, coal, oil, unit];
    
            //Inserting data of current row into database
            pool.query(insertStatement, items, (err, results, fields) => {
                if (err) {
                    console.log("Unable to insert item at row " + i+1);
                    return console.log(err);
                }
            });
        }
        response.status(201).send('all rows added');
    })
  }


  const insertPopGrowth = (request, response) => {
    const { Country,Year,Population } = request.body;
    pool.query(
      `INSERT INTO popGrowth_temp (Country,Year,Population) VALUES ($1, $2, $3)`,
      [Country,Year,Population],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Food added`);
      }
    );
  }
  
  
  //route for /populateDPTWH
  const populatePopGrowth = (request, response) => {
    const caldata = "./data/population-and-demography.csv"; 
    const options = {
        delimiter: ','
      };
    csvtojson().fromFile(caldata, options).then(source => {
        //Fetching the data from each row 
        //and inserting to the table food_tmp
        for (let i = 0; i < source.length; i++) {
          let country = source[i]["Country name"];
          let year = source[i]["Year"];
          let population = source[i]["Population"];
          let insertStatement = `INSERT INTO popGrowth_tmp (country,year,population) VALUES ($1, $2, $3)`;
          let items = [country, year, population];    
            //Inserting data of current row into database
            pool.query(insertStatement, items, (err, results, fields) => {
                if (err) {
                    console.log("Unable to insert item at row " + i+1);
                    return console.log(err);
                }
            });
        }
        response.status(201).send('all rows added');
    })
  }
  
  const insertPopProjection = (request, response) => {
    const { country, year, est, population } = request.body;
    pool.query(
      `INSERT INTO popProj_tmp (country,year,estimate,poulation) VALUES ($1, $2, $3, $4)`,
      [country, year, est, population],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Food added`);
      }
    );
  }

  const populatePopProjection = (request, response) => {
    const caldata = "./data/UNdata_Export_20240508_074443411.csv"; 
    const options = {
        delimiter: ','
      };
    csvtojson().fromFile(caldata, options).then(source => {
        //Fetching the data from each row 
        //and inserting to the table food_tmp
        for (let i = 0; i < source.length; i++) {
            
          if(source[i]["Variant"]=="Low"||source[i]["Variant"]=="Medium"||source[i]["Variant"]=="High")
            {let country = source[i]["Country or Area"];
            let year = source[i]["Year(s)"];
            let est = source[i]["Variant"];
            let population = source[i]["Value"];
            let insertStatement = `INSERT INTO popProj_tmp (country,year,estimate,poulation) VALUES ($1, $2, $3, $4)`;
            let items = [country, year, est, population];    
              //Inserting data of current row into database
              pool.query(insertStatement, items, (err, results, fields) => {
                if (err) {
                    console.log("Unable to insert item at row " + i+1);
                    return console.log(err);
                }
            });}
        }
        response.status(201).send('all rows added');
    })
  }

  module.exports = { 
    insertDPTWH,
    insertConsumptionCountry,
    insertPopGrowth,
    insertPopProjection,
    populateDPTWH,
    populateConsumptionCountry,
    populatePopGrowth,
    populatePopProjection
    
  };
  
  