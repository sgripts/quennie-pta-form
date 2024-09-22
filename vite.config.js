import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/quennie-pta-form/',
  plugins: [react()],
  build: {
    target: 'esnext',
  },
})
