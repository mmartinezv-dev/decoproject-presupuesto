import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/vue') || id.includes('node_modules/vue-router')) {
            return 'vendor-vue'
          }
          if (id.includes('@tanstack/vue-query')) return 'vendor-query'
          if (id.includes('node_modules/pinia'))  return 'vendor-pinia'
          if (id.includes('PresupuestosListView') || id.includes('PresupuestoView')) return 'budgets'
          if (id.includes('CategoriasView') || id.includes('ProductosView')) return 'catalog'
          if (id.includes('ClientesView')) return 'clients'
        },
      },
    },
  },
})
