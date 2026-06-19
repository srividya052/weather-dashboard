# Weather Dashboard

A real-time weather dashboard built with HTML, CSS, and asynchronous JavaScript.

## How to Use

1. Open `index.html` in your browser.
2. Search for a city name.

The OpenWeatherMap API key is stored in `script.js` as a constant named `apiKey`.

## API Used

This project uses the OpenWeatherMap Current Weather Data endpoint for live weather:

`https://api.openweathermap.org/data/2.5/weather`

It also uses the 5-Day Forecast endpoint to generate the Weather Advisory:

`https://api.openweathermap.org/data/2.5/forecast`

## Features

- Fetches real-time weather data using `fetch` and `async/await`
- Generates forecast-based weather advisories using precipitation probability and wind speed
- Handles missing input, network failures, invalid cities, and invalid API keys
- Parses nested JSON fields from the OpenWeatherMap response
- Renders city name, weather icon, description, temperature, humidity, and wind speed
- Includes responsive styling for desktop and mobile screens
