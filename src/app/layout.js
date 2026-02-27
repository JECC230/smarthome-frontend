import './globals.css';

export const metadata = {
  title: 'SmartHome - Inventario',
  description: 'Gestión inteligente de productos del hogar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased bg-black text-gray-100 selection:bg-blue-500/30">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}