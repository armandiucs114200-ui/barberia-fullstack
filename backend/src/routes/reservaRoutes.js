const express = require('express');
const router = express.Router();
const { getReservas } = require('../controllers/reservaController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

const { validatePagination } = require('../middleware/validationMiddleware');

// Get reservations (paginated)
router.get('/', authMiddleware, validatePagination, getReservas);

// Example of admin only route
router.post('/admin-only', authMiddleware, roleMiddleware(['admin']), (req, res) => {
    res.json({ message: 'Welcome, Admin' });
});

module.exports = router;
