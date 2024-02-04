
const apiKey = '9b149de9367f6c0a5aa712320b23d01f';
const units = 'imperial'; // Specify units as 'imperial' for Fahrenheit
const searchForm = $('#searchForm');
const cityInput = $('#cityInput');
const currentWeatherContainer = $('#currentWeather');
const recentSearchesContainer = $('#searchHistory');
const boxesContainer = $('.forecast-container');
let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

// Function to get weather data for a city using fetch
async function getWeatherData(city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    displayWeather(data);
    updateSearchHistory(city);
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}

// Function to update recent searches section
function updateRecentSearches() {
  recentSearchesContainer.empty();
  recentSearchesContainer.append('<h2>Recent Searches</h2>');
  const uniqueSearches = Array.from(new Set(searchHistory)).slice(0, 7);

  uniqueSearches.forEach(city => {
    recentSearchesContainer.append(`
      <button onclick="searchCityFromHistory('${city}')">${city}</button>
    `);
  });
}

// Function to update search history and initiate search
function updateSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    // Limit the search history to the last 8 entries
    if (searchHistory.length > 8) {
      searchHistory.shift(); // Remove the oldest entry
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateRecentSearches();
  }
}

// Modified searchCity function to display weather for the selected city
// Modified searchCity function to clear previous weather data
async function searchCity() {
  // Clear existing weather information
  currentWeatherContainer.html('');
  boxesContainer.html('');

  // If no city is provided, default to 'Toronto'
  const cityName = cityInput.val().trim() || 'Los Angeles';

  // Fetch weather data
  const data = await getWeatherData(cityName);

  if (data) {
    // Display weather information
    displayWeather(data);
    // Update search history
    updateSearchHistory(cityName);
  }
}

// Function to display weather information
function displayWeather(data) {
  const currentWeather = data.list[0];
  const temperatureFahrenheit = currentWeather.main.temp;
  const weatherIcon = currentWeather.weather[0].icon;

  currentWeatherContainer.html(`
    <h2>${data.city.name} (${dayjs.unix(currentWeather.dt).format('MM/DD/YYYY')})</h2>
    <p>Temperature: ${temperatureFahrenheit.toFixed(2)} °F</p>
    <img src="http://openweathermap.org/img/w/${weatherIcon}.png" alt="Weather Icon">
    <p>Humidity: ${currentWeather.main.humidity}%</p>
    <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>

  `);

  // Update Recent Searches
  updateRecentSearches();

  // Clear the forecast container
  boxesContainer.html('');

  // Calculate consecutive dates for the 5-day forecast
  const startDate = dayjs().add(1, 'day'); // Start from tomorrow
  for (let i = 0; i < 5; i++) {
    const forecastWeather = data.list[i + 1];
    const forecastDate = startDate.add(i, 'day').format('MM/DD/YYYY');
    const forecastTemperature = forecastWeather.main.temp;
    const forecastWeatherIcon = forecastWeather.weather[0].icon;

    // Append forecast information to the forecast container
    boxesContainer.append(`
      <div class="weather-box">
        <p>Date: ${forecastDate}</p>
        <p>Temperature: ${forecastTemperature.toFixed(2)} °F</p>
        <img src="http://openweathermap.org/img/w/${forecastWeatherIcon}.png" alt="Weather Icon">
        <p>Humidity: ${forecastWeather.main.humidity}%</p>
        <p>Wind Speed: ${forecastWeather.wind.speed} m/s</p>

      </div>
    `);
  }
}

// Initial display based on the default city
searchCity();