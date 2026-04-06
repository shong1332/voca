import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/voca/',
  server: {
    port: 5173,
    proxy: {
      '/voca/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/voca/, ''),
      },
    },
  },
})
