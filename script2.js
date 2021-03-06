

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
        weatherIcon: weatherData.current.weather[0].icon,
        humidPercent: weatherData.current.humidity,
        windSpeed: weatherData.current.wind_speed,
        uvIndex: weatherData.current.uvi,
    });

    // FUTURE WEATHER
    // Looping through 5 days of future forecast
    for (var i = 0; i < 5; i++) {
        var tempK = weatherData.daily[i].temp.max;
        tempF = ((tempK - 273.15) * 1.8) + 32;
        tempF = tempF.toFixed(2);

        // These objects correspond to the forecasted weather for each day
        var futureWeather = {
            date: moment().add(i + 1, "d").format('YYYY-MM-DD'),
            temperature: tempF,
            weatherIcon: weatherData.daily[i].weather[0].icon,
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
function displayWeatherData() {

    // Getting the city name from the upper part of the screen
    // Setting is as a variable called cityInQuestion
    var cityInQuestion = document.getElementById("cityOutput").getAttribute("data-name");

    // Getting all the weather data from localStorage
    // Storing it in an array
    var weatherArrayCurrent = JSON.parse(localStorage.getItem("weatherDataStorage"));

    // Initializing two null variables for future uses
    var getWeatherData = null;
    var elementPosition = null;

    // Going through the weatherArrayCurrent with a for loop
    for (var i = 0; i < weatherArrayCurrent.length; i++) {

        // Using forEach to search through weatherArrayCurrent
        // if the city in the object corresponds to cityInQuestion, log that elementPosition
        weatherArrayCurrent[i].forEach((Obj) => {
            if (Obj.city === cityInQuestion) {
                elementPosition = i;
            }
        })
    }

    // Using the elementPosition determined earlier, use that as the index
    // Go into the weatherArrayCurrent at that index
    // Stored that information as getWeather Data
    var getWeatherData = weatherArrayCurrent[elementPosition];

    // CURRENT WEATHER

    // Setting the URL for the weather icon to be used
    weatherIconURL = "http://openweathermap.org/img/wn/" + getWeatherData[1].weatherIcon + "@2x.png"

    // Displaying all the current weather content on the page
    document.getElementById("date1").innerHTML = "Date: " + getWeatherData[1].date;
    document.getElementById("icon1").setAttribute("src", weatherIconURL);
    document.getElementById("icon1").setAttribute("alt", "Weather Icon");
    document.getElementById("temp1").innerHTML = "Temperature: " + getWeatherData[1].temperature + "&#176; F";
    document.getElementById("humid1").innerHTML = "Humidity: " + getWeatherData[1].humidPercent + " %"
    document.getElementById("wind1").innerHTML = "Wind Speed: " + getWeatherData[1].windSpeed + " mph"
    document.getElementById("uv1").innerHTML = "UV Index: " + getWeatherData[1].uvIndex

    // Setting the color visuals for the UV index based on its value
    var currentUVindex = getWeatherData[1].uvIndex;
    var uvIndexStyle = document.getElementById("currentUVindex")
    if (currentUVindex >= 11) {
        uvIndexStyle.setAttribute("class","extreme");
    } else if (currentUVindex < 11 && currentUVindex >= 8) {
        uvIndexStyle.setAttribute("class","veryHigh");
    } else if (currentUVindex < 8 && currentUVindex >= 6) {
        uvIndexStyle.setAttribute("class","high");
    } else if (currentUVindex < 6 && currentUVindex >= 3 ) {
        uvIndexStyle.setAttribute("class","moderate");
    } else if (currentUVindex < 3 && currentUVindex >=0) {
        uvIndexStyle.setAttribute("class","low");
    }

    // Future Weather
    for (var i = 2; i <= 6; i++) {

        // Setting variables to correspond to IDs used in the html
        var outputDate = "date" + i;
        var outputIcon = "icon" + i;
        var outputTemp = "temp" + i;
        var outputHumid = "humid" + i;

        // Setting the URL for the weather icon to be used
        weatherIconURL = "http://openweathermap.org/img/wn/" + getWeatherData[i].weatherIcon + "@2x.png"

        // Displaying all the forecasted weather content on the page
        document.getElementById(outputDate).innerHTML = getWeatherData[i].date
        document.getElementById(outputIcon).setAttribute("src", weatherIconURL);
        document.getElementById(outputIcon).setAttribute("alt", "Weather Icon");
        document.getElementById(outputTemp).innerHTML = getWeatherData[i].temperature + "&#176; F"
        document.getElementById(outputHumid).innerHTML = getWeatherData[i].humidPercent + " %"
    }
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

    // Getting the value that was in the input search bar
    var cityInput = $("#cityInput").val().trim()

    // Calling the setCityName function using that value
    setCityName(cityInput);

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

    // Getting the data-name attribute from this button (whatever button was clicked)
    var cityInput = $(this).attr("data-name");

    // Calling the setCityName function using that attribute
    setCityName(cityInput);

    // Run the displayWeatherData function
    displayWeatherData();
}


// Set the city name in the upper part of the screen
function setCityName(cityInput) {
    document.getElementById("cityOutput").innerHTML = cityInput;
    document.getElementById("cityOutput").setAttribute("data-name", cityInput);
}


// This function displays the weather of the last city searched
function lastSearchDisplayed() {

    // Initializes an empty array
    var weatherArrayCurrent = [];

    // if the weatherDataStorage in localStorage is null,
    // then do nothing
    if (localStorage.getItem("weatherDataStorage") === null) {
        return;
    }
    // else: this means that weatherDataStorage has values
    // Therefore, use getItem to get the weatherDataStorage array from localStorage
    // and make that array as the weatherArrayCurrent array
    else {
        weatherArrayCurrent = JSON.parse(localStorage.getItem("weatherDataStorage"));

        // Getting the length of the weatherArrayCurrent, and
        // using it to find the lastIndex, which corresponds to
        // the last city searched
        var arrayLength = weatherArrayCurrent.length
        var lastIndex = arrayLength-1;

        // Initializing an empty variable
        var cityOutput = "";
        
        // Going through the weatherArrayCurret at the lastIndex, which
        // corresponds to an array of objects. Use the forEach function to
        // go through each object and find the value corresponding to the
        // object key of city (Obj.city). This value is stored in the cityOutput variable
        weatherArrayCurrent[lastIndex].forEach((Obj) => {
            if (Obj.city) {
                cityOutput = Obj.city;
            }
        });
        
        // Setting the data-name attribute and
        // Displaying the name on the page
        document.getElementById("cityOutput").setAttribute("data-name", cityOutput);
        document.getElementById("cityOutput").innerHTML = cityOutput;
    }

    // Running the display weather function
    displayWeatherData();
}

// Running the lastSearchDisplayed automatically when the page loads
lastSearchDisplayed();