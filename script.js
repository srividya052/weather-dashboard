const apiKey = "7cd4ab62f334ef4df0c505089cd0f54b";

const form = document.querySelector("#weather-form");
const cityInput = document.querySelector("#city-input");
const button = document.querySelector("#search-button");
const loading = document.querySelector("#loading");
const message = document.querySelector("#message");

const cityName = document.querySelector("#city-name");
const iconBox = document.querySelector("#icon-box");
const description = document.querySelector("#weather-description");
const temperature = document.querySelector("#temperature");
const humidity = document.querySelector("#humidity");
const windSpeed = document.querySelector("#wind-speed");

const advisoryCard = document.querySelector("#advisory-card");
const advisoryIcon = document.querySelector("#advisory-icon");
const advisoryText = document.querySelector("#advisory-text");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const city = cityInput.value.trim();

  if (!city) {
    showMessage("Please enter a city name.", "error");
    return;
  }

  setLoading(true);

  try {
    const weather = await getData("weather", city);
    const forecast = await getData("forecast", city);

    showWeather(weather);
    showAdvisory(forecast, weather.name);
    showMessage("Weather updated successfully.", "success");
  } catch (error) {
    showMessage(error.message, "error");
    resetCards();
  } finally {
    setLoading(false);
  }
});

// Fetches data from either /2.5/weather or /2.5/forecast.
async function getData(type, city) {
  const url = `https://api.openweathermap.org/data/2.5/${type}?q=${encodeURIComponent(
    city
  )}&appid=${apiKey}&units=metric`;

  let response;

  try {
    response = await fetch(url);
  } catch {
    throw new Error("Network error. Please check your internet connection.");
  }

  const data = await response.json();

  if (!response.ok) {
    if (data.cod === "404") throw new Error("City not found.");
    if (data.cod === "401" || data.cod === 401) throw new Error("Invalid API key.");
    throw new Error(data.message || "Unable to fetch weather data.");
  }

  return data;
}

function showWeather(data) {
  const weather = data.weather[0];

  cityName.textContent = `${data.name}, ${data.sys.country}`;
  description.textContent = weather.description;
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  humidity.textContent = `${data.main.humidity}%`;
  windSpeed.textContent = `${data.wind.speed.toFixed(1)} m/s`;
  iconBox.innerHTML = `<img src="https://openweathermap.org/img/wn/${weather.icon}@2x.png" alt="${weather.description}" />`;
}

function showAdvisory(data, city) {
  const next24Hours = data.list.slice(0, 8);
  const rainItem = next24Hours.reduce((max, item) => (item.pop > max.pop ? item : max));
  const windItem = next24Hours.reduce((max, item) =>
    item.wind.speed > max.wind.speed ? item : max
  );

  const rainChance = Math.round(rainItem.pop * 100);
  const wind = windItem.wind.speed;
  const time = formatTime(rainItem.dt_txt);

  let icon = "☀️";
  let level = "stable";
  let text = `Weather conditions are expected to remain stable in ${city}.`;

  if (rainChance >= 60) {
    icon = "⚠️";
    level = "severe";
    text = `Heavy rain or storms may affect ${city} around ${time}, with a ${rainChance}% chance of rain. Carry an umbrella and avoid unnecessary travel.`;
  } else if (rainChance >= 30) {
    icon = "🌦️";
    level = "moderate";
    text = `Moderate rainfall is expected in ${city} around ${time}, with a ${rainChance}% chance of precipitation.`;
  }

  if (wind > 10) {
    icon = "💨";
    level += " wind";
    text += ` Strong winds up to ${wind.toFixed(1)} m/s are also forecasted.`;
  }

  advisoryIcon.textContent = icon;
  advisoryText.textContent = text;
  advisoryCard.className = `card advisory-card ${level}`;
}

function resetCards() {
  cityName.textContent = "City Name";
  description.textContent = "Weather description will appear here.";
  temperature.textContent = "--°C";
  humidity.textContent = "--%";
  windSpeed.textContent = "-- m/s";
  iconBox.textContent = "--";
  advisoryIcon.textContent = "☀️";
  advisoryText.textContent = "Search for a city to get a forecast-based advisory.";
  advisoryCard.className = "card advisory-card";
}

function setLoading(isLoading) {
  loading.classList.toggle("hidden", !isLoading);
  button.disabled = isLoading;
  button.textContent = isLoading ? "Loading..." : "Search";
}

function showMessage(text, type = "") {
  message.textContent = text;
  message.className = type ? `message ${type}` : "message";
}

function formatTime(dateText) {
  return new Date(dateText).toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}
