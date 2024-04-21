// weather API key
const apiKey = "930ab72ef79543069c0462a5f5878d1a";
// the user's birthdate and birthplace from the form
let birthDate;
let birthPlace;
// the user's age in years from the function getAgeInYears()
let ageInYears;
// Array to store the Unix timestamps for each year of the user's life from the function generateYearlyUnixTimestamps()
const unixTimestamps = [];
// the latitude and longitude of the user's birthplace from the function getLatitudeLongitude()
let latitude;
let longitude;


function handleSubmit(event) {
  event.preventDefault();
  // get birthdate from input
  birthDate = $("#date-of-birth").val();
  // get birthplace from input
  birthPlace = $("#birthplace-search").val();
  // validate input
  if (!birthDate || !birthPlace) {
    alert("Please enter a valid birthdate and birthplace");
    return;
  }
  // clean form input fields
  $("#date-of-birth").val("");
  $("#birthplace-search").val("");
  // close modal
  document.getElementById("modal_dob").close();

  // get age in years
  getAgeInYears();
  console.log(`Age in years: ${ageInYears}`);

  // generate yearly unix timestamps from birthDate until now and store in global unixTimestamps array
  generateYearlyUnixTimestamps(birthDate, ageInYears);

  // get latitude and longitude of birthplace for weather API and fetch weather data asynchronously
  geoLocateBirthPlace(birthPlace)
    .then((data) => getLatitudeLongitude(data))
    .then(() => fetchWeatherData(unixTimestamps));

  // render birthplace to page
  renderBirthPlaceBirthYear(birthPlace);

  // TODO - STILL NEED TO GET A FAMOUS BIRTHDAY FOR EACH YEAR OF WEATHER FROM THE WIKI API
  handleDate(birthDate);
  convertDate(birthDate);

  renderEvents(birthDate)

  // NOTE THE renderEvents() FUNCTION IS NOT ACTIVE - NEED TO GET THE FAMOUS BIRTHDAY RANDOMLY FROM THE WIKI API AND RENDER TO THE PAGE WITH THE WEATHER DATA FOR EACH YEAR
  // SEE LINE 190 & 193 BELOW
}

function generateYearlyUnixTimestamps(birthDate, ageInYears) {
  // Parse the input date to ensure it's a Date object
  let date = new Date(birthDate);
  // push original birthdate to array
  unixTimestamps.push(date.getTime() / 1000);

  // Loop to generate additional dates, adding one year each time
  for (let i = 0; i < ageInYears; i++) {
    // Create a new Date object from the current date
    let newDate = new Date(date);
    // Add one year
    newDate.setFullYear(newDate.getFullYear() + 1);
    // Convert the new date to a Unix timestamp and add it to the array
    unixTimestamps.push(newDate.getTime() / 1000);
    // Update the date for the next iteration
    date = newDate;
  }
}

// render birthplace and birthdate to page
function renderBirthPlaceBirthYear(place) {
  const placeOfBirth = $("#place-of-birth");
  placeOfBirth.text(place);
}

// use OpenWeather API to get latitude and longitude of birthplace
function geoLocateBirthPlace(birthPlace) {
  const cityQueryUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${birthPlace}&appid=${apiKey}`;

  return fetch(cityQueryUrl)
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
      return data;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// read Lat & Lon from API response
function getLatitudeLongitude(data) {
  latitude = data[0].lat;
  longitude = data[0].lon;
}

// Note async function waits until each date has been fetched before moving on to the next
async function fetchWeatherData(dateArray) {
  // loop through each date in the array
  for (const date of dateArray) {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${date}&appid=${apiKey}&units=metric`
      );
      const data = await response.json();
      console.log(data);
      // render the weather data to the page
      renderWeather(data);
    } catch (error) {
      console.log("Error: ", error);
    }
  }
}


function renderWeather(data) {
  const birthdayTemp = $("#weather-results");

  // convert unix timestamp to date and get year
  const nextDate = new Date(data.data[0].dt * 1000);
  const nextYear = nextDate.getFullYear();
  const month = nextDate.getMonth() + 1;
  const day = nextDate.getDate();
  // create div for each year to append to birthdayTemp
  const yearDiv = (`
  <div class="bg-green-400 rounded-lg p-8 mb-5">
    <h3 class="text-3xl uppercase montserrat-900-italic">
      In the year ${nextYear}
    </h3>
    <p class="montserrat-400 text-xl">
      On <span id="day-month-of-birth"> ${day}/${month}</span>
    </p>
    <div class="flex gap-4">
      <div
        class="w-auto inline-flex gap-x-2 px-4 py-2 mt-4 bg-white/30 backgrop-blur-sm rounded-full text-xl"
      >
        <span class="material-symbols-outlined"> thermostat </span>

        <p class="montserrat-400 text-md">${Math.round(data.data[0].temp)} C</p>
      </div>

      <div
        class="w-auto inline-flex gap-x-2 px-4 py-2 mt-4 bg-white/30 backgrop-blur-sm rounded-full text-xl"
      >
        <span class="material-symbols-outlined"> air </span>
        <p class="montserrat-400 text-md"> ${data.data[0].wind_speed} km/h</p>
      </div>

      <div
        class="w-auto inline-flex gap-x-2 px-4 py-2 mt-4 bg-white/30 backgrop-blur-sm rounded-full text-xl"
      >
        <span class="material-symbols-outlined"> humidity_mid </span>
        <p class="montserrat-400 text-md"> ${data.data[0].humidity}%</p>
      </div>
    </div>
  </div>`);
  // append div to birthdayTemp
  birthdayTemp.append(yearDiv);
}

function getAgeInYears() {
  let birthday = new Date(birthDate);
  let currentDate = new Date();

  ageInYears = currentDate.getFullYear() - birthday.getFullYear();

  // Adjust for cases where the current date is before the birth date in the calendar year
  if (
    currentDate.getMonth() < birthday.getMonth() ||
    (currentDate.getMonth() == birthday.getMonth() &&
      currentDate.getDate() < birthday.getDate())
  ) {
    ageInYears--;
  }
}

// gets the famous births from the wiki API
function handleDate(date) {
  const dateObject = new Date(date);
  console.log(dateObject);
  // get
  fetchDateHistory(dateObject).then(handleData);
}

function convertDate(date) {
  const dateObject = new Date(date);
  const unixTime = dateObject.getTime() / 1000;
  return unixTime;
}

// Get the famous birthdays from the wiki API
async function fetchDateHistory(date) {
  const wikiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${date.getMonth() + 1
    }/${date.getDate()}`;

  let response = await fetch(wikiUrl, {
    headers: {
      Authorization:
        "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJiODE0MzI2M2EwNjdlMTZjYTk4Yjc3NTE5ZDYyMjAyOSIsImp0aSI6IjkzNmFiMzQzZjE5Njc4YjQ2NzEwOGU5YjhmNjQ2MjdjMTI4ODRjNzczMDcyYzc3MjYwMGJkZjdhZjY2ZTZhZTliY2MzYmYyMTUwMDE0M2E5IiwiaWF0IjoxNzEyNzAwNzAzLjU1ODU5MSwibmJmIjoxNzEyNzAwNzAzLjU1ODU5NCwiZXhwIjozMzI2OTYwOTUwMy41NTcwMTQsInN1YiI6Ijc1Mzk1ODMxIiwiaXNzIjoiaHR0cHM6Ly9tZXRhLndpa2ltZWRpYS5vcmciLCJyYXRlbGltaXQiOnsicmVxdWVzdHNfcGVyX3VuaXQiOjUwMDAsInVuaXQiOiJIT1VSIn0sInNjb3BlcyI6WyJiYXNpYyJdfQ.ujp3V_UB6_tfrkt9Gm22HJXSkU-JuUufVRlRiUzkbGt60vDu2vNABOfZz7Cv2EBkxjfRpsk2i3ov135zXQWBZZPxwrmk_ilB5hlaoVIrQrRaZ1zyC0j_3fnpI4zsC07FExbWFPOokTQID1Z4_mRsc7MfBZzi_tGNXPOcT0TmFWN3D5WNvpWnbCedfNDr3J_sUXQQaEDS10cncjes96ourgg93X_ZnmBTcQJ4R_Y8jppkTz_aaAeYCJju-SFCwmjThrKzcKSY1kY7C0a3_P39YhiZYfu0TLBoySPyNHTv1t5eo55F9FzZ1DQRQhJSKg4Mc0OdPtWgLvE09gb6B7AY9rdWeN2p9fjOIcIXlK4f8oBTP7CWC0ugOUoDE7a0Ob9fwIMhG_YIS6mrNS_ms3diIYP7DqidDY6h-W6KIyA4QfKtObcS1gzPpfTVvehBTMW7iBcvBNakvkPxtE7YlKFtYfyOgeW2sw-r-BKscXMtPvPyzAZHnUCSMNICoudmkN0E49yuDihH4sHMxa_IZ3BHeIqHwMk1ZA7J44tC39g82h1uBVjYQyf80jGmViz_mOYNlW1tT3qGiCf8ZNCVVI65Mp0U4D_DTOSG7ukHogixQvYRO-2Qz2tPNbC9cZKicpP19sUTTNlRcGkQwMVPt4rz6vbHCJaWjtpoa7E1YPh8RcM",
      "Api-User-Agent": "best_day_of_the_year",
    },
  });
  return response.json().catch(console.error);
}

function handleData(data) {
  const births = data.births;

  console.log(data);
  renderEvents(births);
}

function renderEvents(births) {

  const birthList = $("#event-results");

  birthList.empty();

  let randomBirths = [];
  for (let i = 0; i < unixTimestamps.length; i++) {
    randomBirths.push(births[Math.floor(Math.random() * births.length)]);

  }
  console.log(randomBirths);
  randomBirths.forEach((births) => {

    const eventElement = $(
      `
        <div class="bg-yellow-200 rounded-lg p-8 mb-5">
        <p class="text-2xl uppercase montserrat-900-italic">
         You share a birthday with ${births.text}
        </p>
        <p class="montserrat-400">who was born in ${births.year} </p>
      </div>`
    );
    birthList.append(eventElement);
  });

}

$(document).ready(function () {
  $("#date-form").on("submit", handleSubmit);
});
