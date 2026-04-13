const apiKey = "3a7864eb4ac2470b41ca0c1f6c30d49c"; // <-- replace this

const cityEl = document.getElementById("city");
const tempEl = document.getElementById("temp");
const condEl = document.getElementById("condition");

const loading = document.getElementById("loading");
const error = document.getElementById("error");

// ICONS
const icons = {
  hot: document.querySelector(".hot"),
  cloudy: document.querySelector(".cloudy"),
  stormy: document.querySelector(".stormy"),
  breezy: document.querySelector(".breezy"),
  night: document.querySelector(".night"),
};

// 🔄 RESET ICONS
function resetIcons() {
  Object.values(icons).forEach(i => i.style.display = "none");
}

// 🎯 SET ICON
function setIcon(weather) {
  resetIcons();

  if (weather.includes("clear")) icons.hot.style.display = "block";
  else if (weather.includes("cloud")) icons.cloudy.style.display = "block";
  else if (weather.includes("rain") || weather.includes("thunder")) icons.stormy.style.display = "block";
  else if (weather.includes("wind")) icons.breezy.style.display = "block";
  else icons.night.style.display = "block";
}

// 🌍 FETCH WEATHER
async function getWeather(city) {
  try {
    loading.style.display = "block";
    error.innerText = "";

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );

    if (!res.ok) throw new Error("City not found");

    const data = await res.json();

    cityEl.innerText = data.name;
    tempEl.innerText = Math.round(data.main.temp) + "°C";
    condEl.innerText = data.weather[0].main;

    setIcon(data.weather[0].main.toLowerCase());

    // 🌙 DAY/NIGHT BACKGROUND
    if (data.dt > data.sys.sunset) {
      document.body.style.background = "#0b1d3a";
    } else {
      document.body.style.background = "#fff";
    }

  } catch (e) {
    error.innerText = "❌ " + e.message;
  } finally {
    loading.style.display = "none";
  }
}

// 📅 FORECAST
async function getForecast(city) {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
  );

  const data = await res.json();
  const days = document.querySelectorAll(".day");

  let index = 0;

  for (let i = 0; i < data.list.length; i += 8) {
    if (days[index]) {
      const temp = Math.round(data.list[i].main.temp);
      const date = new Date(data.list[i].dt_txt).toDateString().slice(0, 3);

      days[index].innerHTML = `${date}<br>${temp}°C`;
      index++;
    }
  }
}

// 🔍 SEARCH
document.getElementById("searchBox").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = e.target.value;
    getWeather(city);
    getForecast(city);
  }
});

// 📍 LOCATION
document.getElementById("locBtn").onclick = () => {
  navigator.geolocation.getCurrentPosition(async (pos) => {
    const { latitude, longitude } = pos.coords;

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
    );

    const data = await res.json();

    getWeather(data.name);
    getForecast(data.name);
  });
};

// 🚀 INITIAL LOAD
getWeather("Kota");
getForecast("Kota");

// 🔄 AUTO REFRESH
setInterval(() => getWeather(cityEl.innerText), 600000);
