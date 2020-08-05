

// Building the queryURL to get current weather data
function buildCurrentQueryURL () {
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?";

    var queryParameters = {"appid": "f5e728105e3af40a0f53311e5edbb7c8"};
    queryParameters.q = $("#cityInput").val().trim();

    console.log(queryURL + $.param(queryParameters));
    return(queryURL + $.param(queryParameters))
}

// Building the queryURL to get forecasted weather data
function buildForecastQueryURL () {
    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?";
    
    var queryParameters = {"appid": "f5e728105e3af40a0f53311e5edbb7c8"};
    queryParameters.q = $("#cityInput").val().trim();

    console.log(queryURL + $.param(queryParameters));
    return(queryURL + $.param(queryParameters))
}



// Generating an array of the next five days after today
// Since the hottest temperature is usually at noon, I've appended 12:00:00
function generateFutureDates () {
    var todayDate = moment().format('YYYY-MM-DD');
    futureDays = new Array(5);
    for (i=0; i < futureDays.length; i++) {
        newDate = moment(todayDate).add(i+1,"d").format('YYYY-MM-DD') + " 12:00:00";
        futureDays[i] = newDate;
    }
    return futureDays;
}


function getCurrentWeather(weatherData) {

    // Getting today's date
    var todayDate = moment().format('YYYY-MM-DD');
 
    var tempK = weatherData.main.temp;
    tempF = ((tempK - 273.15) * 1.8) + 32;
    tempC = (tempK - 273.15);

    var humidPercent = weatherData.main.humidity;

    var windSpeed = weatherData.wind.speed;

    

    // Weather for Current Day and Time

    // Store all the data in localStorage

}

function getForecastWeather(weatherData) {

    // Getting the next five dates after today
    var futureDays = generateFutureDates();

    // console.log(futureDays);


    // Weather for future days and times
    
    // Store all the data in localStorage

}

    


$("#searchButton").on("click", function(event) {
    
    event.preventDefault();
    
    var queryURLcurrentWeather = buildCurrentQueryURL();
    var queryURLforecastWeather = buildForecastQueryURL();

    $.ajax({
        url: queryURLcurrentWeather,
        method: "GET"
    }).then(getCurrentWeather);

    $.ajax({
        url: queryURLforecastWeather,
        method: "GET"
    }).then(getForecastWeather);


    // Add a button with the city name
    // Append it to the search history list

    // var cityName = $("#cityInput").val().trim();

});


