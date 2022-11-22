const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
const timezone = document.getElementById("time-zone");
const countryEl = document.getElementById("country");
const currentTempEl = document.getElementById("current-temp");
const weatherForecastEl = document.getElementById("weather-forecast");
const currentWeatherItemsEl = document.getElementById("current-weather-items");
const cityInput = document.querySelector("#city-input");
const searchBtn = document.querySelector("#search");

const days = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const months = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

const API_KEY = "49cc8c821cd2aff9af04c9f98c36eb74";
setInterval(() => {
  const time = new Date();
  const day = time.getDay();
  const date = time.getDate();
  const hour = time.getHours();
  const month = time.getMonth();
  const minutes = time.getMinutes();
  const ampm = hour >= 12 ? "PM" : "AM";
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour;
  dateEl.innerHTML = days[day] + ", " + date + " " + months[month];
  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? "0" + hoursIn12HrFormat : hoursIn12HrFormat) +
    ":" +
    (minutes < 10 ? "0" + minutes : minutes) +
    " " +
    `<span id="am-pm">${ampm}</span>`;
}, 1000);

const getWeatherByCityName = async (city) => {
  const searchWeather = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`;
  const response = await fetch(searchWeather);
  const data = await response.json();
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value;
  getWeatherByCityName(city);
});

const getWeatherByGeolocation = () => {
  navigator.geolocation.getCurrentPosition(async (success) => {
    const { latitude, longitude } = success.coords;
    const weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}&lang=pt_br`;
    const response = await fetch(weatherApi);
    const data = await response.json();

    data.daily.map((day) => {
      currentTempEl.innerHTML = `
              <img src="http://openweathermap.org/img/wn//${
                day.weather[0].icon
              }@4x.png" alt="weather icon" class="w-icon">
              <div class="other">
                  <div class="day">${window.moment().format("dddd")}</div>
                  <div class="temp">Night - ${day.temp.night}&#176;C</div>
                  <div class="temp">Day - ${day.temp.day}&#176;C</div>
              </div>
              `;
    });

    showWeatherByGeolocation(data);
  });
};

getWeatherByGeolocation();

const showWeatherByCityName = (city) => getWeatherByCityName(city);

const showWeatherByGeolocation = (data) => {
  const { humidity, pressure, sunrise, sunset, wind_speed } = data.current;
  timezone.innerHTML = data.timezone.replace("_", " ");
  countryEl.innerHTML = data.lat + "N " + data.lon + "E";
  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
        <div>Humidity</div>
        <div>${humidity}%</div>
    </div>
    <div class="weather-item">
        <div>Pressure</div>
        <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
    </div>
    <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format("HH:mm a")}</div>
    </div>
    <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format("HH:mm a")}</div>
    </div>
    `;
};
