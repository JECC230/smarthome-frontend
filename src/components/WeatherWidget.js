'use client';
import { useState, useEffect } from 'react';

const interpretarClima = (codigo) => {
  if (codigo === 0) return 'Cielo Despejado';
  if (codigo >= 1 && codigo <= 3) return 'Parcialmente Nublado';
  if (codigo >= 45 && codigo <= 48) return 'Niebla';
  if (codigo >= 51 && codigo <= 67) return 'Llovizna / Lluvia Ligera';
  if (codigo >= 71 && codigo <= 77) return 'Nieve';
  if (codigo >= 80 && codigo <= 82) return 'Chubascos';
  if (codigo >= 95) return 'Tormenta';
  return 'Clima Variable';
};

export default function WeatherWidget() {
  const [clima, setClima] = useState({ temp: '--', desc: 'Buscando satélites...' });
  const [ubicacion, setUbicacion] = useState('Ubicando...');

  useEffect(() => {
    const obtenerClimaPorCoordenadas = async (lat, lon, ciudadFija = null) => {
      try {
        const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const weatherData = await weatherRes.json();
        
        setClima({ 
          temp: Math.round(weatherData.current_weather.temperature), 
          desc: interpretarClima(weatherData.current_weather.weathercode)
        });

        if (!ciudadFija) {
          const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`);
          const geoData = await geoRes.json();
          const city = geoData.address.city || geoData.address.town || geoData.address.village || geoData.address.state || 'Ubicación Local';
          const country = geoData.address.country_code ? geoData.address.country_code.toUpperCase() : '';
          setUbicacion(`${city}${country ? `, ${country}` : ''}`);
        } else {
          setUbicacion(ciudadFija);
        }
      } catch (err) {
        console.error("Error obteniendo el clima:", err);
        setUbicacion('Sin conexión');
        setClima({ temp: '--', desc: 'Error de red' });
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => obtenerClimaPorCoordenadas(position.coords.latitude, position.coords.longitude),
        (error) => {
          console.warn("Ubicación denegada, usando predeterminada.");
          obtenerClimaPorCoordenadas(28.63, -106.08, 'Chihuahua, MX');
        },
        { timeout: 5000 }
      );
    } else {
      obtenerClimaPorCoordenadas(28.63, -106.08, 'Chihuahua, MX');
    }
  }, []);

  return (
    <div className="mb-10 flex items-center justify-between bg-gradient-to-br from-[#0052d4] via-[#4364f7] to-[#6fb1fc] p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/20 border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
      
      <div className="relative z-10">
        <p className="text-blue-100 text-xs font-bold uppercase tracking-[0.2em] mb-1">Atmósfera Actual</p>
        <h2 className="text-white text-3xl font-bold tracking-tight">{ubicacion}</h2>
      </div>
      <div className="text-right relative z-10">
        <div className="text-white text-6xl font-light leading-none flex items-start justify-end">
          {clima.temp}<span className="text-2xl mt-2">°C</span>
        </div>
        <p className="text-blue-100/90 text-sm mt-1 font-medium">{clima.desc}</p>
      </div>
    </div>
  );
}