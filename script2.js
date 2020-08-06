
// Building the queryURL to get the geocoding data


function buildGeoCodeQueryURL() {
    var queryURL = "https://api.opencagedata.com/geocode/v1/json?"

    var queryParameters = { "key": "7b5d7173bf8d49dbb2bd074694d9d501" }

    queryParameters.q = $("#cityInput").val().trim()

    queryParameters.no_annotations = 1;

    console.log(queryURL + $.param(queryParameters));
    return (queryURL + $.param(queryParameters))
}

// GeoCoding Function
function geocoding() {

    var queryURLgeocoding = buildGeoCodeQueryURL();

    // Putting a return in front of the AJAX call
    // To return the results of the AJAX call as the return of the function geocoding()
    return ($.ajax({
        url: queryURLgeocoding,
        method: "GET"
    }).then(function (geocodeData) {
        var latitude = geocodeData.results[0].geometry.lat;
        var longitude = geocodeData.results[0].geometry.lng;
        coordinates = [latitude, longitude];
        return coordinates;
    }))
}

// Building the queryURL to get the weather data
// We make the function async
async function buildWeatherQueryURL() {

    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?";

    var queryParameters = { "appid": "f5e728105e3af40a0f53311e5edbb7c8" };

    // Awaiting the return from geocoding() prior to continuing the rest of the buildWeatherQueryURL function
    var coordinates = await geocoding();
    console.log(coordinates);

    var latitude = coordinates[0];
    var longitude = coordinates[1];

    queryParameters.lat = latitude;
    queryParameters.lon = longitude;
    // queryParameters.exclude = "minutely,hourly"

    console.log(queryURL + $.param(queryParameters));
    return (queryURL + $.param(queryParameters))
}


// Generating an array of the next five days after today
// Since the hottest temperature is usually at noon, I've appended 12:00:00
function generateFutureDates() {
    var todayDate = moment().format('YYYY-MM-DD');
    futureDays = new Array(5);
    for (i = 0; i < futureDays.length; i++) {
        newDate = moment(todayDate).add(i + 1, "d").format('YYYY-MM-DD') + " 12:00:00";
        futureDays[i] = newDate;
    }
    return futureDays;
}


function getWeather(weatherData) {

    // console.log(weatherData);

    // Getting today's date
    var todayDate = moment().format('YYYY-MM-DD');

    // CURRENT WEATHER


    var tempK = weatherData.current.temp;
    tempF = ((tempK - 273.15) * 1.8) + 32;
    tempC = (tempK - 273.15);

    var humidPercent = weatherData.current.humidity;

    var windSpeed = weatherData.current.wind_speed;

    var uvIndex = weatherData.current.uvi;

    console.log(tempF);
    console.log(humidPercent);
    console.log(windSpeed);
    console.log(uvIndex);


    // FUTURE WEATHER

    for (i = 0; i < 4; i++) {


        {
            humidPercent: weatherData.daily[i].humidity;

            windSpeed: weatherData.daily[i].wind_speed;

            uvIndex: weatherData.daily[i].uvi;
        }
        

    }


    // STORE EVERYTHING IN LOCAL STORAGE

}



// On button click, running an async function
$("#searchButton").on("click", async function (event) {

    event.preventDefault();

    // Awaiting the return from buildWeatherQueryURL() prior to continuing the rest of the function called on the button click
    // The .catch() afterwards is catching if there is an error in the return of the buildWeatherQueryURL() function (and console logging that error)
    var queryURLWeather = await buildWeatherQueryURL()
        .catch(function(error) {
            console.log(error)
        });

    $.ajax({
        url: queryURLWeather,
        method: "GET"
    }).then(getWeather)

    // Add a button with the city name
    // Append it to the search history list

    // var cityName = $("#cityInput").val().trim();

});


