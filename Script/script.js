//THIS IS A MESS, NEED A LOT OF IMPR
const ACCORDION =
`<div class="col-md-4 p-1 cardData {{className}}">
    <div class="card shadow rounded bg-white" onclick="showCountryData({{countryName}})" style="cursor:pointer">
        <div class="card-body" style="height:110px;">
            <div class="row">
                <div class="col-1 pl-0 py-0" style="min-width:fit-content;color: #969696;">{{position}}</div>
                <div class="col-6 pl-0">{{country}}</div>
                <div class="col-5 currentVaccineNumber ml-auto mr-1 heightFitContent" style="max-width:fit-content"><img alt="syringe" width="15px" class="mr-2" src="Images/syringe.png""><span>{{totalVaccines}}</span></div>
            </div>
            <div class="row mt-2">
                <div class="col popolationpercent" style="max-width:fit-content"><img alt="syringe" class="mr-2" src="Images/Population.png" style="width: 20px;" />{{popolationPercent}}</div>
                <div class="col ml-auto mr-1 differenceCounter" style="max-width:fit-content">{{totalVaccinesDifferences}}</div>
            </div>
        </div>
    </div>
</div>`;

const COUNTERS_TEMPLATE = document.querySelector('#countersTemplate');

let selectedType = 0;
let searchVal = "";

$(document).ready(async () => {
    await loadVariables();
    $('#loadingmodal').css('display', 'none');
    loadCounetrsTemplate(await GetWorldLastData());
    loadCounterScript();
    loadCollapse(0);
    loadContinents(0);
    $('#collapse').show();
});

$('#search').bind('change keydown keyup', function () {
    searchVal = $(this).val()
    loadCollapse(selectedType, searchVal);
    loadContinents(selectedType, searchVal);
});

function loadCollapse(sortType, searchVal = '') {
    //given an id this switch will sort the list of data
    switch (sortType) {
        case 0:
            var temp = sortListByVaccination(GetCountriesLastData());
            break;
        case 1:
            var temp = sortListByFullyVaccination(GetCountriesLastData());
            break;
    }

    let countryData = [];
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
        countryData.push(data);
    }

    countryData = (searchVal != "") ? countryData.filter(x => ((x['name'].replace(/\s+/g, '')).toLowerCase()).includes(searchVal.toLowerCase())) : countryData;

    $('.countryCard').remove();

    if (countryData.length) {
        countryData.forEach(country => {
            var html = ACCORDION.replaceAll('{{totalVaccines}}', formatNumberWithCommas(country.totalVaccine)).replace('{{country}}', country.name).replace('{{vaccineType}}', country.type).replace('{{lastUpdate}}', country.lastDate).replace('{{position}}', country.position).replace('{{popolationPercent}}', country.vaccinatedPercent).replace('{{totalVaccinesDifferences}}', country.totalVaccineDifferences).replace("{{countryName}}", "'" + country.name + "'").replace("{{className}}", "countryCard");
            $("#collapseCountries").append(html);
        });
    } else {
        var noCountryMsg = '<h6 class="countryCard text-center p-5 w-100">No Country Data Found!</h6>'
        $("#collapseCountries").append(noCountryMsg);
    }
    $('#license').css('display', 'inline');
    $('#filterDiv').css('display', 'inline');
}

function loadContinents(sortType, searchVal = '') {
    //Same as the function on top, but for the continents
    switch (sortType) {
        case 0:
            var temp = sortListByVaccination(GetContinentsData());
            break;
        case 1:
            var temp = sortListByFullyVaccination(GetContinentsData());
            break;
    }

    let continentData = [];

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
        continentData.push(data);
    }

    continentData = (searchVal != "") ? continentData.filter(x => ((x['name'].replace(/\s+/g, '')).toLowerCase()).includes(searchVal.toLowerCase())) : continentData;

    $('.continentCard').remove();

    if (continentData.length) {
        continentData.forEach(continent => {
            var html = ACCORDION.replaceAll('{{totalVaccines}}', formatNumberWithCommas(continent.totalVaccine)).replace('{{country}}', continent.name).replace('{{vaccineType}}', continent.type).replace('{{lastUpdate}}', continent.lastDate).replace('{{position}}', continent.position).replace('{{popolationPercent}}', continent.vaccinatedPercent).replace('{{totalVaccinesDifferences}}', continent.totalVaccineDifferences).replace("{{countryName}}", "'" + continent.name + "'").replace("{{className}}", "continentCard");
            $("#collapseContinents").append(html);
        });
    } else {
        var noContinentMsg = '<h6 class="continentCard text-center p-5 w-100">No Continent Data Found!</h6>'
        $("#collapseContinents").append(noContinentMsg);
    }
    $('#license').css('display', 'inline');
}

function loadCounetrsTemplate(data) {
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
    selectedType = selectedItem;
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

