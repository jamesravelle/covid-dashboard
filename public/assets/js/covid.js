$( document ).ready(function() {
  console.log($('#location').val());
 
// Get Covid Numbers by state
// Set global variables
var result = "";
var stateAbbr = "";
var stateName = "";
var stateArray = [];
var positiveArray = [];
var colorArray = [];
var hospitalizedArray = [];
var heatmapSet = true;

// Default date format YYYYMMDD ex. 20200612. Set default date to yesterday
var date = outputDate(-1);
// Format outputted date
printDate(date);
// Run USA stats on load
getCovidStatsClick("USA", date)

function getCovidStatsClick(state, date){
  if(state === "" || state === "USA"){
    state = "USA";
    var query = "https://covidtracking.com/api/v1/us/" + date + ".json";
  } else {
    var query = "https://covidtracking.com/api/v1/states/" + state.toLocaleLowerCase() + "/" + date + ".json";
    zoomMap(state);
  } 
    console.log(query);
      $.ajax({ // Added return statement here
          url: query,
          method:"GET",
          // dataType: 'jsonp',
          cors: true ,
          contentType:'application/json',
          secure: true,
          error:function (xhr, ajaxOptions, thrownError){
              if(xhr.status==404) {
                  alertError();
                  return;
              }
          }
      }).then(function(response){
          console.log(response);
          outputClickedStats(state, response.positive, response.negative, response.death, response.positiveIncrease, response.hospitalizedCurrently);
          printDate(date.toString());
          printLocation(state);
      })
}

function alertError(){
  $('.error').addClass('is-active');
}

function outputClickedStats(state, pos, neg, deaths, dailyPos, hospital){
    $('#total-header').text("Total for " + state + " as of " + formatDate(date));
    $('#positive').text(pos)
    $('#negative').text(neg)
    $('#deaths').text(deaths)
    $('#daily-positive').text(dailyPos)
    $('#daily-hospital').text(hospital)
}

function zoomMap(x){
    var stateString = "US-" + x.toUpperCase();
    chart.zoomToMapObject(polygonSeries.getPolygonById(stateString));
}

$('#submit').on("click", function(e){
    e.preventDefault();
    var location = $('#location').val();
    date = $('#date').val();
    date = date.replace(/-/g, '');
    console.log(date);
    getCovidStatsClick(location, parseInt(date));
    // buildGraph(location, date)
    stateArray = [];
    positiveArray = [];
    colorArray = [];
    hospitalizedArray = [];
})

/*

MAPS CODE

*/

// Create map instance
var chart = am4core.create("chartdiv", am4maps.MapChart);

// Set map definition
chart.geodata = am4geodata_usaLow;

// Set projection
chart.projection = new am4maps.projections.AlbersUsa();

// Create map polygon series
var polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
polygonSeries.useGeodata = true;

// Add data tool tip and fill
var polygonTemplate = polygonSeries.mapPolygons.template;
polygonTemplate.fill = am4core.color("#E8BE89");


// Click event
polygonTemplate.events.on("hit", function(ev) {
    ev.target.series.chart.zoomToMapObject(ev.target);
    var stateAbbr = ev.target.dataItem.dataContext.id.split("-").pop();
    console.log(stateAbbr);
    // get object info
    getCovidStatsClick(stateAbbr, date);
});

// Hover event
/*
polygonTemplate.events.on("over", function(ev) {
    polygonTemplate.fill = "";
    stateAbbr = ev.target.dataItem.dataContext.id.split("-").pop();
    getCovidStatsHover(stateAbbr,date);
});
*/

// Reset zoom button
let home = chart.chartContainer.createChild(am4core.Button);
home.label.text = "Reset Zoom";
home.align = "right";
home.events.on("hit", function(ev) {
  chart.goHome();
});


/*

Geo Location

*/
  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }
  
  function showPosition(position) {
    var geoAPI = "cedbd416f0e54e32a4d7eadfd8b2e680";
    var locationQuery = "https://api.opencagedata.com/geocode/v1/json?q=" + position.coords.latitude + "+" + position.coords.longitude + "&key=" + geoAPI; 
    callLocationAPI(locationQuery);
  }

  function printLocation(x){
    $('#output-location').text(x.toUpperCase());
  }

  function printDate(date){
    $('#date').val(formatDate(date));
  }

  // Change date form YYYYMMDD -> MM/DD/YYYY
  function formatDate(date){
    return date[4] + date[5] + "/" + date[6] + date[7] + "/" + date[0] + date[1] + date[2] + date[3];
  }
  
// Convert longitude/latitude into city state
  function callLocationAPI(x){
    $.ajax({
        url:x,
        method:"GET"
    }).then(function(response){
      console.log(response);
       getCovidStatsClick(response.results[0].components.state_code, date)
       // News call
       displayStateInfo(response.results[0].components.state);
       // Testing call
       console.log("Get Testing");
       getTesting(response.results[0].components.state);
    })
  }

// Function to retrieve date +/- amount of days
function outputDate(numDays){
    var targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + numDays);
    var year = targetDate.getFullYear();
    var month = targetDate.getMonth() + 1;
    var day = targetDate.getDate();
    // Check if month/day are single digit. If they are add a 0 before it (06, 01, etc.)
    if(month.toString().length < 2){
        month = "0" + month;
    }
    if(day.toString().length < 2){
        day = "0" + day;
    }
    return year + "" + month + "" + day;
}

/*

Heat map

*/

// Add state names
var labelSeries = chart.series.push(new am4maps.MapImageSeries());
var labelTemplate = labelSeries.mapImages.template.createChild(am4core.Label);
labelTemplate.horizontalCenter = "middle";
labelTemplate.verticalCenter = "middle";
labelTemplate.fontSize = 10;
labelTemplate.nonScaling = true;
labelTemplate.interactionsEnabled = false;

// Load initial map
polygonSeries.events.on("inited", function () {
  polygonSeries.mapPolygons.each(function (polygon) {
    let state = polygon.dataItem.dataContext.id.split("-").pop();
    getCovidStatsMap(state,date);
  });
});

// API call for map
function getCovidStatsMap(x, y){
    var state = x;
    // date format: 20200501
    var date = y;
    var query = "https://covidtracking.com/api/v1/states/" + state.toLocaleLowerCase() + "/" + date + ".json";
    console.log("Query: " + query)
    $.ajax({ // Added return statement here
        url:query,
        method:"GET",
        // dataType: 'jsonp',
        cors: true ,
        contentType:'application/json',
        secure: true,
        error:function (xhr, ajaxOptions, thrownError){
          console.log(thrownError);
            if(xhr.status==404) {
                alertError();
                return;
            }
        }
    }).then(function(response){
      console.log("Response: " + JSON.stringify(response))
        buildHeatMap(response.state, response.positiveIncrease, response.hospitalizedCurrently);
    })
}

// Table output
function buildTable(){
  for(var i = 0; i < stateArray.length; i++){
    var newRow = $('<tr>');
    var cell1 = $('<td>');
    cell1.text(stateArray[i]);
    $('#table-date').text(formatDate(date));
    var cell2 = $('<td>');
    cell2.text(positiveArray[i]);
    var cell3 = $('<td>');
    cell3.text(hospitalizedArray[i]);
    newRow.append(cell1,cell2,cell3);
    $('#state-data').append(newRow)
  }
}

// Heat map build
function buildHeatMap(state, pos, hosp){
    stateArray.push(state);
    positiveArray.push(pos);
    hospitalizedArray.push(hosp);
    if(stateArray.length === 51){
        heatmapSet = true;
        for(var i = 0; i < stateArray.length; i++){
          if(positiveArray[i] === 0 || positiveArray[i] < 0){
            // 0 or not defined
            colorArray.push('#B8B8B8');
          } else if(positiveArray[i] >= 0 && positiveArray[i] <= 100){
            // 0 - 100
            colorArray.push('#f9ff00');
          } else if(positiveArray[i] >= 100 && positiveArray[i] <= 200){
            // 100 - 200
            colorArray.push('#f9f400');
          } else if(positiveArray[i] >= 200 && positiveArray[i] <= 300){
            // 200 - 300
            colorArray.push('#f9eb00');
          } else if(positiveArray[i] >= 300 && positiveArray[i] <= 400){
            // 300 - 400
            colorArray.push('#f9d900');
          } else if(positiveArray[i] >= 400 && positiveArray[i] <= 500){
            // 400 - 500
            colorArray.push('#f9c700');
          } else if(positiveArray[i] >= 500 && positiveArray[i] <= 1000){
            // 500 - 1000
            colorArray.push('#f9b800');
          } else if(positiveArray[i] >= 1000 && positiveArray[i] <= 1500){
            // 1000 - 1500
            colorArray.push('#faa600');
          } else if(positiveArray[i] >= 1500 && positiveArray[i] <= 2000){
            // 1500 - 2000
            colorArray.push('#fa9700');
          } else if(positiveArray[i] >= 2000 && positiveArray[i] <= 5000){
            // 2000 - 5000
            colorArray.push('#fb7d00');
          } else if(positiveArray[i] >= 5000 && positiveArray[i] <= 10000){
            // 5000 - 10,000
            colorArray.push('#fc6300');
          } else {
            // Greater than 10,000
            colorArray.push('#ff0000');
          }
        }
    }
}

function createHeatMapKey(){
  var heatColors = ['#B8B8B8', '#f9ff00', '#f9f400', '#f9eb00', '#f9d900','#f9c700','#f9b800','#faa600','#fa9700','#fb7d00','#fc6300','#ff0000']
  var heatNumbers = ['N/A','< 100','100-200','200 - 300','300 - 400','400 - 500','500 - 1000','1000 - 1500','1500 - 2000','2000 - 5000','5000 - 10,000','10,000+']
  
  for(var i = 0; i < 12; i++){
    var newDiv = $('<div>');
    newDiv.text(heatNumbers[i]);
    newDiv.css("background-color", heatColors[i]);
    newDiv.addClass("column");
    $('#heatmap-key').append(newDiv);
  }
}

createHeatMapKey()

function getColorCode(state){
    stateArray.indexOf(state);
    return colorArray[stateArray.indexOf(state)];
}

function getPositiveCases(state){
    stateArray.indexOf(state);
    var posArray = positiveArray[stateArray.indexOf(state)];
    if(posArray){
      return positiveArray[stateArray.indexOf(state)];
    }
    else {
      return "N/A";
    }
}

function getHospitalized(state){
    stateArray.indexOf(state);
    var hospArray = hospitalizedArray[stateArray.indexOf(state)];
    if(hospArray){
      return hospitalizedArray[stateArray.indexOf(state)];
    }
    else {
      return "N/A";
    }
}

polygonSeries.events.on("inited", function () {
    setInterval(function(){ 
      if(heatmapSet){
        console.log("running")
        polygonSeries.mapPolygons.each(function (polygon) {
            // Fill
            let state = polygon.dataItem.dataContext.id.split("-").pop();
            getCovidStatsMap(state,date);
            polygon.fill = getColorCode(state);
        });
        polygonSeries.mapPolygons.each(function (polygon) {
          let label = labelSeries.mapImages.create();
          let state = polygon.dataItem.dataContext.id.split("-").pop();
          label.latitude = polygon.visualLatitude;
          label.longitude = polygon.visualLongitude;
          label.children.getIndex(0).text = state
          // polygon.tooltipText = state + ": " + getPositiveCases(state) + "/" + getHospitalized(state);
          polygon.tooltipText = `[bold]{name}: ` + formatDate(date) + `[/]
          ----
          New Cases: ` + getPositiveCases(state) + `[/]
          Hospitalized: ` + getHospitalized(state)
        });
        heatmapSet = false;
      }
    }, 1000);
});

/*

Click events

*/

$('#submit').on("click", function(e){
  e.preventDefault();
  console.log($('#location option:selected').text());
  heatmapSet = true
  var location = $('#location').val();
  date = $('#date').val();
  date = date.replace(/-/g, '');
  if(date.includes("/")){
    var newDate = date.replace(/\//g, '');
    date = newDate[4] + newDate[5] + newDate[6] + newDate[7] + newDate[0] + newDate[1] + newDate[2] + newDate[3];
  }
  console.log(date);
  getCovidStatsClick(location, parseInt(date));
  stateArray = [];
  positiveArray = [];
  colorArray = [];
  hospitalizedArray = [];
  // News call
  displayStateInfo($('#location option:selected').text());
  // Testing call
  getTesting($('#location option:selected').text());
})

$('#current-location').on("click", function(e){
  e.preventDefault();
  getLocation();
})

// Modals
$('#show-table').on("click", function(e){
  e.preventDefault();
  $('.table-modal').addClass('is-active');
  buildTable();
})

$('#question').on("click", function(e){
  e.preventDefault();
  $('.how-to-use').addClass('is-active');
})

$('#show-testing').on("click", function(e){
  e.preventDefault();
  $('.testing-modal').addClass('is-active');
})

// Close modals
$('.delete').on("click", function(){
  $('.how-to-use').removeClass('is-active');
  $('.error').removeClass('is-active');
  $('.table-modal').removeClass('is-active');
  $('.testing-modal').removeClass('is-active');
})

});