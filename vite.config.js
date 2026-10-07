import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3002,
    strictPort: true,
    proxy: {
      // backend vnm-backend (Spring Boot) em desenvolvimento
      '/api': 'http://localhost:8080',
    },
  },
})
