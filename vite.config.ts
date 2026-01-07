import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import svgr from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    // Allows using React dev server along with building a React application with Vite.
    react(),
    // Allows using the compilerOptions.paths property in tsconfig.json.
    tsconfigPaths(),
    // Allows importing SVG as React components
    svgr({
      include: '**/*.svg',
    }),
  ],
  publicDir: './public',
  server: {
    host: true,
    port: 3000,
    https: false,
    // Proxy для API запросов (опционально, если используете прокси вместо прямых запросов)
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8090',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@images': path.resolve(__dirname, 'src', 'shared', 'assets', 'images'),
      '@scss': path.resolve(__dirname, 'src', 'shared', 'assets', 'style'),
      '@fonts': path.resolve(__dirname, 'src', 'shared', 'assets', 'fonts'),
    },
  },
})

