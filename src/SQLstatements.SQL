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

"SELECT SUM(amountInTWH) AS VALUE, year
FROM energyUseRegion
GROUP BY year;"

CREATE TABLE populateAccessElCountry(
  countryID INT REFERENCES country(countryID),
  year INT,
  numberWithoutEl DECIMAL,
  PRIMARY KEY(countryID, year)
);

CREATE TABLE energyUseCountry(
  countryID INT REFERENCES country(countryID),
  energyTypeID INT REFERENCES energyType(energyTypeID),
  year INT,
  amountInTWH FLOAT,
  PRIMARY KEY (countryID,energyTypeID,year)
);

CREATE TABLE popProjRegion (
    regionID INT REFERENCES region(regionID),
    year INT,
    estimate VARCHAR,
    poulation VARCHAR
);

SELECT SUM(amountInTWH), energyUseRegion.year, energySuperType 
  FROM energyUseRegion 
  INNER JOIN energyType 
    ON energyType.energyTypeID = energyUseRegion.energyTypeID 
  GROUP BY energySuperType, year
  ORDER BY energySuperType ASC, year ASC

  SELECT amountInTWH, year, energyName, countryName
    FROM energyUseCountry
    INNER JOIN energyType
      ON energyType.energyTypeID = energyUseCountry.energyTypeID
    INNER JOIN country
      ON country.countryID = energyUseCountry.countryID
    WHERE year = 2022 AND ( countryName ILIKE 'DENMARK' OR countryName ILIKE 'GERMANY' )

  

"SELECT SUM(amountInTWH), energyUseRegion.year, energySuperType FROM energyUseRegion INNER JOIN energyType ON energyType.energyTypeID = energyUseRegion.energyTypeID GROUP BY energySuperType, yearORDER BY year ASC"

INSERT INTO popProjRegion (regionID, year, estimate, poulation FLOAT) VALUES($1,$2,$3$);

INSERT INTO energyType(energyTypeID, energyName, energySuperType) VALUES($1,$2,$3);

INSERT INTO country (countryName, countryID) VALUES ($1, $2);

INSERT INTO populationCountry(countryID, year, population) VALUES($1, $2, $3);

INSERT INTO energyUseCountry(countryID, energyTypeID, year, amountInTWH)VALUES($1,$2,$3,$4);

INSERT INTO region(regionName, regionID) VALUES ($1, $2);

INSERT INTO populationRegion(regionID, year, population) VALUES($1, $2, $3);

INSERT INTO energyUseRegion(regionID, energyTypeID, year, amountInTWH) VALUES ($1,$2,$3,$4);