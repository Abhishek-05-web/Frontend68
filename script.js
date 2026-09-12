//Live-date added 
function updateDate(){
    const now=new Date();
    const day=now.toLocaleDateString("en-IN",{
        weekday:"long"
    });

    const date=now.getDate();
    const month=now.toLocaleDateString("en-IN",{
        month:"long"
    }).toUpperCase();

    document.querySelector(".date").textContent=`${day} · ${date} ${month}`;
}
updateDate();
setInterval(updateDate,60000);
// --------------------------------------------------------------------------------------------
// ------------------------------Live-location added-------------------------------------------
// --------------------------------------------------------------------------------------------
const searchBar=document.getElementById("search-bar");
const searchButton=document.querySelector(".search-button");

searchButton.addEventListener("click",async(event) => {
    event.preventDefault();
    const query =searchBar.value.trim();
    
    if(!query) return;
    try{
        const response=await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=1&language-en&format=json`
        );
        if(!response.ok){
            throw new Error("API error");
        }
        const data=await response.json();

        if(!data.results||data.results.length===0){
            alert("Location not found");
            return;
        }
        const location=data.results[0];

        const city=location.name|| "";
        const state=location.admin1||"";
        const district= 
            location.admin2||
            location.admin3||
            "";

        //Header-> City, State
        document.querySelector(".location-address h3").textContent=[city, state].filter(Boolean).join(", ");

        //Weather Card-> City
        document.querySelector(".location-line1").textContent= city;

        //Weather Card -> District, state
        document.querySelector(".location-line2").textContent=[district, state].filter(Boolean).join(", ");

        //LIVE Weather
        await updateCurrentWeathter(location.latitude, location.longitude);
        await updateFourWeatherBoxes(location.latitude,location.longitude);
    } catch(error){
        console.error(error);
        alert("Unable to fetch location");
    }
});
// --------------------------------------------------------------------------------
// ----------------------------Theme-Mod-Change-----------------------------------
// ---------------------------------------------------------------------------------

const modeButton=document.querySelector(".mode");
const modeIcon=document.querySelector(".mode i");

modeButton.addEventListener("click",() =>{
    document.body.classList.toggle("dark-mode");
    if (document.body.classList.contains("dark-mode")){
        modeIcon.className="fa-solid fa-sun";
        modeIcon.style.color="white";

        localStorage.setItem("theme","dark");
    }else{
        modeIcon.className="fa-solid fa-circle-half-stroke";
        modeIcon.style.color="black";

        localStorage.setItem("theme","light");
    }
});
//Refresh k bad bhi selected mode rahega
if(localStorage.getItem("theme") ==="dark"){
    document.boby.classList.add("dark-mode");

    modeIcon.className="fa-solid fa-sun";
    modeIcon.style.color="white";
}
// =================================Night image change====================
const weatherIcon=document.getElementById("weather-icon");

function updateWeatherIcon(){
    const hour=new Date().getHours();

    if(hour>=6&&hour<18){
        weatherIcon.src="Icon/partly-cloudy-day.png";
    }else{
        weatherIcon.src="Icon/partly-cloudy-night.jpeg";
    }
}
updateWeatherIcon();
setInterval(updateWeatherIcon,60000);
// =======================================
// ============Risk-bar===================
// =======================================

function updateRiskBars(rain, wind, temperature){
    //Rain: already 0-100%
    const rainPercent=Math.min(rain,100);
    //Wind: 60km/h=full bar
    const windPercent=Math.min((wind/60)*100,100);
    //Temperature:20 C -> 0%, 45C-> 100%
    const heatPercent=Math.min(Math.max(((temperature-20)/25)*100,0),100);

    document.querySelector(".rain-bar").style.width=rainPercent+"%";
    document.querySelector(".wind-bar").style.width=windPercent+"%";
    document.querySelector(".heat-bar").style.width=heatPercent+"%";

    document.querySelector(".rain-level").textContent=
        rain<30 ? "Low":
        rain<70 ? "Moderate":"High";
    document.querySelector(".wind-level").textContent=
        wind<20 ? "Low":
        wind<40 ? "Moderate":"High";
    document.querySelector(".heat-level").textContent=
        temperature<30 ? "Low":
        temperature<38 ? "Moderate":"High";
}
//Abhi testing
updateRiskBars(1,80,21);
// ============================================================
// ======================Temp-active===========================
// ============================================================

async function updateCurrentWeathter(latitude, longitude){
    const response= await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&timezone=auto`
    );

    if(!response.ok){
        throw new Error("Weather API Error");
    }
    const weatherData= await response.json();

    const temperature=Math.round(
        weatherData.current.temperature_2m
    );

    const weatherCode= weatherData.current.weather_code;

    const conditions={
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Cloudy",
        45: "Fog",
        48: "Fog",
        51: "Light drizzle",
        53: "Drizzle",
        55: "Heavy drizzle",
        61: "Light rain",
        63: "Rain",
        65: "Heavy rain",
        71: "Light snow",
        73: "Snow",
        75: "Heavy snow",
        80: "Rain showers",
        81: "Rain showers",
        82: "Heavy showers",
        95: "Thunderstorm",
        96: "Thunderstorm",
        99: "Severe thunderstorm"
    };

    document.querySelector(".main-temp-val h1").textContent=temperature;
    document.querySelector(".condition").textContent=conditions[weatherCode]||"Weather";
}

// ===========================
// const location=data.results[0];
// updateCurrentWeathter(location.latitude, location.longitude);
// ===================================================================
// ================Weather result live================================
// ===================================================================
async function updateFourWeatherBoxes(latitude, longitude) {

    const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,wind_direction_10m&hourly=precipitation_probability&daily=uv_index_max&timezone=auto&forecast_days=1`
    );

    if (!response.ok) {
        throw new Error("Weather details API error");
    }

    const data = await response.json();

    // ===== HUMIDITY =====
    const humidity = data.current.relative_humidity_2m;

    const humidityLevel =
        humidity < 40 ? "Dry" :
        humidity <= 60 ? "Comfortable" :
        humidity <= 75 ? "Humid" :
        "Uncomfortable";

    document.querySelector(".Humidity").textContent = humidityLevel;
    document.querySelector(".Box1 .data").textContent =
        Math.round(humidity) + "%";


    // ===== WIND =====
    const wind = data.current.wind_speed_10m;
    const degree = data.current.wind_direction_10m;

    const directions = ["N","NE","E","SE","S","SW","W","NW"];

    const direction =
        directions[Math.round(degree / 45) % 8];

    const windLevel =
        wind < 10 ? "Calm" :
        wind < 20 ? "Breeze" :
        wind < 40 ? "Windy" :
        "Strong";

    document.querySelector(".Wind").textContent =
        `${direction} ${windLevel}`;

    document.querySelector(".Box2 .data").textContent =
        Math.round(wind) + " km/h";


    // ===== RAIN CHANCE =====
    const currentHour =
        data.current.time.slice(0, 13);

    let hourIndex = data.hourly.time.findIndex(
        time => time.startsWith(currentHour)
    );

    if (hourIndex === -1) {
        hourIndex = 0;
    }

    const rainChance =
        data.hourly.precipitation_probability[hourIndex] ?? 0;

    const rainLevel =
        rainChance < 30 ? "Low" :
        rainChance < 70 ? "Moderate" :
        "High";

    document.querySelector(".Rain-Chance").textContent =
        rainLevel;

    document.querySelector(".Box3 .data").textContent =
        Math.round(rainChance) + "%";


    // ===== UV INDEX =====
    const uv = data.daily.uv_index_max[0];

    const uvLevel =
        uv < 3 ? "Low" :
        uv < 6 ? "Moderate" :
        uv < 8 ? "High" :
        uv < 11 ? "Very High" :
        "Extreme";

    document.querySelector(".UV-Index").textContent =
        uvLevel;

    document.querySelector(".Box4 .data").textContent =
        Math.round(uv);


    // ===== RISK BARS =====
    updateRiskBars(
        rainChance,
        wind,
        data.current.temperature_2m
    );

}
// updateFourWeatherBoxes(location.latitude,location.longitude);
// ===========================================================
