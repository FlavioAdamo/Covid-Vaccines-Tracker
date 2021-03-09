const dataUrl = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/country_data/";
const masterDataUrl = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/vaccinations/vaccinations.csv";
let lastDataAvaible = [];
let secondlastData = [];
var accordion = ' <div class="col-md-4"><div class="accordion" ><div class="row deletepadding"><div class="col-1" style="padding-top: 2px;"><text class="position">{{position}}</text></div><div class="col deletepadding"><text class="countryname">{{country}}</text></div><div class="col" style="padding-right:0;"><text class="currentVaccineNumber"><img src="Images/syringe.png" style="height:14px;"> {{totalVaccines}}</text></div><div class="col-1 deletepadding" style="max-width: 22px;"><text class="position"></text></div></div><div class="row" style="padding-top: 5px;"><div class="col-1"><text class="position"></text></div><div class="col-7 deletepadding" style="padding-top: 4px;"><text class="popolationpercent"> <img src="Images/Population.png" style="width: 20px; padding-right: 5px;"/>{{popolationPercent}}</text></div><div class="col-3 deletepadding"><div><text class="differenceCounter">{{totalVaccinesDifferences}}</text></div></div></div></div></div>';    
var counterstemplate = '    <div class="row"><div class="four col-md-6" style="padding-top: 15px;"><div class="counter-box green"><i class="fa fa-thumbs-o-up"></i><span class="counter">{{totvalue}}</span> <p>Vaccine administered around the world</p></div></div><div class="four col-md-6" style="padding-top: 15px;"><div class="counter-box blue"><i class="fa fa-thumbs-o-up"></i><span class="counter1">{{totvaccinated}}</span> <p>Of the global population received<br> at least 1 dose of vaccine</p></div></div></div>'

$( document ).ready(async () => {  
    lastDataAvaible = await GetLastData();
    secondlastData = await getSecondLastData();
    $('#loadingmodal').css('display', 'none');
    loadCounetrsTemplate(lastDataAvaible[lastDataAvaible.length - 2].split(','));
    loadCounterScript();
    loadCollapse(0);
});

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

function loadCollapse(sortType){
  switch (sortType) {
    case 0:
      var temp = sortListByVaccination(lastDataAvaible);
      var secontemp = sortListByVaccination(secondlastData);     
      break;
    case 1:
      var temp = sortListByFullyVaccination(lastDataAvaible);
      var secontemp = sortListByFullyVaccination(secondlastData);      
       break;
  }

    for (let index = 1; index < temp.length-1; index++) {
        var splittedData = temp[index].toString().split(',');
        var totdifferenceTemp = "+" + splittedData[6];
        if (splittedData[6] === "") {
          var totdifferenceTemp = "+0";
        }
        var secondSplittedData = secontemp[index].toString().split(',');
        if(splittedData[10] != ""){
          var data = {
            name : splittedData[0].toString(),
            totalVaccine : splittedData[3].toString(),
            type : splittedData[2].toString(),
            lastDate : splittedData[2].toString(),
            position : index,
            vaccinatedPercent: splittedData[10] + "% fully vaccinated",
            totalVaccineDifferences : totdifferenceTemp
            }
          }
         if (splittedData[9] != "" && splittedData[9] != "0"){
            var data = {
              name : splittedData[0].toString(),
              totalVaccine : splittedData[3].toString(),
              type : splittedData[2].toString(),
              lastDate : splittedData[2].toString(),
              position : index,
              vaccinatedPercent: splittedData[9] + "% received at least 1 dose",
              totalVaccineDifferences : totdifferenceTemp
          }
        }
        else if (splittedData[8] != "" && splittedData[8] != "0"){
          var data = {
            name : splittedData[0].toString(),
            totalVaccine : splittedData[3].toString(),
            type : splittedData[2].toString(),
            lastDate : splittedData[2].toString(),
            position : index,
            vaccinatedPercent: splittedData[8] + "% received at least 1 dose",
            totalVaccineDifferences : totdifferenceTemp
        }
      }
        else{
          var data = {
            name : splittedData[0].toString(),
            totalVaccine : splittedData[3].toString(),
            type : splittedData[2].toString(),
            lastDate : splittedData[2].toString(),
            position : index,
            vaccinatedPercent:"Data not available",
            totalVaccineDifferences : totdifferenceTemp
        }
      }
        var html = accordion.replaceAll('{{totalVaccines}}', formatNumberWithCommas(data.totalVaccine)).replace('{{country}}', data.name).replace('{{vaccineType}}',data.type).replace('{{lastUpdate}}', data.lastDate).replace('{{position}}', data.position).replace('{{popolationPercent}}', data.vaccinatedPercent).replace('{{totalVaccinesDifferences}}',data.totalVaccineDifferences);
        $("#collapse").append(html);     
    }
    $('#license').css('display', 'inline');
    $('#filterDiv').css('display', 'inline');
    

}

function loadCounetrsTemplate(data){
  var secondData = sortListByFullyVaccination(secondlastData);
  var newdailyvaccine = parseInt(data[3] - parseInt(secondData.toString().split(',')[3]));
  $("#counters").append(counterstemplate.replace('{{totvalue}}', data[3]).replace('{{totvaccinated}}',data[9] + "%").replace('{{totdailyvaccines}}','+' + newdailyvaccine)); 
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
    if(isNaN(a[3].toString())){
      return a[4]-b[3]
    }
    if(isNaN(b[3].toString())){
      return a[3]-b[4]
    }
    return a[3]-b[3]
  });
  return result.reverse();
}

function UpdateListFilter(selectedItem){
  switch (selectedItem) {
    case 0:
      $("#collapse").empty();
      loadCollapse(0);
      $("#dropdownMenuButton").html('<img src="Images/syringe.png" style="width: 25px; padding-right:10px;">Doses Administered');
      break;
    case 1:
      $("#collapse").empty();
      loadCollapse(1);
      $("#dropdownMenuButton").html('<img src="Images/Population.png" style="width: 25px; padding-right:10px;">% fully vaccinated');
      break;
  }
}

async function GetWorldData(){
  const {data} = await axios.get(masterDataUrl);
  let lines = data.split('\n');
  let totalVaccination = lines[lines.length-2].split(',');
  var i;
  for (i = 0; i < cars.length; i++) {
    text += cars[i] + "<br>";
  }
  return totalVaccination;
}

function formatNumberWithCommas(number) {
  return parseInt(number).toLocaleString();
  //return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

