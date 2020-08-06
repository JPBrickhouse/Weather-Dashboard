
// Building the queryURL to get the geocoding data
function buildGeoCodeQueryURL() {
    var queryURL = "https://api.opencagedata.com/geocode/v1/json?"

    var queryParameters = { "key": "7b5d7173bf8d49dbb2bd074694d9d501" }

    queryParameters.q = $("#cityInput").val().trim()

    queryParameters.no_annotations = 1;

    console.log(queryURL + $.param(queryParameters));
    return (queryURL + $.param(queryParameters))
}

// GeoCoding Function to get the latitude and longitude
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

    // Initializing an array with an object in the first index
    // Corresponding to the value of #cityInput
    var weatherArray = [{ "city": $("#cityInput").val().trim() }];

    // CURRENT WEATHER
    var tempK = weatherData.current.temp;
    tempF = ((tempK - 273.15) * 1.8) + 32;
    tempF = tempF.toFixed(2);

    // Pushing an object into the empty array
    // This object corresopnds to the current weather
    weatherArray.push({
        date: moment().format('YYYY-MM-DD'),
        temperature: tempF,
        humidPercent: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_speed,
        uvIndex: weatherData.current.uvi,
    });

    // FUTURE WEATHER
    // Looping through 5 days of future forecast
    for (i = 0; i < 5; i++) {
        var tempK = weatherData.daily[i].temp.max;
        tempF = ((tempK - 273.15) * 1.8) + 32;
        tempF = tempF.toFixed(2);

        // These objects correspond to the forecasted weather for each day
        var futureWeather = {
            date: moment().add(i + 1, "d").format('YYYY-MM-DD'),
            temperature: tempF,
            humidPercent: weatherData.daily[i].humidity,
            windSpeed: weatherData.daily[i].wind_speed,
            uvIndex: weatherData.daily[i].uvi,
        }
        // Pushing objects into the array for each day of data
        weatherArray.push(futureWeather);
    }

    // STORING IT IN LOCAL STORAGE FOR RECALL

    // Initializes an empty array
    var weatherArrayCurrent = [];

    // if the weatherDataStorage in localStorage is null,
    // then use the empty array initialized earlier
    if (localStorage.getItem("weatherDataStorage") === null) {
        weatherArrayCurrent;
    }
    // else: this means that weatherDataStorage has values
    // Therefore, use getItem to get the weatherDataStorage array from localStorage
    // and make that array as the weatherArrayCurrent array
    else {
        weatherArrayCurrent = JSON.parse(localStorage.getItem("weatherDataStorage"));
    }

    // pushes the weatherArray array into the weatherArrayCurrent array
    weatherArrayCurrent.push(weatherArray);

    // sets that overall array as the new version of the array in localStorage
    localStorage.setItem("weatherDataStorage", JSON.stringify(weatherArrayCurrent));
}


// DISPLAYING THE WEATHER FUNCTION
// Based on what the city name is in the upper part of the screen
// Display that data in the html
// Need to recall the object from local storage
function displayWeatherData() {

    var cityInQuestion = document.getElementById("cityOutput").getAttribute("data-name");

    var weatherArrayCurrent = JSON.parse(localStorage.getItem("weatherDataStorage"));

    var getWeatherData = null;

    var elementPosition = null;

    for (i = 0; i < weatherArrayCurrent.length; i++) {

        weatherArrayCurrent[i].forEach((Obj) => {
            if (Obj.city === cityInQuestion) {
                elementPosition=i;
                console.log(elementPosition);
            }
        })
    }

    var getWeatherData = weatherArrayCurrent[elementPosition];

    // Current Weather
    console.log(getWeatherData[1].temperature);
    console.log(getWeatherData[1].humidPercent);
    console.log(getWeatherData[1].windSpeed);
    console.log(getWeatherData[1].uvIndex);

    // Future Weather






}









// On button click, running an async function
$("#searchButton").on("click", async function (event) {

    event.preventDefault();

    // Generating the queryURLWeather for use in the AJAX call
    // Awaiting the return from buildWeatherQueryURL() prior to continuing the rest of the function called on the button click
    // The .catch() afterwards is catching if there is an error in the return of the buildWeatherQueryURL() function (and console logging that error)
    var queryURLWeather = await buildWeatherQueryURL()
        .catch(function (error) {
            console.log(error)
        }
        );

    // AJAX call to get the weather data
    await $.ajax({
        url: queryURLWeather,
        method: "GET"
    }).then(getWeather)

    // Set the city name in the upper part of the screen
    var cityInput = $("#cityInput").val().trim()
    document.getElementById("cityOutput").innerHTML = cityInput;
    document.getElementById("cityOutput").setAttribute("data-name", cityInput);

    // Running the renderButtons function
    renderButtons();

    // Run the displayWeatherData function
    displayWeatherData();
});


// Add a button with the city name to the search history
function renderButtons() {

    // Getting the city name
    var cityName = $("#cityInput").val().trim();

    // Creating an div element row
    var historyButtonDiv = $("<div class='row'>");

    // Creating a div element column
    var historyColumn = $("<div class='col md-12'>")

    // Generating the button and adding classes, attributes, and text
    var searchHistoryButton = $("<button>");
    searchHistoryButton.addClass("btn btn-outline-dark btn-block historyButton");
    searchHistoryButton.attr("type", "button")
    searchHistoryButton.attr("data-name", cityName);
    searchHistoryButton.text(cityName);

    // Appending the button to the column element
    historyColumn.append(searchHistoryButton)

    // Appending the column element to the row
    historyButtonDiv.append(historyColumn);

    // Prepending the row element above any previous rows
    // (Located wherever we find the #searchHistory ID div)
    $("#searchHistory").prepend(historyButtonDiv);
}


// Event listener for all the buttons in the search history list
// Looking for buttons with the class historyButton
// When the button is clicked, run the setButtonFetchData function
$(document).on("click", ".historyButton", setCityFetchData);

function setCityFetchData(event) {

    event.preventDefault();

    // Getting the data-name attribute from the this button (whatever button was clicked)
    var cityInput = $(this).attr("data-name");

    // Set the city name in the upper part of the screen
    document.getElementById("cityOutput").innerHTML = cityInput;

    // Run the displayWeatherData function
    displayWeatherData();
}

