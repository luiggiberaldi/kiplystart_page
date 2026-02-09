import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'https://pydolarvenezuela-api.vercel.app',
        changeOrigin: true,
        secure: false,
      },
      '/google-api': {
        target: 'https://script.google.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/google-api/, ''),
      },
    },
  },
})

