/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta primaria (Manual de Marca v2)
        coal: '#1A1A1B',        // Carbón
        'brand-red': '#3D0F18', // Borgoña
        cream: '#F5F5DC',       // Crema
        gold: '#C5A059',        // Oro, solo sobre fondo oscuro
        // Paleta de apoyo: el territorio nocturno
        noche: '#0E0A0B',       // Fondo plano de las piezas nocturnas
        ambar: '#E8B87A',       // Resaltados, cifras, estados activos
        humo: '#8A8078',        // Textos secundarios, filetes, campos inactivos
        'oro-tostado': '#8A6B2F', // Único dorado legible como texto sobre crema
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
