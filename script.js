
const map = L.map('map').setView([13.7565, 121.0583], 10); 


L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

function createDefaultIcon() {
    return L.icon({
        iconUrl: 'https://img.icons8.com/ios/452/marker.png', 
        iconSize: [32, 32], 
        iconAnchor: [16, 32], 
        popupAnchor: [0, -32] 
    });
}


function createCloudyIcon(color) {
    return L.divIcon({
        className: 'custom-cloud-icon',
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
                <path d="M19.35 10.04a4.5 4.5 0 0 0-8.07-2.62 4.5 4.5 0 0 0-7.09 4.23 4.5 4.5 0 0 0 1.1 8.67h12.93a4.5 4.5 0 0 0 1.09-8.66 4.5 4.5 0 0 0 1.09-8.66zM12 15H4a3 3 0 0 1-2.98-2.5 3 3 0 0 1 2.5-3.48c1.55-.04 2.89-.76 3.82-1.87.87-.95 2.15-1.6 3.66-1.6 1.51 0 2.79.63 3.66 1.6.92 1.11 2.27 1.83 3.83 1.87a3 3 0 0 1 2.5 3.48A3 3 0 0 1 20 15h-8z" fill="${color}"/>
                </svg>`,
        iconSize: [32, 32], 
        iconAnchor: [16, 32], 
        popupAnchor: [0, -32] 
    });
}


function createMarker(lat, lon, frequency, popupContent) {

    let color;
    if (frequency > 10) {
        color = 'red'; 
    } else if (frequency > 5) {
        color = 'orange'; 
    } else {
        color = 'blue'; 
    }

    return L.marker([lat, lon], { icon: createCloudyIcon(color) })
        .addTo(map)
        .bindPopup(popupContent);
}


function handleLocationSuccess(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;


    L.marker([lat, lon], { icon: createDefaultIcon() })
        .addTo(map)
        .bindPopup('You are here')
        .openPopup();

    map.setView([lat, lon], 14); 
}

function handleLocationError(error) {
    console.error('Error getting location:', error);
}


navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError);


fetch('http://localhost/Openweatherapp/get_thunderstorm_data.php')
    .then(response => response.json())
    .then(data => {
        data.forEach(storm => {
            const apiKey = '6b0f8e0e06a446518ce6a060073a6f17'; 
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${storm.latitude}&lon=${storm.longitude}&appid=${apiKey}&units=metric`;

            fetch(url)
                .then(response => response.json())
                .then(weatherData => {
                    const popupContent = `
                        <strong>Location:</strong> ${weatherData.name}<br>
                        <strong>Temperature:</strong> ${weatherData.main.temp} °C<br>
                        <strong>Weather:</strong> ${weatherData.weather[0].description}<br>
                        <strong>Humidity:</strong> ${weatherData.main.humidity}%<br>
                        <strong>Wind Speed:</strong> ${weatherData.wind.speed} m/s<br>
                        <strong>Thunderstorm Frequency:</strong> ${storm.frequency}
                    `;

                    createMarker(storm.latitude, storm.longitude, storm.frequency, popupContent);
                })
                .catch(error => console.error('Error fetching weather data:', error));
        });
    })
    .catch(error => console.error('Error fetching thunderstorm data:', error));
