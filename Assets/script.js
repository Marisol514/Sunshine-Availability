const apiKey = '9b149de9367f6c0a5aa712320b23d01f';
const unsplashApiKey = 'QsjcagTBQoM7R7guV7vpRdMCShgIWFwaisc823yRf1A'; // Replace with your actual Unsplash API key
const units = 'imperial';
const searchForm = $('#searchForm');
const cityInput = $('#cityInput');
const currentWeatherContainer = $('#currentWeather');
const boxesContainer = $('.forecast-container');
const weatherDisplayContainer = $('.weather-display');
const recentSearchesList = $('#recentSearchesList');
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
    return data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return null;
  }
}

// Function to get an image of the location using Unsplash API
async function getCityImage(city) {
  const apiUrl = `https://api.unsplash.com/photos/random?query=${city}&client_id=${unsplashApiKey}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.urls.small; // Change 'small' to the desired image size (e.g., 'regular', 'full')
  } catch (error) {
    console.error('Error fetching city image:', error);
    return null;
  }
}

// Function to update search history and initiate search
function updateSearchHistory(city) {
  if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    if (searchHistory.length > 8) {
      searchHistory.shift();
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    updateRecentSearchesList();
  }
}

// Function to update the recent searches list in the sidebar
function updateRecentSearchesList() {
  recentSearchesList.html('');
  searchHistory.forEach(city => {
    recentSearchesList.append(`
      <button onclick="searchCity('${city}')">${city}</button>
    `);
  });
}

// Modified searchCity function to display weather, city image, and update recent searches
async function searchCity(city) {
  currentWeatherContainer.html('');
  boxesContainer.html('');
  weatherDisplayContainer.find('img').remove(); // Clear existing image

  const cityName = city || cityInput.val().trim() || 'Los Angeles';
  const weatherData = await getWeatherData(cityName);

  if (weatherData) {
    displayWeather(weatherData);

    const cityImage = await getCityImage(cityName);
    if (cityImage) {
      $('#backgroundImage').css('background-image', `url(${cityImage})`);
    }

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

  updateRecentSearchesList();

  boxesContainer.html('');

  const startDate = dayjs().add(1, 'day');
  for (let i = 0; i < 5; i++) {
    const forecastWeather = data.list[i + 1];
    const forecastDate = startDate.add(i, 'day').format('MM/DD/YYYY');
    const forecastTemperature = forecastWeather.main.temp;
    const forecastWeatherIcon = forecastWeather.weather[0].icon;

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