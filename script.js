const yourWeather = document.querySelector(".yourWeather");
const searchWeather = document.querySelector(".searchWeather");
let cityName = document.querySelector(".city");
let flag = document.querySelector("[flag]");
let weatherType = document.querySelector(".weatherType");
let weatehrTypeIcon = document.querySelector(".weatherTypeIcon");
let temp = document.querySelector(".temp");
let windSpeed = document.querySelector(".windSpeed");
let clouds = document.querySelector(".cloudiness");
let humidity = document.querySelector(".humidity");
let access = document.querySelector(".access");
let btn = document.querySelector(".btn");
let locationAccess = document.querySelector(".locationAccess");
let cityWeather = document.querySelector(".cityWeather");
let clock = document.querySelector(".clock");
let load = document.querySelector(".loading");
let searchTab= document.querySelector(".form");
let gif=document.querySelector(".gif");
let form = document.querySelector(".form");
let search= document.querySelector(".search");
let input=document.querySelector(".input");
let error=document.querySelector(".error");

let localCoords;
let coords;

let currTab= yourWeather;
currTab.classList.add("bg-slate-500");



function switchTab(clickedTab){
    if(clickedTab !=currTab){
        currTab.classList.remove("bg-slate-500");
        currTab=clickedTab;
        currTab.classList.add("bg-slate-500");

        if(currTab === searchWeather){
            clock.classList.add("hidden");
            locationAccess.classList.add("hidden");
            cityWeather.classList.add("hidden");
            searchTab.classList.remove("hidden");
            error.classList.add("hidden");
        }

        else {
            searchTab.classList.add("hidden");
            if(!localCoords){
                console.log("hey man");
                cityWeather.classList.add("hidden");
                locationAccess.classList.remove("hidden");
                getFromSessionStorage();
            }
            else {

                cityWeather.classList.remove("hidden");
                fetchWeatherInfo(coords);
                getLocation();
                console.log("hey man");

                
            }
            
            
            error.classList.add("hidden");
        }
    }


}

yourWeather.addEventListener("click", () => {
    switchTab(yourWeather);
})

searchWeather.addEventListener("click", () => {
    switchTab(searchWeather);
})

const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";

getFromSessionStorage();

function getFromSessionStorage(){

     localCoords= sessionStorage.getItem("usserCoords");

    if(!localCoords){

        locationAccess.classList.remove("hidden");

        btn.addEventListener("click", getLocation);

    }
    else {
        cityWeather.classList.remove("hidden");
        locationAccess.classList.add("hidden");
        const storedCoords= JSON.parse(localCoords);
        fetchWeatherInfo(storedCoords);
    }
}

function getLocation(){
    if(navigator.geolocation){

        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        //error

    }
}
function showPosition (position){
    coords= {
   lat: position.coords.latitude,
   lon: position.coords.longitude,
}
sessionStorage.setItem("usserCoords",JSON.stringify(coords));
fetchWeatherInfo(coords);
}



async  function fetchWeatherInfo(data){
    const {lat, lon}= data;

    clock.classList.remove("hidden");
    locationAccess.classList.add("hidden");
    cityWeather.classList.add("hidden");

    try{
         const response = await fetch(
             `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
           );
        clock.classList.add("hidden");
        const  convert = await response.json();
        renderWeatherInfo(convert);
    }
    catch(err){
        //error

        cityWeather.classList.add("hidden");
        locationAccess.classList.add("hidden");
        clock.classList.remove("hidden");

        load.innerText="Some Error Occured...";

    }
}

    function renderWeatherInfo(weatherInfo) {
        console.log(weatherInfo);
            cityWeather.classList.remove("hidden");

            cityName.innerText = weatherInfo?.name;
            flag.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
            weatherType.innerText = weatherInfo?.weather?.[0]?.description;
             weatehrTypeIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
            temp.innerText = `${weatherInfo?.main?.temp} °C`;
            windSpeed.innerText = `${weatherInfo?.wind?.speed} m/s`;
            humidity.innerText = `${weatherInfo?.main?.humidity}%`;
            clouds.innerText = `${weatherInfo?.clouds?.all}`;

        }

form.addEventListener("submit", (e) =>{
    e.preventDefault();

    let name= input.value;
    console.log(name);

    if(name === ""){
        return;
    }
    else {
        fetchWeatherInfom(name);
    }
})

async function fetchWeatherInfom(city) { 
    load.classList.remove("hidden"); 
    cityWeather.classList.add("hidden"); 
    locationAccess.classList.add("hidden"); 
     
        try { 
            const response = await fetch( 
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric` 
              ); 
        if(response.status===404){
            error.classList.remove("hidden");
            cityWeather.classList.add("hidden");
            load.classList.add("hidden");
            form.classList.add("hidden");
            document.querySelector(".notFound").innerText = "City Not Found";

        }
        else {
            const datas= await response.json(); 
            load.classList.add("hidden"); 
            cityWeather.classList.remove("hidden"); 
            form.classList.add("hidden");
            renderWeatherInfo(datas);
        }
             
        } 

        catch(err) { 
            //hW 
            load.classList.remove("hidden");
        } 
    }
