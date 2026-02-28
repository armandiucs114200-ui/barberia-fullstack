const express = require('express');
const router = express.Router();
const { getCurrentWeather } = require('../controllers/weatherController');

// Get current weather
router.get('/current', getCurrentWeather);

module.exports = router;
