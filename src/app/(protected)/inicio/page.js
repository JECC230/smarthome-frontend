'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';

export default function InicioPage() {
  const [stats, setStats] = useState({
    productos: 0,
    tareas: 0,
    mandado: 0
  });
  const [clima, setClima] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarDashboard = async () => {
    setLoading(true);
    try {
      // 1. Cargamos productos (usamos la meta-información para el conteo real)
      const resProd = await apiFetch('/api/productos?limit=1');
      
      // 2. Cargamos tareas
      const resTareas = await apiFetch('/api/tasks');
      
      // 3. Calculamos cuántos faltan para el mandado
      // Traemos todos para filtrar (o una cantidad grande)
      const resMandado = await apiFetch('/api/productos?limit=100');
      const faltantes = (resMandado.data || []).filter(p => p.stock <= p.stock_minimo).length;

      setStats({
        //  Usamos totalItems del backend
        productos: resProd.meta?.totalItems || 0,
        tareas: (resTareas.data || []).length,
        mandado: faltantes
      });

      // 4. Clima (Simulado o API externa)
      setClima({ temp: 24, condicion: 'Despejado', icono: '☀️' });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDashboard();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-8 pt-12 pb-20">
      <header className="mb-12">
        <h1 className="text-5xl font-bold text-white tracking-tight">Panel de Control</h1>
        <p className="text-gray-500 mt-3 text-lg">Bienvenido a tu SmartHome. Todo está bajo control.</p>
      </header>

      <StatusBox loading={loading} error={error} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* TARJETA INVENTARIO */}
        <div className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-blue-500/30 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-blue-600/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition">📦</div>
            <span className="text-blue-500 font-bold text-sm tracking-widest">INVENTARIO</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white">{stats.productos}</span>
            <span className="text-gray-500 font-medium">Productos</span>
          </div>
          <p className="text-gray-500 mt-4 text-sm leading-relaxed">Artículos registrados en tu despensa inteligente.</p>
        </div>

        {/* TARJETA MANDADO */}
        <div className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-red-500/30 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-red-600/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition">🛒</div>
            <span className="text-red-500 font-bold text-sm tracking-widest">MANDADO</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white">{stats.mandado}</span>
            <span className="text-gray-500 font-medium">Por comprar</span>
          </div>
          <p className="text-gray-500 mt-4 text-sm leading-relaxed">Productos que están por debajo del stock mínimo.</p>
        </div>

        {/* TARJETA TAREAS */}
        <div className="bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl hover:border-purple-500/30 transition-all group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-14 h-14 bg-purple-600/10 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition">📋</div>
            <span className="text-purple-500 font-bold text-sm tracking-widest">TAREAS</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-6xl font-black text-white">{stats.tareas}</span>
            <span className="text-gray-500 font-medium">Pendientes</span>
          </div>
          <p className="text-gray-500 mt-4 text-sm leading-relaxed">Actividades del hogar asignadas a la familia.</p>
        </div>

      </div>

      {/* SECCIÓN DE CLIMA */}
      {clima && (
        <div className="mt-12 bg-gradient-to-br from-[#1c1c1e] to-[#000000] p-10 rounded-[3rem] border border-white/5 flex items-center justify-between shadow-inner">
          <div>
            <p className="text-blue-500 font-bold text-xs tracking-[0.3em] uppercase mb-2">Estado del Tiempo</p>
            <h2 className="text-3xl font-bold text-white">{clima.condicion} en tu ciudad</h2>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-7xl">{clima.icono}</span>
            <span className="text-7xl font-light text-white">{clima.temp}°</span>
          </div>
        </div>
      )}
    </main>
  );
}
