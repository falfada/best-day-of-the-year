
function handleSubmit(event) {
        event.preventDefault();
        if ($("#datepicker").val() == "") {
            alert("Date is required");
            return;
        }
        const date = $("#datepicker").val();
        $("#datepicker").val("");
        handleDate(date);
    }

function handleDate(date) {

    const dateObject = new Date(date);
    
    fetchDateHistory(dateObject).then(handleData);
}

async function fetchDateHistory(date) {
    const wikiUrl = `https://api.wikimedia.org/feed/v1/wikipedia/en/onthisday/events/${date.getMonth() + 1}/${date.getDate()}`;

    let response = await fetch( wikiUrl,
    {
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJiODE0MzI2M2EwNjdlMTZjYTk4Yjc3NTE5ZDYyMjAyOSIsImp0aSI6IjkzNmFiMzQzZjE5Njc4YjQ2NzEwOGU5YjhmNjQ2MjdjMTI4ODRjNzczMDcyYzc3MjYwMGJkZjdhZjY2ZTZhZTliY2MzYmYyMTUwMDE0M2E5IiwiaWF0IjoxNzEyNzAwNzAzLjU1ODU5MSwibmJmIjoxNzEyNzAwNzAzLjU1ODU5NCwiZXhwIjozMzI2OTYwOTUwMy41NTcwMTQsInN1YiI6Ijc1Mzk1ODMxIiwiaXNzIjoiaHR0cHM6Ly9tZXRhLndpa2ltZWRpYS5vcmciLCJyYXRlbGltaXQiOnsicmVxdWVzdHNfcGVyX3VuaXQiOjUwMDAsInVuaXQiOiJIT1VSIn0sInNjb3BlcyI6WyJiYXNpYyJdfQ.ujp3V_UB6_tfrkt9Gm22HJXSkU-JuUufVRlRiUzkbGt60vDu2vNABOfZz7Cv2EBkxjfRpsk2i3ov135zXQWBZZPxwrmk_ilB5hlaoVIrQrRaZ1zyC0j_3fnpI4zsC07FExbWFPOokTQID1Z4_mRsc7MfBZzi_tGNXPOcT0TmFWN3D5WNvpWnbCedfNDr3J_sUXQQaEDS10cncjes96ourgg93X_ZnmBTcQJ4R_Y8jppkTz_aaAeYCJju-SFCwmjThrKzcKSY1kY7C0a3_P39YhiZYfu0TLBoySPyNHTv1t5eo55F9FzZ1DQRQhJSKg4Mc0OdPtWgLvE09gb6B7AY9rdWeN2p9fjOIcIXlK4f8oBTP7CWC0ugOUoDE7a0Ob9fwIMhG_YIS6mrNS_ms3diIYP7DqidDY6h-W6KIyA4QfKtObcS1gzPpfTVvehBTMW7iBcvBNakvkPxtE7YlKFtYfyOgeW2sw-r-BKscXMtPvPyzAZHnUCSMNICoudmkN0E49yuDihH4sHMxa_IZ3BHeIqHwMk1ZA7J44tC39g82h1uBVjYQyf80jGmViz_mOYNlW1tT3qGiCf8ZNCVVI65Mp0U4D_DTOSG7ukHogixQvYRO-2Qz2tPNbC9cZKicpP19sUTTNlRcGkQwMVPt4rz6vbHCJaWjtpoa7E1YPh8RcM',
            'Api-User-Agent': 'best_day_of_the_year'
        }
    }
);
return response.json().catch(console.error);
}

function handleData(data) {
        console.log(data);
        const events = data.events;
        renderEvents(events);;    
}

function renderEvents(events) {
    const eventList = $("#event-results");
    eventList.empty();
    events.forEach(event => {
        const eventElement = $(`<li>On this day in ${event.year}: ${event.text}</li>`);
        eventList.append(eventElement);
    })
}


$(document).ready(function () {

    $("#datepicker").datepicker({
        changeMonth: true,
        changeYear: true,
        yearRange: "-100:+0",
    });

    $("#form-input").on("submit", handleSubmit);

    


});