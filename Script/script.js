//THIS IS A MESS, NEED A LOT OF IMPR
const ACCORDION = document.querySelector("#accordion"); 
const COUNTERS_TEMPLATE = document.querySelector('#countersTemplate');


$(document).ready(async () => {
    await loadVariables();
    $('#loadingmodal').css('display', 'none');
    loadCounetrsTemplate(await GetWorldLastData());
    loadCounterScript();
    loadCollapse(0);
    loadContinents(0);
    $('#collapse').show();
});

function loadCollapse(sortType) {
    //given an id this switch will sort the list of data
    switch (sortType) {
        case 0:
            var temp = sortListByVaccination(GetCountriesLastData());
            break;
        case 1:
            var temp = sortListByFullyVaccination(GetCountriesLastData());
            break;
    }

    for (let index = 1; index < temp.length - 1; index++) {
        var splittedData = temp[index].toString().split(',');
        var totdifferenceTemp = "+" + splittedData[6];
        var vaccinatedPercentage = "";
        if (splittedData[6] === "") {
            var totdifferenceTemp = "+0";
        }
        //show the fully vaccinated %, if not present show the % of people that have received at least 1 dose
        if (splittedData[10] != "") {
            vaccinatedPercentage = splittedData[10] + "% fully vaccinated";
        }
        else if (splittedData[9] != "" && splittedData[9] != "0" & splittedData[8] < 100) {
            vaccinatedPercentage = splittedData[9] + "% received at least 1 dose";
        }
        else if (splittedData[8] != "" && splittedData[8] != "0" & splittedData[8] < 100) {
            vaccinatedPercentage = splittedData[8] + "% received at least 1 dose";
        }
        else {
            vaccinatedPercentage = splittedData[8] + " vaccinations per hundred people";
        }

        var data = {
            name: " " + splittedData[0].toString(),
            totalVaccine: splittedData[3].toString(),
            type: splittedData[2].toString(),
            lastDate: splittedData[2].toString(),
            position: index,
            vaccinatedPercent: vaccinatedPercentage,
            totalVaccineDifferences: totdifferenceTemp
        }
      
      const CONTENT = ACCORDION.content.cloneNode(true);
      //Load the counters on the top
      // Change content
      CONTENT.querySelector('.currentVaccineNumber').innerHTML = `<img alt="syringe" src="Images/syringe.png" style="height:14px;"> ${formatNumberWithCommas(data.totalVaccine)}`;
      CONTENT.querySelector('.countryname').innerHTML = data.name;
      CONTENT.querySelector('.position').innerHTML = data.position;
      CONTENT.querySelector('.popolationpercent').innerHTML = `<img alt="syringe" src="Images/Population.png" style="height:14px;"> ${data.vaccinatedPercent}`;
      CONTENT.querySelector('.differenceCounter').innerHTML = data.totalVaccineDifferences;
      
      // Set attribute
      CONTENT.querySelector('.accordion').setAttribute('data-country-name', data.name);

      // Add click event
      CONTENT.querySelector('.accordion').addEventListener('click', (e) => {
        const name = e.target.closest('.accordion').getAttribute('data-country-name');
        showCountryData(name);
      })
      
      $("#collapseCountries").append(CONTENT);
    }
    $('#license').css('display', 'inline');
    $('#filterDiv').css('display', 'inline');
}

function loadContinents(sortType) {
    //Same as the function on top, but for the continents
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

        if (splittedData[10] != "") {
            vaccinatedPercentage = splittedData[10] + "% fully vaccinated";
        }
        else if (splittedData[9] != "" && splittedData[9] != "0") {
            vaccinatedPercentage = splittedData[9] + "% received at least 1 dose";
        }
        else if (splittedData[8] != "" && splittedData[8] != "0") {
            vaccinatedPercentage = splittedData[8] + "% received at least 1 dose";
        }
        else {
            vaccinatedPercentage = "Data not available";
        }

        var data = {
            name: " " + splittedData[0].toString(),
            totalVaccine: splittedData[3].toString(),
            type: splittedData[2].toString(),
            lastDate: splittedData[2].toString(),
            position: index + 1,
            vaccinatedPercent: vaccinatedPercentage,
            totalVaccineDifferences: totdifferenceTemp
        }
      
      const CONTENT = ACCORDION.content.cloneNode(true);
      
      // Change content
      CONTENT.querySelector('.currentVaccineNumber').innerHTML = `<img alt="syringe" src="Images/syringe.png" style="height:14px;"> ${formatNumberWithCommas(data.totalVaccine)}`;
      CONTENT.querySelector('.countryname').innerHTML = data.name;
      CONTENT.querySelector('.position').innerHTML = data.position;
      CONTENT.querySelector('.popolationpercent').innerHTML = `<img alt="syringe" src="Images/Population.png" style="height:14px;"> ${data.vaccinatedPercent}`;
      CONTENT.querySelector('.differenceCounter').innerHTML = data.totalVaccineDifferences;
      
      // Set attribute
      CONTENT.querySelector('.accordion').setAttribute('data-country-name', data.name);

      // Add click event
      CONTENT.querySelector('.accordion').addEventListener('click', (e) => {
        const name = e.target.closest('.accordion').getAttribute('data-country-name');
        showCountryData(name);
      })

      $("#collapseContinents").append(CONTENT);
    }
    $('#license').css('display', 'inline');
}

function loadCounetrsTemplate(data){
  //load the counters on top
  const CONTENT = COUNTERS_TEMPLATE.content.cloneNode(true);

  // Change content
  CONTENT.querySelector("#totvalue").innerHTML = data[3];
  CONTENT.querySelector("#totvaccinated").innerHTML = `${data[9]}%`;
    
  CONTENT.querySelector("#fullyVaccinated").innerHTML = `${data[10]}%`;
  CONTENT.querySelector("#peopleVaccinated").innerHTML = data[4];

  $("#counters").append(CONTENT);
}

function loadCounterScript() {
    //Load the animation to the counter
    //actually is a copy & paste from some russian website 
    $('.counter').each(function () {
        $(this).prop('Counter', 0.0).animate({
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

function sortListByFullyVaccination(data) {
    //sorting by fult vaccinated
    var result = [];
    var temp = [];
    for (let index = 0; index < data.length; index++) {
        temp.push(data[index].split(','));
    }
    result = temp.sort(function (a, b) {
        return a[10] - b[10]
    });
    return result.reverse();
}

function sortListByVaccination(data) {
    //sorting by vaccination
    var result = [];
    var temp = [];
    for (let index = 0; index < data.length; index++) {
        temp.push(data[index].split(','));
    }
    result = temp.sort(function (a, b) {
        return a[3] - b[3]
    });
    return result.reverse();
}

function UpdateListFilter(selectedItem) {
    switch (selectedItem) {
        case 0:
            $("#collapseCountries").empty();
            $("#collapseCountries").append('<div class="col-12 groupList-title">Countries</div>');
            $("#collapseContinents").empty();
            $("#collapseContinents").append('<div class="col-12 groupList-title">Continents</div>');
            loadCollapse(0);
            loadContinents(0);
            $("#dropdownMenuButton").html('<img alt="syringe" src="Images/syringe.png" style="width: 25px; padding-right:10px;">Doses Administered');
            break;
        case 1:
            $("#collapseCountries").empty();
            $("#collapseCountries").append('<div class="col-12 groupList-title">Countries</div>');
            $("#collapseContinents").empty();
            $("#collapseContinents").append('<div class="col-12 groupList-title">Continents</div>');
            loadCollapse(1);
            loadContinents(1);
            $("#dropdownMenuButton").html('<img alt="population" src="Images/Population.png" style="width: 25px; padding-right:10px;">% fully vaccinated');
            break;
    }
}

function showCountryData(countryname) {
    //href to the clicked item page 
    window.location.href = "View/country.html" + "?" + countryname.replace(" ", "");
}

