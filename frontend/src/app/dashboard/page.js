'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Calendar, Clock, LogOut, Sun, CloudRain, Thermometer } from 'lucide-react';

import Link from 'next/link';

export default function Dashboard() {
    const { user, loading: authLoading, logout } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1 });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    const fetchReservas = async (page = 1) => {
        setLoading(true);
        try {
            const response = await api.get(`/reservas?page=${page}&limit=5`);
            setReservas(response.data.data);
            setPagination(response.data.pagination);
        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (user) {
            fetchReservas(pagination.page);
        }
    }, [user, pagination.page]);

    if (authLoading || !user) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
                Cargando...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <div>
                        <h1 className="text-3xl font-bold">Mis Reservas</h1>
                        <p className="text-gray-400">Bienvenido de nuevo, {user.email}</p>
                    </div>
                    <div className="flex gap-4">
                        <Link
                            href="/barberos"
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm text-white font-medium transition-colors"
                        >
                            Ver Barberos
                        </Link>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm border border-gray-700 transition-colors"
                        >
                            <LogOut size={18} /> Salir
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20 bg-gray-800 rounded-xl">Cargando reservas...</div>
                ) : reservas.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800 rounded-xl">No tienes reservas pendientes.</div>
                ) : (
                    <div className="space-y-4">
                        {reservas.map((reserva) => (
                            <div key={reserva.id} className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg hover:border-blue-500/50 transition-all">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-blue-400 font-medium">
                                            <Calendar size={18} />
                                            <span>{new Date(reserva.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Clock size={18} />
                                            <span>{reserva.hora}</span>
                                        </div>
                                    </div>

                                    {reserva.clima && (
                                        <div className="bg-gray-900/50 p-3 rounded-lg flex items-center gap-4 border border-gray-700/50">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 uppercase tracking-wider">Clima previsto</p>
                                                <p className="font-medium text-sm">{reserva.clima.condition}</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-blue-500/10 p-2 rounded-full">
                                                <img src={reserva.clima.icon} alt="clima" className="w-8 h-8" />
                                                <span className="font-bold text-blue-400">{reserva.clima.avg_temp}°C</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Paginación */}
                {pagination.pages > 1 && (
                    <div className="mt-8 flex justify-center gap-2">
                        {[...Array(pagination.pages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setPagination({ ...pagination, page: i + 1 })}
                                className={`w-10 h-10 rounded-lg font-medium transition-all ${pagination.page === i + 1
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
