//Seleccionamos todas las variables con las que vamos a trabajar
const apiKey = '1f6b024cb2b0d7d4837d2da5500a7ddc';
const locButton = document.querySelector('.loc-button');
const todayInfo = document.querySelector('.today-info');
const todayWeatherIcon = document.querySelector('.today-weather i');
const todayTemp = document.querySelector('.weather-temp');
const dayList = document.querySelector('.days-list');

//Mapping of weather condition codes to icon class names (Depending on OpenWeather Api Response)
const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water',
}

//Función que usaremos para solicitar datos al servidor
function fecthWeatherData(location){
    //Construimos la url de nuestra API con la ubicacion y la api Key
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    //Fetch weather data de la api
    fetch(apiUrl).then(response => response.json()).then
    (data => {
        //Update todays info
        const todayWeather = data.list[0].weather[0].description;
        const todayTemperature = `${Math.round(data.list[0].main.temp)}ºC`;
        const todayWeatherIconCode = data.list[0].weather[0].icon;

        
        todayInfo.querySelector('h2').textContent = new Date().toLocaleDateString('en', {Weekday: 'long'});
        todayInfo.querySelector('span').textContent = new Date().toLocaleDateString('en', { day: 'numeric', mont: 'long', year: 'numeric'});
        todayWeatherIcon.className = `bx bx-${weatherIconMap[todayWeatherIconCode]}`;
        todayTemp.textContent = todayTemperature;


        //Update location and weather description in the "left-column"
        const locationElement = document.querySelector('.today-info > div > span');
        locationElement.textContent = `${data.city.name}, ${data.city.country}`;

        const weatherDescriptionElement = document.querySelector('.today-weather > h3');
        weatherDescriptionElement.textContent = todayWeather;

        //Update today info in the "today-info" section
        const todayPrecipitation = `${data.list[0].pop}%`;
        const todayWind = `${data.list[0].wind.speed}km/h`;
        const todayHumidity = `${data.list[0].main.humidity}%`;

        const dayInfoContainer = document.querySelector('today-info');
        dayInfoContainer.innerHTML = `
        
            <div>
                <span class="title">PRECIPITATION</span>
                <span class="value">${todayPrecipitation}</span>
            </div>
            
            <div>
                <span class="title">WIND SPEED</span>
                <span class="value">${todayWind}</span>
            </div>

            <div>
                <span class="title">HUMIDITY</span>
                <span class="value">${todayHumidity}</span>
            </div>
        `;

        //Update next 4 days weather
        const today = new Date();
        const nextDayData = data.list.slice(1);

        const uniqueDays = new Set();
        let count = 0;
        dayList.innerHTML = '';
        for (const dayData of nextDayData){
            const forecastDate = new Date(dayData.dt_txt);
            const dayAbbreviation = forecastDate.toLocaleDateString('en', {weekday: 'short'});
            const todayTemp = `${Math.round(dayData.main.temp)}ºC`;
            const iconCode = dayData.weather[0].icon;

            //Ensure the day isn't duplicate and today
            if(!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()){
                uniqueDays.add(dayAbbreviation);
                dayList.innerHTML += `
                    <li>
                        <i class='bx bx-${weatherIconMap}[iconCode]}'></i>
                        <span>${dayAbbreviation}</span>
                        <span class="day-temp">${todayTemp}</span>
                    </li>
                `;
                count++;
            }

            //Stop after getting 4 distinct days
            if (count === 4) break;
        }
    }).catch(error => {
        alert(`Error fetching weather data: ${error}(Api Error)`);
    });
}

//Fetch weather data on document load for default location (Germany)
document.addEventListener('DOMContentLoaded', () =>{
    const defaultLocation = 'Germany';
    fecthWeatherData(defaultLocation);
});

locButton.addEventListener('click', () =>{
    const location = prompt('Busca tu localización:');
    if(!location) return;

    fecthWeatherData(location);
});