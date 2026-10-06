import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/record': process.env.API_PROXY_TARGET || 'http://localhost:5050',
    },
  },
})
