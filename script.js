$(document).ready(function() {

    var API_KEY = "e0e304094102eac6a91aae0440b16040";

    function currentConditions(city) {
       var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + API_KEY;

        $.ajax ({
            url: queryURL,
            method: "GET",
        }).then(function(response){

            var cityName = $("<h2>");
            cityName.text(response.name);

            var dateNow = $("<h2>");
            dateNow.text(moment().format('L'));

            var weatherIcon = $("<img>");
            weatherIcon.attr("src", "http://openweathermap.org/img/wn/"+response.weather[0].icon+"@2x.png");

            var temperature = $("<div>");
            var kelvin = response.main.temp;
            var fahrenheit = (kelvin - 273.15) * (9/5) + 32;
            temperature.text("Temp: "+ fahrenheit.toFixed(1) + "°F");

            var humidity = $("<div>");
            humidity.text("Humidity: " + response.main.humidity + "%"); 

            var windSpeed = $("<div>");
            windSpeed.text("Wind Speed: " + response.wind.speed + " MPH");

            var cityDateIcon = $("<div>")

            cityName.appendTo(cityDateIcon);
            dateNow.appendTo(cityDateIcon);
            weatherIcon.appendTo(cityDateIcon);
            cityDateIcon.appendTo(".conditions");
            temperature.appendTo(".conditions");
            humidity.appendTo(".conditions");
            windSpeed.appendTo(".conditions");

            var lon = response.coord.lon;
            var lat = response.coord.lat;
            
            uvIndex(lat, lon); 

        });
        
    }
    
    function uvIndex(lat, lon) {
        var queryURL = "http://api.openweathermap.org/data/2.5/uvi?appid="+ API_KEY +"&lat="+ lat +"&lon="+ lon;
 
         $.ajax ({
             url: queryURL,
             method: "GET",
         }).then(function(response){
             console.log(response);
             var uv = $("<div>");
             uv.text("UV Index: "+ response.value);
             uv.appendTo(".conditions");
         });
 
     }

     function fiveDay(city) {
         var queryURL = "http://api.openweathermap.org/data/2.5/forecast?q="+ city + "&appid="+ API_KEY;
 
         $.ajax ({
             url: queryURL,
             method: "GET",
         }).then(function(response){
            console.log(response);

        })
    }
    
    $("#searchBtn").on("click", function(){
        event.preventDefault();
        $(".conditions").empty();
        var city = $("#inputCity").val();
        currentConditions(city);
        fiveDay(city);
    })
     
})
