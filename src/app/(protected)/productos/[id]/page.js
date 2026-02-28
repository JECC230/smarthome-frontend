'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';

export default function ProductoDetalle({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise); 
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  //  Estado para el modal de confirmación
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const cargarProducto = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/productos/${params.id}`);
      setProducto(data.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarProducto();
  }, [params.id]);

  const actualizarStock = async (cantidad) => {
    const nuevoStock = producto.stock + cantidad;
    if (nuevoStock < 0) return;
    try {
      await apiFetch(`/api/productos/${params.id}`, {
        method: 'PUT',
        body: JSON.stringify({ stock: nuevoStock })
      });
      setProducto({ ...producto, stock: nuevoStock });
    } catch (err) {
      setError("No se pudo actualizar el stock");
    }
  };

  const eliminar = async () => {
    try {
      await apiFetch(`/api/productos/${params.id}`, { method: 'DELETE' });
      router.push('/productos');
    } catch (err) {
      setError(err.message);
      setMostrarConfirmacion(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><StatusBox loading={true} /></div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center p-6"><StatusBox error={error} /></div>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative">
      <div className="w-full max-w-md bg-[#1c1c1e] rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-10 pb-6 text-center">
          <div className="inline-block bg-white/5 text-gray-400 text-[10px] uppercase font-bold tracking-widest px-4 py-1.5 rounded-full mb-6">
            {producto.categoria}
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">{producto.nombre}</h1>
          <p className="text-gray-500 font-medium">Marca: {producto.marca}</p>
          
          {/*  Se agregó la descripción aquí */}
          <div className="mt-6 p-4 bg-black/20 rounded-2xl border border-white/5">
            <p className="text-gray-400 text-sm leading-relaxed">
              {producto.descripcion || 'Sin descripción registrada para este producto.'}
            </p>
          </div>
        </div>

        <div className="p-10 pt-2">
          <div className="bg-[#151516] rounded-3xl p-6 mb-8 border border-white/5 flex items-center justify-between gap-6 shadow-inner">
              <button onClick={() => actualizarStock(-1)} className="w-14 h-14 rounded-2xl bg-[#2c2c2e] text-white text-3xl hover:bg-[#3a3a3c] transition-all active:scale-95 shadow-lg">-</button>
              <div className="text-center">
                <span className={`block text-6xl font-black tracking-tighter ${producto.stock <= producto.stock_minimo ? 'text-red-500' : 'text-white'}`}>{producto.stock}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 block">Unidades</span>
              </div>
              <button onClick={() => actualizarStock(1)} className="w-14 h-14 rounded-2xl bg-[#2c2c2e] text-white text-3xl hover:bg-[#3a3a3c] transition-all active:scale-95 shadow-lg">+</button>
          </div>

          <div className="flex gap-4">
            <button onClick={() => router.back()} className="flex-1 py-4 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-2xl transition-all font-bold">Volver</button>
            <button onClick={() => setMostrarConfirmacion(true)} className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-2xl transition-all font-bold">Eliminar</button>
          </div>
        </div>
      </div>

      {/*  Modal de confirmación estilo Apple */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#1c1c1e] w-full max-w-sm rounded-[2.5rem] border border-white/10 p-8 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="text-5xl mb-6">🗑️</div>
            <h2 className="text-xl font-bold text-white mb-2">¿Eliminar producto?</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Se borrará <strong>"{producto.nombre}"</strong> permanentemente del inventario de la casa. Esta acción no se puede deshacer.
            </p>
            
            <div className="flex gap-3">
              <button onClick={() => setMostrarConfirmacion(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-white font-bold hover:bg-white/10 transition border border-white/5">Cancelar</button>
              <button onClick={eliminar} className="flex-1 py-4 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 shadow-lg transition active:scale-95">Sí, eliminar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}