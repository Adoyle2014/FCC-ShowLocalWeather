$(document).ready(function() {

    //API key for openweathermap.com  4c45bb0e6071b74cf43da0d4aa498377

    var lat = 0;
    var long = 0;

    //Get data on page load
    //getUserLocation();
    setDates();

    //Button watchers
    $("#locale-button").on('click', function(e) {
        e.preventDefault();
        var city = $("#city").val();
        getUserWeather(lat, long, city);
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




    //Helper methods
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


    function createDateStrings(fullDate, element) {
        var daysArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        var monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var day = daysArr[fullDate.getDay()];
        var ordinalInd = getOrd(day);
        var month = monthsArr[fullDate.getMonth()];
        var dayDate = fullDate.getDate();
        var year = fullDate.getFullYear();
        var dateStr = '<strong>' + day + " " + month + " " + dayDate + '<sup>' + ordinalInd + '</sup></strong>';
        $('#' + element).append(dateStr);
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



    //Display the weather data
    function parseWeather(response) {
        console.log(response);


    }

    //Get the data
    function getUserWeather(lat, long, city) {
        console.log(city);
        var apiKey = "4c45bb0e6071b74cf43da0d4aa498377";

        apiCall(lat, long, city, apiKey);
        console.log(city);
        function apiCall(lat, long) {
            if(city) {

                $.ajax({
                    url: "http://api.openweathermap.org/data/2.5/find?",

                    data: {
                        q: city,
                        type: "accurate",
                        APPID: apiKey
                    },
                    success: function (response) {
                        parseWeather(response);
                    }
                });

            } else {
                $.ajax({
                    url: "http://api.openweathermap.org/data/2.5/weather?",

                    data: {
                        lon: long,
                        lat: lat,
                        APPID: apiKey
                    },
                    success: function (response) {
                        parseWeather(response);
                    }
                });
            }
        }
    }

    function getUserLocation() {

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError);
        } else {
            alert("Geolocation is not supported. Please update your browser");
        }
    }

    function showPosition(position) {
        currLat = position.coords.latitude;
        currLong = position.coords.longitude;

        getUserWeather(currLat, currLong);

    }

    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("User denied the request for Geolocation.");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("Location information is unavailable.");
                break;
            case error.TIMEOUT:
                alert("The request to get user location timed out.");
                break;
            case error.UNKNOWN_ERROR:
                alert("An unknown error occurred.");
                break;
        }
    }

});