const API_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline'
const API_KEY = 'HQVQD7CP73PUMUPFVJUFLA2Q7'
const iconMap = {
    "clear-day": "☀️",
    "clear-night": "🌙",
    "cloudy": "☁️",
    "partly-cloudy-day": "☁️",
    "rain": "🌧️",
    "snow": "❄️",
    "partly-cloudy-night": "🌙☁️",
};


const form = document.querySelector("#weather-form");
const weatherSection =  document.querySelector("#weather-display");
const toogleTemp = document.querySelector("#unit-toggle")
const searchInput = document.querySelector("#search-location")
const errorMessage = document.querySelector("#error-message");
const loading = document.querySelector("#loading");
loading.style.display = "none"
errorMessage.style.display = "none";

let currentTemp, currentFeelsLike;
let currentTempinC = true;
let unit = "°C"
let weatherData;

const weatherLocation = document.querySelector("#location")
const weatherDate = document.querySelector("#weather-time")
const weatherTemp = document.querySelector("#temperature")
const weatherFeelslike = document.querySelector("#feels-like")
const weatherHumidity = document.querySelector("#humidity")
const weatherWindspeed = document.querySelector("#wind")
const weatherConditions = document.querySelector("#conditions")
const weatherIcon = document.querySelector("#weather-icon");

form.addEventListener("submit", (event) => {
    event.preventDefault();

    resetWeatherDisplay();
    errorMessage.textContent = "";
    loading.style.display = "block";
    // get the location
    const location = searchInput.value
    
    // call getWeather()
    getWeather(location)
    .then(data => {
        currentTempinC = true;
        unit = "°C"
        const weather = processData(data);

        console.log(weather.icon)
        currentTemp = weather.temp;
        currentFeelsLike = weather.feelslike;
        renderWeatherDisplay(weather)

        weatherData = weather;

        toogleTemp.disabled = false;

    })
    .catch(err => {
        console.log(err);
        errorMessage.style.display = "block";
        errorMessage.textContent = err.message
        toogleTemp.disabled = true;
    })
     .finally( () => {
        loading.style.display = "none";
     }
     )
});

toogleTemp.addEventListener("click", (event) => {
    if (currentTempinC) {
        currentTempinC = !currentTempinC
        toogleTemp.textContent = "Show in °C"
        currentTemp = convertToF(currentTemp)
        currentFeelsLike = convertToF(currentFeelsLike)
        renderWeatherDisplay(weatherData)
    }
    else {
        currentTempinC = !currentTempinC
        toogleTemp.textContent = "Show in °F"
        currentTemp = convertToC(currentTemp)
        currentFeelsLike = convertToC(currentFeelsLike)
        renderWeatherDisplay(weatherData)
    }
})





async function getWeather(location) {
    try {
        const response = await fetch(`${API_URL}/${location}?unitGroup=metric&key=${API_KEY}`)

        if (response.status == 200) {
            const data = await response.json()
            return data
        }
        else {
            throw new Error("Something went wrong!");
        }
        
    }
    catch(err) {
        throw err;
    }
}

function processData(data) {
    const location = data.address
    const date = data.currentConditions.datetime
    const temp = data.currentConditions.temp
    const feelslike = data.currentConditions.feelslike
    const humidity = data.currentConditions.humidity
    const windspeed = data.currentConditions.windspeed
    const conditions = data.currentConditions.conditions
    const icon = data.currentConditions.icon

    return {location, date, temp, feelslike, humidity, windspeed, conditions, icon}
}

function convertToF(temp) {
    const value = (temp * (9/5))+32
    return Number(value.toFixed(2))
}

function convertToC(temp) {
    const value = (temp - 32) * (5/9)
    return Number(value.toFixed(2))
}

function renderWeatherDisplay(weather) {
    updateWeatherTheme(weather.icon)
    weatherLocation.textContent = `${weather.location}`
    weatherDate.textContent = `Time: ${weather.date}`

    if (currentTempinC) {
        unit = "°C"
        toogleTemp.textContent = "Show in °F"
    }
    else {
        unit = "°F"
        toogleTemp.textContent = "Show in °C"
    }

    weatherTemp.textContent = `${currentTemp}${unit}`
    weatherFeelslike.textContent = `Feels like: ${currentFeelsLike}${unit}`
    weatherHumidity.textContent = `Humidity: ${weather.humidity}%`
    weatherWindspeed.textContent = `Wind speed: ${weather.windspeed} km/hr`
    weatherConditions.textContent = `Current conditions: ${weather.conditions}`
    weatherIcon.textContent = iconMap[weather.icon] || "🌤️";
}

function resetWeatherDisplay() {
    weatherLocation.textContent = ""
    weatherDate.textContent = ""
    weatherTemp.textContent = ""
    weatherFeelslike.textContent = ""
    weatherHumidity.textContent = ""
    weatherWindspeed.textContent = ""
    weatherConditions.textContent = ""
    weatherIcon.textContent = "";
}


function updateWeatherTheme(icon) {
    let color;

    switch (icon) {
        case "clear-day":
            color = "#87CEEB";
            break;

        case "clear-night":
            color = "#191970";
            break;

        case "partly-cloudy-day":
        case "partly-cloudy-night":
            color = "#B0C4DE";
            break;

        case "cloudy":
            color = "#778899";
            break;

        case "rain":
            color = "#4682B4";
            break;

        case "snow":
            color = "#E0FFFF";
            break;

        case "thunderstorm":
            color = "#483D8B";
            break;

        case "fog":
            color = "#D3D3D3";
            break;

        default:
            color = "#FFFFFF";
    }

    weatherSection.style.backgroundColor = color;
}