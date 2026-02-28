'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MessageCircle, CheckCircle, XCircle, Search, Calendar, Filter } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Custom Tooltip Recharts
const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        // Simulamos un "Servicio Estrella" para el demo de la gráfica
        const starServices = ['Taper Fade', 'Ritual de Barba', 'Combo Ejecutivo', 'Buzz Cut'];
        const randomService = starServices[Math.floor(Math.random() * starServices.length)];

        return (
            <div className="bg-black/90 border border-red-900/50 p-4 rounded-xl shadow-2xl backdrop-blur-sm">
                <p className="text-white font-bold mb-2 uppercase tracking-widest border-b border-gray-800 pb-2">{label}</p>
                <div className="flex justify-between items-center gap-4">
                    <span className="text-gray-400 text-sm">Volumen Exacto:</span>
                    <span className="text-red-500 font-black text-lg">{payload[0].value} citas</span>
                </div>
                <div className="flex justify-between items-center gap-4 mt-1">
                    <span className="text-gray-400 text-sm">Servicio Estrella:</span>
                    <span className="text-green-400 font-bold text-sm tracking-wide">{randomService}</span>
                </div>
            </div>
        );
    }
    return null;
};

export default function AdminDashboard() {
    const router = useRouter();
    const { user, loading: authLoading, logout } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);

    // UI states para Filtros
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDate, setFilterDate] = useState('all'); // all, hoy, manana

    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/');
            return;
        }

        const fetchAll = async () => {
            if (!user) return;
            try {
                // Solicitamos hasta 50 para métricas. (Limit en el backend real)
                const res = await api.get('/reservas?limit=50&page=1');
                setReservas(res.data.data || []);

                // Efecto "Sorpresa": Simulando que entra una reserva online justo cuando abres el panel
                setTimeout(() => {
                    toast.success('¡Nueva reserva entrante detectada desde la Web!', {
                        icon: '🔥',
                        style: {
                            borderRadius: '10px',
                            background: '#111',
                            color: '#fff',
                            border: '1px solid #333',
                        }
                    });
                }, 3000);

            } catch (err) {
                console.error("Error admin:", err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && user?.role === 'admin') {
            fetchAll();
        }
    }, [user, authLoading, router]);

    const handleEstadoChange = async (id, nuevoEstado) => {
        // Optimistic UI update para velocidad
        const prevReservas = [...reservas];
        setReservas(reservas.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));

        // Notificación de Acción Rápida
        if (nuevoEstado === 'completada') toast.success('Cita marcada como Completada', { icon: '✅' });
        if (nuevoEstado === 'cancelada') toast.error('Cita cancelada', { icon: '❌' });

        try {
            await api.patch(`/reservas/${id}/estado`, { estado: nuevoEstado });
        } catch (error) {
            console.error('Error al cambiar estado:', error);
            toast.error('Error de red. Revirtiendo cambio.');
            setReservas(prevReservas); // Rollback
        }
    };

    const handleWhatsApp = (reserva) => {
        const telefono = reserva.cliente_telefono?.replace(/\s+/g, '') || '';
        const nombreCliente = reserva.cliente_nombre || 'Cliente';
        const mensaje = `Hola ${nombreCliente}, confirmamos tu cita para el día ${reserva.fecha.split('T')[0]} a las ${reserva.hora?.substring(0, 5) || ''} en Crimson Blades. ¡Te esperamos!`;
        const url = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(url, '_blank');
        toast('Redirigiendo a WhatsApp...', { icon: '💬' });
    };

    // Procesamiento y Lógica de Filtrado
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const filteredReservas = reservas.filter(r => {
        // Búsqueda por Servicio o ID (Como MVP si no hay nombre de cliente fácil)
        const matchSearch = String(r.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
            String(r.servicio).toLowerCase().includes(searchTerm.toLowerCase());

        // Filtro por Fecha (Simulado a String comparition rápido)
        let matchDate = true;
        if (filterDate === 'hoy') {
            matchDate = r.fecha.split('T')[0] === todayStr;
        } else if (filterDate === 'manana') {
            matchDate = r.fecha.split('T')[0] === tomorrowStr;
        } else if (filterDate === 'pendientes') {
            matchDate = r.estado === 'pendiente'; // Truco: usamos el dropdown para filtrar estado también
        }

        return matchSearch && matchDate;
    });

    // Procesar datos para gráficas
    const gananciasTotales = reservas.filter(r => r.estado !== 'cancelada').length * 25; // Setup de prueba $25
    const totalCompletadas = reservas.filter(r => r.estado === 'completada').length;
    const totalCanceladas = reservas.filter(r => r.estado === 'cancelada').length;

    // Fake Data Evolución Semanal para Recharts
    const dataEvolucion = [
        { name: 'Lun', citas: Math.max(0, reservas.length - 10) },
        { name: 'Mar', citas: Math.max(2, reservas.length - 8) },
        { name: 'Mié', citas: Math.max(5, reservas.length - 3) },
        { name: 'Jue', citas: reservas.length },
        { name: 'Vie', citas: reservas.length + 4 },
        { name: 'Sáb', citas: reservas.length + 10 }
    ];

    const dataIngresos = [
        { name: 'Sem 1', usd: 400 },
        { name: 'Sem 2', usd: 300 },
        { name: 'Sem 3', usd: 550 },
        { name: 'Sem 4', usd: gananciasTotales || 200 }
    ];

    if (authLoading || loading) {
        return <div className="min-h-screen bg-background flex justify-center items-center h-64"><div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div></div>;
    }

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-background text-white p-6 md:p-8">
            <Toaster position="top-right" />

            <nav className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
                <h1 className="text-2xl font-black tracking-widest text-red-600 uppercase">
                    Admin <span className="text-white">Command Center</span>
                </h1>
                <button onClick={logout} className="text-sm bg-black border border-gray-800 px-4 py-2 rounded-xl hover:border-gray-500 transition-colors uppercase tracking-wider font-bold">Salir del Panel</button>
            </nav>

            <div className="max-w-7xl mx-auto space-y-8">

                {/* Tarjetas KPI Superiores */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-xl relative overflow-hidden">
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Ingresos Mes</h3>
                        <p className="text-4xl font-black text-white">${gananciasTotales}</p>
                        <div className="absolute right-0 bottom-0 w-24 h-24 bg-red-600/20 rounded-full blur-2xl -mr-10 -mb-10"></div>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-xl">
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Total Citas</h3>
                        <p className="text-4xl font-black text-white">{reservas.length}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-gray-800 shadow-xl">
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Éxito</h3>
                        <p className="text-4xl font-black text-green-500">{totalCompletadas}</p>
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card/95 backdrop-blur-md p-6 rounded-2xl border border-red-900/40 shadow-xl">
                        <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Cancelaciones</h3>
                        <p className="text-4xl font-black text-red-500">{totalCanceladas}</p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Grafico 1: Recharts Citas Semanales */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }} className="bg-card/95 backdrop-blur-md border border-gray-800 p-6 rounded-2xl h-96 shadow-xl">
                        <h3 className="text-lg font-bold mb-6 text-gray-300 uppercase tracking-widest text-sm">Tráfico de Citas (Est. Semanal)</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <LineChart data={dataEvolucion}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="citas" stroke="#dc2626" strokeWidth={3} dot={{ r: 6, fill: '#000', stroke: '#dc2626' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Grafico 2: Recharts Ingresos */}
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }} className="bg-card/95 backdrop-blur-md border border-gray-800 p-6 rounded-2xl h-96 shadow-xl">
                        <h3 className="text-lg font-bold mb-6 text-gray-300 uppercase tracking-widest text-sm">Ingresos Proyectados (USD)</h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <BarChart data={dataIngresos}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff', borderRadius: '12px' }} />
                                <Bar dataKey="usd" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </motion.div>
                </div>

                {/* Tabla de Gestión de Reservas */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-card/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-gray-800 mt-8">

                    {/* HEADER DE TABLA + BARRA DE FILTROS SUPERIOR */}
                    <div className="p-6 border-b border-gray-800 bg-black/40 xl:flex justify-between items-center gap-4">
                        <div className="mb-6 xl:mb-0">
                            <h3 className="text-xl font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-red-500" /> Control del Día
                            </h3>
                            <p className="text-sm text-gray-500 mt-1 uppercase tracking-widest text-[10px]">Busca clientes, filtra fechas y presiona botones para acción rápida.</p>
                        </div>

                        {/* Barra de Herramientas (Filtros) */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Buscar servicio o ID..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="bg-black/50 border border-gray-700 text-sm text-white rounded-xl pl-9 pr-4 py-2.5 focus:ring-1 focus:ring-red-600 focus:outline-none w-full sm:w-64"
                                />
                            </div>
                            <div className="relative flex items-center bg-black/50 border border-gray-700 rounded-xl px-2">
                                <Filter className="w-4 h-4 text-gray-500 mr-2" />
                                <select
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className="bg-transparent text-sm font-bold text-gray-300 py-2.5 focus:outline-none appearance-none cursor-pointer pr-4 uppercase tracking-wider"
                                >
                                    <option value="all" className="bg-gray-900">Todas las Citas</option>
                                    <option value="hoy" className="bg-gray-900">Citas de Hoy</option>
                                    <option value="manana" className="bg-gray-900">Citas de Mañana</option>
                                    <option value="pendientes" className="bg-gray-900">Solo Pendientes</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* TABLA DE RESULTADOS */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-400">
                            <thead className="text-[10px] text-gray-400 uppercase tracking-widest font-black bg-black/80 border-b border-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Status Visual</th>
                                    <th scope="col" className="px-6 py-4">ID Cita</th>
                                    <th scope="col" className="px-6 py-4">Servicio</th>
                                    <th scope="col" className="px-6 py-4">Fecha/Hora</th>
                                    <th scope="col" className="px-6 py-4 text-center">Clima</th>
                                    <th scope="col" className="px-6 py-4 text-right">Acciones Rápidas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800/50">
                                {filteredReservas.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center text-gray-500 uppercase tracking-widest text-xs font-bold">
                                            No hay reservas que coincidan con estos filtros.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredReservas.map((reserva) => (
                                        <tr key={reserva.id} className="bg-card-bg hover:bg-black/60 transition-colors">

                                            {/* BADGE VISUAL DE ESTADO */}
                                            <td className="px-6 py-4">
                                                {reserva.estado === 'completada' && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-green-900/30 text-green-400 border border-green-800 tracking-wider uppercase">Completada</span>}
                                                {reserva.estado === 'cancelada' && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-red-900/30 text-red-500 border border-red-800/50 tracking-wider uppercase">Cancelada</span>}
                                                {(!reserva.estado || reserva.estado === 'pendiente') && <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-yellow-900/30 text-yellow-500 border border-yellow-800/50 tracking-wider uppercase">Pendiente</span>}
                                            </td>

                                            <td className="px-6 py-4 font-black text-white whitespace-nowrap">
                                                <span className="text-red-600 mr-1">#</span>{String(reserva.id).substring(0, 8)}
                                            </td>
                                            <td className="px-6 py-4 capitalize text-gray-300 font-bold">
                                                {reserva.servicio || 'Corte Clásico'}
                                            </td>
                                            <td className="px-6 py-4 font-bold">
                                                <span className="text-gray-400 text-xs">{reserva.fecha.split('T')[0]}</span> <br /><span className="text-white bg-black/50 px-2 py-0.5 rounded-md border border-gray-800">{reserva.hora?.substring(0, 5)}</span>
                                            </td>
                                            <td className="px-6 py-4 px-2 text-center">
                                                {reserva.clima && typeof reserva.clima === 'object' ? (
                                                    <div className="flex items-center justify-center gap-2 bg-black/40 px-2 py-1 rounded-lg border border-gray-800 inline-flex">
                                                        <img src={reserva.clima.icon} alt="Clima" className="w-5 h-5" />
                                                        <span className="text-xs font-black text-gray-300">{reserva.clima.avg_temp}°C</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-gray-600 font-bold">N/A</span>
                                                )}
                                            </td>

                                            {/* BOTONES DE ACCIÓN RÁPIDA (REEMPLAZANDO EL SELECT) */}
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">

                                                    {reserva.estado !== 'completada' && (
                                                        <button
                                                            onClick={() => handleEstadoChange(reserva.id, 'completada')}
                                                            className="p-1.5 text-gray-500 hover:text-green-400 hover:bg-green-500/10 rounded-xl transition-colors group border border-transparent hover:border-green-900/30"
                                                            title="Marcar Completado"
                                                        >
                                                            <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                        </button>
                                                    )}

                                                    {reserva.estado !== 'cancelada' && reserva.estado !== 'completada' && (
                                                        <button
                                                            onClick={() => handleEstadoChange(reserva.id, 'cancelada')}
                                                            className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-colors group border border-transparent hover:border-red-900/30"
                                                            title="Cancelar Cita"
                                                        >
                                                            <XCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                                        </button>
                                                    )}

                                                    <div className="w-px h-6 bg-gray-800 mx-1"></div>

                                                    <button
                                                        onClick={() => handleWhatsApp(reserva)}
                                                        className="p-1.5 text-green-500 hover:text-white hover:bg-green-600 rounded-xl transition-colors bg-green-900/10 border border-green-800/30 shadow-sm"
                                                        title="Chat Cliente WhatsApp"
                                                    >
                                                        <MessageCircle className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

            </div>
        </div>
    );
}
