'use client'; // Necesario para interactividad
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-white p-4 text-center">
      <h2 className="text-6xl font-bold text-blue-600 mb-4">404</h2>
      <h3 className="text-2xl font-semibold mb-2">Página no encontrada</h3>
      <p className="text-gray-500 mb-8 max-w-md">
        Lo sentimos, no pudimos encontrar el recurso o la página que estás buscando.
      </p>
      
      <Link 
        href="/productos"
        className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition"
      >
        Volver al Inicio
      </Link>
    </div>
  );
}