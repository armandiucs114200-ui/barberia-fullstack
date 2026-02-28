'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { ChevronLeft, ChevronRight, Calendar, Star, Sun, CloudRain, Clock, User, Phone, X } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const carouselRef = useRef(null);
  const [weather, setWeather] = useState(null);

  // Catalog Data
  const [barberos, setBarberos] = useState([]);
  const [servicios, setServicios] = useState([]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reserva, setReserva] = useState({
    servicio_id: null,
    servicio_nombre: '',
    barbero_id: '',
    fecha: '',
    hora: '',
    cliente_nombre: '',
    cliente_telefono: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitExito, setSubmitExito] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const fetchPublicData = async () => {
      // Fetch Weather
      try {
        const wRes = await api.get('/weather/current');
        if (wRes.data) setWeather(wRes.data);
      } catch (err) {
        console.warn("Weather widget unavailable:", err.message);
      }

      // Fetch Barberos
      try {
        const bRes = await api.get('/equipo');
        setBarberos(bRes.data || []);
      } catch (err) {
        console.error("Error fetching barberos:", err);
      }
    };

    const fetchServiciosFromDB = async () => {
      // Simulando los servicios por ahora o fetch real. Asumiendo que tenemos los endpoints (pero el user nos dio un script sql completo del catálogo).
      // Para estar seguros usaremos el arreglo hardcodeado si no hay endpoint o adaptaremos el arreglo.
      // Como el usuario dio el SQL, los servicios deberían estar en la BD, pero no creamos endpoint público de servicios aún.
      // Vamos a usar el visual hardcodeado y pasaremos el NOMBRE del servicio en vez del ID para que Backend/BD lo tome.
      // Wait: El backend espera 'servicio' como texto directo.
    };

    fetchPublicData();
    fetchServiciosFromDB();
  }, []);

  const openModal = (servicioNombre) => {
    setReserva(prev => ({ ...prev, servicio_nombre: servicioNombre, servicio: servicioNombre }));
    setIsModalOpen(true);
    setSubmitExito(false);
    setSubmitError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSubmitExito(false);
  };

  const handleReservaSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Mandamos los datos al backend publico
      await api.post('/reservas/public', {
        fecha: reserva.fecha,
        hora: reserva.hora,
        barbero_id: reserva.barbero_id,
        servicio: reserva.servicio_nombre, // el controlador dice 'servicio'
        cliente_nombre: reserva.cliente_nombre,
        cliente_telefono: reserva.cliente_telefono
      });

      setSubmitExito(true);
    } catch (err) {
      setSubmitError(err.response?.data?.error || 'No se pudo generar la reserva. Verifica los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    if (carouselRef.current) carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  // Generar horas estandar
  const generateTimeSlots = () => {
    const slots = [];
    for (let h = 9; h <= 20; h++) {
      slots.push(`${h.toString().padStart(2, '0')}:00:00`);
      slots.push(`${h.toString().padStart(2, '0')}:30:00`);
    }
    return slots;
  };

  const catServicios = [
    { title: 'Taper Fade (Desvanecido)', short: 'Desvanecido oscuro', desc: 'Fade oscuro lateral con peso arriba, perfecto para peinados modernos.', url: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=400&auto=format&fit=crop' },
    { title: 'Buzz Cut (Rapado Militar)', short: 'Rapado militar', desc: 'Corte ultra corto a máquina, alineación perfecta con navaja recta.', url: 'https://images.unsplash.com/photo-1593702275687-f8b402bf1fb5?q=80&w=400&auto=format&fit=crop' },
    { title: 'Mullet Moderno', short: 'Tendencia rebelde', desc: 'El estilo en tendencia: corto a los lados y volumen con textura en nuca.', url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop' },
    { title: 'Ritual de Barba', short: 'Toalla caliente', desc: 'Ritual con toalla caliente, espuma clásica, masaje facial y navaja libre.', url: 'https://images.unsplash.com/photo-1534066922332-68c4c3ef0824?q=80&w=400&auto=format&fit=crop' },
    { title: 'COMBO: Rey Absoluto', short: 'Corte + Barba + Cejas', desc: 'Corte Premium + Ritual de Barba + Cejas. El servicio completo.', url: 'https://images.unsplash.com/photo-1516975080661-46bca181cb23?q=80&w=400&auto=format&fit=crop' },
    { title: 'Perfilado de Cejas (Hilo/Navaja)', short: 'Marco facial limpio', desc: 'Limpieza de cejas masculina conservando el marco natural del rostro.', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop' },
    { title: 'Platinado / Decoloración', short: 'Decoloración & Tinte', desc: 'Decoloración extrema (Platino, Gris o Blanco). Incluye matizador.', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop' },
    { title: 'Masaje y Limpieza Facial', short: 'Mascarilla Negra', desc: 'Exfoliación profunda con carbón activado, eliminación de puntos negros.', url: 'https://images.unsplash.com/photo-1521117184087-0bf82f2385ab?q=80&w=400&auto=format&fit=crop' },
    { title: 'Diseño Freestyle', short: 'Lineas & Tatuajes', desc: 'Líneas rectas, curvas o dibujos geométricos trabajados a navaja seca.', url: 'https://images.unsplash.com/photo-1621592484082-2d05b1290d7a?q=80&w=400&auto=format&fit=crop' },
    { title: 'Corte Clásico Premium', short: 'Tijera Tradicional', desc: 'Corte tradicional a tijera o máquina con acabados finos y lavado térmico.', url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=400&auto=format&fit=crop' },
    { title: 'Alisado Express', short: 'Relajación de rizos', desc: 'Relajación temporal de rizos con queratina express masculina.', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop' },
    { title: 'COMBO: Ejecutivo (Express)', short: 'Corte + Barba Express', desc: 'Buzz Cut/Classic + Recorte rápido de barba y lavado refrescante.', url: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=400&auto=format&fit=crop' }
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden text-white relative">
      {/* Header NavBar */}
      <nav className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-700 tracking-widest uppercase">
                Crimson Blades
              </h1>
            </div>

            <div className="flex gap-6 items-center">
              {/* Widget de Clima */}
              {weather && (
                <div className="hidden sm:flex items-center gap-2 bg-black/40 border border-gray-800 px-4 py-2 rounded-xl">
                  <img src={weather.icon} alt="climate" className="w-6 h-6" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none">Chihuahua</p>
                    <p className="text-sm font-black text-gray-300 leading-tight">{weather.avg_temp}°C</p>
                  </div>
                </div>
              )}
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2.5 text-sm font-bold text-white transition-all bg-black/50 border border-red-900/50 rounded-xl hover:bg-red-600 hover:border-red-500 uppercase tracking-widest shadow-lg"
              >
                Soy Staff
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Gran Hero / CTA */}
        <div className="relative overflow-hidden flex flex-col sm:flex-row justify-between items-center mb-16 bg-gradient-to-br from-[#0a0a0a] via-[#111] to-red-950/20 p-8 sm:p-14 rounded-[40px] border border-red-900/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>

          <div className="z-10 text-center sm:text-left mb-10 sm:mb-0 max-w-xl">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-6">
              {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500 drop-shadow-lg" />)}
              <span className="text-white text-sm ml-3 font-bold uppercase tracking-widest text-[#a3a3a3]">+1,000 Clientes Felices</span>
            </div>
            <h2 className="text-5xl sm:text-6xl font-black text-white leading-tight mb-6 tracking-tighter uppercase">
              No es un corte,<br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">Es una experiencia.</span>
            </h2>
            <p className="text-[#a3a3a3] text-lg lg:text-xl font-medium mb-8 leading-relaxed">
              Agenda tu cita hoy mismo. Disfruta de la mejor atención, toallas calientes y precisión a navaja en el corazón de la ciudad.
            </p>

            <button
              onClick={() => openModal('Corte Clásico Premium')}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_30px_rgba(220,38,38,0.4)] hover:shadow-[0_0_50px_rgba(220,38,38,0.6)] hover:-translate-y-1"
            >
              <Calendar className="w-6 h-6" /> Agendar Rápido
            </button>
          </div>
        </div>

        {/* Sección de Inspiración / Galería Visual Estilo Netflix */}
        <div className="mt-8 mb-20 relative group">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Catálogo de <span className="text-red-600">Servicios</span></h3>
              <p className="text-sm font-medium text-gray-400 mt-2 uppercase tracking-widest">Navega, inspírate y ¡aparta tu lugar en segundos!</p>
            </div>
            <div className="flex gap-3">
              <button onClick={scrollLeft} className="w-14 h-14 rounded-full bg-black/60 border border-gray-800 flex justify-center items-center hover:bg-gray-800 transition-colors text-white hover:border-red-500 group-hover:bg-black/90 shadow-xl backdrop-blur-md">
                <ChevronLeft className="w-7 h-7" />
              </button>
              <button onClick={scrollRight} className="w-14 h-14 rounded-full bg-black/60 border border-gray-800 flex justify-center items-center hover:bg-gray-800 transition-colors text-white hover:border-red-500 group-hover:bg-black/90 shadow-xl backdrop-blur-md">
                <ChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>

          <div
            ref={carouselRef}
            className="flex gap-6 overflow-x-auto snap-x snap-mandatory hide-scrollbars pb-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {catServicios.map((item, idx) => (
              <div key={idx} className="snap-start flex-shrink-0 w-[280px] md:w-[320px] group relative rounded-[32px] overflow-hidden aspect-[3/4] border border-gray-800 cursor-pointer bg-[#0a0a0a] shadow-2xl">
                <img src={item.url} alt={item.title} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100" />

                {/* Overlay Default (Visible without hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 p-6 w-full group-hover:opacity-0 transition-opacity duration-300">
                  <h4 className="text-2xl font-black text-white leading-tight uppercase tracking-tighter mb-1">{item.title}</h4>
                  <p className="text-xs font-bold text-red-500 uppercase tracking-widest">{item.short}</p>
                </div>

                {/* Overlay Hover con Scroll para la Descripción Larga */}
                <div className="absolute inset-0 bg-black/95 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out border-t-8 border-red-600 flex flex-col pt-10 pb-6 px-8 backdrop-blur-sm">
                  <h4 className="text-2xl font-black text-white mb-4 uppercase tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-100 to-gray-500">{item.title}</h4>
                  <div className="flex-1 text-gray-300 text-sm leading-relaxed font-medium">
                    <p>{item.desc}</p>
                  </div>
                  <button
                    onClick={() => openModal(item.title)}
                    className="mt-6 w-full py-4 bg-red-600 hover:bg-red-500 text-white text-sm font-black uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] hover:-translate-y-1"
                  >
                    Reservar Este
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Autores */}
        <div className="text-center pb-20 pt-10 border-t border-gray-900 border-dashed">
          <p className="text-gray-600 font-bold tracking-widest uppercase text-xs">Un proyecto de Barbería evolucionado a la Era Digital.</p>
        </div>
      </main>

      {/* MODAL FLOTANTE DE RESERVA */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeModal}></div>

          {/* Modal Content */}
          <div className="relative bg-[#0d0d0d] border border-gray-800 rounded-3xl p-8 w-full max-w-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button onClick={closeModal} className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors bg-gray-900 rounded-full p-2">
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">Agendar Cita</h2>
            <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-8 bg-red-900/10 w-max px-3 py-1 rounded inline-block">{reserva.servicio_nombre}</p>

            {submitExito ? (
              <div className="text-center py-10 bg-[#111] rounded-2xl border border-green-900/50">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-10 h-10 text-green-500" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">¡Cita Confirmada!</h3>
                <p className="text-gray-400 font-medium mb-8">Te esperamos el día {reserva.fecha} a las {reserva.hora.substring(0, 5)}.</p>
                <button onClick={closeModal} className="px-8 py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-colors">Cerrar</button>
              </div>
            ) : (
              <form onSubmit={handleReservaSubmit} className="space-y-5">
                {submitError && (
                  <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm font-medium">{submitError}</div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2"><User className="w-4 h-4 inline mr-1 -mt-0.5" /> Tu Nombre</label>
                    <input type="text" required value={reserva.cliente_nombre} onChange={e => setReserva({ ...reserva, cliente_nombre: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-3.5 text-white font-medium focus:ring-1 focus:ring-red-600 focus:outline-none placeholder-gray-600" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2"><Phone className="w-4 h-4 inline mr-1 -mt-0.5" /> WhatsApp</label>
                    <input type="tel" required value={reserva.cliente_telefono} onChange={e => setReserva({ ...reserva, cliente_telefono: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-3.5 text-white font-medium focus:ring-1 focus:ring-red-600 focus:outline-none placeholder-gray-600" placeholder="Ej. 55 1234 5678" />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Barbero de Preferencia</label>
                  <select required value={reserva.barbero_id} onChange={e => setReserva({ ...reserva, barbero_id: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-3.5 text-white font-medium focus:ring-1 focus:ring-red-600 focus:outline-none appearance-none cursor-pointer">
                    <option value="" className="text-gray-500">Selecciona con quién cortarte</option>
                    {barberos.map(b => (
                      <option key={b.id} value={b.id}>{b.nombre} • {b.especialidad}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Día</label>
                    <input type="date" required min={new Date().toISOString().split('T')[0]} value={reserva.fecha} onChange={e => setReserva({ ...reserva, fecha: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-3.5 text-white font-medium focus:ring-1 focus:ring-red-600 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">Hora</label>
                    <select required value={reserva.hora} onChange={e => setReserva({ ...reserva, hora: e.target.value })} className="w-full bg-[#161616] border border-gray-800 rounded-xl px-4 py-3.5 text-white font-medium focus:ring-1 focus:ring-red-600 focus:outline-none appearance-none cursor-pointer">
                      <option value="">Elegir Hora</option>
                      {generateTimeSlots().map(hora => (
                        <option key={hora} value={hora}>{hora.substring(0, 5)}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-black py-4 rounded-xl mt-6 uppercase tracking-widest transition-all">
                  {isSubmitting ? 'Procesando...' : 'Confirmar Reserva'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
