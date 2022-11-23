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

input = document.getElementById("city-input");
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("search").click();
  }
});

const getWeatherByCityName = async (city) => {
  const weatherCity = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}&lang=pt_br`;
  const response = await fetch(weatherCity);
  const data = await response.json();

  return data;
};

getWeatherByCityName();

const toPascalCase = (string) => {
  return `${string}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, "g"), " ")
    .replace(new RegExp(/[^\w\s]/, "g"), "")
    .replace(
      new RegExp(/\s+(.)(\w*)/, "g"),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
};

const mainInfoWeather = (data) => {
  const maxTemp = data.main.temp_min;
  const minTemp = data.main.temp_max;
  const description = toPascalCase(data.weather[0].description);
  const sunset = window.moment(data.sys.sunset * 1000).format("HH:mm a");
  const sunrise = window.moment(data.sys.sunrise * 1000).format("HH:mm a");
  timezone.innerHTML = data.name;
  countryEl.innerHTML = "LA: " + data.coord.lat + " LO: " + data.coord.lon;

  return `<div class="weather-item">
        <div>Máxima</div>
        <div>${maxTemp}</div>
    </div>
    <div class="weather-item">
        <div>Mínima</div>
        <div>${minTemp}</div>
    </div>
    <div class="weather-item">
        <div>Condição</div>
        <div>${description}</div>
    </div>
    <div class="weather-item">
        <div>Nascer do sol</div>
        <div>${sunrise}</div>
    </div>
    <div class="weather-item">
        <div>Por do sol</div>
        <div>${sunset}</div>
    </div>
    `;
};

const showWeatherByCityName = async (city) => {
  const data = await getWeatherByCityName(city);
  currentWeatherItemsEl.innerHTML = await mainInfoWeather(data);
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const city = cityInput.value;
  showWeatherByCityName(city);
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
