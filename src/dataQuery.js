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

module.exports = { 
  insertDPTWH,
  insertConsumptionCountry,
  insertPopGrowth,
  insertPopProjection,
  insertPopulationCountry,
  insertCountry,
  insertEnergyType,
  insertEnergyUseCountry,
  insertRegion,
  insertPopulationRegion,
  insertEnergyUseRegion,
  populateDPTWH,
  populateConsumptionCountry,
  populatePopGrowth,
  populatePopProjection,
  populatePopulation,
  populateCountry,
  populateEnergyType,
  populateCountryEnergryUse,
  populateRegion,
  populatePopulationRegion,
  populateRegionEnergryUse
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