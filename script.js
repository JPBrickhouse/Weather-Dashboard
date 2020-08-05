



function buildQueryURL () {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?";

    var queryParameters = {"appid": "f5e728105e3af40a0f53311e5edbb7c8"};

    queryParameters.q = $("#cityInput").val().trim();

    console.log(queryURL + $.param(queryParameters));
    return(queryURL + $.param(queryParameters))
}




function generateFutureDates () {
    // Generating an array of the next five days after today
    // Since the hottest temperature is usually at noon, I've appended 12:00:00
    var todayDate = moment().format('YYYY-MM-DD');
    futureDays = new Array(5);
    for (i=0; i < futureDays.length; i++) {
        newDate = moment(todayDate).add(i+1,"d").format('YYYY-MM-DD') + " 12:00:00";
        futureDays[i] = newDate;
    }
    return futureDays;
}


function getWeatherData() {

    // Getting today's date
    var todayDate = moment().format('YYYY-MM-DD');
    
    // Getting the next five dates after today
    var futureDays = generateFutureDates();
    
    console.log(todayDate);
    console.log(futureDays);
    
    
}


$("#searchButton").on("click", function(event) {
    
    event.preventDefault();
    
    var queryURL = buildQueryURL();

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(getWeatherData);
});


