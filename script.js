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

searchButton.addEventListener("click",async(even) => {
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
updateRiskBars(65,12,24);