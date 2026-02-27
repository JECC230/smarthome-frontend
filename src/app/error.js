'use client'; 

import { useEffect } from 'react';

export default function Error({ error, reset }) {
  useEffect(() => {
    // Aquí podrías enviar el error a un servicio de logs
    console.error('Error capturado por Next.js:', error);
  }, [error]);

  return (
    <div className="flex h-screen flex-col items-center justify-center bg-black text-white p-6 text-center">
      <div className="bg-red-500/10 p-4 rounded-full mb-4">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-bold mb-2">¡Algo salió mal!</h2>
      <p className="text-red-400 mb-6 text-sm font-mono bg-red-950/30 p-2 rounded border border-red-900/50">
        {error.message || "Error desconocido"}
      </p>
      
      <button
        onClick={() => reset()}
        className="px-6 py-3 bg-blue-600 rounded-xl font-bold hover:bg-blue-500 transition"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}