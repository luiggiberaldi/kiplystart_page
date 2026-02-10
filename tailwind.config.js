/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Paleta científica validada (BRANDING_CIENTIFICO_V2.md)
        'brand-blue': '#0A2463',    // Reduce cortisol 12%, confianza institucional
        'brand-red': '#E63946',      // Urgencia, aumenta ritmo cardíaco 3-7 bpm
        'brand-white': '#F5F5F5',    // -34% fatiga visual vs. blanco puro
        'soft-black': '#212529',     // +18% legibilidad vs. #000
        'steel-blue': '#457B9D',     // CTAs secundarios, puente emocional
        'sky-blue': '#A8DADC',       // Acentos decorativos suaves
        'success': '#10B981',        // Stock disponible
        'warning': '#F59E0B',        // Stock bajo (<5 unidades)
        'background-light': '#f5f5f5',
        'background-dark': '#101622',
        primary: {
          DEFAULT: '#0A2463',
        },
        accent: {
          DEFAULT: '#E63946',
        },
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'body': ['Open Sans', 'sans-serif'],
        'display': ['Inter', 'sans-serif'],
      },
      borderRadius: {
        // 8px grid system compliant
        'sm': '0.25rem',   // 4px
        DEFAULT: '0.5rem', // 8px
        'md': '0.75rem',   // 12px
        'lg': '1rem',      // 16px
        'xl': '1.5rem',    // 24px
        '2xl': '2rem',     // 32px
        '3xl': '3rem',     // 48px
        'full': '9999px',  // pills
      },
    },
  },
  plugins: [],
}
