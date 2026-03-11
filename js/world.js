let apiKey = "YOUR_API_KEY_HERE";

const searchInput = document.querySelector(".searchinput");
const cityBox = document.querySelector(".city-box");
const normalMessage = document.querySelector(".normal-message");
const errorMessage = document.querySelector(".error-message");
const addedMessage = document.querySelector(".added-message");

// Display today's date dynamically
const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const now = new Date();
document.querySelector(".date").innerHTML = `${monthNames[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;

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

// Build a city weather card
async function loadCityCard(cityName) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?units=metric&q=${cityName}&appid=${apiKey}`
  );

  if (!res.ok) return null;

  const data = await res.json();

  // Create card elements
  const weatherBox = document.createElement("div");
  weatherBox.className = "weather-box";

  const nameDiv = document.createElement("div");
  nameDiv.className = "name";

  const cityEl = document.createElement("div");
  cityEl.className = "city-name city";
  cityEl.innerHTML = data.name;

  const tempEl = document.createElement("div");
  tempEl.className = "weather-temp temp";
  tempEl.innerHTML = Math.floor(data.main.temp) + "°";

  const iconWrap = document.createElement("div");
  iconWrap.className = "weather-icon";

  const img = document.createElement("img");
  img.className = "weather";
  img.src = getWeatherIcon(data.weather[0].main);
  img.alt = data.weather[0].description;

  iconWrap.appendChild(img);
  nameDiv.appendChild(cityEl);
  nameDiv.appendChild(tempEl);
  weatherBox.appendChild(nameDiv);
  weatherBox.appendChild(iconWrap);

  // Append to box
  let box = document.querySelector(".box");
  if (!box) {
    box = document.createElement("div");
    box.className = "box";
    cityBox.appendChild(box);
  }
  box.appendChild(weatherBox);

  return weatherBox;
}

// Add city panel toggle
const addPanel = document.querySelector(".add-section");
const navBtn = document.querySelector(".button");
const navIcon = document.querySelector(".btn-icon");

navBtn.addEventListener("click", () => {
  if (addPanel.style.top === "-60rem" || addPanel.style.top === "") {
    addPanel.style.top = "100px";
    navIcon.className = "fa-solid fa-circle-xmark btn-icon";
  } else {
    addPanel.style.top = "-60rem";
    navIcon.className = "fa-solid fa-circle-plus btn-icon";
  }
});

// Search and add city on Enter
searchInput.addEventListener("keydown", async function (e) {
  if (e.key === "Enter" && searchInput.value.trim()) {
    const card = await loadCityCard(searchInput.value.trim());
    if (card) {
      normalMessage.style.display = "none";
      errorMessage.style.display = "none";
      addedMessage.style.display = "block";
      searchInput.value = "";
    } else {
      normalMessage.style.display = "none";
      errorMessage.style.display = "block";
      addedMessage.style.display = "none";
    }
  }
});

// Default cities — changed from original
loadCityCard("Delhi");
loadCityCard("Dubai");
loadCityCard("New York");
loadCityCard("Singapore");
loadCityCard("Sydney");
