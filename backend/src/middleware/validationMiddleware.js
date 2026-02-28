const validatePagination = (req, res, next) => {
    const { page, limit } = req.query;

    // Validate only if they are provided
    if (page !== undefined) {
        if (isNaN(parseInt(page)) || parseInt(page) < 1) {
            return res.status(400).json({ error: 'Invalid pagination parameter: page must be an integer greater than 0' });
        }
    }

    if (limit !== undefined) {
        if (isNaN(parseInt(limit)) || parseInt(limit) < 1 || parseInt(limit) > 100) {
            return res.status(400).json({ error: 'Invalid pagination parameter: limit must be an integer between 1 and 100' });
        }
    }

    next();
};

module.exports = { validatePagination };
