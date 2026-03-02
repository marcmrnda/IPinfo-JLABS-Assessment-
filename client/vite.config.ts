import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')  // loads your .env file

  return {
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3000', // ← fallback just in case
          changeOrigin: true,
          configure: (proxy, _options) => {
            proxy.on('proxyReq', (proxyReq, req, _res) => {
              proxyReq.setHeader('X-Real-IP', req.socket.remoteAddress || 'unknown')
            })
          }
        }
      }
    },
    plugins: [
      tailwindcss(),
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react()
    ]
  }
})