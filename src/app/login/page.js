'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API } from '@/config';
import { setToken } from '@/lib/auth';
import StatusBox from '@/components/StatusBox';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await fetch(`${API}/api/users/login`, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Credenciales incorrectas');
      
      setToken(data.token);
      router.replace('/inicio');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#1c1c1e] p-8 rounded-[2.5rem] border border-white/10 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl">🏠</div>
          <h1 className="text-2xl font-bold text-white">SmartHome</h1>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <StatusBox loading={loading} error={error} />
          <input className="input-apple" type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input-apple" type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 py-4 rounded-2xl font-bold text-white active:scale-95 transition">
            {loading ? 'Entrando...' : 'Iniciar Sesión'}
          </button>
        </form>

        {/* BOTÓN PARA CREAR CUENTA NUEVA */}
        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <p className="text-gray-500 text-sm mb-4">¿No tienes una casa registrada?</p>
          <button 
            onClick={() => router.push('/registro')}
            className="w-full border border-white/10 hover:bg-white/5 py-3 rounded-2xl font-bold text-white text-sm transition"
          >
            Crear nueva casa
          </button>
        </div>
      </div>
      <style jsx>{` .input-apple { @apply w-full bg-[#2c2c2e] rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-600; } `}</style>
    </div>
  );
}