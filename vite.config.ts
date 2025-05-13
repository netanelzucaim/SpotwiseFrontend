import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env,
  },
  server: {
    allowedHosts: ['spotwise.cs.colman.ac.il'], // 👈 allows external access
    host: '0.0.0.0', // 👈 allows external access
  }
})
