import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ai-api': {
        target: 'http://52.58.222.100:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/ai-api/, '')
      }
    }
  }
})