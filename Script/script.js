//THIS IS A MESS, NEED A LOT OF IMPR
const ACCORDION = document.querySelector("#accordion");
const COUNTERS_TEMPLATE = document.querySelector('#countersTemplate');

let selectedType = 0;
let searchVal = "";
let countryLastData = "";

$('#map').hide();

$(document).ready(async () => {
    await loadVariables();
    countryLastData = await GetLastData();
    $('#map').show();
    drawRegionsMap(countryLastData);
    $('#loadingmodal').css('display', 'none');
    loadCounetrsTemplate(await GetWorldLastData());
    loadCounterScript();
    loadCollapse(0);
    loadContinents(0);
    $("#filterDiv").show();
    $('#collapse').show();
    $('#map').show();
    $(".hoverForMapChange").mouseenter(function() {
        drawRegionsMap(countryLastData, parseInt($(this).attr('id')));
    });
});

$('#search').bind('change keydown keyup', function () {
    search($(this).val());
});

function search(searchVal) {
    loadCollapse(selectedType, searchVal);
    loadContinents(selectedType, searchVal);
}

// (1/3) Function for searching, changed it from: look for any match with the string typed
// (2/3) to: look for a match in the same index location as the typed characters.
// (3/3) I.e: typing "uni" comes up with only "United States, United ..." as opposed to including "Tunisia" and the like.

function searchCountryOrContinentNameStartsWithSearchVal(name, sVal) {
    for (let i = 0; i < sVal.length; i ++) {
        if (sVal[i] !== name[i]) {
            return false;
        }
    }
    return true
}

function loadCollapse(sortType, searchVal = '') {
    // given an id this switch will sort the list of data
    // 
    switch (sortType) {
        // dIdx is the index of the data that we want to sort. For example, our data array will have
        // Country names at index 0, so we pass that to sortData in case 2 when sorting alphabetically
        case 0: // sort by total vaccinated
            var temp = sortData(data = GetCountriesLastData(), dIdx = 3); 
            break;
        case 1: // Sort by percentage vaccinated
            var temp = sortData(data = GetCountriesLastData(), dIdx = 10);
            break;
        case 2: // Sort alphabetically
            var temp = sortData(data = GetCountriesLastData(), dIdx = 0);
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

    // see line 32 for new algo 'searchCountryOrContinentNameStartsWithSearchVal'

    countryData = (searchVal != "")
        ? countryData.filter( x => searchCountryOrContinentNameStartsWithSearchVal(((x['name'].replace(/^ /, '')).toLowerCase()), (searchVal.toLowerCase())))
        : countryData;

    $('.countryCard').remove();

    if (countryData.length) {
        countryData.forEach(country => {
            const CONTENT = ACCORDION.content.cloneNode(true);
            //Load the counters on the top
            // Change content
            CONTENT.querySelector('.currentVaccineNumber').innerHTML = `<img alt="syringe" src="Images/syringe.png" style="height:14px;"> ${formatNumberWithCommas(country.totalVaccine)}`;
            CONTENT.querySelector('.countryname').innerHTML = country.name;
            CONTENT.querySelector('.position').innerHTML = country.position;
            CONTENT.querySelector('.populationpercent').innerHTML = `<img alt="syringe" src="Images/Population.png" style="height:14px;"> ${country.vaccinatedPercent}`;
            CONTENT.querySelector('.differenceCounter').innerHTML = formatDifferenceWithCommas(country.totalVaccineDifferences);
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
    //Same as loadCollapse, read comments there for more detail
    switch (sortType) {
        case 0:
            var temp = sortData(data = GetContinentsData(), dIdx = 3);
            break;
        case 1:
            var temp = sortData(data = GetContinentsData(), dIdx = 10);
            break;
        case 2:
            var temp = sortData(data = GetContinentsData(), dIdx = 0);
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

    // see line 32 for new algo 'earchCountryOrContinentNameStartsWithSearchVal'

    continentData = (searchVal != "")
        ? continentData.filter( x => searchCountryOrContinentNameStartsWithSearchVal(((x['name'].replace(/^ /, '')).toLowerCase()), (searchVal.toLowerCase())))
        : continentData;

    $('.continentCard').remove();

    if (continentData.length) {
        continentData.forEach(continent => {
            const CONTENT = ACCORDION.content.cloneNode(true);
            // Change content
            CONTENT.querySelector('.currentVaccineNumber').innerHTML = `<img alt="syringe" src="Images/syringe.png" style="height:14px;"> ${formatNumberWithCommas(continent.totalVaccine)}`;
            CONTENT.querySelector('.countryname').innerHTML = continent.name;
            CONTENT.querySelector('.position').innerHTML = continent.position;
            CONTENT.querySelector('.populationpercent').innerHTML = `<img alt="syringe" src="Images/Population.png" style="height:14px;"> ${continent.vaccinatedPercent}`;
            CONTENT.querySelector('.differenceCounter').innerHTML = formatDifferenceWithCommas(continent.totalVaccineDifferences);
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
    CONTENT.querySelector("#totvalue").innerHTML = data[5];
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

function compare(a, b) {
    // If we are comparing alphabetically, like with country / continent names, we use first option
    if (isNaN(Number(a))) {
        return a < b ? 1 : -1;
    } else {
    // Else we use this option for comparing numerically
        return a - b
    }
}

function sortData(data, dIdx) {
    let result = [];
    let temp = [];

    for (let idx = 0; idx < data.length; idx++) {
        temp.push(data[idx].split(','));
    }
    result = temp.sort((a, b) => compare(a[dIdx], b[dIdx]));
    return result.reverse();
}


// selectedItem will be an integer (1, 2, 3)
function updateListFilter(selectedItem) {
    selectedType = selectedItem;
    const ddAttrs = {
        alts: ["syringe", "population", "alphabetical"],
        imgs: ["syringe.png", "Population.png", "alphabetical.png"],
        text: ["Doses Administered", "% fully vaccinated", "Alphabetical"]
    }

    $("#collapseCountries").empty();
    $("#collapseCountries").append('<div class="col-12 groupList-title">Countries</div>');
    $("#collapseContinents").empty();
    $("#collapseContinents").append('<div class="col-12 groupList-title">Continents</div>');
    loadCollapse(selectedItem);
    loadContinents(selectedItem);
    // Keep arrays that are values of ddAttrs in order, and this will work
    $("#dropdownMenuButton").html(`<img alt=${ddAttrs.alts[selectedItem]} src="Images/${ddAttrs.imgs[selectedItem]}">${ddAttrs.text[selectedItem]}`);

    if ($('#search').val()) {
        search($('#search').val());
    }
}

function showCountryData(countryname) {
    //href to the clicked item page
    window.location.href = "View/country.html" + "?" + countryname.replace(" ", "");
}

google.charts.load('current', {
    'packages':['geochart'],
    'mapsApiKey': 'AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY'
});

google.charts.setOnLoadCallback(drawRegionsMap(countryLastData, undefined));

function drawRegionsMap(countryLastData = countryLastData, useCase = 0) {

    // append to array -- for all distinct country names -not continents (get lines w/ countryname, get last line from array of lines, split by comma and take the percentage vaccinated, append)
    
    countryLastData = countryLastData.filter(x => x.split(',')[0] != 'Asia' || 'North America' || 'Europe' || 'South America' || 'Africa' || 'Oceania');
    
    switch(useCase) {

        case 0:

            var arr = [["Country", "Percentage fully vaccinated"]]

            for (let i = 0; i < countryLastData.length; i ++) {
                var temp = [0, 0]
                var line = countryLastData[i].split(",");
                temp[0] = line[0]
                temp[1] = Math.floor(parseFloat(line[10]))
                arr.push(temp);
            }

            var max = 100

            break

        case 1:

            var arr = [["Country", "Percentage recieved at least one dose"]]

            for (let i = 0; i < countryLastData.length; i ++) {
                var temp = [0, 0]
                var line = countryLastData[i].split(",");
                temp[0] = line[0]
                temp[1] = Math.floor(parseFloat(line[9]))
                arr.push(temp);
            }

            var max = 100

            break

        case 2:

            var arr = [["Country", "People recieved at least one dose"]]

            var max = 0;

            for (let i = 0; i < countryLastData.length; i ++) {
                var temp = [0, 0]
                var line = countryLastData[i].split(",");
                temp[0] = line[0]
                temp[1] = Math.floor(parseFloat(line[4]))
                if (temp[1] > max) {
                    max = temp[1]
                }
                arr.push(temp);
            }

            break
        
        case 3:

            var arr = [["Country", "People fully vaccinated"]]

            var max = 0;

            for (let i = 0; i < countryLastData.length; i ++) {
                var temp = [0, 0]
                var line = countryLastData[i].split(",");
                temp[0] = line[0]
                temp[1] = Math.floor(parseFloat(line[5]))
                if (temp[1] > max) {
                    max = temp[1]
                }
                arr.push(temp);
            }

            break

    }

    var data = google.visualization.arrayToDataTable(arr);

    var options = {
        region: 'world',
        colorAxis: {minValue: 0, maxValue: max, colors: ['#FFFFFF','#6abf69']},
        backgroundColor: '#f8f9fa',
        width: $(document.querySelector('#map-holder')).width()*1,
        height: $(document.querySelector('#map-holder')).height()*1,
        };


    var chart = new google.visualization.GeoChart(document.getElementById('map'));

    chart.draw(data, options);

    window.onresize = function() {

        drawRegionsMap(countryLastData, useCase);

        $('#map').hide();

        // following code is so chart centering is not lost

        $('#map-holder').removeClass('chart-col')
        $('#map-holder').addClass('chart-col')

        $('#map').show();
    };

    google.visualization.events.addListener(chart, 'select', function() {
        var selectedItem = chart.getSelection()[0];
        if (selectedItem) {
          var country = data.getValue(selectedItem.row, 0);
          var countryForURL = country.replace(" ", "%20");
          window.location.href = "/View/country.html?" + countryForURL;
        }    
      });
}
