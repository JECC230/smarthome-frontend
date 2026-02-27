export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner estilo iOS */}
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-blue-500"></div>
        <p className="text-sm font-medium text-gray-500 animate-pulse">Cargando SmartHome...</p>
      </div>
    </div>
  );
}