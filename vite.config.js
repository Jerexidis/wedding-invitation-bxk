import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(async ({ command }) => {
  const plugins = [react()]

  if (command === 'serve') {
    try {
      const { default: devAdminPlugin } = await import('./plugins/devAdminPlugin.js')
      plugins.push(devAdminPlugin())
    } catch {
      // Local admin API is optional in production builds.
    }
  }

  return {
    plugins,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom', 'react-router-dom'],
            'vendor-icons': ['lucide-react'],
          },
        },
      },
    },
  }
})
