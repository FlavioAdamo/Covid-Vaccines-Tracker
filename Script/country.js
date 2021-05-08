var countryName = "";
var countryData = [];

$( document ).ready(async () => {  
    await loadVariables();
    countryName = GetCountryName();
    countryData = await GetCountryData(countryName);
    console.log(countryData)
});

function GetCountryName(){
    var query = window.location.search.substring(1).split("&");
    return query;
}


