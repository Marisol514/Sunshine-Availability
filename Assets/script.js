const apiKey = '9b149de9367f6c0a5aa712320b23d01f';
const units = 'imperial'; // Specify units as 'imperial' for Fahrenheit
const searchForm = $('#searchForm');
const cityInput = $('#cityInput');
const currentWeatherContainer = $('#currentWeather');
const recentSearchesContainer = $('#searchHistory');
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

// Function to display weather information
function displayWeather(data) {
  const currentWeather = data.list[0];
  const temperatureFahrenheit = currentWeather.main.temp;

  currentWeatherContainer.html(`
    <h2>${data.city.name} (${dayjs.unix(currentWeather.dt).format('MM/DD/YYYY')})</h2>
    <p>Temperature: ${temperatureFahrenheit.toFixed(2)} °F</p>
    <p>Humidity: ${currentWeather.main.humidity}%</p>
    <p>Wind Speed: ${currentWeather.wind.speed} m/s</p>
  `);

  // Update Recent Searches
  updateRecentSearches();
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

// Function to search a city from recent searches
function searchCityFromHistory(city) {
  cityInput.val(city);
  searchCity();
}

// Function to update search history and initiate search
function updateSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateRecentSearches();
  }
}

// Initial display of London on page load
getWeatherData('London');
