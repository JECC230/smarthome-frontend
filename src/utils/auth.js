import { CONFIG } from '@/config';

// Función centralizada para obtener el token de forma segura

export function getToken() {
  // Verificamos si estamos en el navegador (client-side)
  if (typeof window !== 'undefined') {
    return localStorage.getItem(CONFIG.TOKEN_KEY);
  }
  return null;
}

// Función para guardar el token
 
export function saveToken(token) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(CONFIG.TOKEN_KEY, token);
  }
}

//Función para cerrar sesión
 
export function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CONFIG.TOKEN_KEY);
    window.location.href = '/login';
  }
}