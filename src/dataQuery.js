//When you make a new insert or populate (multiple inserts) statement, we make them as a const that contains an annonymous function.
//Then it must be added to the export statement so it can be seen by other scripts namely server.js
//You will also need to make a app.post to make it listen for the .
//In this file there are 3 lists energyTypeList, regionList og contriesPopulation. 
//These have an order that doubles for the ID of the list in question, 
//thus you will see us checking against our list to determin the ID.
//This is done to put everything directly into the final tables.

const { Pool } = require("pg");
require("dotenv").config();
const csvtojson = require("csvtojson");
const { request } = require("express");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});


const insertCountry = (request, response) => {
    const { countryName, countryID } = request.body;
    pool.query(
      `INSERT INTO country (countryName, countryID) VALUES ($1, $2)`,
      [countryName, countryID],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`pop added`);
      }
    );
}

const insertRegion = (request, response) => {
    const { regionName, regionID } = request.body;
    pool.query(
      `INSERT INTO region(regionName, regionID) VALUES ($1, $2);`,
      [regionName, regionID],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`pop added`);
      }
    );
}
  
const insertPopulationCountry = (request, response) => {
    const { countryID, year, population } = request.body;
    pool.query(
      `INSERT INTO populationCountry(countryID, year, population) VALUES($1, $2, $3);`,
      [countryID, year, population],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`pop added`);
      }
    );
}

const insertPopulationRegion = (request, response) => {
    const { regionID, year, population } = request.body;
    pool.query(
      `INSERT INTO region(regionName, regionID) VALUES ($1, $2);`,
      [regionID, year, population],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`pop added`);
      }
    );
}

const insertEnergyType = (request, response) => {
    const { energyTypeID, energyName, energySuperType } = request.body;
    pool.query(
      `INSERT INTO energyType(energyTypeID, energyName, energySuperType) VALUES($1,$2,$3);`,
      [energyTypeID, energyName, energySuperType],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`pop added`);
      }
    );
}

const insertEnergyUseCountry = (request, response) => {
  const { countryID, energyTypeID, year, amountInTWH } = request.body;
  pool.query(
    `INSERT INTO energyUseCountry(countryID, energyTypeID, year, amountInTWH)($1,$2,$3,$4);`,
    [countryID, energyTypeID, year, amountInTWH],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Food added`);
    }
  );
}

const insertEnergyUseRegion = (request, response) => {
  const { regionID, energyTypeID, year, amountInTWH } = request.body;
  pool.query(
    `INSERT INTO energyUseRegion(regionID, energyTypeID, year, amountInTWH) VALUES ($1,$2,$3,$4);`,
    [regionID, energyTypeID, year, amountInTWH],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Food added`);
    }
  );
}

// Here the contries are insertet, the ID is the position on the list in the bottom countriesPopulation,
// That list taken from population-and-demography.csv, where Frank took out everything not a country.
const populateCountry = (request, response) => {
    for(let i=0; i<countriesPopulation.length; i++){
      let country = countriesPopulation[i];
      let countryStatement = `INSERT INTO country (countryName, countryID) VALUES ($1, $2);`;
      let countryItems = [country, i];    
          //Inserting data of current row into database
      pool.query(countryStatement, countryItems, (err, results, fields) => {
          if (err) {
            console.log("Unable to insert item at row " + i+1);
            return console.log(err);
          }
      })
    }
};

// So far only world, but you can add to it by adding a region in capital letters in the regionList.
// It is important that you add to the bottom of the list or that you removes all data and run all populates to all region tables.
// The other regions can be seen in deleted.txt, where they are written with respect to which file they were removed from.
const populateRegion = (request, response) => {
  for(let i=0; i<regionList.length; i++){
    let region = regionList[i];
    let insertRegion = `INSERT INTO region(regionName, regionID) VALUES ($1, $2);`;
    let regionItems = [region, i];    
        //Inserting data of current row into database
    pool.query(insertRegion, regionItems, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert item at row " + i+1);
          return console.log(err);
        }
    })
  }
  response.status(201).send('all rows added');
};

//Energry types are the columns from the list energyTypeList, here we get the ID by the position on the list.
//the super type is added so it is easier to aggregate rennewable and fossil fuels.
const populateEnergyType = (request, response) => {
  for(let i=0; i<energyTypeList.length; i++){
    let energyType = energyTypeList[i][0];
    let energySuperType = energyTypeList[i][1];
    let insertEnergyType = `INSERT INTO energyType(energyTypeID, energyName, energySuperType) VALUES($1,$2,$3);`;
    let energyItems = [i, energyType, energySuperType];    
        //Inserting data of current row into database
    pool.query(insertEnergyType, energyItems, (err, results, fields) => {
        if (err) {
          console.log("Unable to insert item at row " + i+1);
          return console.log(err);
        }
    })
  }
};

//This populates the populations of contries, the ID is the list countriesPopulation.
const populatePopulation = (request, response) => {
    const popdata = "./data/population-and-demography.csv"; 
    const options = {
        delimiter: ','
      };
    csvtojson().fromFile(popdata, options).then(source => {
        for (let i = 0; i < source.length; i++) {
          let country = source[i]["Country name"].toUpperCase();
          let year = source[i]["Year"];
          let population = source[i]["Population"];
          for(let n=0; n<countriesPopulation.length; n++){
            if(country==countriesPopulation[n]){
              let insertCountryPop = `INSERT INTO populationCountry(countryID, year, population) VALUES($1, $2, $3)`;
              let countryPop = [n, year, population];    
              //Inserting data of current row into database
              pool.query(insertCountryPop, countryPop, (err, results, fields) => {
                if (err) {
                    console.log("Unable to insert item at row " + i+1);
                    return console.log(err);
                  }
              });
            }
          }
        }
        response.status(201).send('all rows added');
    })
}

//this populates the population of the chosen regions, we again refer to the regionList  for the ID (position on)
const populatePopulationRegion = (request, response) => {
  const popdata = "./data/population-and-demography.csv"; 
  const options = {
      delimiter: ','
    };
  csvtojson().fromFile(popdata, options).then(source => {
      for (let i = 0; i < source.length; i++) {
        let region = source[i]["Country name"].toUpperCase();
        let year = source[i]["Year"];
        let population = source[i]["Population"];
        for(let n=0; n<regionList.length; n++){
          if(region==regionList[n]){
            let insertRegionPop = `INSERT INTO populationRegion(regionID, year, population) VALUES($1, $2, $3);`;
            let regionPop = [n, year, population];    
            //Inserting data of current row into database
            pool.query(insertRegionPop, regionPop, (err, results, fields) => {
              if (err) {
                  console.log("Unable to insert item at row " + i+1);
                  return console.log(err);
                }
            });
          }
        }
      }
      response.status(201).send('all rows added');
  })
}

//populates the contries energyUse.
const populateCountryEnergryUse = (request, response) => {
  const caldata = "./data/energy-consumption-by-source-and-country.csv"; 
  const options = {
      delimiter: ','
    };
  csvtojson().fromFile(caldata, options).then(source => {
      //Fetching the data from each row 
      //and inserting to the table consumptionCountry_tmp
      for (let i = 0; i < source.length; i++) {
        let Entity = source[i]["Entity"].toUpperCase();
        let Code = source[i]["Code"];
        let Year = source[i]["Year"];
        let listOfTypeAmount =[];
        listOfTypeAmount.push(source[i]["Other renewables (including geothermal and biomass) - TWh"]);
        listOfTypeAmount.push(source[i]["Biofuels consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Solar consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Wind consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Hydro consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Nuclear consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Gas consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Coal consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Oil consumption - TWh"]);
        for(let m=0; m<countriesPopulation.length;m++){
          if(Entity==countriesPopulation[m]){
          for(let n=0; n<listOfTypeAmount.length;n++){
              let insertStatement = `INSERT INTO energyUseCountry(countryID, energyTypeID, year, amountInTWH) VALUES ($1,$2,$3,$4)`;
              if(listOfTypeAmount[n]===""){listOfTypeAmount=0;}
              let items = [m , n ,Year, listOfTypeAmount[n]];
              pool.query(insertStatement, items, (err, results, fields) => {
                if (err) {
                  console.log("Unable to insert item at row " + i+1);
                  return console.log(err);
              }
          });
        }
        }
      }
      }
      response.status(201).send('all rows added');
  })
}

//populateing the region energyuse.
const populateRegionEnergryUse = (request, response) => {
  const caldata = "./data/energy-consumption-by-source-and-country.csv"; 
  const options = {
      delimiter: ','
    };
  csvtojson().fromFile(caldata, options).then(source => {
      //Fetching the data from each row 
      //and inserting to the table consumptionCountry_tmp
      for (let i = 0; i < source.length; i++) {
        let Entity = source[i]["Entity"].toUpperCase();
        let Code = source[i]["Code"];
        let Year = source[i]["Year"];
        let listOfTypeAmount =[];
        listOfTypeAmount.push(source[i]["Other renewables (including geothermal and biomass) - TWh"]);
        listOfTypeAmount.push(source[i]["Biofuels consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Solar consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Wind consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Hydro consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Nuclear consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Gas consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Coal consumption - TWh"]);
        listOfTypeAmount.push(source[i]["Oil consumption - TWh"]);
        for(let m=0; m<regionList.length;m++){
          if(Entity==regionList[m]){
          for(let n=0; n<listOfTypeAmount.length;n++){
              let insertStatement = `INSERT INTO energyUseRegion(regionID, energyTypeID, year, amountInTWH) VALUES ($1,$2,$3,$4);`;
              if(listOfTypeAmount[n]===""){listOfTypeAmount=0;}
              let items = [m , n ,Year, listOfTypeAmount[n]];
              pool.query(insertStatement, items, (err, results, fields) => {
                if (err) {
                  console.log("Unable to insert item at row " + i+1);
                  return console.log(err);
              }
          });
        }
        }
      }
      }
      response.status(201).send('all rows added');
  })
}

//This has not been made available for contries yet
const insertPopProjectionRegion = (request, response) => {
  const { regionID, year, est, population } = request.body;
  pool.query(
    `INSERT INTO popProjRegion (regionID, year, estimate, population) VALUES($1,$2,$3,$4);`,
    [regionID, year, est, population],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`region projection added`);
    }
  );
}
//Similar to population region world, but with estimates for population
//Data only covers world, but more can be found at the un databank
const populatePopProjectionRegion = (request, response) => {
  const popdata = "./data/UNdata_Export_20240510_084501992.csv"; 
  const options = {
      delimiter: ','
    };
  csvtojson().fromFile(popdata, options).then(source => {
      for (let i = 0; i < source.length; i++) {
        let region = source[i]["Country or Area"].toUpperCase();
        let year = source[i]["Year(s)"];
        let estimate = source[i]["Variant"];
        let population = source[i]["Value"];
        for(let n=0; n<regionList.length; n++){
          if(region==regionList[n]){
            let insertRegionPop = `INSERT INTO popProjRegion (regionID, year, estimate, population) VALUES($1, $2 ,$3 ,$4);`;
            let regionPop = [n, year, estimate, population];    
            pool.query(insertRegionPop, regionPop, (err, results, fields) => {
              if (err) {
                  console.log("Unable to insert item at row " + i+1);
                  return console.log(err);
                }
            });
          }
        }
      }
      response.status(201).send('all rows added');
  })
}

//
const getPopProj = (request, response) => {
  pool.query("SELECT * FROM popProjRegion", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const getPopulation = (request, response) => {
  pool.query("SELECT * FROM populationregion", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getEnergyUseSuperType = (request, response) => {
  pool.query("SELECT SUM(amountInTWH) AS usedEnergy, energyUseRegion.year, energySuperType FROM energyUseRegion INNER JOIN energyType ON energyType.energyTypeID = energyUseRegion.energyTypeID GROUP BY energySuperType, year ORDER BY energySuperType ASC, year ASC" , (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getEnergyUseWorld = (request, response) => {
  pool.query("SELECT SUM(amountInTWH) AS value, year AS date FROM energyUseRegion GROUP BY year ORDER BY year ASC;", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getYearEnergyUseRegion = (request, response) => {
  pool.query("SELECT DISTINCT year FROM energyUseRegion ORDER BY year ASC", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getEnergyMixCountry = (request, response) => {
  pool.query("SELECT amountInTWH AS value, year, energyName AS axsis, countryName FROM energyUseCountry INNER JOIN energyType ON energyType.energyTypeID = energyUseCountry.energyTypeID INNER JOIN country ON country.countryID = energyUseCountry.countryID WHERE year = 2022 AND ( countryName ILIKE 'DENMARK' OR countryName ILIKE 'GERMANY' )", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  getEnergyMixCountry,
  getYearEnergyUseRegion,
  getEnergyUseSuperType,
  getPopulation, 
  getEnergyUseWorld,
  getPopProj,
  insertPopulationCountry,
  insertCountry,
  insertEnergyType,
  insertEnergyUseCountry,
  insertRegion,
  insertPopulationRegion,
  insertEnergyUseRegion,
  insertPopProjectionRegion,
  populatePopulation,
  populateCountry,
  populateEnergyType,
  populateCountryEnergryUse,
  populateRegion,
  populatePopulationRegion,
  populateRegionEnergryUse,
  populatePopProjectionRegion
};


const energyTypeList =[
  ["otherRenewables", "renewable"],
  ["Biofuels", "renewable"],
  ["Solar", "renewable"], 
  ["Wind", "renewable"],
  ["Hydro", "renewable"],
  ["Nuclear", "nuclear"], 
  ["Gas", "fossil"],
  ["Coal", "fossil"],
  ["Oil", "fossil"]
]

const regionList = [
  "WORLD"
];

const countriesPopulation = [
    "AFGHANISTAN",
    "ALBANIA",
    "ALGERIA",
    "AMERICAN SAMOA",
    "ANDORRA",
    "ANGOLA",
    "ANGUILLA",
    "ANTIGUA AND BARBUDA",
    "ARGENTINA",
    "ARMENIA",
    "ARUBA",
    "AUSTRALIA",
    "AUSTRIA",
    "AZERBAIJAN",
    "BAHAMAS",
    "BAHRAIN",
    "BANGLADESH",
    "BARBADOS",
    "BELARUS",
    "BELGIUM",
    "BELIZE",
    "BENIN",
    "BERMUDA",
    "BHUTAN",
    "BOLIVIA",
    "BONAIRE SINT EUSTATIUS AND SABA",
    "BOSNIA AND HERZEGOVINA",
    "BOTSWANA",
    "BRAZIL",
    "BRITISH VIRGIN ISLANDS",
    "BRUNEI",
    "BULGARIA",
    "BURKINA FASO",
    "BURUNDI",
    "CAMBODIA",
    "CAMEROON",
    "CANADA",
    "CAPE VERDE",
    "CAYMAN ISLANDS",
    "CENTRAL AFRICAN REPUBLIC",
    "CHAD",
    "CHILE",
    "CHINA",
    "COLOMBIA",
    "COMOROS",
    "CONGO",
    "COOK ISLANDS",
    "COSTA RICA",
    "COTE D'IVOIRE",
    "CROATIA",
    "CUBA",
    "CURACAO",
    "CYPRUS",
    "CZECHIA",
    "DEMOCRATIC REPUBLIC OF CONGO",
    "DENMARK",
    "DJIBOUTI",
    "DOMINICA",
    "DOMINICAN REPUBLIC",
    "EAST TIMOR",
    "ECUADOR",
    "EGYPT",
    "EL SALVADOR",
    "EQUATORIAL GUINEA",
    "ERITREA",
    "ESTONIA",
    "ESWATINI",
    "ETHIOPIA",
    "FALKLAND ISLANDS",
    "FAROE ISLANDS",
    "FIJI",
    "FINLAND",
    "FRANCE",
    "FRENCH GUIANA",
    "FRENCH POLYNESIA",
    "GABON",
    "GAMBIA",
    "GEORGIA",
    "GERMANY",
    "GHANA",
    "GIBRALTAR",
    "GREECE",
    "GREENLAND",
    "GRENADA",
    "GUADELOUPE",
    "GUAM",
    "GUATEMALA",
    "GUERNSEY",
    "GUINEA",
    "GUINEA-BISSAU",
    "GUYANA",
    "HAITI",
    "HONDURAS",
    "HONG KONG",
    "HUNGARY",
    "ICELAND",
    "INDIA",
    "INDONESIA",
    "IRAN",
    "IRAQ",
    "IRELAND",
    "ISLE OF MAN",
    "ISRAEL",
    "ITALY",
    "JAMAICA",
    "JAPAN",
    "JERSEY",
    "JORDAN",
    "KAZAKHSTAN",
    "KENYA",
    "KIRIBATI",
    "KOSOVO",
    "KUWAIT",
    "KYRGYZSTAN",
    "LAOS",
    "LATVIA",
    "LEBANON",
    "LESOTHO",
    "LIBERIA",
    "LIBYA",
    "LIECHTENSTEIN",
    "LITHUANIA",
    "LUXEMBOURG",
    "MACAO",
    "MADAGASCAR",
    "MALAWI",
    "MALAYSIA",
    "MALDIVES",
    "MALI",
    "MALTA",
    "MARSHALL ISLANDS",
    "MARTINIQUE",
    "MAURITANIA",
    "MAURITIUS",
    "MAYOTTE",
    "MEXICO",
    "MICRONESIA (COUNTRY)",
    "MOLDOVA",
    "MONACO",
    "MONGOLIA",
    "MONTENEGRO",
    "MONTSERRAT",
    "MOROCCO",
    "MOZAMBIQUE",
    "MYANMAR",
    "NAMIBIA",
    "NAURU",
    "NEPAL",
    "NETHERLANDS",
    "NEW CALEDONIA",
    "NEW ZEALAND",
    "NICARAGUA",
    "NIGER",
    "NIGERIA",
    "NIUE",
    "NORTH KOREA",
    "NORTH MACEDONIA",
    "NORTHERN MARIANA ISLANDS",
    "NORWAY",
    "OMAN",
    "PAKISTAN",
    "PALAU",
    "PALESTINE",
    "PANAMA",
    "PAPUA NEW GUINEA",
    "PARAGUAY",
    "PERU",
    "PHILIPPINES",
    "POLAND",
    "PORTUGAL",
    "PUERTO RICO",
    "QATAR",
    "REUNION",
    "ROMANIA",
    "RUSSIA",
    "RWANDA",
    "SAINT BARTHELEMY",
    "SAINT HELENA",
    "SAINT KITTS AND NEVIS",
    "SAINT LUCIA",
    "SAINT MARTIN (FRENCH PART)",
    "SAINT PIERRE AND MIQUELON",
    "SAINT VINCENT AND THE GRENADINES",
    "SAMOA",
    "SAN MARINO",
    "SAO TOME AND PRINCIPE",
    "SAUDI ARABIA",
    "SENEGAL",
    "SERBIA",
    "SEYCHELLES",
    "SIERRA LEONE",
    "SINGAPORE",
    "SINT MAARTEN (DUTCH PART)",
    "SLOVAKIA",
    "SLOVENIA",
    "SOLOMON ISLANDS",
    "SOMALIA",
    "SOUTH AFRICA",
    "SOUTH KOREA",
    "SOUTH SUDAN",
    "SPAIN",
    "SRI LANKA",
    "SUDAN",
    "SURINAME",
    "SWEDEN",
    "SWITZERLAND",
    "SYRIA",
    "TAIWAN",
    "TAJIKISTAN",
    "TANZANIA",
    "THAILAND",
    "TOGO",
    "TOKELAU",
    "TONGA",
    "TRINIDAD AND TOBAGO",
    "TUNISIA",
    "TURKEY",
    "TURKMENISTAN",
    "TURKS AND CAICOS ISLANDS",
    "TUVALU",
    "UGANDA",
    "UKRAINE",
    "UNITED ARAB EMIRATES",
    "UNITED KINGDOM",
    "UNITED STATES",
    "UNITED STATES VIRGIN ISLANDS",
    "URUGUAY",
    "UZBEKISTAN",
    "VANUATU",
    "VENEZUELA",
    "VIETNAM",
    "WALLIS AND FUTUNA",
    "WESTERN SAHARA",
    "YEMEN",
    "ZAMBIA",
    "ZIMBABWE"
];  