'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);
        if (!result.success) {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md p-8 bg-card/95 backdrop-blur-md rounded-2xl shadow-2xl border border-red-900/30 relative overflow-hidden">
                {/* Decoración roja */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-900"></div>

                <div className="text-center mb-8">
                    <h2 className="mt-2 text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 uppercase tracking-wider">
                        Barbería Axial Flare
                    </h2>
                    <p className="mt-2 text-sm text-gray-400 font-medium tracking-widest uppercase">
                        Inicia sesión en tu cuenta
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="mb-6 p-4 text-sm text-red-200 bg-red-900/50 rounded-lg border border-red-800 flex items-center gap-3">
                            <AlertCircle size={20} />
                            <span className="font-bold">Acceso Denegado: </span> {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Correo del Acceso
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full py-3 pl-10 pr-4 text-white bg-black/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder-gray-600"
                                    placeholder="admin@barberia.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full py-3 pl-10 pr-4 text-white bg-black/50 border border-gray-600/50 rounded-xl focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all placeholder-gray-600"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full px-4 py-3 text-sm font-bold text-white transition-all duration-300 bg-red-600 rounded-xl hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 hover:shadow-[0_0_15px_rgba(220,38,38,0.5)] uppercase tracking-wider"
                        >
                            {loading ? 'Iniciando sesión...' : 'Entrar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
