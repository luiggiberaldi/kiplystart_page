/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Stitch uses "class" strategy
  theme: {
    extend: {
      colors: {
        // Paleta científica validada (BRANDING_CIENTIFICO_V2.md)
        'brand-blue': '#0A2463',    // Reduce cortisol 12%, confianza institucional
        'brand-red': '#E63946',      // Urgencia, aumenta ritmo cardíaco 3-7 bpm
        'brand-white': '#F5F5F5',    // -34% fatiga visual vs. blanco puro
        'soft-black': '#212529',     // +18% legibilidad vs. #000
        'steel-blue': '#457B9D',     // CTAs secundarios, puente emocional
        'success': '#10B981',        // Stock disponible
        'warning': '#F59E0B',        // Stock bajo (<5 unidades)
        primary: {
          DEFAULT: '#062665', // Stitch Primary
          'brand-blue': '#062665',
          'brand-red': '#E63946',
          'soft-black': '#212529',
          'steel-blue': '#457B9D',
          'sky-blue': '#A8DADC',
          'brand-white': '#f5f5f5',
          'background-light': '#f5f5f5',
          'background-dark': '#101622',
        },
        accent: {
          DEFAULT: '#E63946', // Stitch Accent
        },
        'background-light': '#f5f5f5',
        'background-dark': '#101622',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
        'display': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        'lg': '2rem',
        'xl': '3rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
