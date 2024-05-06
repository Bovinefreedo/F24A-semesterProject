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
  oil VARCHAR
  )