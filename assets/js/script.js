let birthDate;
let birthPlace;

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
  // close modal
  document.getElementById("modal_dob").close();

  // render birthplace to page
  renderBirthPlaceBirthYear(birthPlace, birthDate);
  // get latitude and longitude of birthplace for weather API
  geoLocateBirthPlace(birthPlace);
  handleDate(birthDate);
  convertDate(birthDate);
}
// render birthplace and birthdate to page
function renderBirthPlaceBirthYear(place, date) {
  const placeOfBirth = $("#place-of-birth");
  placeOfBirth.text(place);
  const yearOfBirth = $("#year-of-birth");
  const dayMonthOfBirth = $("#day-month-of-birth");
  // get birthday from date
  const dateObject = new Date(date);
    yearOfBirth.text(dateObject.getFullYear());
    dayMonthOfBirth.text(dateObject.getDate() + "/" + (dateObject.getMonth() + 1));
}

// use OpenWeather API to get latitude and longitude of birthplace
function geoLocateBirthPlace(birthPlace) {
  const apiKey = "930ab72ef79543069c0462a5f5878d1a";
  const cityQueryUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${birthPlace}&appid=${apiKey}`;
  fetch(cityQueryUrl)
    .then((response) => response.json())
    .then((data) => {
      getLatitudeLongitude(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

// read Lat & Lon from API response
function getLatitudeLongitude(data) {
  const latitude = data[0].lat;
  const longitude = data[0].lon;
  // convert global birthDate to unix time
  const date = convertDate(birthDate);
  // call weather API with lat, lon, and date
  fetchWeatherData(latitude, longitude, date);
}

function fetchWeatherData(lat, lon, date) {
  const apiKey = "930ab72ef79543069c0462a5f5878d1a";
  fetch(
    `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${date}&appid=${apiKey}&units=metric`
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(`This is the weather: `, data);
      renderWeather(data);
    })
    .catch(function (error) {
      console.log("Error on the API requeriments", error);
    });
}

function renderWeather(data) {
    // const weather = data.current.weather[0].description;
    // console.log(weather);
    const date = convertDate(birthDate);
    // const age = currentAge(unixTime * 1000);
    let thisYear = new Date();
    let thisYearUni = convertDate(thisYear);
    let currentAge = convertDate(thisYear) - convertDate(date);
    console.log(currentAge);
    const dayjs = require(‘dayjs’);
    let age = dayjs();
    console.log(age);

 
 const birthAge = date.getFullYear();


    
const
 year = date.getFullYear();

    const birthdayTemp = $("#birthday-temp");
    birthdayTemp.text(`${data.data[0].temp} C`);
}

function handleDate(date) {
  const dateObject = new Date(date);
  console.log(dateObject);
  fetchDateHistory(dateObject).then(handleData);
}
function convertDate(date) {
  const dateObject = new Date(date);
  const unixTime = dateObject.getTime() / 1000;
  return unixTime;
}
async function fetchDateHistory(date) {
  const wikiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/births/${
    date.getMonth() + 1
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
  console.log(data);
  const births = data.births;
  renderEvents(births);
}

function renderEvents(births) {
//   const birthList = $("#event-results");
//   birthList.empty();
//   births.forEach((births) => {
//     const eventElement = $(
//       `<li>You share a birthday with ${births.text}, who was born in ${births.year}.</li>`
//     );
//     birthList.append(eventElement);
//   });
}

function handleBirthPlace(event) {}

$(document).ready(function () {
  $("#date-form").on("submit", handleSubmit);
});