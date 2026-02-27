'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';

export default function TareaDetalle({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise);
  const [tarea, setTarea] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarTarea = async () => {
    try {
      // Arreglado: El backend ahora tiene una ruta GET /api/tasks/:id
      const res = await apiFetch(`/api/tasks/${params.id}`);
      setTarea(res.data || res);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargarTarea(); }, [params.id]);

  const moverA = async (nuevoStatus) => {
    try {
      const res = await apiFetch(`/api/tasks/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify({ ...tarea, status: nuevoStatus })
      });
      setTarea(res.data || res);
    } catch (err) { alert(err.message); }
  };

  const eliminar = async () => {
    if (!confirm('¿Eliminar esta tarea definitivamente?')) return;
    try {
      await apiFetch(`/api/tasks/${params.id}`, { method: 'DELETE' });
      router.push('/tareas');
    } catch (err) { alert(err.message); }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><StatusBox loading={true} /></div>;
  if (!tarea) return <div className="min-h-screen bg-black flex items-center justify-center"><StatusBox error="La tarea ya no existe" /></div>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-[#1c1c1e] rounded-[3rem] p-10 border border-white/10 shadow-2xl">
        <div className="mb-10">
          <div className="flex justify-between items-start mb-6">
             <span className="bg-blue-600/10 text-blue-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
               Asignada a: {tarea.assigned_name?.split('@')[0]}
             </span>
             <button onClick={eliminar} className="text-red-500 text-xs font-bold hover:underline">Eliminar</button>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{tarea.title}</h1>
          <p className="text-gray-500 leading-relaxed">{tarea.description || 'Sin instrucciones adicionales.'}</p>
        </div>

        <div className="space-y-6">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-widest text-center">Mover estado a:</p>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => moverA('por hacer')} 
              className={`py-4 rounded-2xl text-xs font-bold transition ${tarea.status === 'por hacer' ? 'bg-orange-600 text-white' : 'bg-white/5 text-gray-500'}`}>
              Por hacer
            </button>
            <button onClick={() => moverA('en proceso')} 
              className={`py-4 rounded-2xl text-xs font-bold transition ${tarea.status === 'en proceso' ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-500'}`}>
              En proceso
            </button>
            <button onClick={() => moverA('terminada')} 
              className={`py-4 rounded-2xl text-xs font-bold transition ${tarea.status === 'terminada' ? 'bg-green-600 text-white' : 'bg-white/5 text-gray-500'}`}>
              Terminada
            </button>
          </div>
          
          <button onClick={() => router.back()} className="w-full py-4 bg-[#2c2c2e] text-white rounded-2xl font-bold mt-4">Volver al tablero</button>
        </div>
      </div>
    </div>
  );
}