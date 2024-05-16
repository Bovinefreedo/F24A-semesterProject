/*
importing /data/death-rates-from-energy-production-per-twh.csv
Temporary table on Neon.Tech
*/
CREATE TABLE deathsPrTWH_tmp (
    entity VARCHAR,
    year VARCHAR,
    deathsPrTWH VARCHAR
    );

/*
importing /data/energy-consumption-by-source-and-country.csv
Temporary table on Neon.Tech
*/
CREATE TABLE consumptionCountry_tmp (
    entity VARCHAR,
    year VARCHAR,
    otherRenewables VARCHAR,
    biofuels VARCHAR,
    solar VARCHAR,
    wind VARCHAR,
    hydro VARCHAR,
    nuclear VARCHAR,
    gas VARCHAR,
    coal VARCHAR,
    oil VARCHAR,
    unit VARCHAR
    );

  /*
    importing /data/population-and-demography.csv
    Temporary table on Neon.Tech
  */
CREATE TABLE popGrowth_tmp (
    country VARCHAR,
    year VARCHAR,
    population VARCHAR
    );

  /*
    importing /data/UNdata_Export_20240508_074443411.csv
    Temporary table on Neon.Tech
  */

CREATE TABLE popProj_tmp (
    country VARCHAR,
    year VARCHAR,
    estimate VARCHAR,
    poulation VARCHAR
);

CREATE TABLE country (
    countryID INT PRIMARY KEY,
    countryName VARCHAR
);

CREATE TABLE populationCountry(
  countryID INT REFERENCES country(countryID),
  year INT,
  population FLOAT,
  PRIMARY KEY (countryID,year)
);

CREATE TABLE region(
  regionID SERIAL PRIMARY KEY,
  regionName VARCHAR(75)
);

CREATE TABLE energyType(
  energyTypeID INT PRIMARY KEY,
  energyName VARCHAR(75),
  energySuperType VARCHAR
);

CREATE TABLE populationRegion(
  regionID INT REFERENCES region(regionID),
  year INT,
  population FLOAT,
  PRIMARY KEY (regionID,year)
);

CREATE TABLE energyUseRegion(
  regionID INT REFERENCES country(countryID),
  energyTypeID INT REFERENCES energyType(energyTypeID),
  year INT,
  amountInTWH FLOAT,
  PRIMARY KEY (regionID,energyTypeID,year)
);

CREATE TABLE energyUseCountry(
  countryID INT REFERENCES country(countryID),
  energyTypeID INT REFERENCES energyType(energyTypeID),
  year INT,
  amountInTWH FLOAT,
  PRIMARY KEY (countryID,energyTypeID,year)
);

CREATE TABLE popProjRegion (
    regionID REFERENCES region(regionID),
    year INT,
    estimate VARCHAR,
    poulation VARCHAR
);

INSERT INTO popProjRegion (regionID, year, estimate, poulation FLOAT) VALUES($1,$2,$3$);

INSERT INTO energyType(energyTypeID, energyName, energySuperType) VALUES($1,$2,$3);

INSERT INTO country (countryName, countryID) VALUES ($1, $2);

INSERT INTO populationCountry(countryID, year, population) VALUES($1, $2, $3);

INSERT INTO energyUseCountry(countryID, energyTypeID, year, amountInTWH)VALUES($1,$2,$3,$4);

INSERT INTO region(regionName, regionID) VALUES ($1, $2);

INSERT INTO populationRegion(regionID, year, population) VALUES($1, $2, $3);

INSERT INTO energyUseRegion(regionID, energyTypeID, year, amountInTWH) VALUES ($1,$2,$3,$4);