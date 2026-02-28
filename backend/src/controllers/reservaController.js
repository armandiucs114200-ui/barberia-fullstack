const supabase = require('../config/supabase');

const { getForecast } = require('../services/weatherService');

const getReservas = async (req, res, next) => {
    const { page = 1, limit = 5 } = req.query;
    const offset = (page - 1) * limit;

    try {
        let query = supabase
            .from('reservas')
            .select('*', { count: 'exact' });

        // Filtro por rol
        if (req.user.role !== 'admin') {
            query = query.eq('cliente_id', req.user.id);
        }

        const { data, count, error } = await query
            .range(offset, offset + limit - 1)
            .order('fecha', { ascending: true });

        if (error) throw error;

        // Enriquecer con clima
        const reservationsWithWeather = await Promise.all(data.map(async (reserva) => {
            // Asumiendo que reserva.fecha es YYYY-MM-DD o ISO string
            const weather = await getForecast(reserva.fecha.split('T')[0]);
            return { ...reserva, clima: weather };
        }));

        res.json({
            data: reservationsWithWeather,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: count,
                pages: Math.ceil(count / limit)
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getReservas };
