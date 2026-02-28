const express = require('express');
const router = express.Router();
const { getBarberos } = require('../controllers/barberoController');

// Rutas públicas o protegidas (en este caso la hacemos pública para el widget, o protegida si lo prefieres)
// Según las instrucciones, el dashboard mostrará los barberos, así que asumimos que es pública o el token se pasa.
// La mantendremos pública para facilitar la carga inicial si es necesario, o protegida si requiere Auth.
// Por el contexto de "Visualización de barberos" en el frontend, la dejaremos pública.

router.get('/', getBarberos);

module.exports = router;
