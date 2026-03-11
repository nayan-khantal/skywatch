let apiKey = "YOUR_API_KEY_HERE";

const searchInput = document.querySelector(".searchinput");

// Icon mapping
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
  };
  return map[condition.toLowerCase()] || "img/sun.png";
}

// Fetch and display weather for searched city
async function fetchWeatherByCity(cityName) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`
  );

  const resultBox = document.querySelector(".return");
  const defaultMsg = document.querySelector(".message");
  const errorMsg = document.querySelector(".error-message");

  if (res.ok) {
    const data = await res.json();

    resultBox.style.display = "block";
    defaultMsg.style.display = "none";
    errorMsg.style.display = "none";

    document.querySelector(".city-name").innerHTML = data.name;
    document.querySelector(".weather-temp").innerHTML = Math.floor(data.main.temp) + "°";
    document.querySelector(".wind").innerHTML = Math.floor(data.wind.speed) + " m/s";
    document.querySelector(".pressure").innerHTML = Math.floor(data.main.pressure) + " hPa";
    document.querySelector(".humidity").innerHTML = Math.floor(data.main.humidity) + "%";
    document.querySelector(".sunrise").innerHTML = new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    document.querySelector(".sunset").innerHTML = new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    document.querySelector(".weather-img").src = getWeatherIcon(data.weather[0].main);
  } else {
    resultBox.style.display = "none";
    defaultMsg.style.display = "none";
    errorMsg.style.display = "block";
  }
}

// Trigger search on Enter key
searchInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && searchInput.value.trim()) {
    fetchWeatherByCity(searchInput.value.trim());
  }
});
