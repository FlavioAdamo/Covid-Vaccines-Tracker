const dataUrl = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/";
var masterDataUrl = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv";
var allData = [];
let lastDataAvaible = [];
let = secondlastData = []


async function loadVariables(){
    allData = await GetAllData();
    lastDataAvaible = await GetLastData();
    secondlastData = await getSecondLastData();
    await GetContinentsData();
}

async function GetAllData(){
    const {data} = await axios.get(masterDataUrl);
    return data.split("\n");
}

async function GetCountryData(country_name){
    return allData.filter(word => word.split(',')[0] == country_name.toString());
  }

async function GetLastData(){
    var alldata = [];
    var lastadata = [];
    const {data} = await axios.get(masterDataUrl);
    let lines = data.split('\n');
    for (let i = 1; i < lines.length; i++) {
      alldata.push(lines[i].toString().split(','));
    }
    for (let i = 0; i < alldata.length - 1; i++) {
      if(alldata[i][1] != alldata[i + 1][1])
      {
        lastadata.push(alldata[i].toString());
      }
    }
    return lastadata;
}

async function getSecondLastData(){
    var alldata = [];
    var secondlastdata = [];
    const {data} = await axios.get(masterDataUrl);
    let lines = data.split('\n');
    for (let i = 1; i < lines.length; i++) {
      alldata.push(lines[i].toString().split(','));
    }
    for (let i = 0; i < alldata.length - 1; i++) {
      if(alldata[i][1] != alldata[i + 1][1] && alldata[i][1] == alldata[i - 1][1])
      {
        secondlastdata.push(alldata[i-1].toString());
      }else if(alldata[i][1] != alldata[i + 1][1] && alldata[i][1] != alldata[i - 1][1]){
        secondlastdata.push(alldata[i].toString());
      }
    }
    return secondlastdata;
  }

async function GetContinentsData(){
    var continents = []
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "European Union"));
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "Asia"));
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "North America"));
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "Africa"));
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "South America"));
    continents.push(lastDataAvaible.filter(word => word.split(',')[0] == "United Kingdom"));
    return continents;
  }