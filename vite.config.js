// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//   server: {
//     proxy: {
//       '/api': {
//         target: 'http://localhost:5000',
//       }
//     }
//   }
// })


import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '') // Fixes process.cwd() error

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "src"), // Fixes alias issue
      },
    },
    server: {
      proxy: {
        "/api": {
          target: env.VITE_BACKEND_URL || "https://movie-rental-backend-0bcb.onrender.com",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})

