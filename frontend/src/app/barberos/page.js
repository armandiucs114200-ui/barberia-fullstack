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
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                                <ArrowLeft size={24} />
                            </Link>
                            <h1 className="text-3xl font-bold flex items-center gap-3">
                                <Users className="text-blue-500" /> Nuestros Barberos
                            </h1>
                        </div>
                        <p className="text-gray-400 ml-9">Conoce a los expertos de Axial Flare</p>
                    </div>
                    <button
                        onClick={logout}
                        className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm border border-gray-700 transition-colors"
                    >
                        <LogOut size={18} /> Salir
                    </button>
                </header>

                {loading ? (
                    <div className="text-center py-20 bg-gray-800 rounded-xl">Cargando barberos...</div>
                ) : barberos.length === 0 ? (
                    <div className="text-center py-20 bg-gray-800 rounded-xl">No hay barberos registrados.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {barberos.map((barbero) => (
                            <div key={barbero.id} className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden hover:border-blue-500/50 transition-all shadow-lg">
                                <div className="aspect-w-16 aspect-h-9 relative bg-gray-700">
                                    {/* Using standard img tag per initial setup, next/image requires domain config */}
                                    <img
                                        src={barbero.url_imagen || 'https://via.placeholder.com/400x300?text=Sin+Foto'}
                                        alt={barbero.nombre}
                                        className="object-cover w-full h-48"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-1">{barbero.nombre}</h3>
                                    <p className="text-blue-400 font-medium text-sm mb-4">{barbero.especialidad}</p>

                                    <div className="flex justify-between items-center text-sm text-gray-400 border-t border-gray-700 pt-4 mt-2">
                                        <span>Experiencia</span>
                                        <span className="bg-gray-900 px-3 py-1 rounded-full text-white font-medium">
                                            {barbero.experiencia_anios} {barbero.experiencia_anios === 1 ? 'año' : 'años'}
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
