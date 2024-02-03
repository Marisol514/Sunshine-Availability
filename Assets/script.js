var apiKey = '9b149de9367f6c0a5aa712320b23d01f';
var searchForm = $('#searchForm');
var cityInput = $('#cityInput');
var currentWeatherContainer = $('#currentWeather');
var forecastContainer = $('#forecast');
var searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

searchForm.submit(function(event) {
  event.preventDefault();
  const city = cityInput.val();
  getWeatherData(city);
});


