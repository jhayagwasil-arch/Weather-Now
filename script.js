// 1. Get the HTML elements we need to update
const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const cityName = document.getElementById('cityName');
const currentDate = document.getElementById('currentDate');
const temperature = document.getElementById('temperature');
const weatherDesc = document.getElementById('weatherDesc');
const weatherIcon = document.getElementById('weatherIcon');
const humidity = document.getElementById('humidity');
const wind = document.getElementById('wind');
const feelsLike = document.getElementById('feelsLike');

// 2. Function to update the live Date and Time
function updateDate() {
  const now = new Date();
  const options = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  currentDate.textContent = now.toLocaleDateString('en-US', options);
}

// 3. Function to match Weather Codes (from the API) to Emojis
function getWeatherIcon(code) {
  if (code === 0) return '☀️'; // Clear sky
  if (code === 1 || code === 2 || code === 3) return '⛅'; // Partly cloudy
  if (code === 45 || code === 48) return '🌫️'; // Fog
  if (code >= 51 && code <= 67) return '🌧️'; // Rain
  if (code >= 71 && code <= 77) return '❄️'; // Snow
  if (code >= 80 && code <= 82) return '🌦️'; // Showers
  if (code >= 95 && code <= 99) return '⛈️'; // Thunderstorm
  return '☁️'; // Default cloudy
}

// 4. Main function to fetch weather data
async function getWeather(city) {
  try {
    // Step A: Get the Latitude and Longitude for the city
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    const geoResponse = await fetch(geoUrl);
    const geoData = await geoResponse.json();

    if (!geoData.results) {
      alert("City not found. Please try again.");
      return;
    }

    const lat = geoData.results[0].latitude;
    const lon = geoData.results[0].longitude;
    const country = geoData.results[0].country_code;
    
    // Update the city name in the UI
    cityName.textContent = `${geoData.results[0].name}, ${country}`;

    // Step B: Get the weather using the coordinates
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`;
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    const current = weatherData.current;

    // Step C: Update the UI with the real data
    temperature.textContent = `${Math.round(current.temperature_2m)}°`;
    feelsLike.textContent = `${Math.round(current.apparent_temperature)}°`;
    humidity.textContent = `${current.relative_humidity_2m}%`;
    wind.textContent = `${current.wind_speed_10m} km/h`;
    
    // Update icon and description
    weatherIcon.textContent = getWeatherIcon(current.weather_code);
    weatherDesc.textContent = "Live Weather";

  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Failed to get weather data. Please check your connection.");
  }
}

// 5. Event Listeners
searchBtn.addEventListener('click', () => {
  if (cityInput.value.trim() !== "") {
    getWeather(cityInput.value.trim());
  }
});

// Allow pressing "Enter" to search
cityInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && cityInput.value.trim() !== "") {
    getWeather(cityInput.value.trim());
  }
});

// 6. Run on page load
updateDate();
setInterval(updateDate, 60000); // Update time every minute
getWeather("Manila"); // Default city on load