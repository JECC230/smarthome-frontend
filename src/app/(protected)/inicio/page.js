'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';

export default function InicioPage() {
  const router = useRouter();
  const [resumen, setResumen] = useState({ productos: 0, alertas: 0, tareas: 0 });
  const [clima, setClima] = useState({ temp: '--', desc: 'Sincronizando...' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarTodo() {
      try {
        // 1. Obtener Clima Local (Chihuahua)
        const weatherRes = await fetch('https://api.open-meteo.com/v1/forecast?latitude=28.63&longitude=-106.08&current_weather=true');
        const weatherData = await weatherRes.json();
        setClima({ 
          temp: Math.round(weatherData.current_weather.temperature), 
          desc: "Cielo Despejado" 
        });

        // 2. Cargar datos del Backend (Promesa conjunta para velocidad)
        const [prodData, taskData] = await Promise.all([
          apiFetch('/api/productos'),
          apiFetch('/api/tasks')
        ]);

        const listaProductos = prodData.data || [];
        const listaTareas = taskData.data || taskData || [];
        
        // Filtrado de alertas (Productos con stock bajo)
        const productosCriticos = listaProductos.filter(p => p.stock <= p.stock_minimo).length;
        // Filtrado de tareas (Solo las que no están terminadas)
        const tareasActivas = listaTareas.filter(t => t.status !== 'terminada').length;

        setResumen({ 
          productos: listaProductos.length, 
          alertas: productosCriticos,
          tareas: tareasActivas
        });
      } catch (err) {
        console.error("Error en Dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    cargarTodo();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 pt-10 pb-20 font-sans">
      
      {/* 🌤️ WIDGET DE CLIMA (Diseño Premium) */}
      <div className="mb-10 flex items-center justify-between bg-gradient-to-br from-[#0052d4] via-[#4364f7] to-[#6fb1fc] p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 border border-white/10">
        <div>
          <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mb-1">Atmósfera Actual</p>
          <h2 className="text-white text-3xl font-bold tracking-tight">Chihuahua, México</h2>
        </div>
        <div className="text-right">
          <div className="text-white text-6xl font-light leading-none flex items-start">
            {clima.temp}<span className="text-2xl mt-2">°C</span>
          </div>
          <p className="text-blue-100/80 text-sm mt-1">{clima.desc}</p>
        </div>
      </div>

      {/* 🏠 TÍTULO DE BIENVENIDA */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Panel de Control</h1>
        <p className="text-gray-500 mt-2 font-medium">Estado general de la Casa 10</p>
      </div>
      
      <StatusBox loading={loading} />

      {/* 📊 GRID DE TARJETAS (Diseño Apple Dark Original) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* TARJETA 1: PRODUCTOS */}
        <div 
          onClick={() => router.push('/productos')}
          className="group cursor-pointer bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/10 shadow-xl hover:bg-[#252528] hover:border-blue-500/40 hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Inventario</p>
              <h3 className="text-white font-bold text-lg">Productos</h3>
            </div>
            <span className="text-gray-700 group-hover:text-blue-500 transition-colors">→</span>
          </div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-6xl font-bold text-white tracking-tighter">{resumen.productos}</h2>
            <span className="text-gray-600 text-xs">SKUs</span>
          </div>
        </div>

        {/* TARJETA 2: ALERTAS DE PRODUCTOS */}
        <div 
          onClick={() => router.push('/mandado')}
          className="group cursor-pointer bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/10 shadow-xl hover:bg-[#252528] hover:border-red-500/40 hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-red-500/80 text-[10px] font-bold uppercase tracking-widest">Crítico</p>
              <h3 className="text-white font-bold text-lg">Alertas Stock</h3>
            </div>
            <span className="text-gray-700 group-hover:text-red-500 transition-colors">→</span>
          </div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-6xl font-bold text-red-500 tracking-tighter">{resumen.alertas}</h2>
            <span className="text-red-900/50 text-xs font-bold">BAJO</span>
          </div>
        </div>

        {/* TARJETA 3: TAREAS PENDIENTES */}
        <div 
          onClick={() => router.push('/tareas')}
          className="group cursor-pointer bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/10 shadow-xl hover:bg-[#252528] hover:border-green-500/40 hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-blue-500/80 text-[10px] font-bold uppercase tracking-widest">Pendientes</p>
              <h3 className="text-white font-bold text-lg">Tareas Hoy</h3>
            </div>
            <span className="text-gray-700 group-hover:text-green-500 transition-colors">→</span>
          </div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-6xl font-bold text-blue-500 tracking-tighter">{resumen.tareas}</h2>
            <span className="text-blue-900/50 text-xs font-bold">ACTIVAS</span>
          </div>
        </div>

      </div>
    </main>
  );
}