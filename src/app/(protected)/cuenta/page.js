'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';
import { getToken } from '@/lib/auth';

export default function CuentaPage() {
  const [perfil, setPerfil] = useState(null);
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ error: '', success: '' });

  useEffect(() => {
    // Decodificamos el token para obtener el rol y la casa
    const token = getToken();
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const payload = JSON.parse(window.atob(base64Url));
        setPerfil(payload);
      } catch (e) { console.error("Token inválido"); }
    }
  }, []);

  const crearUsuarioComun = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg({ error: '', success: '' });
    try {
      // Utilizamos la función 'create' de tu controlador
      // Forzamos que el house_id sea el mismo del administrador logueado
      await apiFetch('/api/users/create', {
        method: 'POST',
        body: JSON.stringify({ ...form, house_id: perfil.house_id })
      });
      setMsg({ success: 'Miembro registrado correctamente', error: '' });
      setForm({ email: '', password: '', role: 'user' });
    } catch (err) { setMsg({ error: err.message, success: '' }); }
    finally { setLoading(false); }
  };

  if (!perfil) return <div className="p-10 text-center text-gray-500">Cargando perfil...</div>;

  return (
    <main className="max-w-2xl mx-auto px-6 pt-12 pb-20">
      {/* INFORMACIÓN DEL PERFIL */}
      <div className="bg-[#1c1c1e] p-10 rounded-[3rem] border border-white/10 mb-8 shadow-2xl">
        <div className="w-16 h-16 bg-gray-800 rounded-2xl mb-6 flex items-center justify-center text-3xl">👤</div>
        <h1 className="text-3xl font-bold text-white mb-2">Mi Perfil</h1>
        <p className="text-blue-500 font-mono text-sm mb-6">{perfil.email}</p>
        <div className="flex gap-3">
          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-400 uppercase font-bold border border-white/5">
            Rol: {perfil.role}
          </span>
          <span className="px-3 py-1 bg-white/5 rounded-full text-[10px] text-gray-400 uppercase font-bold border border-white/5">
            Casa ID: {perfil.house_id}
          </span>
        </div>
      </div>

      {/* GESTIÓN DE MIEMBROS (SOLO ADMINS) */}
      {perfil.role === 'admin' && (
        <div className="bg-[#1c1c1e] p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-xl font-bold text-white mb-2">Gestionar Familia</h2>
          <p className="text-gray-500 text-xs mb-8">Registra nuevos miembros para la Casa {perfil.house_id}</p>
          
          <form onSubmit={crearUsuarioComun} className="space-y-4">
            <StatusBox loading={loading} error={msg.error} success={msg.success} />
            <input className="input-apple" type="email" placeholder="Email del nuevo miembro" required
              value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            <input className="input-apple" type="password" placeholder="Contraseña de acceso" required
              value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
            
            <button className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-bold text-white transition active:scale-95">
              Registrar Miembro
            </button>
          </form>
        </div>
      )}
      <style jsx>{` .input-apple { @apply w-full bg-black border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition shadow-inner; } `}</style>
    </main>
  );
}