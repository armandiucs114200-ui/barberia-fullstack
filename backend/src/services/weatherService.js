const axios = require('axios');
require('dotenv').config();

const getForecast = async (date) => {
    const apiKey = process.env.WEATHER_API_KEY;
    if (!apiKey) {
        console.warn('Weather API Key missing. Skipping forecast.');
        return null;
    }

    // Usando WeatherAPI.com como ejemplo (soporta búsqueda por fecha histórica/futura cercana)
    // Nota: La Barbería está en una ubicación fija (ej: Madrid)
    const location = process.env.BARBER_LOCATION || 'Chihuahua';

    try {
        const response = await axios.get(`http://api.weatherapi.com/v1/forecast.json`, {
            params: {
                key: apiKey,
                q: location,
                dt: date, // formato YYYY-MM-DD
                lang: 'es'
            }
        });

        const dayForecast = response.data.forecast.forecastday[0].day;
        return {
            condition: dayForecast.condition.text,
            icon: dayForecast.condition.icon,
            max_temp: dayForecast.maxtemp_c,
            min_temp: dayForecast.mintemp_c,
            avg_temp: dayForecast.avgtemp_c,
            chance_of_rain: dayForecast.daily_chance_of_rain
        };
    } catch (error) {
        console.error('Error fetching weather:', error.message);
        return null; // Fallback generoso para que la app no rompa
    }
};

module.exports = { getForecast };
