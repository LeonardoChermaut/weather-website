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

const getWeatherByCityName = async (name) => {
  const weatherCity = `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=metric&appid=${API_KEY}&lang=pt_br`;
  const response = await fetch(weatherCity);
  const {data: city} = await response.json();

  return city;
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

const mainInfoWeather = (city) => {
  const maxTemp = city.main.temp_min;
  const minTemp = city.main.temp_max;
  const description = toPascalCase(city.weather[0].description);
  const sunset = window.moment(city.sys.sunset * 1000).format("HH:mm a");
  const sunrise = window.moment(city.sys.sunrise * 1000).format("HH:mm a");
  timezone.innerHTML = city.name;
  countryEl.innerHTML = "LA: " + city.coord.lat + " LO: " + city.coord.lon;

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

const showWeatherByCityName = async (name) => {
  const city = await getWeatherByCityName(name);
  currentWeatherItemsEl.innerHTML = await mainInfoWeather(city);
};

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const name = cityInput.value;
  showWeatherByCityName(name);
});

const getWeatherByGeolocation = () => {
  navigator.geolocation.getCurrentPosition(async (success) => {
    const { latitude, longitude } = success.coords;
    const weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}&lang=pt_br`;
    const response = await fetch(weatherApi);
    const location = await response.json();
    location.daily.map((day) => {
      let imgIcon = day.weather[0].icon;
      let tempNight = day.temp.nigh;
      let tempDay = day.temp.day;
      let date = window.moment().format("dddd");
      currentTempEl.innerHTML = `
              <img src="http://openweathermap.org/img/wn//${imgIcon}@4x.png" alt="weather icon" class="w-icon">
              <div class="other">
                  <div class="day">${date}</div>
                  <div class="temp">Night - ${tempNight}&#176;C</div>
                  <div class="temp">Day - ${tempDay}&#176;C</div>
              </div>
              `;
    });

    showWeatherByGeolocation(location);
  });
};

getWeatherByGeolocation();

const showWeatherByGeolocation = (location) => {
  const { humidity, pressure, sunrise, sunset, wind_speed } = location.current;
  timezone.innerHTML = location.timezone.replace("_", " ");
  countryEl.innerHTML = location.lat + "N " + location.lon + "E";
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
