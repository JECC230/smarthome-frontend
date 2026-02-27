// Centralización de la URL de la API
export const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';


// Validación defensiva: Si no existe la variable, lanzamos un error claro
if (!API) {
  throw new Error(
    "⚠️ ERROR: Se te olvidó configurar la variable NEXT_PUBLIC_API_URL en tu archivo .env.local"
  );
}


export const CONFIG = {
  TOKEN_KEY: 'smarthome_token', 
};