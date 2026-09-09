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