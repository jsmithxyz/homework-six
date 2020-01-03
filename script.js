$(document).ready(function() {
    
    var cities = [];

    var cityBtn = $("<button>");

    var API_KEY = "e0e304094102eac6a91aae0440b16040";

    renderCitiesOnRefresh();

    function currentConditions(city) {
       var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&APPID=" + API_KEY;

        $.ajax ({
            url: queryURL,
            method: "GET",
        }).then(function(response){

            var cityName = $("<h1>");
            cityName.addClass("headerStyle");
            cityName.text(response.name);

            var dateNow = $("<h1>");
            cityName.addClass("headerStyle");
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
            cityDateIcon.addClass("conditionsHeader");

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
            $("#fiveDayBox").empty();
            var counter = 1;

            for(var i = 3; i < response.list.length; i+=8) {
                 
                var card = $("<div>");
                card.addClass("forecastCard");

                var date = $("<p>");
                date.text(moment(moment(response.list[i].dt_txt).add(counter, 'days')).format('L'));
                date.appendTo(card);

                var symbol = $("<img>");
                symbol.addClass("forecastIcons");
                symbol.attr("src", "http://openweathermap.org/img/wn/"+response.list[i].weather[0].icon+"@2x.png");
                symbol.appendTo(card);

                var kelvin = response.list[i].main.temp_max;
                var fahrenheit = (kelvin - 273.15) * (9/5) + 32;
                var temperature = $("<p>");
                temperature.text("Temperature: " + fahrenheit.toFixed(1) + "°F");
                temperature.appendTo(card);

                var humidity = $("<p>");
                humidity.text("Humidity: " + response.list[i].main.humidity);
                humidity.appendTo(card);


                $("#fiveDayBox").append(card);
            }
    
    });

    }
    
    $("#searchBtn").on("click", function(event){
        event.preventDefault();
        $(".conditions").empty();
        var city = $("#inputCity").val().trim();
        cities.push(city);

        currentConditions(city);
        fiveDay(city);

        localStorage.setItem("citiesSearched", JSON.stringify(cities));
        
        renderCities();


    })

    $("#searchArea").on("click", function(event){
        if(event.target.matches("button.cityButton")) {
            event.preventDefault();
            $(".conditions").empty();

            var city = $(event.target).text();
            for(var i = 0; i < cities.length; i++) {
                if (city === cities[i]) {
                    currentConditions(city);
                    fiveDay(city);
                    return;
                }
            }
            cities.push(city);

            localStorage.setItem("citiesSearched", JSON.stringify(cities));

            
      }});


    
    function renderCities() {

        $(".btnArea").empty();

        for (var i = 0; i < cities.length; i++) {
          var a = $("<button>");
          a.addClass("cityButton");
          a.attr("data-name", cities[i]);
          a.text(cities[i]);

          $(".btnArea").append(a);

          localStorage.setItem("citiesSearched", JSON.stringify(cities));

        }
      }

      function renderCitiesOnRefresh() {
        var retrievedCities = localStorage.getItem("citiesSearched");
        var citiesReturned = JSON.parse(retrievedCities);
        if (citiesReturned != null) {
        var cities = citiesReturned;
        }
        else {
            return;
        }

        $(".btnArea").empty();

          var a = $("<button>");
          a.addClass("cityButton");
          a.attr("data-name", cities[cities.length - 1]);
          a.text(cities[cities.length - 1]);

          $(".btnArea").append(a);


        currentConditions(cities[cities.length - 1]);
        fiveDay(cities[cities.length - 1]);

        cities = [cities[cities.length - 1]];

        localStorage.setItem("citiesSearched", JSON.stringify(cities));

        return cities;
        
      }


})

