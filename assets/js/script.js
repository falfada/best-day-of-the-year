let dateBirth ;

function handleSubmit(event) {
    event.preventDefault();

    dateBirth = $("#date-of-birth").val();

    console.log(dateBirth);
    if (!dateBirth) {
        alert("Date is required");
        return;
    }

    handleDate(dateBirth);
    convertDate(dateBirth);
}

function handleDate(date) {
    const dateObject = new Date(date);
    console.log(dateObject);
    fetchDateHistory(dateObject).then(handleData);
}
function convertDate(date) {
 const dateObject = new Date(date);
 const unixTime = dateObject.getTime() / 1000;
 console.log(unixTime);
    return unixTime;
}
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
    console.log(data);
    const births = data.births;
    renderEvents(births);
}

function renderEvents(births) {
    const birthList = $("#event-results");
    birthList.empty();
    births.forEach((births) => {
        const eventElement = $(
            `<li>You share a birthday with ${births.text}, who was born in ${births.year}.</li>`
        );
        birthList.append(eventElement);
    });
}

function handleBirthPlace(event) {
    event.preventDefault();
    const birthPlace = $("#birthplace-search").val();
    console.log(birthPlace);
    getBirthPlaceLatLon(birthPlace);
}

function getBirthPlaceLatLon(birthPlace) {
    const apiKey = "930ab72ef79543069c0462a5f5878d1a";
    const cityQueryUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${birthPlace}&appid=${apiKey}`;
    fetch(cityQueryUrl)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            getLatitudeLongitude(data);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
}

function getLatitudeLongitude(data) {
    const latitude = data[0].lat;
    const longitude = data[0].lon;
    const date = convertDate(date);

    console.log(latitude, longitude);
    fetchData(latitude, longitude, date);
}

function fetchData(lat, lon, date) {
    alert('its working');
    const apiKey = "930ab72ef79543069c0462a5f5878d1a";
    fetch(`https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${date}&appid=${apiKey}`)
        .then(function (response) {
            return response.json()

        })
        .then(function (data) {
            console.log(data)
            
        })
        .catch(function (error) {
            console.log("Error on the API requeriments", error)
        })
}

$(document).ready(function () {
    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+0",
    });

    $("#date-form").on("submit", handleSubmit);

    $("#birthplace-request").on("submit", handleBirthPlace);
});
// add the form 