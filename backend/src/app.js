const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const reservaRoutes = require('./routes/reservaRoutes');
const barberoRoutes = require('./routes/barberoRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/reservas', reservaRoutes);
app.use('/api/equipo', barberoRoutes);
app.use('/api/weather', weatherRoutes);

app.get('/api/status-check', (req, res) => {
    res.json({
        message: 'Backend is up to date',
        deployed_at: '2026-02-28 11:15',
        version: 'v3-equipo'
    });
});

app.get('/', (req, res) => {
    res.json({ message: 'Barber Shop API is running' });
});

// 404 Handler for unmatched routes
app.use((req, res, next) => {
    res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// Centralized Error Handling (should be last)
app.use(errorHandler);

module.exports = app;
