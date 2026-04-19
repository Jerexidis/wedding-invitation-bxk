import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const plugins = [react()]

// Dev-only admin plugin (local, not in git)
try {
  const { default: devAdminPlugin } = await import('./plugins/devAdminPlugin.js')
  plugins.push(devAdminPlugin())
} catch {
  // Plugin not found — production build, skip
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins,
  build: {
    rollupOptions: {
      output: {
        /**
         * Manual chunking para vendors pesados.
         * Beneficio: el browser los cachea por separado al código de la app.
         * Si la app cambia pero jspdf no, el visitor no re-descarga jspdf.
         */
        manualChunks: {
          // Librerías de exportación (solo se usan en RsvpDashboard)
          'vendor-export': ['jspdf', 'jspdf-autotable', 'html2canvas'],
          // Cliente de Supabase
          'vendor-supabase': ['@supabase/supabase-js'],
          // React + router (cambian pocas veces)
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Íconos (cambios muy raros)
          'vendor-icons': ['lucide-react'],
        },
      },
    },
  },
})
