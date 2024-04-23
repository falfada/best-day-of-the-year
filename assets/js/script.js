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


// function to handle the form submission
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
  // send birthdate to local storage
  localStorage.setItem("birthdate", JSON.stringify(birthDate));
  // send birthplace to local storage
  localStorage.setItem("birthplace", JSON.stringify(birthPlace));

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

  // get the historical birthdays from the wiki API
  fetchHistory(birthDate);
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
  const yearDiv = `
  <div class="bg-green-400 rounded-lg p-8 mb-5">
    <h3 class="text-3xl uppercase montserrat-900-italic">
      In the year ${nextYear}, on ${day}/${month}
    </h3>
    <p class="montserrat-400 text-xl">
      The weather was:
    </p>
    <div class="flex flex-wrap gap-x-4">
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
  </div>`;
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

// gets a date object for the wikimedia API call
async function fetchHistory(date) {
  // convert birthDate to a date object
  const dateObject = new Date(date);
  // call the history API with the date object
  try {
    const data = await fetchDateHistory(dateObject);
  } catch (error) {
    console.error("Error: ", error);
  }
}

// fetches the historical births from the wikimedia API
async function fetchDateHistory(date) {
  const wikiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${date.getMonth() + 1
    }/${date.getDate()}`;

    try {
      const response = await fetch(wikiUrl);
      const data = await response.json();
      const births = data.births;
      // renderBirths waits for the data to be fetched before executing
      renderBirths(births);
    } catch (error) {
      console.error("Error: ", error);
    }
}

// renders the historical births to the page
function renderBirths(births) {

  const birthList = $("#event-results");

  birthList.empty();

  birthList.append(
            `<div class="bg-yellow-200 rounded-lg p-8 mb-5">
        <p class="text-2xl uppercase montserrat-900-italic">
         You share a birthday with:
      </div>`
  );

  let randomBirths = [];
  for (let i = 0; i < unixTimestamps.length; i++) {
    randomBirths.push(births[Math.floor(Math.random() * births.length)]);

  }
  console.log(randomBirths);

  // send births to local storage
  localStorage.setItem("births", JSON.stringify(randomBirths));

  randomBirths.forEach((births) => {

    const eventElement = $(
      `
        <div class="bg-yellow-200 rounded-lg p-8 mb-5">
        <p class="text-2xl uppercase montserrat-900-italic">
         ${births.text}. Born: ${births.year}
        </p>
        <p class="montserrat-400">${births.pages[0].extract} </p>
      </div>`
    );

    birthList.append(eventElement);
  });

}

// Await user input in the form
$(document).ready(function () {
  $("#date-form").on("submit", handleSubmit);

});

let birthplaceLocalStorage = JSON.parse(localStorage.getItem("birthplace"));
birthDate = JSON.parse(localStorage.getItem("birthdate"));
let celebritiesBirths = JSON.parse(localStorage.getItem("births"));

if(birthplaceLocalStorage && birthDate && celebritiesBirths){
  console.log(birthDate);
  renderBirthPlaceBirthYear(birthplaceLocalStorage);
  getAgeInYears();

  // generate yearly unix timestamps from birthDate until now and store in global unixTimestamps array
  generateYearlyUnixTimestamps(birthDate, ageInYears);

  // get latitude and longitude of birthplace for weather API and fetch weather data asynchronously
  geoLocateBirthPlace(birthplaceLocalStorage)
    .then((data) => getLatitudeLongitude(data))
    .then(() => fetchWeatherData(unixTimestamps));

  fetchHistory(birthDate);
}

