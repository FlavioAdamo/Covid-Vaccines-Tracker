var countryName = "";
var countryData = [];
var countryLastData = [];
let countryCode = "";

$('#chart-container').hide();

$(document).ready(async () => {
    await loadVariables();
    countryName = await GetCountryName();
    countryCode = await getCountryCode();
    countryData = await GetCountryData(countryName);
    countryLastData = await GetCountryLastData();
    await loadCountryCountersTemplate(countryLastData)
    hideCountersWithNoData(countryLastData);
    loadCounterScript();
    $('#chart-container').show();
    drawChart(countryData);
});

async function getCountryCode() {
    //Get countryCode for to display flags
    let response = await fetch(`https://restcountries.eu/rest/v2/name/${countryName}`);

    if (response.status === 200) {
        countryCode = await response.json();
    } else if (response.status === 404) {
        console.log("country not found")
    }

    if (countryName == "India") {
        return countryCode[1].alpha2Code;
    }

    return countryCode[0]?.alpha2Code;
}

async function GetCountryName() {
    // Get the name of the country by reading di url
    return window.location.search.substring(1).split("&");
}

async function GetCountryLastData() {
    // Get the latest data avaible for each country
    return countryData[countryData.length - 1].split(',');
}

async function loadCountryCountersTemplate(data) {
    // Load counters on top
    let noSpecialCharactersCountryName = countryName.toString().replaceAll("%20", " ");
    //The row below is to long, need some improvement to make it more understandable
    var countryname = countryCode ? `<img src="https://www.countryflags.io/${countryCode}/flat/32.png"> &nbsp; ${noSpecialCharactersCountryName}&nbsp; <img src="https://www.countryflags.io/${countryCode}/flat/32.png">` : noSpecialCharactersCountryName;
    var template = $.trim($('#country_counters_template').html());
    template = template.replace('{{peopleVaccinated}}', data[4]);
    template = template.replace('{{totvalue}}', data[3]);
    template = template.replace('{{totvaccinated}}', `${data[9]}%`);
    template = template.replace('{{fullyVaccinated}}', `${data[10]}%`);
    template = template.replace('{{countryName}}', countryname);
    $('#country_counters').append(template);
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
google.charts.load('45', { 'packages': ['corechart'] });

function drawChart(countryDataForChart = countryData) {
    var arrayOfArraysForChart = [['Date', 'People fully vaccinated', 'People who have recieved at least one dose']]
    var temp = []
    for (let i = 0; i < countryDataForChart.length; i++) {
        line = countryDataForChart[i].split(",")
        if (!!line[2] && (!!line[5] || parseInt(line[5]) == 0) && (!!line[4]) || parseInt(line[4]) == 0) {
            temp = [line[2], parseInt(line[5]), parseInt(line[4])]
            arrayOfArraysForChart.push(temp)
        }
    }

    var data = google.visualization.arrayToDataTable(arrayOfArraysForChart);

    var options = {
        width: $(document.querySelector('#chart-holder')).width(),
        height: $(document.querySelector('#chart-holder')).height(),
        colors: ['#2fbeba', '#6abf69']
    };

    var chart = new google.visualization.AreaChart(document.querySelector('#curve_chart'));

    chart.draw(data, options);

    window.onresize = function () {
        drawChart(countryData)

        $('#curve_chart').hide();

        // following code is so chart centering is not lost
        $('#assign-for-centering').removeClass('chart-col')
        $('#assign-for-centering').addClass('chart-col')

        $('#curve_chart').show();
    };
}

