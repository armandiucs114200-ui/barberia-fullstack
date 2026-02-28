const { getForecast } = require('../services/weatherService');

const getCurrentWeather = async (req, res, next) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const weather = await getForecast(today);
        if (weather) {
            res.json(weather);
        } else {
            res.status(503).json({ error: 'Weather service unavailable' });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = { getCurrentWeather };
