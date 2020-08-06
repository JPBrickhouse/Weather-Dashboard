
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

// Getting the weather data
function getWeather(weatherData) {

    // Initializing an empty array
    var weatherArray = [{"City": "Chicago"}];

    // CURRENT WEATHER
    var tempK = weatherData.current.temp;
    tempF = ((tempK - 273.15) * 1.8) + 32;
    tempF = tempF.toFixed(2);

    // Pushing an object into the empty array
    weatherArray.push({
        date: moment().format('YYYY-MM-DD'),
        temperature: tempF,
        humidPercent: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_speed,
        uvIndex: weatherData.current.uvi,
    });

    // FUTURE WEATHER
    for (i = 0; i < 5; i++) {
        var tempK = weatherData.daily[i].temp.max;
        tempF = ((tempK - 273.15) * 1.8) + 32;
        tempF = tempF.toFixed(2);

        // Pushing objects into the empty array for each day of data
        var futureWeather = {
            date: moment().add(i+1,"d").format('YYYY-MM-DD'),
            temperature: tempF,
            humidPercent: weatherData.daily[i].humidity,
            windSpeed: weatherData.daily[i].wind_speed,
            uvIndex: weatherData.daily[i].uvi,
        }

        weatherArray.push(futureWeather);
    }
    console.log(weatherArray);
    

    // STORING IT IN LOCAL STORAGE FOR RECALL
    // (Recall it using the displayWeather function)


}



// DISPLAYING THE WEATHER FUNCTION

// Need to recall the object from local storage

// Based on what the city name is in the upper part of the screen
// Display that data in the html











// On button click, running an async function
$("#searchButton").on("click", async function (event) {

    event.preventDefault();

    // Generating the queryURLWeather for use in the AJAX call
    // Awaiting the return from buildWeatherQueryURL() prior to continuing the rest of the function called on the button click
    // The .catch() afterwards is catching if there is an error in the return of the buildWeatherQueryURL() function (and console logging that error)
    var queryURLWeather = await buildWeatherQueryURL()
    .catch(function(error) {
        console.log(error)
        }
    );

    // AJAX call to get the weather data
    $.ajax({
        url: queryURLWeather,
        method: "GET"
    }).then(getWeather)




    // Add a button with the city name
    // Append it to the search history list
    // var cityName = $("#cityInput").val().trim();




    // Set the city name in the upper part of the screen
    // Run the displayWeather function
    // (That displayWeather function functions based on what the city name is in the upper part of the screen

});




// Event listener for all the lower buttons in the search history list
// When a button is clicked, look for its ID
// Use that ID to set the city name in the upper part of the screen
// Then run the displayWeather function
// (That displayWeather function functions based on what the city name is in the upper part of the screen