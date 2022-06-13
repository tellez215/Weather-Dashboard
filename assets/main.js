var btnEl = $('.card-body')




var APIKey = '4a53d62ce140537e68f8ea6d5712d537';


var pastCities = JSON.parse(localStorage.getItem('pastCities')) || []


function searchHandler(e) {
    e.preventDefault()
    if ($(this).attr('id') === 'searchBtn') {
        var city = $(this).parent().siblings().children('input').val()
        pastCities.push(city)
        localStorage.setItem('pastCities',JSON.stringify(pastCities))
        pastCitiesDisplay()
    } else {
        var city = $(this).text();
        console.log(e)
    }
    geoSearch(city)
}

function pastCitiesDisplay() {
    var pastCitiesEl = $('#pastCities')
    pastCitiesEl.empty()
    for (let i = 0; i < pastCities.length; i++) {
        const element = pastCities[i];
        var button = $('<button>')
        button.addClass('btn btn-primary m-1')
        button.text(element)
        pastCitiesEl.append(button)
    }
}

function weatherSearch(lat, lon, city) {
    var apiUrl = 'https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=' + lat + '&lon=' + lon + '&appid=' + APIKey
    fetch(apiUrl).then(function (res) {
        return res.json()
    }).then(function (data) {
        console.log(data)
        currentWeatherDisplay(data.current, city)
        fiveDayDisplay(data.daily)
    })
}

function fiveDayDisplay(fiveDay) {
    var weekWeather = $("#fiveDay")
    weekWeather.empty()
    for (i = 1; i < 6; i++) {
        var newCard = $('<div>')
        newCard.addClass('col-md-2 border-1 border m-2')
        var date = $('<p>')
        date.text('Date: ' + moment.unix(fiveDay[i].dt).format("MMM Do YY"))
        var humidity = $('<p>')
        humidity.text("Humidity: " + fiveDay[i].humidity)
        var temp = $('<p>')
        temp.text('Temperature: ' + fiveDay[i].temp.day)
        var icon = $('<img>')
        icon.attr('src', 'http://openweathermap.org/img/wn/'+ fiveDay[i].weather[0].icon + '@2x.png')
        var uvi = $('<p>')
        uvi.text('UV Index: ' + fiveDay[i].uvi)
        if (fiveDay[i].uvi < 3 ) {
            uvi.css('background-color', 'green')
        } else if (fiveDay[i].uvi < 8 && fiveDay[i].uvi > 2) {
            uvi.css('background-color', 'yellow')
        } else {
            uvi.css('background-color', 'red')
        }
        var windSpeed = $('<p>')
        windSpeed.text('Wind Speed: ' + fiveDay[i].wind_speed)
        newCard.append(date, humidity, temp,icon, uvi, windSpeed)
        weekWeather.append(newCard)
    }

}

function currentWeatherDisplay(current, city) {
    var currentEl = $('#currentWeather')
    currentEl.empty()
    console.log(city)
    var cityName = $('<p>')
    cityName.text('City: ' + city)
    var date = $('<p>')
    date.text('Date: ' + moment.unix(current.dt).format("MMM Do YY"))
    var humidity = $('<p>')
    humidity.text("Humidity: " + current.humidity)
    var temp = $('<p>')
    temp.text('Temperature: ' + current.temp)
    var icon = $('<img>')
    icon.attr('src', 'http://openweathermap.org/img/wn/'+ current.weather[0].icon + '@2x.png')
    var uvi = $('<p>')
    uvi.text('UV Index: ' + current.uvi)
    if (current.uvi < 3 ) {
        uvi.css('background-color', 'green')
    } else if (current.uvi < 8 && current.uvi > 2) {
        uvi.css('background-color', 'yellow')
    } else {
        uvi.css('background-color', 'red')
    }
    var windSpeed = $('<p>')
    windSpeed.text('Wind Speed: ' + current.wind_speed)
    currentEl.append(cityName, date, humidity, temp ,icon, uvi, windSpeed)
}

function geoSearch(city) {
    var apiUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=&appid=' + APIKey
    fetch(apiUrl).then(function (res) {
        return res.json()
    }).then(function (data) {
        console.log(data)
        weatherSearch(data[0].lat, data[0].lon, city)
    })
}

pastCitiesDisplay()

btnEl.on('click','button', searchHandler)