import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import babelPlugin from 'vite-plugin-babel'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), babelPlugin(), svgr()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    host: true,
    port: Number(process.env.CLIENT_PORT),  
  },
})
