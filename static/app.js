//Getting DOM elements using querySelector()
const weatherTxt = document.querySelector("#weather-text");
const header = document.querySelector("#header");
const weatherIcon = document.querySelector(".weather-icon");
const lastlyUpdated = document.querySelector(".lastly-updated");
const lastlyUpdatedText = document.querySelector(".lastly-updated-text");
const updateBtn = document.querySelector(".update");
const weatherSection = document.querySelector(".forecast-weather-box");
//Get clients time of the day and store it into variables
let currentTimeInHours = new Date().getHours();
let currentTimeInMinutes = new Date().getMinutes();
let currentTimeInSeconds = new Date().getSeconds();
//My weathermapapi APPID 
const appID = "816ae706e487eef53bf6849ee89d18d1";
//Creating later used variables at top, cause it looks better and also because global scoping
let long, lat, urlCurrentWeather, urlForecast, weatherID, isRaining, isModeratlyCloudy, isCloudy, isSnowing, isThunder, currentTime, timeInHours;
//Create an array with all raining codes from openweathermap, except 500 cause it's only light raining and can be a little confusing
const rainingCodes = [501, 502, 503, 504, 511, 520, 521, 522, 531]; 
//Create an array with 2 out of 4 (cause the last two are very cloudy) with cloudy codes but not cloudy enough to hide the sun from openweathermap + 500 from rainy codes cause it fits more in this array
const smallCloudCodes = [500, 801, 802];
//Create an array with 2 out of 4 (cause the first two don't't show a lot of clouds) cloudy codes from openweathermap + 500 from rainy codes cause it fits more in this array
const cloudyCodes = [803, 804];
//Create an array with snowing codes from openweathermap
const snowyCodes = [600, 601, 602, 611, 612, 613, 615, 616, 620, 621, 622];
//Create an array with thunderstormy codes from openweathermap
const thunderCodes = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232];

//Function to easier read time if by example the hour is 04, actually display 04(:30:42) instead of just 4(:40:42)
function getTime() {
  if(currentTimeInHours <= 9) {
    timeInHours = "0" + currentTimeInHours;
  } else {
    timeInHours = currentTimeInHours;
  }
  if(currentTimeInMinutes <= 9) {
    currentTimeInMinutes = "0" + currentTimeInMinutes;
  }
  if(currentTimeInSeconds <= 9) {
    currentTimeInSeconds = "0" + currentTimeInSeconds;
  }
}

//Update funtion for update btn to update page
function update() {
  location.reload();
}

//Get clients position using geolocation
navigator.geolocation.getCurrentPosition(position => {

  //Assing values for the variables I made before, so I can pass them into my url variable
  lat = position.coords.latitude;
  long = position.coords.longitude;
  //Console.logging the values to see if they are accurate or if there is any errors
  console.log(lat);
  console.log(long);

  //Display update btn and lastly updated text
  updateBtn.style.display = "inline";
  lastlyUpdatedText.style.display = "inline";

  //Creating the url, consiting of lat&long (for deciding location) and my AppID to get the current weather but also future forecasted weather data
  urlCurrentWeather = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=${appID}&units=metric`;
  urlForecast = `https://cors-anywhere.herokuapp.com/api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${long}&appid=${appID}&units=metric`;
  //Here I'm also console.logging the url to see that everything is working out 
  console.log(urlCurrentWeather);

  //Fetching the api with my "custom" url to get desired values from the current weather
  fetch(urlCurrentWeather)
  .then(res => {
    return res.json();
  })
  .then(data => {
    //Log the data gotten from fetching the urlCurrentWeather api
    console.log(data);
    //Change the HTML tag associated with weatherTxt variables text to this, containing the citys name and temperature in celcius
    weatherTxt.innerHTML = `In ${data["name"]} it's currently ${data["main"]["temp"].toFixed(1)}°C.`;

    //Write to HTML with tag lastly-updated, the last time the website was updated, in other words, when the api was lastly fetched with getTime() function
    getTime();
    lastlyUpdated.innerHTML = `${timeInHours}:${currentTimeInMinutes}:${currentTimeInSeconds}`;

    //Get current weather by code from fetched API, like rainy, cloudy etc
    weatherID = data["weather"][0]["id"];

    //use includes() method to search each of the 3 arrays and see which one of them (or if even one) contains the same id as stored in the weatherID variable
    isRaining = rainingCodes.includes(weatherID);
    isModeratlyCloudy = smallCloudCodes.includes(weatherID);
    isCloudy = cloudyCodes.includes(weatherID);
    isSnowing = snowyCodes.includes(weatherID);
    isThunder = thunderCodes.includes(weatherID);

    //Change background of the site depening on if its day, night, sunny, snowy, cloudy or raining 
    if(isRaining) {
      header.style.backgroundImage = "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.85) 100%), url(./static/pics_gifs/raining.gif)";
      weatherIcon.innerHTML = "🌧";
    } else if(isCloudy) {
      header.style.backgroundImage = "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.85) 100%), url(./static/pics_gifs/cloudy.gif)";
      weatherIcon.innerHTML = "☁";
    } else if(isSnowing) {
      header.style.backgroundImage = "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.85) 100%), url(./static/pics_gifs/snowing.gif)";
      weatherIcon.innerHTML = "❆";
    } else if(isThunder) {
      header.style.backgroundImage = "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.85) 100%), url(./static/pics_gifs/thunder.gif)"
      weatherIcon.innerHTML = "⚡";
    } else if(currentTimeInHours >= 20 || currentTimeInHours <= 3) {
      //If this condition is true, turn background into a moon, indicating it's night time
      header.style.backgroundImage = "linear-gradient(to bottom, rgba(0,0,0,0.65) 0%,rgba(0,0,0,0.65) 100%), url(./static/pics_gifs/night.jpg)";
      weatherIcon.innerHTML = "☾";
    } else if(isModeratlyCloudy) {
      header.style.backgroundImage = "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.85) 100%), url(./static/pics_gifs/cloudyAndSunny.gif)";
      weatherIcon.innerHTML = "⛅";
    } else {
      //If none of the conditions above are true, asume it's daytime & mostly sunny outsides
      header.style.backgroundImage = "linear-gradient(to bottom, rgba(0,0,0,0.85) 0%,rgba(0,0,0,0.85) 100%), url(./static/pics_gifs/sunny_pic.jpg)";
      weatherIcon.innerHTML = "☀";
    }

    //Fetch the same API from openweathermap, but for another set of data. This time the forecasted weather data
    return fetch(urlForecast);
  })
  .then(res => {
    return res.json();
  })
  .then(data => {
    console.log(data);

    for(i = 0; i < data["list"].length; i++) {
      //Create element for date
      console.log(data["list"][i]["dt_txt"])
      let nodeForDate = document.createElement("span");
      let textnodeForDate = document.createTextNode(`${data["list"][i]["dt_txt"]}`);
      nodeForDate.appendChild(textnodeForDate);
      document.querySelector(".forecast-weather-data").appendChild(nodeForDate).classList.add("forecasted-weather-date");
      //Create element for weather
      let nodeForWeather = document.createElement("p");
      let textnodeForWeather = document.createTextNode(`${data["list"][i]["main"]["temp"]}°C - ${data["list"][i]["weather"][0]["main"]}`);
      nodeForWeather.appendChild(textnodeForWeather);
      document.querySelector(".forecast-weather-box").appendChild(nodeForWeather).classList.add("forecasted-weather-data");
    }

  })
})

//Horizontal scrolling 
window.addEventListener('wheel', e => {

  if (e.deltaY > 0) weatherSection.scrollLeft += 80;
  else weatherSection.scrollLeft -= 80;

});