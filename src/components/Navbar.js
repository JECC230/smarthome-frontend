'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth'; // 

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Estado para controlar el modal de confirmación
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    clearToken(); // [cite: 261-268]
    router.replace('/login'); // [cite: 160]
  };

  const navItems = [
    { name: 'Inicio', path: '/inicio' },
    { name: 'Productos', path: '/productos' },
    { name: 'Mandado', path: '/mandado' },
    { name: 'Tareas', path: '/tareas' },
    { name: 'Cuenta', path: '/cuenta' },
  ];

  return (
    <>
      <nav className="bg-black w-full h-20 flex items-center px-8 border-b border-white/5 relative z-40">
        <div className="flex items-center w-full max-w-7xl mx-auto justify-between">
          
          {/* LOGO IZQUIERDA */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-900/20">
              🏠
            </div>
            <span className="text-xl font-bold text-white tracking-tight">SmartHome</span>
          </div>

          {/* LINKS CENTRO (ESTILO CÁPSULA) */}
          <div className="bg-[#1c1c1e] rounded-full px-2 py-1.5 flex gap-1 border border-white/5">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                  pathname.startsWith(item.path) 
                  ? 'bg-[#2c2c2e] text-white shadow-inner border border-white/5' 
                  : 'text-gray-400 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* BOTÓN SALIR */}
          <button 
            onClick={() => setShowConfirm(true)}
            className="text-xs font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            SALIR
          </button>
        </div>
      </nav>

      {/* MODAL DE CONFIRMACIÓN CERRAR SESIÓN */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1c1c1e] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 duration-200 text-center">
            <div className="text-4xl mb-4">🚪</div>
            <h2 className="text-xl font-bold text-white mb-2">¿Cerrar sesión?</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Tendrás que volver a ingresar tus credenciales para acceder a la gestión de tu casa.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition border border-white/5"
              >
                Cancelar
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-lg shadow-red-900/20 transition active:scale-95"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}