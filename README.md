# Weather App

A responsive weather forecast web application built with HTML, CSS, and JavaScript using the [Visual Crossing Weather API](https://www.visualcrossing.com/weather-api).

The app allows users to search for a location and view its current weather conditions, including temperature, feels-like temperature, humidity, wind speed, and weather conditions. It also supports switching between Celsius and Fahrenheit, weather icons, loading feedback, error handling, and weather-dependent card styling.

## Features

- Search for weather by location
- Fetch current weather data from the Visual Crossing API
- Display:
  - Location
  - Current time
  - Temperature
  - Feels-like temperature
  - Humidity
  - Wind speed
  - Current weather conditions
- Toggle temperature between Celsius (°C) and Fahrenheit (°F)
- Weather icons based on the API's weather condition
- Weather-dependent background colors
- Loading indicator while fetching weather data
- Error message for failed requests
- Responsive and simple UI
- Uses JavaScript Promises and `async/await`
- Separates API data processing from DOM rendering

## Demo

After running the application, enter a location such as:

- Guwahati
- Kokrajhar
- London
- New York

The application will fetch the current weather information and display it in the weather card.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Visual Crossing Weather API
- Fetch API
- Promises
- Async/Await
- DOM Manipulation

## Project Structure

```text
weather-app/
├── index.html
├── style.css
├── app.js
└── README.md
```

## How It Works

### 1. User enters a location

The application contains a search form:

```html
<form id="weather-form">
    <input type="text" id="search-location" placeholder="Enter a location">
    <button type="submit">Search</button>
</form>
```

When the form is submitted, the default form submission is prevented and the entered location is passed to `getWeather()`.

### 2. Weather data is fetched

The `getWeather()` function uses the Fetch API:

```js
async function getWeather(location) {
    const response = await fetch(
        `${API_URL}/${location}?unitGroup=metric&key=${API_KEY}`
    );

    if (response.status == 200) {
        return await response.json();
    }

    throw new Error("Something went wrong!");
}
```

The API is requested using metric units so that the initial temperature is returned in Celsius.

### 3. API data is processed

The Visual Crossing API returns a large JSON response. The application only extracts the information it needs:

```js
function processData(data) {
    const location = data.address;
    const date = data.currentConditions.datetime;
    const temp = data.currentConditions.temp;
    const feelslike = data.currentConditions.feelslike;
    const humidity = data.currentConditions.humidity;
    const windspeed = data.currentConditions.windspeed;
    const conditions = data.currentConditions.conditions;
    const icon = data.currentConditions.icon;

    return {
        location,
        date,
        temp,
        feelslike,
        humidity,
        windspeed,
        conditions,
        icon
    };
}
```

This keeps the UI code independent from the complete API response.

### 4. Weather information is rendered

After the data is processed, the application updates the corresponding DOM elements:

```js
weatherTemp.textContent = `${currentTemp}${unit}`;
weatherFeelslike.textContent = `Feels like: ${currentFeelsLike}${unit}`;
weatherHumidity.textContent = `Humidity: ${weather.humidity}%`;
weatherWindspeed.textContent = `Wind speed: ${weather.windspeed} km/hr`;
weatherConditions.textContent = `Current conditions: ${weather.conditions}`;
```

### 5. Celsius/Fahrenheit conversion

The API data is initially stored in Celsius. The application performs the Fahrenheit conversion locally, so changing the unit does not require another API request.

Celsius to Fahrenheit:

```js
function convertToF(temp) {
    const value = (temp * (9 / 5)) + 32;
    return Number(value.toFixed(2));
}
```

Fahrenheit to Celsius:

```js
function convertToC(temp) {
    const value = (temp - 32) * (5 / 9);
    return Number(value.toFixed(2));
}
```

This also means the unit toggle works without repeatedly hitting the API.

## Weather Icons

The application maps Visual Crossing icon names to emoji:

```js
const iconMap = {
    "clear-day": "☀️",
    "clear-night": "🌙",
    "cloudy": "☁️",
    "partly-cloudy-day": "☁️",
    "rain": "🌧️",
    "snow": "❄️"
};
```

The API's icon value is used to select the appropriate emoji:

```js
weatherIcon.textContent = iconMap[weather.icon] || "🌤️";
```

The fallback ensures that an unknown icon value does not leave the weather icon empty.

## Weather-Based Styling

The appearance of the weather card changes according to the current weather condition.

For example:

- Clear day → sky blue
- Clear night → dark blue
- Cloudy → gray
- Rain → blue
- Snow → light cyan
- Thunderstorm → dark purple
- Fog → light gray

This is handled by `updateWeatherTheme()`:

```js
function updateWeatherTheme(icon) {
    let color;

    switch (icon) {
        case "clear-day":
            color = "#87CEEB";
            break;

        case "clear-night":
            color = "#191970";
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

        default:
            color = "#FFFFFF";
    }

    weatherSection.style.backgroundColor = color;
}
```

## Loading State

A loading message is displayed while the API request is in progress:

```js
loading.style.display = "block";
```

The loading message is removed using `.finally()`:

```js
.finally(() => {
    loading.style.display = "none";
});
```

Using `finally()` is useful here because it runs whether the request succeeds or fails.

## Error Handling

If the API request fails, the error is passed to the promise's `.catch()` handler:

```js
.catch(err => {
    errorMessage.style.display = "block";
    errorMessage.textContent = err.message;
    toogleTemp.disabled = true;
});
```

This prevents the application from silently failing and gives the user feedback.

## Running the Project Locally

### Prerequisites

You only need:

- A modern web browser
- A Visual Crossing API key
- A local web server (recommended)

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd weather-app
```

### 2. Open the project

You can serve the project using a local development server.

For example, with VS Code and the Live Server extension, open `index.html` using Live Server.

Alternatively, use another simple static HTTP server.

### 3. Enter a location

Open the application in your browser and search for a location.

## API

This project uses the Visual Crossing Weather API:

https://www.visualcrossing.com/weather-api

The API endpoint used by the application is:

```text
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline
```

The request uses:

```text
unitGroup=metric
```

so the initial weather data is returned using metric units.

## API Key Note

This project follows The Odin Project's Weather App assignment. The assignment specifically explains that the API key used for this project may be exposed publicly because of the nature of this particular project/API setup.

For real-world applications, API keys and other secrets should generally **not** be embedded directly in frontend JavaScript. A backend service or other appropriate secret-management approach should be used when the API provider requires the key to remain private.

## Design Decisions

### Why process the API response?

The Visual Crossing response contains much more information than the application needs.

Instead of passing the entire API response throughout the application, `processData()` creates a smaller object containing only the required fields.

This makes the rest of the application easier to reason about.

### Why convert temperature locally?

The application initially requests metric data from the API.

When the user switches between Celsius and Fahrenheit, the application converts the already-fetched values instead of making another API request.

This avoids unnecessary network requests.

### Why use `.finally()` for loading?

The loading indicator should disappear regardless of whether the request succeeds or fails.

`finally()` is therefore a natural place to hide it.

## Future Improvements

Possible improvements for a future version include:

- Replace emoji weather icons with SVG icons
- Use Webpack and dynamic imports for weather icon assets
- Improve responsive design for smaller screens
- Add a multi-day forecast
- Display additional weather information
- Add wind direction
- Add sunrise and sunset times
- Add weather animations
- Improve error messages for different HTTP errors
- Add input validation
- Add a more polished weather-themed UI
- Add accessibility improvements
- Deploy the application publicly

## What I Learned

This project was built as part of The Odin Project's JavaScript curriculum.

Key concepts practiced include:

- Working with third-party APIs
- HTTP requests with `fetch()`
- Promises
- `async/await`
- Error handling with `try/catch`
- Promise chaining with `.then()` and `.catch()`
- Using `.finally()`
- Processing API responses
- DOM manipulation
- Event listeners
- Form submission handling
- Managing application state
- Unit conversion
- Conditional rendering
- Dynamic UI styling
- Separating data processing from presentation

## Credits

- Weather data: [Visual Crossing](https://www.visualcrossing.com/)
- Project specification: [The Odin Project](https://www.theodinproject.com/lessons/node-path-javascript-weather-app)

## License

This project was created for learning purposes as part of The Odin Project curriculum.
