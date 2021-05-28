var countryName = "";
var countryData = [];
var countryLastData = [];

$('#chart-container').hide();

$(document).ready(async () => {
    await loadVariables();
    countryName = await GetCountryName();
    countryData = await GetCountryData(countryName);
    countryLastData = await GetCountryLastData();
    await loadCountryCountersTemplate(countryLastData)
    hideCountersWithNoData(countryLastData);
    loadCounterScript();
    drawChart(countryData, undefined);
    $('#chart-container').show();
});

async function GetCountryName() {
    // Get the name of the country by reading di url
    return window.location.search.substring(1).split("&");
}

async function GetCountryLastData() {
    // Get the latest data avaible for each country
    return countryData[countryData.length - 1].split(',');
}

async function loadCountryCountersTemplate(data) {
    const TEMPLATE = document.querySelector("#country_counters_template");
    const CONTENT = TEMPLATE.content.cloneNode(true);

    // Change content
    CONTENT.querySelector("#totvalue").innerHTML = data[3];
    CONTENT.querySelector("#totvaccinated").innerHTML = `${data[9]}%`;
    
    CONTENT.querySelector("#fullyVaccinated").innerHTML = `${data[10]}%`;
    CONTENT.querySelector("#peopleVaccinated").innerHTML = data[4];

    // removes %20 then adds to title card for country (id="countryname")
    let noSpecialCharactersCountryName = countryName.toString().replaceAll("%20", " ");
    CONTENT.querySelector("#countryname").innerHTML = noSpecialCharactersCountryName;

    $("#country_counters").append(CONTENT);
}


function hideCountersWithNoData(data) {
    // Hide the counters on the top if the the data is not avaible
    if (data[3] == null || data[3] == "") {
        $("#total_doses").hide();
    }
    if (data[4] == null || data[4] == "") {
        $("#people_vaccinated").hide();
    }
    if (data[9] == null || data[9] == "") {
        $("#vaccinated_percent").hide();
    }
    if (data[10] == null || data[10] == "") {
        $("#fully_vaccinated_percent").hide();
    }
}


function loadCounterScript() {
    // Load the animation to the counter
    // actually is a copy & paste from some russian website 
    $('.counter').each(function () {
        $(this).prop('Counter', 0.0).animate({ Counter: $(this).text() }, {
            duration: 2000,
            easing: 'swing',
            step: function (now) {
                $(this).text(formatNumberWithCommas(Math.ceil(now)));
            }
        });
      });
  }

// google charts loading

google.charts.load('current', {'packages':['corechart']});

function drawChart(countryDataForChart = countryData, sortType = 0) {

    switch(sortType) {

        case 0:

            var caseTitle = 'Total vaccinations'

            var arrayOfArraysForChart = [['Date', 'Total vaccinations']]
            var temp = []

            for (let i = 0; i < countryDataForChart.length; i++) {
                line = countryDataForChart[i].split(",")
                if (!!line[2] && !!line[3]) {
                    temp = [line[2], parseInt(line[3])]
                    arrayOfArraysForChart.push(temp)
                }
            }

            break;

        case 1:

            var caseTitle = 'People fully vaccinated'

            var arrayOfArraysForChart = [['Date', 'People fully vaccinated']]
            var temp = []

            for (let i = 0; i < countryDataForChart.length; i++) {
                line = countryDataForChart[i].split(",")
                if (!!line[2] && !!line[5]) {
                    temp = [line[2], parseInt(line[5])]
                    arrayOfArraysForChart.push(temp)
                }
            }

            break;

        case 2:

            var caseTitle = 'People who have recieved at least one dose'

            var arrayOfArraysForChart = [['Date', 'People who have recieved at least one dose']]
            var temp = []

            for (let i = 0; i < countryDataForChart.length; i++) {
                line = countryDataForChart[i].split(",")
                if (!!line[2] && !!line[4]) {
                    temp = [line[2], parseInt(line[4])]
                    arrayOfArraysForChart.push(temp)
                }
            }

            break;
    }

    var data = google.visualization.arrayToDataTable(arrayOfArraysForChart);

    var options = {
        series: {
            0: {color: '#2abfa7'},
            1: {color: '#00bcd4'}
        },
        vAxis: {
            title: caseTitle
        },
        colors: ['#a52714', '#097138'],
        crosshair: {
            color: '#000',
            trigger: 'selection'
        },
        titlePosition: 'none',
        curveType: 'function',
        legend: { position: 'none' },
        'height':$(window).height()*0.5,
        'width':$(window).width()*0.7
    };

    var chart = new google.visualization.LineChart(document.querySelector('#curve_chart'));

    chart.draw(data, options);

    $('#dropdownMenuButton').html(caseTitle)

    var tmp = sortType;

    window.onresize = function() {

        $('#curve_chart').hide();

        drawChart(countryData, tmp)

        // following code is so chart centering is not lost

        $('#assign-for-centering').removeClass('chart-col')
        $('#assign-for-centering').addClass('chart-col')

        $('#curve_chart').show();
    };
}