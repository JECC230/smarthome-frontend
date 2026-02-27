'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirección automática al login
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      Cargando SmartHome...
    </div>
  );
}