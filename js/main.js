let apiKey = "YOUR_API_KEY_HERE";

// Weather icon mapping
function getWeatherIcon(condition) {
  const map = {
    rain: "img/rain.png",
    clear: "img/sun.png",
    "clear sky": "img/sun.png",
    snow: "img/snow.png",
    clouds: "img/cloud.png",
    smoke: "img/cloud.png",
    mist: "img/mist.png",
    fog: "img/mist.png",
    haze: "img/haze.png",
    thunderstorm: "img/thunderstorm.png",
    wind: "img/wind.png",
  };
  return map[condition.toLowerCase()] || "img/sun.png";
}

// Temperature state
let currentTempC = 0;
let currentFeelsC = 0;
let isCelsius = true;

function toggleUnit() {
  isCelsius = !isCelsius;
  const btn = document.getElementById("unit-btn");
  if (isCelsius) {
    document.getElementById("metric").innerHTML = Math.floor(currentTempC) + "°";
    document.getElementById("feels-like").innerHTML = Math.floor(currentFeelsC) + "°";
    btn.textContent = "Switch to °F";
  } else {
    const tempF = (currentTempC * 9) / 5 + 32;
    const feelsF = (currentFeelsC * 9) / 5 + 32;
    document.getElementById("metric").innerHTML = Math.floor(tempF) + "°";
    document.getElementById("feels-like").innerHTML = Math.floor(feelsF) + "°";
    btn.textContent = "Switch to °C";
  }
}

// Fetch weather using geolocation
navigator.geolocation.getCurrentPosition(
  async function (position) {
    try {
      const { latitude: lat, longitude: lon } = position.coords;

      // Reverse geocode to get city name
      const geoRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${apiKey}`
      );
      const geoData = await geoRes.json();
      const cityName = geoData[0].name;

      // Fetch forecast data
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=metric&appid=${apiKey}`
      );
      const data = await forecastRes.json();

      // Store temps for unit toggle
      currentTempC = data.list[0].main.temp;
      currentFeelsC = data.list[0].main.feels_like;

      // Update current weather UI
      document.getElementById("city-name").innerHTML = data.city.name;
      document.getElementById("metric").innerHTML = Math.floor(currentTempC) + "°";
      document.getElementById("weather-main").innerHTML = data.list[0].weather[0].description;
      document.getElementById("weather-main-today").innerHTML = data.list[0].weather[0].description;
      document.getElementById("humidity").innerHTML = Math.floor(data.list[0].main.humidity);
      document.getElementById("feels-like").innerHTML = Math.floor(currentFeelsC) + "°";
      document.getElementById("temp-min-today").innerHTML = Math.floor(data.list[0].main.temp_min) + "°";
      document.getElementById("temp-max-today").innerHTML = Math.floor(data.list[0].main.temp_max) + "°";

      // Update weather icons
      const iconSrc = getWeatherIcon(data.list[0].weather[0].main);
      document.querySelector(".weather-icon").src = iconSrc;
      document.querySelector(".weather-icons").src = iconSrc;

      // Render 6-day forecast
      renderForecast(data);
    } catch (err) {
      console.error("Error loading weather:", err);
    }
  },
  () => {
    alert("Please enable location access and refresh the page.");
  }
);

// Build 6-day forecast cards
function renderForecast(data) {
  const dailyMap = {};
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap[date]) {
      const dayIndex = new Date(date).getDay();
      dailyMap[date] = {
        label: dayLabels[dayIndex],
        temp: Math.floor(item.main.temp) + "°",
        description: item.weather[0].description,
        icon: getWeatherIcon(item.weather[0].main),
      };
    }
  });

  let html = "";
  for (const date in dailyMap) {
    const d = dailyMap[date];
    html += `
      <div class="weather-forecast-box">
        <div class="day-weather">${d.label}</div>
        <div class="weather-icon-forecast"><img src="${d.icon}" alt="${d.description}" /></div>
        <div class="temp-weather">${d.temp}</div>
        <div class="weather-main-forecast">${d.description}</div>
      </div>`;
  }

  document.getElementById("future-forecast-box").innerHTML = html;
}


// Dark mode toggle
const darkBtn = document.getElementById("darkToggle");
if(darkBtn){
darkBtn.onclick = () => {
document.body.classList.toggle("dark");
};
}

// Hide loader after load
window.addEventListener("load", () => {
const loader = document.getElementById("loader");
if(loader) loader.style.display = "none";
});
