import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      // '/api' : "http://localhost:3000", // This is for development
      "/api": "https://lets-code-c5hz.onrender.com"  // This is for Production
    }
  },
  plugins: [react(), tailwindcss()],
})
