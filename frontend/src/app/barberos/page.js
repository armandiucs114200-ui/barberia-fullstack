'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { Users, LogOut, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function BarberosPage() {
    const { user, loading: authLoading, logout } = useAuth();
    const [barberos, setBarberos] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchBarberos = async () => {
            try {
                const response = await api.get('/barberos');
                setBarberos(response.data);
            } catch (error) {
                console.error('Error fetching barberos:', error);
            }
            setLoading(false);
        };

        if (user) {
            fetchBarberos();
        }
    }, [user]);

    if (authLoading || !user) {
        return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Cargando...</div>;
    }

    return (
        <div className="min-h-screen bg-background text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div className="flex items-center gap-4">
                        <Link href="/dashboard" className="text-gray-400 hover:text-red-500 transition-colors">
                            <ArrowLeft size={28} />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-extrabold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600 uppercase tracking-widest">
                                <Users className="text-red-500" /> Nuestros Barberos
                            </h1>
                            <p className="text-gray-400 mt-1 uppercase text-xs tracking-wider">Conoce a los expertos de Axial Flare</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-black/50 hover:bg-red-900/50 px-4 py-2 rounded-xl text-sm border border-red-900/30 text-gray-300 hover:text-white transition-all uppercase tracking-wider"
                    >
                        <LogOut size={18} /> Salir
                    </button>
                </header>

                {loading ? (
                    <div className="text-center py-20 bg-card/95 backdrop-blur-md border border-red-900/30 rounded-2xl shadow-xl">Cargando barberos...</div>
                ) : barberos.length === 0 ? (
                    <div className="text-center py-20 bg-card/95 backdrop-blur-md border border-red-900/30 rounded-2xl shadow-xl text-gray-400 uppercase tracking-widest text-sm">No hay barberos registrados.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {barberos.map((barbero) => (
                            <div key={barbero.id} className="bg-card/95 backdrop-blur-md rounded-2xl border border-red-900/30 overflow-hidden hover:border-red-500/50 transition-all shadow-2xl hover:-translate-y-1 relative group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-700 via-red-500 to-red-900 z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className="aspect-w-16 aspect-h-9 relative bg-black">
                                    <img
                                        src={barbero.url_imagen || 'https://via.placeholder.com/400x300?text=Sin+Foto'}
                                        alt={barbero.nombre}
                                        className="object-cover w-full h-56 opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                                </div>
                                <div className="p-6 relative">
                                    <h3 className="text-2xl font-extrabold mb-1 uppercase tracking-wider">{barbero.nombre}</h3>
                                    <p className="text-red-500 font-bold text-sm mb-4 uppercase tracking-widest">{barbero.especialidad}</p>

                                    <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-800 pt-4 mt-2">
                                        <span className="uppercase tracking-widest text-xs">Experiencia</span>
                                        <span className="bg-red-900/20 px-3 py-1 rounded-full text-red-100 font-bold border border-red-900/50">
                                            {barbero.experiencia_anios} {barbero.experiencia_anios === 1 ? 'AÑO' : 'AÑOS'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
