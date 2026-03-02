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
  const [orden, setOrden] = useState(''); 
  const [mostrarMenuOrden, setMostrarMenuOrden] = useState(false);
  const limite = 12; 

  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [form, setForm] = useState({ 
    nombre: '', categoria: '', marca: '', descripcion: '', stock: '', stock_minimo: 1 
  });

  const cargarProductos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiFetch(`/api/productos?page=${pagina}&limit=${limite}&search=${busqueda}`);
      setProductos(data.data || []);
      setTotalPaginas(data.meta?.totalPaginas || 1);
    } catch (err) { 
      setError(err.message); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      cargarProductos();
    }, 400); 
    return () => clearTimeout(delayDebounce);
  }, [pagina, busqueda]);

  const actualizarStockRapido = async (e, id, currentStock, change) => {
    e.stopPropagation(); 
    const nuevoStock = currentStock + change;
    if (nuevoStock < 0) return; // 🔒 Aquí ya estábamos protegidos contra negativos

    setProductos(prev => prev.map(p => p.id === id ? { ...p, stock: nuevoStock } : p));

    try {
      await apiFetch(`/api/productos/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ stock: nuevoStock })
      });
    } catch (err) {
      cargarProductos(); 
    }
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      await apiFetch('/api/productos', { 
        method: 'POST', 
        body: JSON.stringify({ 
          ...form, 
          descripcion: form.descripcion, 
          // 🔒 Doble validación al enviar por si acaso
          stock: Math.max(0, Number(form.stock)), 
          stock_minimo: Math.max(0, Number(form.stock_minimo)) 
        }) 
      });
      setSuccess("Producto creado exitosamente");
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

  let productosMostrar = [...productos];
  if (orden === 'az') productosMostrar.sort((a,b) => a.nombre.localeCompare(b.nombre));
  if (orden === 'menor') productosMostrar.sort((a,b) => a.stock - b.stock);
  if (orden === 'mayor') productosMostrar.sort((a,b) => b.stock - a.stock);

  return (
    <div className="min-h-screen bg-black text-gray-200 pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-8 mb-8 flex justify-between items-center gap-4">
          <div className="flex-1 max-w-md relative">
             <input 
                type="text" placeholder="Buscar en toda la casa..." 
                className="w-full bg-[#1c1c1e] text-white px-5 py-3 rounded-xl border border-white/10 outline-none focus:border-blue-500/50 transition-all shadow-sm"
                value={busqueda} 
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPagina(1);
                }}
             />
          </div>

          <div className="flex items-center gap-3 relative">
            <button 
              onClick={() => setMostrarMenuOrden(!mostrarMenuOrden)}
              className="bg-[#1c1c1e] p-3 rounded-xl border border-white/10 hover:bg-[#252528] transition"
            >
              ↕️
            </button>

            {mostrarMenuOrden && (
              <div className="absolute top-14 right-20 w-48 bg-[#1c1c1e] border border-white/10 rounded-2xl p-2 shadow-2xl z-50">
                <p className="text-xs text-gray-500 font-bold px-3 py-2 uppercase">Ordenar por</p>
                <button onClick={() => {setOrden('az'); setMostrarMenuOrden(false)}} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${orden === 'az' ? 'bg-blue-600/20 text-blue-500' : 'text-white hover:bg-white/5'}`}>A - Z</button>
                <button onClick={() => {setOrden('menor'); setMostrarMenuOrden(false)}} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${orden === 'menor' ? 'bg-blue-600/20 text-blue-500' : 'text-white hover:bg-white/5'}`}>Menor cantidad</button>
                <button onClick={() => {setOrden('mayor'); setMostrarMenuOrden(false)}} className={`w-full text-left px-3 py-2 rounded-xl text-sm ${orden === 'mayor' ? 'bg-blue-600/20 text-blue-500' : 'text-white hover:bg-white/5'}`}>Mayor cantidad</button>
              </div>
            )}

            <button 
              onClick={() => setMostrarModalCrear(true)} 
              className="bg-blue-600 px-5 py-3 rounded-xl font-bold text-sm shadow-lg active:scale-95 text-white transition hover:bg-blue-500"
            >
              + Nuevo
            </button>
          </div>
      </div>

      <main className="max-w-5xl mx-auto px-6">
            <StatusBox loading={loading && productos.length === 0} error={error} />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productosMostrar.map((prod) => (
                    <div 
                      key={prod.id} 
                      onClick={() => router.push(`/productos/${prod.id}`)}
                      className={`cursor-pointer bg-[#1c1c1e] p-5 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-all duration-300 relative shadow-md flex flex-col justify-between ${prod.stock <= prod.stock_minimo ? 'border-l-[3px] border-l-red-500' : ''}`}
                    >
                        <div>
                            <span className="text-[10px] uppercase font-bold text-gray-500 bg-white/5 px-2 py-1 rounded-md mb-3 inline-block">
                              {prod.categoria}
                            </span>
                            <h3 className="font-bold text-white text-lg truncate">{prod.nombre}</h3>
                        </div>
                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                            <span className="text-xs text-gray-500">Stock</span>
                            <div className="flex items-center gap-3 bg-black/40 rounded-lg p-1">
                              <button onClick={(e) => actualizarStockRapido(e, prod.id, prod.stock, -1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white transition">-</button>
                              <span className={`w-6 text-center text-sm font-bold ${prod.stock <= prod.stock_minimo ? 'text-red-400' : 'text-white'}`}>{prod.stock}</span>
                              <button onClick={(e) => actualizarStockRapido(e, prod.id, prod.stock, 1)} className="w-7 h-7 flex items-center justify-center rounded-md bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white transition">+</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {productos.length > 0 && (
                <div className="flex justify-center items-center gap-6 mt-16 pb-10">
                  <button disabled={pagina === 1} onClick={() => setPagina(pagina - 1)} className="px-6 py-2 bg-[#1c1c1e] text-white rounded-xl disabled:opacity-30 border border-white/5 transition hover:bg-[#252528]">← Anterior</button>
                  <span className="text-gray-500 text-sm font-mono">{pagina} / {totalPaginas}</span>
                  <button disabled={pagina >= totalPaginas} onClick={() => setPagina(pagina + 1)} className="px-6 py-2 bg-[#1c1c1e] text-white rounded-xl disabled:opacity-30 border border-white/5 transition hover:bg-[#252528]">Siguiente →</button>
                </div>
            )}
      </main>

      {mostrarModalCrear && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-[#1c1c1e] w-full max-w-lg rounded-[2.5rem] border border-white/10 p-10 shadow-2xl animate-in zoom-in-95">
                <h2 className="text-xl font-bold text-white mb-6 text-center">Registrar Producto</h2>
                <form onSubmit={guardarProducto} className="space-y-4">
                    <StatusBox loading={loading} error={error} success={success} />
                    <input className="input-apple" type="text" placeholder="Nombre" required value={form.nombre} onChange={e => setForm({...form, nombre: e.target.value})} />
                    
                    <textarea className="input-apple resize-none h-20" placeholder="Descripción breve (ej. Litro tapa azul)" value={form.descripcion} onChange={e => setForm({...form, descripcion: e.target.value})} />

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
                        <div>
                           <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest ml-1 mb-1 block">Existencia actual</label>
                           {/* 🔒 Se agregó min="0" y protección en el onChange */}
                           <input className="input-apple" type="number" min="0" placeholder="0" required value={form.stock} onChange={e => {
                             const val = e.target.value;
                             if (val === '' || Number(val) >= 0) setForm({...form, stock: val});
                           }} />
                        </div>
                        <div>
                           <label className="text-[10px] text-red-500/80 font-bold uppercase tracking-widest ml-1 mb-1 block">Avisar si es menor a</label>
                           {/* 🔒 Se agregó min="0" y protección en el onChange */}
                           <input className="input-apple" type="number" min="0" placeholder="1" required value={form.stock_minimo} onChange={e => {
                             const val = e.target.value;
                             if (val === '' || Number(val) >= 0) setForm({...form, stock_minimo: val});
                           }} />
                        </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                        <button type="button" onClick={() => setMostrarModalCrear(false)} className="flex-1 py-4 rounded-2xl border border-white/10 text-gray-400 font-bold transition hover:text-white">Cancelar</button>
                        <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl bg-blue-600 text-white font-bold transition hover:bg-blue-500">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
      )}
      <style jsx>{` .input-apple { @apply w-full bg-[#151516] border border-white/5 rounded-2xl p-4 text-white outline-none focus:border-blue-500 transition shadow-inner; } `}</style>
    </div>
  );
}