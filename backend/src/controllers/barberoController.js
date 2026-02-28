const supabase = require('../config/supabase');

const getBarberos = async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('barberos')
            .select('id, nombre, especialidad, experiencia_anios, url_imagen')
            .order('nombre', { ascending: true });

        if (error) throw error;

        res.json(data);
    } catch (err) {
        next(err);
    }
};

module.exports = { getBarberos };
