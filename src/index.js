// Global variables that are used inside functions
let tempCelsiusFloat = null;
const apiKey = "1522ee297bdb323556a6c95f3b521f77";
let temperature = document.querySelector("#temperature");

//Celsius-Fahrenheit functions

function getCelsius(tempCelsius) {
    // rounds temperature value
    return Math.round(tempCelsius);
}

function getFahrengeit(tempCelsius) {
    // converts Celsius -> Fahrengeit
    return Math.round((tempCelsius * 9) / 5 + 32);
}

function switchToCelcius() {
    // displays Celsius temperature
    let tempCelsius = getCelsius(tempCelsiusFloat);
    temperature.innerHTML = `${tempCelsius}&deg;`;
}

function switchToFahrengeit() {
    // displays Fahrengeit temperature
    let tempFahrengeit = getFahrengeit(tempCelsiusFloat);
    temperature.innerHTML = `${tempFahrengeit}&deg;`;
}

// Date and Time functions
function makeDate(now) {
    // makes Date string 
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let dayWeek = days[now.getDay()];
    let dayDate = now.getDate();
    let month = months[now.getMonth()];
    return `${dayWeek} ${dayDate} ${month}`;
}

function makeTime(now) {
    // makes time string
    let hours = now.getHours();
    let minutes = now.getMinutes();
    if (minutes > 9) {
        return `${hours}:${minutes}`;
    } else {
        return `${hours}:0${minutes}`;
    }
}

function setDateTime() {
    // displays time and date
    let now = new Date();
    let time = document.querySelector("#time");
    time.innerHTML = makeTime(now);
    let date = document.querySelector("#date");
    date.innerHTML = makeDate(now);
}

//Display Real Weather functions

function displayRealCityTemperature(valueTemp) {
    // displays temperature in Celsius or in Fahrengeit depending on radiobox state
    tempCelsiusFloat = valueTemp;
    let temp = 0;
    if (radioCelsius.checked) {
        temp = getCelsius(valueTemp);
    } else {
        temp = getFahrengeit(valueTemp);
    }
    temperature.innerHTML = `${temp}&deg;`;
}

function displayVisibility(visibility) {
    // displays visibility
    let visibilitySpan = document.querySelector("#visibility");
    visibilitySpan.innerHTML = `${visibility}`;
}

function displayWind(windSpeed) {
    // displays wind speed
    let wind = Math.round(windSpeed);
    let windSpan = document.querySelector("#wind");
    windSpan.innerHTML = `${wind}`;
}

function displayClouds(clouds) {
    // displays weather
    let cloudsSpan = document.querySelector("#clouds");
    cloudsSpan.setAttribute("src", `http://openweathermap.org/img/wn/${clouds.icon}@2x.png`);
    cloudsSpan.setAttribute("alt", clouds.description);

}

function displayHumidity(humidity) {
    // displays humidity
    let humiditySpan = document.querySelector("#humidity");
    humiditySpan.innerHTML = `${humidity}`;
}

function displayWeather(response) {
    // calls display functions for temperature, visibility, wind speed, weather, humidity
    displayRealCityTemperature(response.data.main.temp);
    displayVisibility(response.data.visibility);
    displayWind(response.data.wind.speed);
    displayClouds(response.data.weather[0]);
    displayHumidity(response.data.main.humidity);
}

function setRealCityWeather(city) {
    // prepares apiUrl for a city, rescieves data and calls displayWeater for data
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayWeather);
}

// function setRealFiveDayWeather(city, apiKey) {

// }

//City Name Search functions

// copied from https://bobbyhadz.com/blog/javascript-capitalize-first-letter-of-each-word-in-string
function makeTitleCase(str, char) {
    // parses city name input and makes it look nice: without unnecessary ' ' and with the first letter title case only
    // contains bugs
    const titleCase = str
        .trim()
        .toLowerCase()
        .split(char)
        .map((word) => {
            return word.trim().charAt(0).toUpperCase() + word.trim().slice(1);
        })
        .join(char);
    return titleCase;
}

function getTitleCase(str) {
    // prepares city name input for parsing: checks if city name should contain ' ' or  '-' symbols, and call parsing function for both cases
    // contains bugs
    let titleCase = "";
    if (str.includes("-")) {
        titleCase = makeTitleCase(str, "-");
    } else {
        titleCase = makeTitleCase(str, " ");
    }
    return titleCase;
}

function setCityTitle(city) {
    // displays city name
    let cityName = document.querySelector("#city");
    cityName.innerHTML = city;
}

function displayForecast() {
    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = `
            <div class="col">
                <div class="card">
                    <div class="card-body center-align">
                        <h5 class="card-title forecast-day">Vijdag</h5>
                        <img id="clouds" src="http://openweathermap.org/img/wn/11d@2x.png" alt="thunderstorm">
                        <p class="card-text temperature-future">
                            <span class="max-forecast-temperature">19&deg;</span> <span
                                class="min-forecast-temperature">19&deg;</span>
                        </p>

                    </div>
                </div>
            </div>
    `;
}

function displayCityWeather(city) {
    // calls function to display city name, display weather and display weather for 5 days ahead
    setCityTitle(city);
    setRealCityWeather(city);
    // setRealFiveDayWeather(city);
}

function displayCity(event) {
    // takes the input city name, cleans input, sets date and time, calls function to display weather
    event.preventDefault();
    let cityInput = document.querySelector("#cityInput");
    let city = getTitleCase(cityInput.value);
    console.log(city);
    cityInput.value = "";
    setDateTime();
    displayCityWeather(city);
}

// Current Location Button Functions

function displayCurrentWeather(response) {
    // reads city name and calls function to display city name, display date and time, and display weather
    let city = response.data.name;
    setCityTitle(city);
    setDateTime();
    displayWeather(response);
}

function useCurrentPosition(position) {
    // reads longitude and latitude from position, repares apiUrl for a position, rescieves data and calls displayCurrentWeater for data
    let lon = position.coords.longitude;
    let lat = position.coords.latitude;
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayCurrentWeather);
}

function displayCurrentLocationWeather() {
    //recieves position data and calls useCurrentPosition for position data
    navigator.geolocation.getCurrentPosition(useCurrentPosition);
    // setRealFiveDayCurrentLocationWeather();
}

// Current Location Button
let currentLocationButton = document.querySelector("#currentLocationButton");
currentLocationButton.addEventListener("click", displayCurrentLocationWeather);

//City Name Search
let citySearch = document.querySelector("#citySearch");
citySearch.addEventListener("submit", displayCity);

//Celsius-Fahrenheit 
let radioCelsius = document.querySelector("#inlineRadio1");
let radioFahrengeit = document.querySelector("#inlineRadio2");
radioCelsius.addEventListener("click", switchToCelcius.bind(null, tempCelsiusFloat));
radioFahrengeit.addEventListener("click", switchToFahrengeit.bind(null, tempCelsiusFloat));

// Default

//displayCurrentLocationWeather();
setDateTime();
displayCityWeather("Kharkiv");
displayForecast();