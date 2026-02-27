'use client';
import AuthGuard from '@/components/AuthGuard';
import Navbar from '@/components/Navbar';

export default function ProtectedLayout({ children }) {
  return (
    <AuthGuard>
      {}
      <Navbar /> 
      {children}
    </AuthGuard>
  );
}