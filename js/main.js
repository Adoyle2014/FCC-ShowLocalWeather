$(document).ready(function() {

    //API key for openweathermap.com  4c45bb0e6071b74cf43da0d4aa498377

    showLocalWeather();

    function showLocalWeather() {
        var currLat = 0;
        var currLong = 0;

        getUserLocation();


        function getUserWeather(lat, long) {

            var apiKey = "4c45bb0e6071b74cf43da0d4aa498377";
            apiCall(lat, long, apiKey);

            function apiCall(lat, long) {
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

            function parseWeather(response) {
                console.log(response);
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
    }
});