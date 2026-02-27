'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';

export default function ProductoDetalle({ params: paramsPromise }) {
  const router = useRouter();
  const params = use(paramsPromise); // Descomprimir el ID de la URL
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (!confirm(' ¿Eliminar este producto?')) return;
    try {
      await apiFetch(`/api/productos/${params.id}`, { method: 'DELETE' });
      router.push('/productos');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center"><StatusBox loading={true} /></div>;
  if (error) return <div className="min-h-screen bg-black flex items-center justify-center p-6"><StatusBox error={error} /></div>;

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#1c1c1e] rounded-3xl border border-white/10 shadow-2xl overflow-hidden">
        <div className="p-8 pb-4 text-center">
          <div className="inline-block bg-white/5 text-gray-400 text-[10px] uppercase px-3 py-1 rounded-full mb-4">
            {producto.categoria}
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{producto.nombre}</h1>
          <p className="text-gray-600 text-xs">Marca: {producto.marca}</p>
        </div>

        <div className="p-8 pt-2">
          <div className="bg-[#151516] rounded-2xl p-6 mb-8 border border-white/5 flex items-center justify-between gap-6">
              <button onClick={() => actualizarStock(-1)} className="w-12 h-12 rounded-full bg-[#2c2c2e] text-white text-2xl hover:bg-[#3a3a3c] transition">-</button>
              <div className="text-center">
                <span className={`block text-5xl font-bold ${producto.stock <= producto.stock_minimo ? 'text-red-500' : 'text-white'}`}>{producto.stock}</span>
                <span className="text-xs text-gray-500 uppercase">Unidades</span>
              </div>
              <button onClick={() => actualizarStock(1)} className="w-12 h-12 rounded-full bg-[#2c2c2e] text-white text-2xl hover:bg-[#3a3a3c] transition">+</button>
          </div>

          <div className="flex gap-3">
            <button onClick={() => router.back()} className="flex-1 py-4 bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white rounded-xl transition font-bold">Volver</button>
            <button onClick={eliminar} className="flex-1 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition font-bold">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
}