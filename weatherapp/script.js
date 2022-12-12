const API_WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const API_FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';
const IMG_API_URL = 'https://source.unsplash.com/1200x600/';
const WEATHER_API_KEY = '35b1f1d45a7b4378cf2430ae601816be';
const weather = document.querySelector('.weather');
const searchBtn = document.querySelector('button[role="search"]');
const cityField = document.querySelector('input[type="search"]');
const forecastRow = document.querySelector('.forecast > .row');
const dateElement = document.querySelector('.header__date');
const geolocateIcons = document.querySelectorAll('.header__geolocate');

const icons = {
  '01d': 'wi-day-sunny',
  '02d': 'wi-day-cloudy',
  '03d': 'wi-cloud',
  '04d': 'wi-cloudy',
  '09d': 'wi-showers',
  '10d': 'wi-rain',
  '11d': 'wi-thunderstorm',
  '13d': 'wi-snow',
  '50d': 'wi-fog',
  '01n': 'wi-night-clear',
  '02n': 'wi-night-alt-cloudy',
  '03n': 'wi-cloud',
  '04n': 'wi-night-cloudy',
  '09n': 'wi-night-showers',
  '10n': 'wi-night-rain',
  '11n': 'wi-night-thunderstorm',
  '13n': 'wi-night-alt-snow',
  '50n': 'wi-night-fog',
};
function printTodayDate() {
  const today = new Date();
  const options = {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  };
  dateElement.insertAdjacentText('afterbegin', today.toLocaleString('en-us', options));
}

function getWeekDay(date) {
  const options = { weekday: 'long' };
  return date.toLocaleString('en-us', options);
}

function removeChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}


function renderForecast(forecast) {
  removeChildren(forecastRow);
  forecast.forEach((weatherData) => {
    const markup = `<div class="forecast__day">
     <h3 class="forecast__date">${getWeekDay(new Date(weatherData.dt * 1000))}</h3>
     <i class='wi ${icons[weatherData.weather[0].icon]} forecast__icon'></i>
     <p class="forecast__temp">${Math.floor(weatherData.main.temp)}°C</p>
     <p class="forecast__desc">${weatherData.weather[0].main}</p>
   </div>`;
    forecastRow.insertAdjacentHTML('beforeend', markup);
  });
}

function getForecast(url) {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const forecastData = data.list.filter((obj) => obj.dt_txt.endsWith('06:00:00'));
      renderForecast(forecastData);
    });
}
function getCityWeather(url) {

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const markup = `<h1 class="location">${data.name}, ${data.sys.country}</h1>
 <div class="weather__summary">
    <p><i class="wi ${icons[data.weather[0].icon]} weather-icon"></i> <span class="weather__celsius-value">${Math.floor(data.main.temp)}°C</span></p>
    <p>${data.weather[0].main}</p>
    <ul class="weather__miscellaneous">
    <li><i class="wi wi-humidity"></i> Humidity  <span>${data.main.humidity}%</span></li>
    <li><i class="wi wi-small-craft-advisory"></i> Wind Speed <span>${data.wind.speed} m/s</span></li>
    </ul>
 </div>
 `;

 fetch(`${IMG_API_URL}?${data.weather[0].main}`)
 .then((response) => document.body.style.backgroundImage = `url('${response.url}')`
 );

 document.body.style.backgroundRepeat = 'no-repeat';
  document.body.style.backgroundSize = 'cover';
      removeChildren(weather);
      weather.insertAdjacentHTML('beforeend', markup);
    })
    .catch((error) => {
      console.log(error);
    });
  
}
function getWeatherByCoordinates(latitude, longitude) {
  getCityWeather(`${API_WEATHER_URL}?lat=${latitude}&lon=${longitude}&APPID=${WEATHER_API_KEY}&units=metric`);
}
function getForecastByCoordinates(latitude, longitude) {
  getForecast(`${API_FORECAST_URL}?lat=${latitude}&lon=${longitude}&APPID=${WEATHER_API_KEY}&units=metric`);
}
function getWeatherByCity(city) {
  getCityWeather(`${API_WEATHER_URL}?q=${city}&APPID=${WEATHER_API_KEY}&units=metric`);
}
function getForecastByCity(city) {
  getForecast(`${API_FORECAST_URL}?q=${city}&APPID=${WEATHER_API_KEY}&units=metric`);
}

function geosuccess(position) {
  const { latitude, longitude } = position.coords;
  getWeatherByCoordinates(latitude, longitude);
  getForecastByCoordinates(latitude, longitude);
}

printTodayDate();
searchBtn.addEventListener('click', (e) => {
  e.preventDefault();
  getWeatherByCity(cityField.value);
  getForecastByCity(cityField.value);
});


geolocateIcons.forEach((icon) => {
  icon.addEventListener('click', (e) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(geosuccess);
    } else {
      alert('Your browser does not support geolocation');
    }
  });
});
