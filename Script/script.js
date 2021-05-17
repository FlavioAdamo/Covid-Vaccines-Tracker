const ACCORDION = ' <div class="col-md-4"><div class="accordion" onclick="showCountryData({{countryName}})" ><div class="row deletepadding"><div class="col-1" style="padding-top: 2px;"><text class="position">{{position}}</text></div><div class="col deletepadding"><text class="countryname">{{country}}</text></div><div class="col" style="padding-right:0;"><text class="currentVaccineNumber"><img src="Images/syringe.png" style="height:14px;"> {{totalVaccines}}</text></div><div class="col-1 deletepadding" style="max-width: 22px;"><text class="position"></text></div></div><div class="row" style="padding-top: 5px;"><div class="col-1"><text class="position"></text></div><div class="col-7 deletepadding" style="padding-top: 4px;"><text class="popolationpercent"> <img src="Images/Population.png" style="width: 20px; padding-right: 5px;"/>{{popolationPercent}}</text></div><div class="col-3 deletepadding"><div><text class="differenceCounter">{{totalVaccinesDifferences}}</text></div></div></div></div></div>';    
const COUNTERS_TEMPLATE = '<div class="row"> <div class="four col-md-6" style="padding-top: 15px;"> <div class="counter-box green"><i class="fa fa-thumbs-o-up"></i><span class="counter">{{totvalue}}</span> <p>Vaccine administered around the world</p> </div> </div> <div class="four col-md-6" style="padding-top: 15px;"> <div class="counter-box blue"><i class="fa fa-thumbs-o-up"></i><span class="counter">{{peopleVaccinated}}</span> <p>People received at least one dose</p> </div> </div> <div class="col-6 col-md-6" style="padding-top: 15px;"> <div class="counter-box green-light"><i class="fa fa-thumbs-o-up"></i><span class="counter2">{{totvaccinated}}</span> <p>Of the population received<br> at least 1 dose of vaccine</p> </div> </div> <div class="col-6 col-md-6" style="padding-top: 15px;"> <div class="counter-box blue-light"><i class="fa fa-thumbs-o-up"></i><span class="counter1">{{fullyVaccinated}}</span> <p>Of the population is<br> fully vaccinated</p> </div> </div> </div>';

$( document ).ready(async () => {  
    await loadVariables();
    $('#loadingmodal').css('display', 'none');
    loadCounetrsTemplate(await GetWorldLastData());
    loadCounterScript();
    loadCollapse(0);
    loadContinents(0);
});

function loadCollapse(sortType){
  switch (sortType) {
    case 0:
      var temp = sortListByVaccination(GetCountriesLastData());
      break;
    case 1:
      var temp = sortListByFullyVaccination(GetCountriesLastData());
       break;
  }

    for (let index = 1; index < temp.length-1; index++) {
      var splittedData = temp[index].toString().split(',');
      var totdifferenceTemp = "+" + splittedData[6];
      var vaccinatedPercentage = "";
      if (splittedData[6] === "") {
        var totdifferenceTemp = "+0";
      }

      if(splittedData[10] != ""){
        vaccinatedPercentage = splittedData[10] + "% fully vaccinated";
      }
      else if (splittedData[9] != "" && splittedData[9] != "0"){
        vaccinatedPercentage = splittedData[9] + "% received at least 1 dose";
      }
      else if (splittedData[8] != "" && splittedData[8] != "0"){
        vaccinatedPercentage = splittedData[8] + "% received at least 1 dose";
      }
      else{
        vaccinatedPercentage = "Data not available";
      }
        
      var data = {
        name : " " + splittedData[0].toString(),
        totalVaccine : splittedData[3].toString(),
        type : splittedData[2].toString(),
        lastDate : splittedData[2].toString(),
        position : index,
        vaccinatedPercent: vaccinatedPercentage,
        totalVaccineDifferences : totdifferenceTemp
        }
      var html = ACCORDION.replaceAll('{{totalVaccines}}', formatNumberWithCommas(data.totalVaccine)).replace('{{country}}', data.name).replace('{{vaccineType}}',data.type).replace('{{lastUpdate}}', data.lastDate).replace('{{position}}', data.position).replace('{{popolationPercent}}', data.vaccinatedPercent).replace('{{totalVaccinesDifferences}}',data.totalVaccineDifferences).replace("{{countryName}}", "'" + data.name + "'");
      $("#collapseCountries").append(html);     
    }
    $('#license').css('display', 'inline');
    $('#filterDiv').css('display', 'inline');
}

function loadContinents(sortType){
  switch (sortType) {
    case 0:
      var temp = sortListByVaccination(GetContinentsData());
      break;
    case 1:
      var temp = sortListByFullyVaccination(GetContinentsData());
       break;
  }
    for (let index = 0; index < temp.length; index++) {
      var splittedData = temp[index].toString().split(',');
      var totdifferenceTemp = "+" + splittedData[6];
      var vaccinatedPercentage = "";
      if (splittedData[6] === "") {
        var totdifferenceTemp = "+0";
      }

      if(splittedData[10] != ""){
        vaccinatedPercentage = splittedData[10] + "% fully vaccinated";
      }
      else if (splittedData[9] != "" && splittedData[9] != "0"){
        vaccinatedPercentage = splittedData[9] + "% received at least 1 dose";
      }
      else if (splittedData[8] != "" && splittedData[8] != "0"){
        vaccinatedPercentage = splittedData[8] + "% received at least 1 dose";
      }
      else{
        vaccinatedPercentage = "Data not available";
      }
        
      var data = {
        name : " " + splittedData[0].toString(),
        totalVaccine : splittedData[3].toString(),
        type : splittedData[2].toString(),
        lastDate : splittedData[2].toString(),
        position : index + 1,
        vaccinatedPercent: vaccinatedPercentage,
        totalVaccineDifferences : totdifferenceTemp
        }
      var html = ACCORDION.replaceAll('{{totalVaccines}}', formatNumberWithCommas(data.totalVaccine)).replace('{{country}}', data.name).replace('{{vaccineType}}',data.type).replace('{{lastUpdate}}', data.lastDate).replace('{{position}}', data.position).replace('{{popolationPercent}}', data.vaccinatedPercent).replace('{{totalVaccinesDifferences}}',data.totalVaccineDifferences).replace("{{countryName}}", "'" + data.name + "'");
      $("#collapseContinents").append(html);     
    }
    $('#license').css('display', 'inline');
    $('#filterDiv').hide();
}

function loadCounetrsTemplate(data){
  $("#counters").append(COUNTERS_TEMPLATE.replace('{{totvalue}}', data[3]).replace('{{totvaccinated}}',data[9] + "%").replace('{{fullyVaccinated}}' , data[10] + "%").replace('{{peopleVaccinated}}' , data[4])); 
}

function loadCounterScript(){
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

function sortListByFullyVaccination(data){
  var result = [];
  var temp = [];
  for (let index = 0; index < data.length; index++) {
    temp.push(data[index].split(','));  
  }
  result = temp.sort(function(a,b) {
    return a[10]-b[10]
  });
  return result.reverse();
}

function sortListByVaccination(data){
  var result = [];
  var temp = [];
  for (let index = 0; index < data.length; index++) {
    temp.push(data[index].split(','));  
  }
  result = temp.sort(function(a,b) {
    return a[3]-b[3]
  });
  return result.reverse();
}

function UpdateListFilter(selectedItem){
  switch (selectedItem) {
    case 0:
      $("#collapse").empty();
      loadCollapse(0);
      $("#dropdownMenuButton").html('<img src="../Images/syringe.png" style="width: 25px; padding-right:10px;">Doses Administered');
      break;
    case 1:
      $("#collapse").empty();
      loadCollapse(1);
      $("#dropdownMenuButton").html('<img src="../Images/Population.png" style="width: 25px; padding-right:10px;">% fully vaccinated');
      break;
  }
}

function showCountryData(countryname){
  window.location.href ="View/country.html" + "?" + countryname.replace(" ", "");
}

