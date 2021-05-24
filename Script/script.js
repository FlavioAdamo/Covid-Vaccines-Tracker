//THIS IS A MESS, NEED A LOT OF IMPR
const ACCORDION = document.querySelector("#accordion");
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
    search($(this).val());
});

function search(searchVal) {
    loadCollapse(selectedType, searchVal);
    loadContinents(selectedType, searchVal);
}

function loadCollapse(sortType, searchVal = '') {
    //given an id this switch will sort the list of data
    switch (sortType) {
        case 0:
            var temp = sortListByVaccination(GetCountriesLastData());
            break;
        case 1:
            var temp = sortListByFullyVaccination(GetCountriesLastData());
            break;
        case 2:
            var temp = sortListByAlphabetical(GetCountriesLastData());
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

    // (1/3) You had removed all spaces from the countryData.name (to remove the space before all names bug), therefore searching
    // (2/3) anything with a space in it resulted in no results as ' ' was not in countryData.name at all. I added the new .replace()
    // (3/3) so only the first space of each countryData.name is removed (if there is one). Now you can search for names with spaces. Cheers.
    countryData = (searchVal != "") ? countryData.filter(x => ((x['name'].replace(/^ /, '')).toLowerCase()).includes(searchVal.toLowerCase())) : countryData;

    $('.countryCard').remove();

    if (countryData.length) {
        countryData.forEach(country => {
            const CONTENT = ACCORDION.content.cloneNode(true);
            //Load the counters on the top
            // Change content
            CONTENT.querySelector('.currentVaccineNumber').innerHTML = `<img alt="syringe" src="Images/syringe.png" style="height:14px;"> ${formatNumberWithCommas(country.totalVaccine)}`;
            CONTENT.querySelector('.countryname').innerHTML = country.name;
            CONTENT.querySelector('.position').innerHTML = country.position;
            CONTENT.querySelector('.popolationpercent').innerHTML = `<img alt="syringe" src="Images/Population.png" style="height:14px;"> ${country.vaccinatedPercent}`;
            CONTENT.querySelector('.differenceCounter').innerHTML = country.totalVaccineDifferences;
            CONTENT.querySelector('.accordion').parentNode.classList.add("countryCard");

            // Set attribute
            CONTENT.querySelector('.accordion').setAttribute('data-country-name', country.name);

            // Add click event
            CONTENT.querySelector('.accordion').addEventListener('click', (e) => {
                const name = e.target.closest('.accordion').getAttribute('data-country-name');
                showCountryData(name);
            })
            $("#collapseCountries").append(CONTENT);
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
        case 2:
            var temp = sortListByAlphabetical(GetContinentsData());
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
            const CONTENT = ACCORDION.content.cloneNode(true);
            // Change content
            CONTENT.querySelector('.currentVaccineNumber').innerHTML = `<img alt="syringe" src="Images/syringe.png" style="height:14px;"> ${formatNumberWithCommas(continent.totalVaccine)}`;
            CONTENT.querySelector('.countryname').innerHTML = continent.name;
            CONTENT.querySelector('.position').innerHTML = continent.position;
            CONTENT.querySelector('.popolationpercent').innerHTML = `<img alt="syringe" src="Images/Population.png" style="height:14px;"> ${continent.vaccinatedPercent}`;
            CONTENT.querySelector('.differenceCounter').innerHTML = continent.totalVaccineDifferences;
            CONTENT.querySelector('.accordion').parentNode.classList.add("continentCard");

            // Set attribute
            CONTENT.querySelector('.accordion').setAttribute('data-country-name', continent.name);

            // Add click event
            CONTENT.querySelector('.accordion').addEventListener('click', (e) => {
                const name = e.target.closest('.accordion').getAttribute('data-country-name');
                showCountryData(name);
            })

            $("#collapseContinents").append(CONTENT);
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

function sortListByAlphabetical(data) {
    
    var result = [];
    var temp = [];
    for (let index = 0; index < data.length; index++) {
        temp.push(data[index].split(','))
    }
    result = temp.sort(function (a, b) {
        return a[0] > b[0] ? 1 : -1
    });
    
    return result
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
        case 2:
            $("#collapseCountries").empty();
            $("#collapseCountries").append('<div class="col-12 groupList-title">Countries</div>');
            $("#collapseContinents").empty();
            $("#collapseContinents").append('<div class="col-12 groupList-title">Continents</div>');
            loadCollapse(2);
            loadContinents(2);
            $("#dropdownMenuButton").html('<img alt="population" src="Images/alphabetical.png" style="width: 25px; padding-right:10px;">Alphabetical');
    }

    if ($('#search').val()) {
        search($('#search').val());
    }
}

function showCountryData(countryname) {
    //href to the clicked item page
    window.location.href = "View/country.html" + "?" + countryname.replace(" ", "");
}

