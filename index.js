let weather = {
    "apiKey": "65bb548ae00f93d411b8af5ebd40de1a",
    fetchWeather: function (city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey).then((response) => response.json()).then((data) => this.displayWeather(data))
    },
    displayWeather: function (data) {
        const name = data.name;
        const description = data.weather[0].description;
        const icon = data.weather[0].icon;
        const temp = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        // console.log(name, description);
        document.querySelector(".city").innerText = name;
        document.querySelector(".temp").innerText = Math.round(temp) + " °C";
        document.querySelector(".icon").src = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + windSpeed + "km/hr";
        im.auto(name);


    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-box").value);

    }
};

let geocode = {
    reverseGeocode: function (latitude, longitude) {
        var api_key = 'ca70630efbbc4d41bf9b8d8daf17d772';
        var api_url = 'https://api.opencagedata.com/geocode/v1/json'

        var request_url = api_url
            + '?'
            + 'key=' + api_key
            + '&q=' + encodeURIComponent(latitude + ',' + longitude)
            + '&pretty=1'
            + '&no_annotations=1';

        // see full list of required and optional parameters:
        // https://opencagedata.com/api#forward

        var request = new XMLHttpRequest();
        request.open('GET', request_url, true);

        request.onload = function () {
            // see full list of possible response codes:
            // https://opencagedata.com/api#codes

            if (request.status === 200) {
                // Success!
                var data = JSON.parse(request.responseText);
                // console.log(data.results[0]); // print the location
                weather.fetchWeather(data.results[0].components.city);
                // im.auto(data.results[0].components.city);



            } else if (request.status <= 500) {
                // We reached our target server, but it returned an error

                console.log("unable to geocode! Response code: " + request.status);
                var data = JSON.parse(request.responseText);
                console.log('error msg: ' + data.status.message);

            } else {
                console.log("server error");

            }
        };

        request.onerror = function () {
            // There was a connection error of some sort
            console.log("unable to connect to server");
        };

        request.send();  // make the request

    },
    getLocation: function () {
        function success(data) {
            geocode.reverseGeocode(data.coords.latitude, data.coords.longitude);
        }
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(success, console.error);
        }
        else {
            alert("cannot get your location..");
            weather.fetchWeather("kolkata");
        }
    }

}



//location


let im = {
    apiKey: "26242182-9af3923ee36314f4c3c17c2e7",
    auto: function (data) {
        const url = "https://pixabay.com/api/?key=" + this.apiKey + "&q=" + encodeURIComponent(data) + "&image_type=photo";
        // console.log(url);
        fetch(url).then((response) => response.json()).then((data) => (document.body.style.backgroundImage = "url(" + data.hits[0].largeImageURL + ")"))


    },

}
geocode.getLocation()

// btn click listen 
document.querySelector(".search-btn").addEventListener('click', function () {
    weather.search();

})

// enter listen 

document.querySelector(".search-box").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
})