'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';

export default function TareasPage() {
  const router = useRouter();
  const [tareas, setTareas] = useState([]);
  const [usuarios, setUsuarios] = useState([]); // Para el dropdown
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', assigned_to: '' });

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [tData, uData] = await Promise.all([
        apiFetch('/api/tasks'),
        apiFetch('/api/users/house') // Debes crear esta ruta en tu backend
      ]);
      setTareas(tData.data || tData);
      setUsuarios(uData.data || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { cargarDatos(); }, []);

  const guardarTarea = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await apiFetch('/api/tasks', {
        method: 'POST',
        body: JSON.stringify({ ...form, assigned_to: form.assigned_to || null })
      });
      setSuccess('Tarea creada');
      setTimeout(() => {
        setMostrarModal(false);
        setForm({ title: '', description: '', assigned_to: '' });
        cargarDatos();
      }, 1000);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const Column = ({ title, status, color }) => (
    <div className="flex-1 min-w-[300px] bg-[#151516] rounded-[2rem] p-4 border border-white/5">
      <div className="flex items-center gap-2 mb-6 px-2">
        <div className={`w-2 h-2 rounded-full ${color}`}></div>
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">{title}</h2>
        <span className="ml-auto bg-white/5 px-2 py-0.5 rounded text-xs">{tareas.filter(t => t.status === status).length}</span>
      </div>
      <div className="space-y-3">
        {tareas.filter(t => t.status === status).map(tarea => (
          <div 
            key={tarea.id}
            onClick={() => router.push(`/tareas/${tarea.id}`)}
            className="bg-[#1c1c1e] p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition cursor-pointer"
          >
            <h3 className="font-bold text-white mb-2">{tarea.title}</h3>
            <p className="text-xs text-gray-500 truncate">{tarea.description}</p>
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-[10px] text-blue-400 font-mono">@{tarea.assigned_name?.split('@')[0] || 'Libre'}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-bold">Tablero de Tareas</h1>
          <button onClick={() => setMostrarModal(true)} className="bg-blue-600 px-6 py-3 rounded-2xl font-bold">+ Nueva</button>
        </div>

        <StatusBox loading={loading && tareas.length === 0} error={error} />

        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto pb-10">
          <Column title="Por hacer" status="por hacer" color="bg-orange-500" />
          <Column title="En proceso" status="en proceso" color="bg-blue-500" />
          <Column title="Terminada" status="terminada" color="bg-green-500" />
        </div>
      </div>

      {mostrarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#1c1c1e] w-full max-w-md rounded-[2.5rem] border border-white/10 p-8">
            <h2 className="text-xl font-bold mb-6 text-center">Asignar Tarea</h2>
            <form onSubmit={guardarTarea} className="space-y-4">
              <StatusBox loading={loading} error={error} success={success} />
              <input type="text" className="input-apple" placeholder="¿Qué hay que hacer?" required
                value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              
              <select className="input-apple appearance-none" 
                value={form.assigned_to} onChange={e => setForm({...form, assigned_to: e.target.value})}>
                <option value="">Cualquier miembro</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.email}</option>
                ))}
              </select>

              <textarea className="input-apple h-24 resize-none" placeholder="Instrucciones..."
                value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setMostrarModal(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400">Cerrar</button>
                <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold">Crear</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style jsx>{` .input-apple { @apply w-full bg-[#2c2c2e] rounded-2xl p-4 text-white focus:ring-2 focus:ring-blue-600 outline-none transition; } `}</style>
    </div>
  );
}