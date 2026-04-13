const apiKey = "YOUR_API_KEY"; // <-- replace this

const city = "Kota"; // you can change or make dynamic

async function getWeather() {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  
  const res = await fetch(url);
  const data = await res.json();

  // Update UI
  document.getElementById("city").innerText = data.name;
  document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";
  document.getElementById("condition").innerText = data.weather[0].main;

  // Hide all icons first
  document.querySelector(".hot").style.display = "none";
  document.querySelector(".cloudy").style.display = "none";
  document.querySelector(".stormy").style.display = "none";
  document.querySelector(".breezy").style.display = "none";
  document.querySelector(".night").style.display = "none";

  const weather = data.weather[0].main.toLowerCase();

  // Show correct icon (YOUR ORIGINAL DESIGN)
  if (weather.includes("clear")) {
    document.querySelector(".hot").style.display = "block";
  } 
  else if (weather.includes("cloud")) {
    document.querySelector(".cloudy").style.display = "block";
  } 
  else if (weather.includes("rain") || weather.includes("thunder")) {
    document.querySelector(".stormy").style.display = "block";
  } 
  else if (weather.includes("wind")) {
    document.querySelector(".breezy").style.display = "block";
  } 
  else {
    document.querySelector(".night").style.display = "block";
  }
}

getWeather();
setInterval(getWeather, 600000); // refresh every 10 mins
