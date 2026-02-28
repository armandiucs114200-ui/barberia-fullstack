const express = require('express');
const router = express.Router();
const { getReservas, createReserva, updateReservaEstado } = require('../controllers/reservaController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const { validatePagination } = require('../middleware/validationMiddleware');

// Get reservations (paginated)
router.get('/', authMiddleware, validatePagination, getReservas);

// Create reservation (Auth required)
router.post('/', authMiddleware, createReserva);

// Create Public reservation (No Auth required)
router.post('/public', createPublicReserva);

// Update reservation status (Admin Only)
router.patch('/:id/estado', authMiddleware, roleMiddleware(['admin']), updateReservaEstado);

// Example of admin only route
router.post('/admin-only', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    res.json({ message: 'Welcome, Admin' });
});

module.exports = router;
