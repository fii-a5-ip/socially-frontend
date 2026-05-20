import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:9090', //ca sa mearga rulat local cu backendul
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
