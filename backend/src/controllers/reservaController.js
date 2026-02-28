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

const createReserva = async (req, res, next) => {
    try {
        const { fecha, hora, barbero_id, servicio } = req.body;

        if (!fecha || !hora || !barbero_id || !servicio) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios: fecha, hora, barbero_id, servicio' });
        }

        const cliente_id = req.user.id;

        const { data, error } = await supabase
            .from('reservas')
            .insert([
                { fecha, hora, barbero_id, cliente_id, servicio, estado: 'pendiente' }
            ])
            .select('*')
            .single();

        if (error) {
            throw error;
        }

        res.status(201).json({ message: 'Reserva creada exitosamente', data });
    } catch (err) {
        next(err);
    }
};

const updateReservaEstado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!['pendiente', 'completada', 'cancelada'].includes(estado)) {
            return res.status(400).json({ error: 'Estado inválido. Debe ser pendiente, completada o cancelada' });
        }

        const { data, error } = await supabase
            .from('reservas')
            .update({ estado })
            .eq('id', id)
            .select('*')
            .single();

        if (error) {
            throw error;
        }

        if (!data) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        res.json({ message: 'Estado de reserva actualizado', data });
    } catch (err) {
        next(err);
    }
};

const createPublicReserva = async (req, res, next) => {
    try {
        const { fecha, hora, barbero_id, servicio, cliente_nombre, cliente_telefono } = req.body;

        if (!fecha || !hora || !barbero_id || !servicio || !cliente_nombre || !cliente_telefono) {
            return res.status(400).json({ error: 'Todos los campos son obligatorios: fecha, hora, barbero_id, servicio, cliente_nombre, cliente_telefono' });
        }

        const { data, error } = await supabase
            .from('reservas')
            .insert([
                {
                    fecha,
                    hora,
                    barbero_id,
                    servicio,
                    cliente_nombre,
                    cliente_telefono,
                    estado: 'pendiente'
                }
            ])
            .select('*')
            .single();

        if (error) {
            throw error;
        }

        res.status(201).json({ message: 'Reserva pública creada exitosamente', data });
    } catch (err) {
        next(err);
    }
};

module.exports = { getReservas, createReserva, updateReservaEstado, createPublicReserva };
