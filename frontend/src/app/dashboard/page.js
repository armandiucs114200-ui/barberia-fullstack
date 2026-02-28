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
        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role === 'admin') {
                router.push('/admin');
            }
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
            <div className="min-h-screen bg-background flex items-center justify-center text-white">
                Cargando...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 uppercase tracking-widest">
                            Mis Reservas
                        </h1>
                        <p className="text-gray-400 mt-1 uppercase text-xs tracking-wider">Cliente: <span className="text-white">{user.email}</span></p>
                    </div>
                    <div className="flex gap-4">
                        {user.role === 'usuario' && (
                            <Link
                                href="/reservar"
                                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl text-sm text-white font-bold transition-all uppercase tracking-wider hover:shadow-[0_0_15px_rgba(220,38,38,0.5)]"
                            >
                                Nueva Reserva
                            </Link>
                        )}
                        <Link
                            href="/barberos"
                            className="flex items-center gap-2 bg-black/50 border border-gray-700 hover:border-red-600 px-4 py-2 rounded-xl text-sm text-white font-medium transition-colors uppercase tracking-wider"
                        >
                            Ver Barberos
                        </Link>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 bg-black/50 hover:bg-red-900/50 px-4 py-2 rounded-xl text-sm border border-red-900/30 text-gray-300 hover:text-white transition-all uppercase tracking-wider"
                        >
                            <LogOut size={18} /> Salir
                        </button>
                    </div>
                </header>

                {loading ? (
                    <div className="text-center py-20 bg-card/95 backdrop-blur-md border border-red-900/30 rounded-2xl shadow-xl">Cargando reservas...</div>
                ) : reservas.length === 0 ? (
                    <div className="text-center py-20 bg-card/95 backdrop-blur-md border border-red-900/30 rounded-2xl shadow-xl text-gray-400 uppercase tracking-widest text-sm">
                        No hay reservas pendientes
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reservas.map((reserva) => (
                            <div key={reserva.id} className="relative overflow-hidden bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-red-900/30 shadow-2xl hover:border-red-500/50 transition-all hover:-translate-y-1">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-red-600 to-red-900"></div>
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pl-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-red-500 text-sm font-bold uppercase tracking-wider">
                                            <Calendar size={18} />
                                            <span>{new Date(reserva.fecha).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-300">
                                            <Clock size={18} />
                                            <span>{reserva.hora.substring(0, 5)} {reserva.servicio ? `- ${reserva.servicio}` : ''}</span>
                                        </div>
                                    </div>

                                    {reserva.clima && (
                                        <div className="bg-black/50 p-3 rounded-xl flex items-center gap-4 border border-gray-800">
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-500 uppercase tracking-widest">Clima previsto</p>
                                                <p className="font-medium text-sm text-gray-300">{reserva.clima.condition}</p>
                                            </div>
                                            <div className="flex items-center gap-2 bg-red-900/20 px-3 py-1.5 rounded-full border border-red-900/50">
                                                <img src={reserva.clima.icon} alt="clima" className="w-6 h-6" />
                                                <span className="font-bold text-red-400">{reserva.clima.avg_temp}°C</span>
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
                                className={`w-10 h-10 rounded-xl font-bold transition-all ${pagination.page === i + 1
                                    ? 'bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.5)]'
                                    : 'bg-black/50 text-gray-400 hover:bg-gray-800 border border-gray-700'
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
