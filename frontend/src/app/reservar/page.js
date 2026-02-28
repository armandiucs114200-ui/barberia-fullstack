'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export default function ReservarPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [barberos, setBarberos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [formData, setFormData] = useState({
        fecha: '',
        hora: '',
        barbero_id: '',
        servicio: 'Corte Clásico'
    });

    const servicios = [
        'Corte Clásico',
        'Corte + Barba',
        'Tinte',
        'Limpieza Facial',
        'Afeitado Premium'
    ];

    const horarios = [
        '09:00:00', '10:00:00', '11:00:00', '12:00:00',
        '13:00:00', '14:00:00', '15:00:00', '16:00:00',
        '17:00:00', '18:00:00', '19:00:00', '20:00:00'
    ];

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchBarberos = async () => {
            try {
                const response = await api.get('/barberos');
                setBarberos(response.data);
            } catch (err) {
                console.error('Error fetching barberos:', err);
                setError('No se pudieron cargar los barberos.');
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchBarberos();
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        try {
            await api.post('/reservas', formData);
            setSuccessMessage('¡Tu reserva ha sido confirmada con éxito!');
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Ocurrió un error al agendar la reserva.');
        }
    };

    if (loading || isLoading) return <div className="text-white text-center mt-20">Cargando barbería...</div>;
    if (!user) return null;

    // Obtener la fecha de hoy en formato YYYY-MM-DD para el atributo 'min'
    const hoy = new Date().toISOString().split('T')[0];

    return (
        <div className="min-h-screen bg-background text-white p-4 md:p-8">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-4">
                <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 uppercase tracking-widest">
                    Nueva Reserva
                </h1>
                <button
                    onClick={() => router.push('/dashboard')}
                    className="mt-4 md:mt-0 bg-black/50 hover:bg-red-900/50 text-white border border-red-900/30 px-4 py-2 rounded-xl transition uppercase tracking-wider text-sm font-bold shadow-lg"
                >
                    Volver al Dashboard
                </button>
            </header>

            <main className="max-w-2xl mx-auto bg-card/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-red-900/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-900"></div>
                <h2 className="text-xl font-bold mb-6 text-gray-300 uppercase tracking-wider mt-2">Reserva tu próxima cita</h2>

                {error && <div className="bg-red-500/10 border border-red-500 text-red-400 p-3 rounded mb-4">{error}</div>}
                {successMessage && <div className="bg-green-500/10 border border-green-500 text-green-400 p-3 rounded mb-4">{successMessage}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-400 mb-2 text-sm uppercase tracking-wider font-bold">Servicio</label>
                        <select
                            name="servicio"
                            value={formData.servicio}
                            onChange={handleChange}
                            required
                            className="w-full bg-black/50 border border-gray-600/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            {servicios.map(servicio => (
                                <option key={servicio} value={servicio} className="bg-gray-900">{servicio}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-400 mb-2 text-sm uppercase tracking-wider font-bold">Barbero de Preferencia</label>
                        <select
                            name="barbero_id"
                            value={formData.barbero_id}
                            onChange={handleChange}
                            required
                            className="w-full bg-black/50 border border-gray-600/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                        >
                            <option value="" className="bg-gray-900">Selecciona un barbero</option>
                            {barberos.map(b => (
                                <option key={b.id} value={b.id} className="bg-gray-900">{b.nombre} - ⭐ {b.especialidad}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm uppercase tracking-wider font-bold">Fecha</label>
                            <input
                                type="date"
                                name="fecha"
                                value={formData.fecha}
                                onChange={handleChange}
                                min={hoy}
                                required
                                className="w-full bg-black/50 border border-gray-600/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 mb-2 text-sm uppercase tracking-wider font-bold">Hora</label>
                            <select
                                name="hora"
                                value={formData.hora}
                                onChange={handleChange}
                                required
                                className="w-full bg-black/50 border border-gray-600/50 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600"
                            >
                                <option value="" className="bg-gray-900">Elige la hora</option>
                                {horarios.map(h => (
                                    <option key={h} value={h} className="bg-gray-900">{h.substring(0, 5)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.6)] transform transition active:scale-95 uppercase tracking-wider mt-4"
                    >
                        Confirmar Reserva
                    </button>
                </form>
            </main>
        </div>
    );
}
