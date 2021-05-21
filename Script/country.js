const COUNTRY_COUNTERS_TEMPLATE = '<div class="row"> <div class="four col-md-6" style="padding-top: 15px;"> <div id="total_doses" class="counter-box green"><i class="fa fa-thumbs-o-up"></i><span class="counter">{{totvalue}}</span> <p>Vaccine administered</p> </div> </div> <div class="four col-md-6" style="padding-top: 15px;"> <div id="people_vaccinated" class="counter-box blue"><i class="fa fa-thumbs-o-up"></i><span class="counter">{{peopleVaccinated}}</span> <p>People received at least one dose</p> </div> </div> <div class="col-6 col-md-6" style="padding-top: 15px;"> <div id="vaccinated_percent" class="counter-box green-light"><i class="fa fa-thumbs-o-up"></i><span class="counter2">{{totvaccinated}}</span> <p>Of the population received<br> at least 1 dose of vaccine</p> </div> </div> <div class="col-6 col-md-6" style="padding-top: 15px;"> <div id="fully_vaccinated_percent" class="counter-box blue-light"><i class="fa fa-thumbs-o-up"></i><span class="counter1">{{fullyVaccinated}}</span> <p>Of the population is<br> fully vaccinated</p> </div> </div> </div>';
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
    //Get the name of the country by reading di url
    var query = window.location.search.substring(1).split("&");
    return query;
}

async function GetCountryLastData(){
    //Get the latest data avaible for each country
    return countryData[countryData.length - 1].split(',');
}

async function loadCountryCounetrsTemplate(data){
    //Load the counters on top
    $("#country_counters").append(
        COUNTRY_COUNTERS_TEMPLATE .replace('{{totvalue}}', data[3])
        .replace('{{totvaccinated}}',data[9] + "%")
        .replace('{{fullyVaccinated}}' , data[10] + "%")
        .replace('{{peopleVaccinated}}' , data[4])); 
}

function hideCountersWithNoData(data){
    //Hide the counters on the top if the the data is not avaible
    if(data[3] == null || data[3] == ""){
        $("#total_doses").hide();
    }
    if(data[4] == null || data[4] == ""){
        $("#people_vaccinated").hide();
    }
    if(data[9] == null || data[9] == ""){
        $("#vaccinated_percent").hide();
    }
    if(data[10] == null || data[10] == ""){
        $("#fully_vaccinated_percent").hide();
    }
}

function loadCounterScript(){
    //Load the animation to the counter
    //actually is a copy & paste from some russian website 
    $('.counter').each(function () {
      $(this).prop('Counter',0.0).animate({
        Counter: $(this).text()
        }, {
        duration: 2000,
        easing: 'swing',
        step: function (now) {
        $(this).text(formatNumberWithCommas(Math.ceil(now)));
          }
        });
      });
  }