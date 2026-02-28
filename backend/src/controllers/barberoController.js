const supabase = require('../config/supabase');
// Fixed: Removed missing experiencia_anios column to prevent 500 error on Render

const getBarberos = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('barberos')
            .select('id, nombre, especialidad, foto_url')
            .order('nombre', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        next(err);
    }
};

module.exports = { getBarberos };
