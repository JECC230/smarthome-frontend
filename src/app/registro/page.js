'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/config';
import StatusBox from '@/components/StatusBox';

export default function RegistroPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const registrarNuevaCasa = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setError('');

    try {
      
      const res = await fetch(`${API}/api/users/register-admin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'No se pudo crear la cuenta.');

      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#1c1c1e] p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center text-3xl">🏠</div>
        <h2 className="text-2xl font-bold text-white text-center mb-2">Fundar mi Casa</h2>
        <p className="text-gray-500 text-[10px] text-center mb-10 uppercase tracking-[0.2em] font-bold">Registro de Administrador</p>
        
        <form onSubmit={registrarNuevaCasa} className="space-y-4">
          <StatusBox loading={loading} error={error} />
          
          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-bold ml-1 uppercase">Correo Personal</label>
            <input className="input-apple" type="email" placeholder="admin@mihogar.com" required 
              onChange={e => setForm({...form, email: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-gray-500 font-bold ml-1 uppercase">Contraseña Segura</label>
            <input className="input-apple" type="password" placeholder="••••••••" required 
              onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 py-4 rounded-2xl font-bold text-white mt-6 shadow-lg shadow-blue-900/20 active:scale-95 transition disabled:opacity-50">
            {loading ? 'Creando Hogar...' : 'Crear mi SmartHome'}
          </button>
        </form>

        <p className="mt-8 text-gray-600 text-[11px] text-center px-4">
          Al registrarte, se te asignará automáticamente un ID de casa único para gestionar tus dispositivos y tareas.
        </p>

        <button onClick={() => router.push('/login')} className="w-full mt-6 text-gray-500 text-sm hover:text-white transition">
          Volver al Inicio de Sesión
        </button>
      </div>
      <style jsx>{` .input-apple { @apply w-full bg-black border border-white/5 rounded-xl p-4 text-white outline-none focus:border-blue-500 transition; } `}</style>
    </div>
  );
}