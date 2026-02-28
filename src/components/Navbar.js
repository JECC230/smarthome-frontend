'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  // Estados: Modal de salida y Menú móvil
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); 

  const handleLogout = () => {
    clearToken();
    router.replace('/login');
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
      <nav className="bg-black w-full h-20 flex items-center px-6 md:px-8 border-b border-white/5 relative z-50">
        <div className="flex items-center w-full max-w-7xl mx-auto justify-between">
          
          {/* LOGO IZQUIERDA */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-xl shadow-lg shadow-blue-900/20">
              🏠
            </div>
            {/* Ocultamos el texto en móviles muy pequeños para dar espacio */}
            <span className="text-xl font-bold text-white tracking-tight hidden sm:block">SmartHome</span>
          </div>

          {/* LINKS CENTRO (Solo visibles en Desktop) */}
          <div className="hidden md:flex bg-[#1c1c1e] rounded-full px-2 py-1.5 gap-1 border border-white/5">
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

          {/* BOTÓN SALIR (Desktop) */}
          <button 
            onClick={() => setShowConfirm(true)}
            className="hidden md:block text-xs font-bold text-gray-500 hover:text-red-500 transition-colors uppercase tracking-widest"
          >
            SALIR
          </button>

          {/* BOTÓN HAMBURGUESA (Solo visible en Móvil) */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 text-2xl"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* MENÚ DESPLEGABLE MÓVIL */}
        {isMenuOpen && (
          <div className="absolute top-20 left-0 w-full bg-black/95 backdrop-blur-md border-b border-white/10 flex flex-col p-6 gap-2 md:hidden animate-in slide-in-from-top-5">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                href={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`p-4 rounded-2xl text-lg font-bold transition-all ${
                  pathname.startsWith(item.path) ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 bg-white/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button 
              onClick={() => { setIsMenuOpen(false); setShowConfirm(true); }}
              className="p-4 rounded-2xl text-lg font-bold text-red-500 text-left bg-red-500/10 mt-2"
            >
              SALIR DEL SISTEMA
            </button>
          </div>
        )}
      </nav>

      {/* MODAL DE CONFIRMACIÓN (Exactamente como lo tenías) */}
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