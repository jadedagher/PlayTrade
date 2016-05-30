//top


google.charts.load('current', {'packages': ['corechart']});

google.charts.setOnLoadCallback(drawChart);

	var data = getData("year");

	var options = {
		title: 'Historic data',
		curveType: 'function',
		colors: ['#FF0000'],
		legend: {
			position: 'bottom'
		}
	};


function drawChart() {

	var chartData = google.visualization.arrayToDataTable(data);

	var chart = new google.visualization.LineChart(document.getElementById('historic_chart_div'));
	chart.draw(chartData, options);

}


//function to update the time for the chart
function endDate_thisWeek()
{
  var myDateDay = new Date();
  var day = myDateDay.getDate();

  var myDateMonth = new Date();
  var month = myDateMonth.getMonth();
  var month = month+1;

  var myDateYear = new Date();
  var year = myDateYear.getFullYear();

  if (day < 10){
    day = "0" + day
  }

  if (month < 10){
    month = "0" + month
  }

  var endDate_oneWeek = (year+"-"+month+"-"+day);

  return endDate_oneWeek;

};

function startDate_thisWeek()
{
  var myDateDay = new Date();
  var day = myDateDay.getDate();
  day = day-7;

  var myDateMonth = new Date();
  var month = myDateMonth.getMonth();
  var month = month+1;

  var myDateYear = new Date();
  var year = myDateYear.getFullYear();


  if (day < 10){
    day = "0" + day
  }

  if (month < 10){
    month = "0" + month
  }

  var startDate_oneWeek = (year+"-"+month+"-"+day);

  return startDate_oneWeek;

};

function endDate_oneyear()
{
  var myDateDay = new Date();
  var day = myDateDay.getDate();

  var myDateMonth = new Date();
  var month = myDateMonth.getMonth();
  var month = month+1;

  var myDateYear = new Date();
  var year = myDateYear.getFullYear();

  if (day < 10){
    day = "0" + day
  }

  if (month < 10){
    month = "0" + month
  }

  var endDate_oneyear = (year+"-"+month+"-"+day);
  return(endDate_oneyear);

};

function startDate_oneyear()
{
  var myDateDay = new Date();
  var day = myDateDay.getDate();

  var myDateMonth = new Date();
  var month = myDateMonth.getMonth();

  var myDateYear = new Date();
  var year = myDateYear.getFullYear()-1;

  if (day < 10){
    day = "0" + day
  }

  if (month < 10){
    month = "0" + month
  }

  var startDate_onehalfyear = (year+"-"+month+"-"+day);
  return(startDate_onehalfyear);

};

function endDate_onehalfyear()
{
  var myDateDay = new Date();
  var day = myDateDay.getDate();

  var myDateMonth = new Date();
  var month = myDateMonth.getMonth();
  var month = month+1;

  var myDateYear = new Date();
  var year = myDateYear.getFullYear();

  if (day < 10){
    day = "0" + day
  }

  if (month < 10){
    month = "0" + month
  }

  var endDate_onehalfyear = (year+"-"+month+"-"+day);

  return(endDate_onehalfyear);

};

function startDate_onehalfyear()
{
  var myDateDay = new Date();
  var day = myDateDay.getDate();


  var myDateMonth = new Date();
  var month = myDateMonth.getMonth();

  var myDateYear = new Date();
  var year = myDateYear.getFullYear();

  if (month = 1){
    month = 12-month;
    year = year-1;
  }
  else if (month = 2){
    month = 12-month;
    year = year-1;
  }
  else if (month = 3){
    month = 12-month;
    year = year-1;
  }
  else if (month = 4){
    month = 12-month;
    year = year-1;
  }
  else if (month = 5){
    month = 12-month;
    year = year-1;
  }
  else if (month = 6){
    month = 12-month;
    year = year-1;
  }

  if (day < 10){
    day = "0" + day
  }

  if (month < 10){
    month = "0" + month
  }

  var startDate_onehalfyear = (year+"-"+month+"-"+day);
  return(startDate_onehalfyear);

};

function endDate_oneMonth()
{
  var myDateDay = new Date();
  var day = myDateDay.getDate();

  var myDateMonth = new Date();
  var month = myDateMonth.getMonth();
  var month = month+1;

  var myDateYear = new Date();
  var year = myDateYear.getFullYear();

  if (day < 10){
    day = "0" + day
  }

  if (month < 10){
    month = "0" + month
  }

  var endDate_oneMonth = (year+"-"+month+"-"+day);
  return(endDate_oneMonth);

};

function startDate_oneMonth()
{
  var myDateDay = new Date();
  var day = myDateDay.getDate();


  var myDateMonth = new Date();
  var month = myDateMonth.getMonth();

  var myDateYear = new Date();
  var year = myDateYear.getFullYear();


  if (day < 10){
    day = "0" + day
  }

  if (month < 10){
    month = "0" + month
  }

  var startDate_oneMonth = (year+"-"+month+"-"+day);

  return(startDate_oneMonth);

};




//plot the chart with yahoo data
function getData(dataRange) {

	var dataArray = [
		['Date','Stock Value USD'],
	];

	var BASE_URL = 'https://query.yahooapis.com/v1/public/yql?q=';
	var yql_query;

	if (dataRange == "year") {

		yql_query = 'select * from yahoo.finance.historicaldata where symbol = "YHOO" and startDate =\"'+startDate_oneyear()+'\" and endDate =\"'+endDate_oneyear()+'\"';

	} else if (dataRange == "halfyear") {
		yql_query = 'select * from yahoo.finance.historicaldata where symbol = "YHOO" and startDate =\"'+startDate_onehalfyear()+'\" and endDate =\"'+endDate_onehalfyear()+'\"';
	} else if (dataRange == "thisMonth") {
		yql_query = 'select * from yahoo.finance.historicaldata where symbol = "YHOO" and startDate =\"'+startDate_oneMonth()+'\" and endDate =\"'+endDate_oneMonth()+'\"';
	} else if (dataRange == "thisWeek") {
		yql_query = 'select * from yahoo.finance.historicaldata where symbol = "YHOO" and startDate =\"'+startDate_thisWeek()+'\" and endDate =\"'+endDate_thisWeek()+'\"';
	};

	var yql_query_str = encodeURI(BASE_URL + yql_query);
	var query_str_final = yql_query_str + "&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";


	$.getJSON(query_str_final, function(data) {

		var stockArray = data.query.results.quote;

		for (var i = 0; i < stockArray.length; i++) {
			var currentObject = stockArray[i];
			// console.log(currentObject.Close);
			var pushedArray = [currentObject.Date, parseFloat(currentObject.Close)];
			dataArray[i+1] = pushedArray;
		}
		// console.log(dataArray);
	var chartData = google.visualization.arrayToDataTable(dataArray);

	var chart = new google.visualization.LineChart(document.getElementById('historic_chart_div'));
	chart.draw(chartData, options);

	});
};

function buttonPressed(buttonTitle) {

	data = getData(buttonTitle);
};


//end
