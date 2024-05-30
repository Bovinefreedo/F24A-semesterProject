let countries = ["DENMARK","ICELAND","CHINA", "INDIA", "UNITED STATES"];
let sortedData = [];

fetch('http://localhost:4000/getPopContryForComperison')
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(table => {
    let data = [];
    data.push(table);
    return data;
}).then(async (data) =>{
    return fetch('http://localhost:4000/getEnergyMixCountryForComperison')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(table => {
    data.push(table);
    return data;
    })
}
).then(async (data) =>{
    return fetch('http://localhost:4000/getPopProj')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(table => {
        data.push(table);
        return data;
        })
    })  
    .then(async (data) => {
    return fetch('http://localhost:4000/getEnergyMixWorld')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(table => {
        data.push(table);
        return data;
        })
    })
    .then((data)=>{
        console.log(data);
    for( let i=0; i<countries.length; i++){
        let totalEngeryConsumption = 0;
        let country = {entity : countries[i]}
        for(let j=0; j<data[0].length; j++){  
            if(data[0][j].countryname == countries[i]){
                country.population = data[0][j].population;
            }
        }
        for(let j=0; j<data[1].length; j++){
            if(data[1][j].countryname == countries[i]){
                let energyname = data[1][j].energyname
                country[energyname] = data[1][j].amountintwh;
                totalEngeryConsumption += data[1][j].amountintwh;
            }
        }
        if(countries[i]=="ICELAND"){
            country.Gas = 0;
            country.Coal = 0;
            country.Oil = 0;
        }
        country.totalEngeryConsumption = totalEngeryConsumption;
        sortedData.push(country);        
    }
    let totalEngeryConsumption = 0;
    let world = {entity : "WORLD"}
    for(let i=0; i<data[3].length;i++){
        let energyname = data[3][i].energyname
        world[energyname] = data[3][i].amountintwh;
        totalEngeryConsumption += data[3][i].amountintwh;
    }
    for(let j=0; j<data[2]; j++){
        if(data[2][j].year=2022 && data[2][j].estimate == "Medium"){
            world.population = data[2][j].population;
        }
    }
    world.totalEngeryConsumption = totalEngeryConsumption;
    sortedData.push(world);
    console.log(sortedData);
}
).catch(error => {
    console.error('Error:', error);
});