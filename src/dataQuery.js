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
    const caldata = "/data/death-rates-from-energy-production-per-twh.csv"; 
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
          let insertStatement = `INSERT INTO deathsPrTWH_temp (entity,year,deathsPrTWH) VALUES ($1, $2, $3)`;
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

  module.exports = { 
    insertDPTWH,
    populateDPTWH,
  };
  
  