import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    host: true,
    port: 5173,
    strictPort: false,
    open: false,
    hmr: {
      overlay: true
    },
    // Éviter les problèmes de polling
    watch: {
      usePolling: false,
      ignored: ['**/node_modules/**', '**/.git/**']
    }
  },
  // Optimisation des dépendances
  optimizeDeps: {
    include: ['vue', 'vue-router', 'axios', 'chart.js', 'vue-chartjs'],
    exclude: ['vite-plugin-vue-devtools']
  },
  // Cache plus agressif
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
          charts: ['chart.js', 'vue-chartjs']
        }
      }
    }
  }
})