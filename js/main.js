$(document).ready(function() {

    //// Page load function ////
    getUserLocation();
    setDates();
    getWeatherOnLoad();





    //// Button watchers ////

    /// Next feature ///
   /* $("#locale-button").on('click', function(e) {
        e.preventDefault();
        var userInput = $("#city").val();
        console.log(userInput);
        getWeatherFromUser(userInput);
        $(".localLoc").fadeOut('fast', 'swing', function() {
            $(".userLoc").fadeIn('slow');
        })
    });*/

    $("#btn-current").on('click', function(e) {
        e.preventDefault();
        $("#btn-forecast").removeClass("active");
        $("#btn-current").addClass("active");
        $("#forecast").fadeOut('fast', 'swing', function() {
            $("#currentConditions").fadeIn('slow');
        })
    });

    $("#btn-forecast").on('click', function(e) {
        e.preventDefault();
        $("#btn-current").removeClass("active");
        $("#btn-forecast").addClass("active");
        $("#currentConditions").fadeOut('fast', 'swing', function() {
            $("#forecast").fadeIn('slow');
        })
    });

    $("#fehren").on('click', function(e) {
        e.preventDefault();
        $("#celsius").removeClass("active");
        $("#fehren").addClass("active");
        $(".celsius").fadeOut('fast', 'swing', function() {
            $(".fahrenheit").fadeIn('slow');
        })
    });

    $("#celsius").on('click', function(e) {
        e.preventDefault();
        $("#fehren").removeClass("active");
        $("#celsius").addClass("active");
        $(".fahrenheit").fadeOut('fast', 'swing', function() {
            $(".celsius").fadeIn('slow');
        });

    });




    //// Helper methods ////
    function convertToMetric(temp) {
        var currentTempMetric = (Math.round(((temp - 32)*(5/9))));
        return currentTempMetric;
    }


    function setDates() {
        var today = new Date();
        createDateStrings(today, "todays-date");
    }

    function getOrd(day) {
        var str = day.toString();
        var lastNum = str.substring(str.length - 1, str.length);
        if(lastNum === 1) {
            return "st";
        } else if(lastNum === 2) {
            return "nd";
        } else if (lastNum === 3) {
            return "rd";
        } else {
            return "th";
        }
    }

    function getCountryNames(countryCode) {
        $.getJSON('http://anyorigin.com/dev/get?url=http%3A//country.io/names.json&callback=?', function(data){
            return (data.contents[countryCode]);
        });
    }

    function getUserLocation() {
        $.get("http://ipinfo.io", function(response) {
            createLocationString(response.city, response.region, response.country);
            if(response.country === "US") {
                var units = "imperial";
            } else {
                var  units = "metric";
            }
            var location = response.loc;
            var lat = location.split(',')[0];
            var lon = location.split(',')[1];
            getWeatherOnLoad(lon, lat, units);

        }, "jsonp");

    }

    function convertUTC(timestamp) {
        var date = new Date(timestamp*1000);
        var hours = date.getHours();
        var minutes = "0" + date.getMinutes();

        return (hours + ':' + minutes.substr(-2));
    }

    function getImages(list, idCode, sunset, sunrise) {

        function expand(obj) {
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length; ++i) {
                var key = keys[i],
                    subkeys = key.split(/,\s?/),
                    target = obj[key];
                delete obj[key];
                subkeys.forEach(function(key) { obj[key] = target; })
            }
            return obj;
        }

        var weatherConditionBackgroundDay = expand({
            "800, 801, 802, 951": {
                url : "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/sunny.jpg"},
            "803, 804": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/cloudy-large.jpg"},
            "781, 900, 901, 902, , 906, 960, 961, 962": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/storm-large.jpg"},
            "300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/rain-large.jpg"},
            "600, 601, 602, 611, 612, 615, 616, 620, 621, 622": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/snow-large.jpg"},
            "701, 711, 721, 731, 741, 751, 761, 762, 771": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/mist-large.jpg"},
            "200, 201, 202, 210, 211, 212, 221, 230, 231, 232": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/lightning-large.jpg"},
            "905, 954, 955, 956, 957, 958, 959": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/wind-large.jpg"}
        });

        var weatherConditionBackgroundNight = expand({
            "800, 801, 802, 951": {
                url : "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/night-clear.jpg"},
            "803, 804": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/cloudy-night.jpg"},
            "781, 900, 901, 902, , 906, 960, 961, 962": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/night-stormy.jpg"},
            "300, 301, 302, 310, 311, 312, 313, 314, 321, 500, 501, 502, 503, 504, 511, 520, 521, 522, 531": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/night-rain.jpg"},
            "600, 601, 602, 611, 612, 615, 616, 620, 621, 622": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/snow-night.jpg"},
            "701, 711, 721, 731, 741, 751, 761, 762, 771": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/night-foggy.jpg"},
            "200, 201, 202, 210, 211, 212, 221, 230, 231, 232": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/night-stormy.jpg"},
            "905, 954, 955, 956, 957, 958, 959": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/night-windy.jpg"}
        });

        var weatherConditionIconDay = expand({
            "904": {
                url : "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/hot.png"},
            "903": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/cold.png"},
            "771, 781, 901, 900, 902, 905, 956, 957, 958, 959": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/windy.png"},
            "800, 801": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/sunny.png"},
            "802": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/partly-cloudy.png"},
            "803": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/mostly-cloudy.png"},
            "701, 711, 721, 731, 741, 751, 761, 762, 804": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/cloudy.png"},
            "906": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/hail.png"},
            "600, 601, 602, 611, 612, 615, 616, 620, 621, 622": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/snow.png"},
            "300, 301, 302, 310, 311, 312, 313, 314, 321": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/lite-rain_1.png"},
            "500, 501, 502, 503, 504, 511, 520, 521, 522, 531": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/lite-rain.png"},
            "200, 201, 202, 210, 211, 212, 221, 230, 231, 232": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/storm.png"}
        });

        var weatherConditionIconNight = expand({
            "904": {
                url : "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/hot.png"},
            "903": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/cold.png"},
            "771, 781, 901, 900, 902, 905, 956, 957, 958, 959": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/windy-night.png"},
            "800, 801": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/clear-night.png"},
            "802": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/partly-cloudy-night.png"},
            "803": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/mostly-cloudy-night.png"},
            "701, 711, 721, 731, 741, 751, 761, 762, 804": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/mostly-cloudy-night.png"},
            "906": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/hail.png"},
            "600, 601, 602, 611, 612, 615, 616, 620, 621, 622": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/snow.png"},
            "300, 301, 302, 310, 311, 312, 313, 314, 321": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/lite-rain-night.png"},
            "500, 501, 502, 503, 504, 511, 520, 521, 522, 531": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/lite-rain-night.png"},
            "200, 201, 202, 210, 211, 212, 221, 230, 231, 232": {
                url: "http://i160.photobucket.com/albums/t180/dominofoe/FCC-Weather%20App/storm.png"}
        });

        var now = convertUTC(new Date());
        now = (now + (4*60*60*1000));

        if(list === "background") {
            if(now > sunset && now < sunrise) {
                return weatherConditionBackgroundNight[idCode].url;

            } else {
                return weatherConditionBackgroundDay[idCode].url;
            }
        } else {
            if (now > sunset && now < sunrise) {
                return weatherConditionIconNight[idCode].url;
            } else {
                return weatherConditionIconDay[idCode].url;
            }
        }
    }

    function convertWindDirection(degrees) {
        var val = Math.floor((degrees / 22.5) + 0.5);
        var arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[(val % 16)];
    }




    //// HTML content functions ////
    function createDateStrings(fullDate, element) {
        var daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var day = daysArr[fullDate.getDay()];
        var ordinalInd = getOrd(day);
        var month = monthsArr[fullDate.getMonth()];
        var dayDate = fullDate.getDate();
        var dateStr = '<strong>' + day + " " + month + " " + dayDate + '<sup>' + ordinalInd + '</sup></strong>';
        $('#' + element).append(dateStr);
    }

    function createLocationString(city, region, country) {
        if(country === "US" || country === "CA") {
            $(".localLoc").html(city + ", " + region);
        } else {
            $("#locationUser").html(city + ", " + getCountryNames(country));
        }
    }

    function createWeatherDataStrings(data) {
        /// Get needed data to variables
        var humidity = data.main.humidity;
        var pressure = data.main.pressure;
        var temp = Math.round(data.main.temp);
        var windDir = convertWindDirection(data.wind.deg);
        var windSpeed = data.wind.speed;
        var sunrise = convertUTC(data.sys.sunrise);
        var sunset = convertUTC(data.sys.sunset);
        var conditions = (data.weather[0].description);
        var backgroundUrl = getImages("background", data.weather[0].id, sunset, sunrise);
        var conditionsIconUrl = getImages("conditions", data.weather[0].id, sunset, sunrise);
        var tempCelsius = convertToMetric(data.main.temp);


        //// Current Conditions
        $("#currentTempF").html(temp + '<small>&deg;F</small>');
        $("#windSpeed").html(windSpeed + '<small>mph</small>');
        $("#windDir").html(windDir);
        $("#pressure").html(pressure + '<small>mb</small>');
        $("#humidity").html(humidity + '<small>%</small>');
        $("#rise").html(sunrise + ' <small>am</small>');
        $("#set").html(sunset + ' <small>pm</small>');
        $("#conditions").html(conditions);
        $("body").css('background-image', 'url(' + backgroundUrl + ')');
        $("#conditions-icon").attr('src', conditionsIconUrl);
        $("#currentTempC").html(tempCelsius + '<small>&deg;C</small>');

    }

    //// Forecast
    function createForecastDataStrings(data) {
        // Tomorrow
        var tomorrow = new Date((data.list[1].dt)*1000);
        createDateStrings(tomorrow, "tomorrow");
        var tomorrowDesc = data.list[1].weather[0].description;
        $("#tomorrowDesc").html(tomorrowDesc);
        var tomorrowMinF = Math.round(data.list[1].temp.min);
        $("#tomorrowMinF").html(tomorrowMinF + '<small class="fahrenheit">&deg;F</small>');
        var tomorrowMaxF = Math.round(data.list[1].temp.max);
        $("#tomorrowMaxF").html(tomorrowMaxF + '<small class="fahrenheit">&deg;F</small>');
        var tomorrowIconUrl = getImages("conditions", data.list[1].weather[0].id);
        $("#tomorrowIconUrl").attr('src', tomorrowIconUrl);
        var tomorrowMinC = convertToMetric(data.list[1].temp.min);
        $("#tomorrowMinC").html(tomorrowMinC + '<small class="celsius">&deg;C</small>');
        var tomorrowMaxC = convertToMetric(data.list[1].temp.max);
        $("#tomorrowMaxC").html(tomorrowMaxC + '<small class="celsius">&deg;C</small>');

        // Tomorrow plus 1
        var tomorrowPlus1 = new Date((data.list[2].dt)*1000);
        createDateStrings(tomorrowPlus1, "tomorrowPlus1");
        var tomorrowPlus1Desc = data.list[2].weather[0].description;
        $("#tomorrowPlus1Desc").html(tomorrowPlus1Desc);
        var tomorrowPlus1MinF = Math.round(data.list[2].temp.min);
        $("#tomorrowPlus1MinF").html(tomorrowPlus1MinF + '<small class="fahrenheit">&deg;F</small>');
        var tomorrowPlus1MaxF = Math.round(data.list[2].temp.max);
        $("#tomorrowPlus1MaxF").html(tomorrowPlus1MaxF + '<small class="fahrenheit">&deg;F</small>');
        var tomorrowPlus1IconUrl = getImages("conditions", data.list[2].weather[0].id);
        $("#tomorrowPlus1IconUrl").attr('src', tomorrowPlus1IconUrl);
        var tomorrowPlus1MinC = convertToMetric(data.list[2].temp.min);
        $("#tomorrowPlus1MinC").html(tomorrowPlus1MinC + '<small class="celsius">&deg;C</small>');
        var tomorrowPlus1MaxC = convertToMetric(data.list[2].temp.max);
        $("#tomorrowPlus1MaxC").html(tomorrowPlus1MaxC + '<small class="celsius">&deg;C</small>');

        //Tomorrow plus 2
        var tomorrowPlus2 = new Date((data.list[3].dt)*1000);
        createDateStrings(tomorrowPlus2, "tomorrowPlus2");
        var tomorrowPlus2Desc = data.list[3].weather[0].description;
        $("#tomorrowPlus2Desc").html(tomorrowPlus2Desc);
        var tomorrowPlus2MinF = Math.round(data.list[3].temp.min);
        $("#tomorrowPlus2MinF").html(tomorrowPlus2MinF + '<small class="fahrenheit">&deg;F</small>');
        var tomorrowPlus2MaxF = Math.round(data.list[3].temp.max);
        $("#tomorrowPlus2MaxF").html(tomorrowPlus2MaxF + '<small class="fahrenheit">&deg;F</small>');
        var tomorrowPlus2IconUrl = getImages("conditions", data.list[3].weather[0].id);
        $("#tomorrowPlus2IconUrl").attr('src', tomorrowPlus2IconUrl);
        var tomorrowPlus2MinC = convertToMetric(data.list[3].temp.min);
        $("#tomorrowPlus2MinC").html(tomorrowPlus2MinC + '<small class="celsius">&deg;C</small>');
        var tomorrowPlus2MaxC = convertToMetric(data.list[3].temp.max);
        $("#tomorrowPlus2MaxC").html(tomorrowPlus2MaxC + '<small class="celsius">&deg;C</small>');
    }




    //// Get weather  data ////
    function getWeatherFromUser(searchTerm) {

        var apiKey = "4c45bb0e6071b74cf43da0d4aa498377";
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/find?",

            data: {
                q: searchTerm,
                type: "accurate",
                APPID: apiKey
            },
            success: function (response) {
                console.log(response);
                createWeatherDataStrings(response);

            }
        });
    }

    function getWeatherOnLoad(lon, lat, units) {

        var apiKey = "4c45bb0e6071b74cf43da0d4aa498377";
        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/weather?",

            data: {
                units: units,
                lon: lon,
                lat: lat,

                APPID: apiKey
            },
            success: function (response) {
                createWeatherDataStrings(response);
            }
        });


        $.ajax({
            url: "http://api.openweathermap.org/data/2.5/forecast/daily?",

            data: {
                units: units,
                lon: lon,
                lat: lat,

                APPID: apiKey
            },
            success: function (forecastResponse) {
                createForecastDataStrings(forecastResponse);
            }
        });
    }
});