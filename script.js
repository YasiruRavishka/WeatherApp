const nameID = document.getElementById("name");
const temp_c = document.getElementById("temp_c");
const condition = document.getElementById("condition");
const conditionImg = document.getElementById("condition-img");
const humidity = document.getElementById("humidity");
const wind_kph = document.getElementById("wind_kph");
const pressure_mb = document.getElementById("pressure_mb");
const tz_id = document.getElementById("tz_id");
const region = document.getElementById("region");
const country = document.getElementById("country");
const lat = document.getElementById("lat");
const lon = document.getElementById("lon");
const map = document.getElementById("map");
const localtime = document.getElementById("localtime");
let dateTime = new Date();

const apiKey = "e8bff90534f74cf8a57113520242708";

// ------------------------------ Functions ------------------------------
function getLocation() {
  // ----- Getting the device location -----
  navigator.geolocation.getCurrentPosition(
    (position) => {
      loadLocationData(
        position.coords.latitude + "," + position.coords.longitude
      );
    },
    (error) => {
      loadLocationData("Colombo");
      if (error.code == error.PERMISSION_DENIED) {
        alert("Location access denied.");
      } else {
        alert("Geolocation is not supported. Try a anothor browser.");
      }
    }
  );
}
async function fetchCurrentWeather(location) {
  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${location}`
    );
    if (!response.ok) {
      throw error;
    }
    const data = await response.json();
    nameID.innerHTML = data.location.name;
    temp_c.innerHTML = data.current.temp_c + " ℃";
    condition.innerHTML = data.current.condition.text;
    conditionImg.innerHTML = `<img src=${data.current.condition.icon} alt=${data.current.condition.text}>`;
    humidity.innerHTML = data.current.humidity + " %";
    wind_kph.innerHTML = data.current.wind_kph + " kph";
    pressure_mb.innerHTML = data.current.pressure_mb + " mb";
    tz_id.innerHTML = data.location.tz_id;
    region.innerHTML = data.location.region;
    country.innerHTML = data.location.country;
    lat.innerHTML = data.location.lat;
    let latitude = parseFloat(data.location.lat);
    lon.innerHTML = data.location.lon;
    let longitude = parseFloat(data.location.lon);
    map.innerHTML = `<iframe src="https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.4}%2C${latitude - 0.1}%2C${longitude + 0.4}%2C${latitude + 0.1}&amp;layer=mapnik&amp;marker=${latitude}%2C${longitude}" style="width:100%; height:100%; border-radius: inherit;"></iframe>`;
    dateTime = new Date(data.location.localtime);
  } catch (error) {
    console.error("CurrentWeather-api doesn't work properly.");
  }
}
async function fetchWeatherForecast(location) {
  const forecastCard = document.getElementById("forecast-cards");
  let tempDate = new Date(dateTime);
  try {
    let cardBody = "";
    for (let index = 0; index < 5; index++) {
      tempDate.setDate(tempDate.getDate() + 1);
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&dt=${tempDate.toLocaleDateString(
          "sv-SE"
        )}`
      );
      if (!response.ok) {
        throw error;
      }
      const data = (await response.json()).forecast.forecastday[0];
      cardBody += `<div class="card text-bg-light flex-fill">
                                  <div class="card-body">
                                    <table class="m-auto fw-semibold">
                                      <tr>
                                        <td>${data.date}</td>
                                      </tr>
                                      <tr>
                                        <td><img src=${data.day.condition.icon} alt=${data.day.condition.text}></td>
                                      </tr>
                                      <tr>
                                        <td>${data.day.condition.text}</td>
                                      </tr>
                                    </table>
                                  </div>
                                </div>`;
    }
    forecastCard.innerHTML = cardBody;
  } catch (error) {
    console.error("WeatherForecast-api doesn't work properly.");
  }
}
function loadLocationData(location) {
  // ----- Loading the location data -----
  try {
    fetchCurrentWeather(location);
    fetchWeatherForecast(location);
  } catch (error) {
    console.error("Function error -> loadLocationData()");
  }
}
function btnSearchOnClick(searchbarID) {
  // ----- Button action event -----
  let searchCheck = document.getElementById(searchbarID).value;
  if (searchCheck.replace(" ", "") == "") {
    return;
  }
  try {
    loadLocationData(document.getElementById(searchbarID).value);
    document.getElementsByTagName("header")[0].scrollIntoView();
  } catch (error) {
    console.error("Function error -> btnSearchOnClick()");
  } finally {
    document.getElementById("header-txtSearch").value = null;
    document.getElementById("footer-txtSearch").value = null;
  }
}
function updateLocalTime() {
  // ----- Updating current time -----
  try {
    dateTime.setTime(dateTime.getTime() + 1000);
    localtime.innerText = dateTime.toLocaleTimeString();
  } catch (error) {
    console.error("Function error -> updateLocalTime()");
  }
}
// ------------------------------ Runtime ------------------------------
getLocation();
setInterval(updateLocalTime, 1000);
