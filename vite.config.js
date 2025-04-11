import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Si hay problemas con proceso/path en MapLibre
      'process': 'process/browser',
      'path': 'path-browserify'
    }
  },
  // Si necesitas instalar las dependencias faltantes
  optimizeDeps: {
    include: ['maplibre-gl']
  }
})
