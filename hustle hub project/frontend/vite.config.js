import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:4000',
    },
  },
  build: {
    rollupOptions: {
      input: {
        landing: fileURLToPath(new URL('./index.html', import.meta.url)),
        marketplace: fileURLToPath(new URL('./marketplace.html', import.meta.url)),
      },
    },
  },
})
