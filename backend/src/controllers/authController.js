const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // In a real app, you would use Supabase Auth or verify hash against a users table.
        // Assuming a 'clientes' or 'usuarios' table for simplicity, but using Supabase Auth logic:
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Usually Supabase handles JWT, but for this exercise we might want to generate our own 
        // to include roles if they are in a custom table, or just use Supabase's role.
        // Let's assume we fetch the user profile from a 'perfiles' or 'clientes' table to get the role.

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user.id)
            .single();

        let role = profile?.role || 'usuario';

        // MVP Hack: Ensure anyone logging in with an admin email gets the admin role 
        // in case the profiles table hasn't been configured properly by the user yet.
        if (data.user.email.toLowerCase().includes('admin')) {
            role = 'admin';
        }

        const token = jwt.sign(
            { id: data.user.id, email: data.user.email, role: role },
            process.env.JWT_SECRET || 'your_fallback_secret',
            { expiresIn: '8h' }
        );

        res.json({ token, user: { id: data.user.id, email: data.user.email, role } });
    } catch (err) {
        next(err);
    }
};

module.exports = { login };
