'use client';
import { useState, useEffect } from 'react';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';

export default function MandadoPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const cargarLista = async () => {
    setLoading(true);
    try {
      // Traemos todos los productos para filtrar los que están en mínimo
      const res = await apiFetch('/api/productos?limit=100');
      const faltantes = (res.data || []).filter(p => p.stock <= p.stock_minimo);
      setItems(faltantes);
    } catch (err) { setError(err.message); } 
    finally { setLoading(false); }
  };

  useEffect(() => { cargarLista(); }, []);

  const surtir = async (id, stockActual) => {
    try {
      const nuevoStock = stockActual + 1;
      await apiFetch(`/api/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ stock: nuevoStock })
      });
      // Recargamos: si ya no es mínimo, desaparecerá automáticamente
      cargarLista();
    } catch (err) { alert("Error al surtir"); }
  };

  return (
    <main className="max-w-4xl mx-auto px-6 pt-12 pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight">Lista de Mandado</h1>
        <p className="text-gray-500 mt-2">Productos que requieren resurtido inmediato</p>
      </div>

      <StatusBox loading={loading} error={error} />

      {!loading && items.length === 0 && (
        <div className="bg-[#1c1c1e] p-12 rounded-[2.5rem] border border-white/5 text-center">
          <span className="text-5xl block mb-4">✅</span>
          <h2 className="text-xl font-bold text-white">¡Despensa Completa!</h2>
          <p className="text-gray-500 mt-2">No hay productos por debajo del stock mínimo.</p>
        </div>
      )}

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="bg-[#1c1c1e] p-6 rounded-3xl border border-red-500/20 flex items-center justify-between shadow-xl animate-in fade-in slide-in-from-left-4">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 font-bold">
                {item.stock}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{item.nombre}</h3>
                <p className="text-xs text-gray-500 uppercase tracking-widest">{item.marca} • Mínimo: {item.stock_minimo}</p>
              </div>
            </div>
            
            <button 
              onClick={() => surtir(item.id, item.stock)}
              className="bg-white text-black px-6 py-3 rounded-2xl font-bold hover:bg-gray-200 transition active:scale-95 shadow-lg"
            >
              + Agregar 1
            </button>
          </div>
        ))}
      </div>
      
      {items.length > 0 && (
        <p className="mt-8 text-center text-gray-600 text-sm">
          Al presionar "+ Agregar", el stock aumenta en tiempo real. <br/>
          Si el stock supera el mínimo, el producto se quitará de esta lista automáticamente.
        </p>
      )}
    </main>
  );
}