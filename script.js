



function buildQueryURL () {

    var queryURL = "https://api.openweathermap.org/data/2.5/forecast?";

    var queryParameters = {"appid": "f5e728105e3af40a0f53311e5edbb7c8"};

    queryParameters.q = "Chicago";

    console.log(queryURL + $.param(queryParameters));
    return(queryURL + $.param(queryParameters))
}

buildQueryURL();





// function (event) {

//     event.preventDefault();

    

// }

