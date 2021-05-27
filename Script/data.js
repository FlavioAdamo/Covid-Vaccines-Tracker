const DATA_URL = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/";
const MASTER_DATA_URL = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv";
var allData = [];
let lastDataAvaible = [];
let secondlastData = [];


async function loadVariables() {
    allData = await GetAllData();
    lastDataAvaible = await GetLastData();
}

async function GetAllData() {
    // You would never guess what this function does
    const { data } = await axios.get(MASTER_DATA_URL);
    // just to see the data --

    // BEN: you gotta for loop the dates (over a certain period of time) and add them to the x-axis,
    // with the y-axis corresponding values showing the vaccination count
    
    $('.test').html(String(data));
    return data.split("\n");
}

async function GetCountryData(country_name) {
    // You would never guess what this function does too
    return allData.filter(word => word.split(',')[0] == country_name.toString().replaceAll("%20", " "));
}


async function GetWorldLastData() {
    //Get the "World" last data
    var query = allData.filter(word => word.split(',')[0] == "World");
    return query[query.length - 1].split(',');
}

function GetCountriesLastData() {
    //delete "non countries" from lastDataAvaible
    return lastDataAvaible.filter(word => word.split(',')[0] != "World"
        && word.split(',')[0] != "Europe"
        && word.split(',')[0] != "Asia"
        && word.split(',')[0] != "North America"
        && word.split(',')[0] != "Africa"
        && word.split(',')[0] != "South America"
        && word.split(',')[0] != "Oceania"
        && word.split(',')[0] != "High income"
        && word.split(',')[0] != "Upper middle income"
        && word.split(',')[0] != "Lower middle income"
        && word.split(',')[0] != "Low income"
        && word.split(',')[0] != "European Union");
}


async function GetLastData() {
    // Get all the last avaible data for each country & continents
    // this could be improved a lot
    var alldata = [];
    var lastadata = [];
    const { data } = await axios.get(MASTER_DATA_URL);
    let lines = data.split('\n');
    for (let i = 1; i < lines.length; i++) {
        alldata.push(lines[i].toString().split(','));
    }
    for (let i = 0; i < alldata.length - 1; i++) {
        if (alldata[i][1] != alldata[i + 1][1]) {
            lastadata.push(alldata[i].toString());
        }
    }
    return lastadata;
}


function GetContinentsData() {
    //Get the data for each continents
    var continents = [];

    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "Europe").toString());
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "Asia").toString());
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "North America").toString());
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "Africa").toString());
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "South America").toString());
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "Oceania").toString());
    return continents;
}


async function GetCountriesByIncome() {
    //I dont know why i did this, i will probably add this in a future version
    var incomeData = [];

    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "High income"));
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "Upper middle income"));
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "Low middle income"));
    return incomeData;
}

function formatNumberWithCommas(number) {
    // Just read the name of the function
    return parseInt(number).toLocaleString();
}

function formatDifferenceWithCommas(number) {
    return '+' + parseInt(number.substring(1)).toLocaleString();
}