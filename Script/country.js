var countryName = "";
var countryData = [];
var countryLastData = [];

$( document ).ready(async () => {  
    await loadVariables();
    countryName = await GetCountryName();
    countryData = await GetCountryData(countryName);
    countryLastData = await GetCountryLastData();
    await loadCountryCounetrsTemplate(countryLastData)
    hideCountersWithNoData(countryLastData);
    loadCounterScript();
});

async function GetCountryName(){
    // Get the name of the country by reading di url
    return window.location.search.substring(1).split("&");
}

async function GetCountryLastData(){
    // Get the latest data avaible for each country
    return countryData[countryData.length - 1].split(',');
}

async function loadCountryCounetrsTemplate(data){
    // Load the counters on top
    $("#country_counters").append(
        COUNTRY_COUNTERS_TEMPLATE .replace('{{totvalue}}', data[3])
        .replace('{{totvaccinated}}',data[9] + "%")
        .replace('{{fullyVaccinated}}' , data[10] + "%")
        .replace('{{peopleVaccinated}}' , data[4])
    );

}

function hideCountersWithNoData(data){
    // Hide the counters on the top if the the data is not avaible
    if(data[3] == null || data[3] == "") {
        $("#total_doses").hide();
    }
    if(data[4] == null || data[4] == "") {
        $("#people_vaccinated").hide();
    }
    if(data[9] == null || data[9] == "") {
        $("#vaccinated_percent").hide();
    }
    if(data[10] == null || data[10] == "") {
        $("#fully_vaccinated_percent").hide();
    }
}

function loadCounterScript(){
    // Load the animation to the counter
    // actually is a copy & paste from some russian website 
    $('.counter').each(function() {
        $(this).prop('Counter', 0.0).animate({Counter: $(this).text()}, {
            duration: 2000,
            easing: 'swing',
            step: function(now) {
                $(this).text(formatNumberWithCommas(Math.ceil(now)));
            }
        });
    });
}