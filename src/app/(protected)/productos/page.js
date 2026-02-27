'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import StatusBox from '@/components/StatusBox';

export default function ProductosPage() {
  const router = useRouter();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [busqueda, setBusqueda] = useState('');
  const limite = 12; 

  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [form, setForm] = useState({ 
    nombre: '', categoria: '', marca: '', descripcion: '', stock: '', stock_minimo: 1 
  });

  const cargarProductos = async () => {
    setLoading(true);
    setError('');
    try {
      // La búsqueda ahora es parte de la petición a la API
      const data = await apiFetch(`/api/productos?page=${pagina}&limit=${limite}&search=${busqueda}`);
      setProductos(data.data || []);
      setTotalPaginas(data.meta?.totalPaginas || 1);
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  // Se recargan los productos cuando cambia la página o el término de búsqueda
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      cargarProductos();
    }, 400); // Pequeña pausa para no saturar el servidor mientras escribes
    return () => clearTimeout(delayDebounce);
  }, [pagina, busqueda]);

  const guardarProducto = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await apiFetch('/api/productos', { 
        method: 'POST', 
        body: JSON.stringify({ 
          ...form, 
          stock: Number(form.stock), 
          stock_minimo: Number(form.stock_minimo) 
        }) 
      });
      setSuccess("Producto creado");
      setTimeout(() => {
        setMostrarModalCrear(false);
        setForm({ nombre: '', categoria: '', marca: '', descripcion: '', stock: '', stock_minimo: 1 });
        setSuccess('');
        cargarProductos();
      }, 1000);
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-8 mb-8 flex justify-between items-center gap-4">
          <div className="flex-1 max-w-md relative">
             {/* Se eliminó el emoji de la lupa */}
             <input 
                type="text" placeholder="Buscar en todo el inventario..." 
                className="w-full bg-[#1c1c1e] text-white px-5 py-2.5 rounded-xl border border-white/10 outline-none focus:border-blue-500/50 transition-all shadow-sm"
                value={busqueda} 
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPagina(1); // Reiniciar a la página 1 al buscar
                }}
             />
          </div>
          <button 
            onClick={() => setMostrarModalCrear(true)} 
            className="bg-blue-600 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg active:scale-95 text-white transition hover:bg-blue-500"
          >
            + Nuevo
          </button>
      </div>

      <main className="max-w-5xl mx-auto px-6">
            <StatusBox loading={loading && productos.length === 0} error={error} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Ya no filtramos aquí, mostramos directamente lo que trae la API */}
                {productos.map((prod) => (
                    <div 
                      key={prod.id} 
                      onClick={() => router.push(`/productos/${prod.id}`)}
                      className={`cursor-pointer bg-[#1c1c1e] p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 relative shadow-md ${prod.stock <= prod.stock_minimo ? 'border-l-[3px] border-l-red-500' : ''}`}
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <span className="text-[10px] uppercase font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-md mb-3 inline-block">
                                  {prod.categoria}
                                </span>
                                <h3 className="font-bold text-white text-lg truncate">{prod.nombre}</h3>
                            </div>
                            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-end">
                                <span className="text-xs text-gray-500">Existencia</span>
                                <span className={`text-xl font-bold ${prod.stock <= prod.stock_minimo ? 'text-red-400' : 'text-white'}`}>
                                  {prod.stock}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Paginación */}
            {productos.length > 0 && (
                <div className="flex justify-center items-center gap-6 mt-16 pb-10">
                  <button 
                    disabled={pagina === 1} 
                    onClick={() => setPagina(pagina - 1)} 
                    className="px-6 py-2 bg-[#1c1c1e] text-white rounded-xl disabled:opacity-30 border border-white/5 transition hover:bg-[#252528]"
                  >
                    ← Anterior
                  </button>
                  <span className="text-gray-500 text-sm font-mono">{pagina} / {totalPaginas}</span>
                  <button 
                    disabled={pagina >= totalPaginas} 
                    onClick={() => setPagina(pagina + 1)} 
                    className="px-6 py-2 bg-[#1c1c1e] text-white rounded-xl disabled:opacity-30 border border-white/5 transition hover:bg-[#252528]"
                  >
                    Siguiente →
                  </button>
                </div>
            )}
      </main>

      {/* Modal para crear producto [cite: 73, 136] */}
      {mostrarModalCrear && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
            <div className="bg-[#1c1c1e] w-full max-w-lg rounded-[2.5rem] border border-white/10 p-10 shadow-2xl">
                <h2 className="text-xl font-bold text-white mb-6 text-center">Registrar Producto</h2>
                <form onSubmit={guardarProducto} className="space-y-4">
                    <StatusBox loading={loading} error={error} success={success} />
                    <input className="input-apple" type="text" placeholder="Nombre" required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                      <input className="input-apple" type="text" placeholder="Marca" required value={form.marca} onChange={e => setForm({...form, marca: e.target.value})} />
                      <select className="input-apple" required value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                          <option value="" disabled>Categoría</option>
                          <option value="Lácteos">Lácteos</option>
                          <option value="Limpieza">Limpieza</option>
                          <option value="Bebidas">Bebidas</option>
                          <option value="Otros">Otros</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input className="input-apple" type="number" placeholder="Stock" required value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
                        <input className="input-apple" type="number" placeholder="Mínimo" required value={form.stock_minimo} onChange={e => setForm({...form, stock_minimo: e.target.value})} />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setMostrarModalCrear(false)} className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold transition hover:text-white">Cancelar</button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold transition hover:bg-blue-500">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
      <style jsx>{` .input-apple { @apply w-full bg-black/50 border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition shadow-inner; } `}</style>
    </div>
  );
}