'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';
import WeatherWidget from '@/components/WeatherWidget'; 

export default function InicioPage() {
  const router = useRouter();
  const [resumen, setResumen] = useState({ productos: 0, alertas: 0, tareas: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatosBackend() {
      try {
        const [prodData, taskData] = await Promise.all([
          apiFetch('/api/productos?limit=1000'), 
          apiFetch('/api/tasks')
        ]);

        const listaProductos = prodData.data || [];
        const listaTareas = taskData.data || taskData || [];
        
        const productosCriticos = listaProductos.filter(p => p.stock <= p.stock_minimo).length;
        const tareasActivas = listaTareas.filter(t => t.status !== 'terminada').length;

        setResumen({ 
          productos: prodData.meta?.totalItems || listaProductos.length, 
          alertas: productosCriticos,
          tareas: tareasActivas
        });
      } catch (err) {
        console.error("Error en Dashboard:", err);
      } finally {
        setLoading(false);
      }
    }
    
    cargarDatosBackend();
  }, []);

  return (
    <main className="max-w-5xl mx-auto px-6 pt-10 pb-20 font-sans">
      
      {/* 🌤️ WIDGET MODULAR DE CLIMA */}
      <WeatherWidget />

      {/* TÍTULO DE BIENVENIDA */}
      <div className="mb-12">
        <h1 className="text-4xl font-extrabold text-white tracking-tight">Panel de Control</h1>
        <p className="text-gray-500 mt-2 font-medium">Estado general de la Casa</p>
      </div>
      
      <StatusBox loading={loading} />

      {/* GRID DE TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div onClick={() => router.push('/productos')} className="group cursor-pointer bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/10 shadow-xl hover:bg-[#252528] hover:border-blue-500/40 hover:scale-[1.02] transition-all duration-300">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Inventario</p>
              <h3 className="text-white font-bold text-lg">Productos</h3>
            </div>
            <span className="text-gray-700 group-hover:text-blue-500 transition-colors">→</span>
          </div>
          <div className="flex items-baseline gap-1">
            <h2 className="text-6xl font-bold text-white tracking-tighter">{resumen.productos}</h2>
            <span className="text-gray-600 text-xs">Total</span>
          </div>
        </div>

        <div onClick={() => router.push('/mandado')} className="group cursor-pointer bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/10 shadow-xl hover:bg-[#252528] hover:border-red-500/40 hover:scale-[1.02] transition-all duration-300">
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

        <div onClick={() => router.push('/tareas')} className="group cursor-pointer bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/10 shadow-xl hover:bg-[#252528] hover:border-green-500/40 hover:scale-[1.02] transition-all duration-300">
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