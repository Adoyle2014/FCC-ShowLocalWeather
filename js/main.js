$(document).ready(function() {

    //// Page load function ////
    getUserLocation();
    setDates();
    getWeatherOnLoad();





    //// Button watchers ////
    $("#locale-button").on('click', function(e) {
        e.preventDefault();
        var userInput = $("#city").val();
        getWeatherFromUser(userInput);
    });

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
        $(".celsius-setting").fadeOut('fast', 'swing', function() {
            $(".fehren-setting").fadeIn('slow');
        })
    });

    $("#celsius").on('click', function(e) {
        e.preventDefault();
        $("#fehren").removeClass("active");
        $("#celsius").addClass("active");
        $(".fehren-setting").fadeOut('fast', 'swing', function() {
            $(".celsius-setting").fadeIn('slow');
        })
    });




    //// Helper methods ////
    function setDates() {
        Date.prototype.addDays = function(days) {
            this.setDate(this.getDate() + parseInt(days));
            return this;
        }
        var today = new Date();
        createDateStrings(today, "todays-date");
        var todayPlus1 = today.addDays(1);
        createDateStrings(todayPlus1, "tomorrow");
        var todayPlus2 = today.addDays(2);
        createDateStrings(todayPlus2, "tomorrowPlus1");
        var todayPlus3 = today.addDays(3);
        createDateStrings(todayPlus3, "tomorrowPlus2");
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
        var seconds = "0" + date.getSeconds();

        return (hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2));
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
            $("#location").html(city + ", " + region);
        } else {
            $("#location").html(city + ", " + getCountryNames(country));
        }
    }

    function createWeatherDataStrings(data) {
        var humidity = data.main.humidity;
        var pressure = data.main.pressure;
        var temp = data.main.temp;
        var temp_max = data.main.temp_max;
        var temp_min = data.main.temp_min;
        var sunrise = convertUTC(data.sys.sunrise);
        var sunset = convertUTC(data.sys.sunset);

        $("#currentTemp").html(temp + '<small class="celsius-setting">&deg;C</small><small class="fehren-setting">&deg;F</small>');
        $("#tempMin").html(temp_min + '<small class="celsius-setting">&deg;C</small><small class="fehren-setting">&deg;F</small>');
        $("#tempMax").html(temp_max + '<small class="celsius-setting">&deg;C</small><small class="fehren-setting">&deg;F</small>');
        $("#pressure").html(pressure + '<small>mb</small>');
        $("#humidity").html(humidity + '<small>%</small>');
        $("#rise").html(sunrise + ' <small>am</small>');
        $("#set").html(sunset + ' <small>pm</small>');
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
    }
});