import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";
import { fileURLToPath } from "url";
import { VitePWA } from 'vite-plugin-pwa'
import { PATH_NAME } from './src/configs/pathName'
import electron from 'vite-plugin-electron/simple';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isElectron = process.env.ELECTRON === 'true';

const navigateFallbackAllowlist = Object.values(PATH_NAME).map((route) => {
  if (route === '/') return /^\/$/
  return new RegExp(`^${route.replace(/\//g, '\\/')}`)
})

// https://vite.dev/config/
export default defineConfig({
  base: isElectron ? './' : '/',
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
    ...(isElectron ? [] : [VitePWA({
      registerType: 'autoUpdate',
      filename: 'sw.js',
      devOptions: {
        enabled: !isElectron // enables SW in dev for testing
      },
      workbox: {
        cleanupOutdatedCaches: true,
        navigateFallback: '/index.html',
        navigateFallbackAllowlist,
      },
      manifest: {
        name: 'HR Admin',
        short_name: 'Admin',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/images/logo/logo-icon.svg',
            sizes: '192x192',
            type: 'image/svg'
          },
          {
            src: '/images/logo/logo-icon.svg',
            sizes: '512x512',
            type: 'image/svg'
          }
        ]
      }
    })]),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            rollupOptions: {
              external: ['keytar'],
            },
          },
        },
      },
      preload: {
        input: {
          preload: 'electron/preload.ts'
        },
        vite: {
          build: {
            rollupOptions: {
              external: ['keytar'], // <- important
            },
          },
        },
      }
    })
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true
  },
  optimizeDeps: { exclude: ['keytar'] },
  resolve: {
    alias: {
      ...(isElectron ? {
        'virtual:pwa-register/react': path.resolve(__dirname, 'src/pwa/shim-registerSW-react.ts'),
        'virtual:pwa-register': path.resolve(__dirname, 'src/pwa/shim-registerSW.ts'),
      } : {}),
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/pages": path.resolve(__dirname, "./src/pages"),
      "@/services": path.resolve(__dirname, "./src/services"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/shared": path.resolve(__dirname, "./src/shared"),
      "@/store": path.resolve(__dirname, "./src/store"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/context": path.resolve(__dirname, "./src/context"),
      "@/configs": path.resolve(__dirname, "./src/configs"),
      "@/guards": path.resolve(__dirname, "./src/guards"),
      "@/layout": path.resolve(__dirname, "./src/layout"),
      "@/routes": path.resolve(__dirname, "./src/routes"),
      "@/i18n": path.resolve(__dirname, "./src/i18n"),
      "@/icons": path.resolve(__dirname, "./src/icons")
    }
  }
});
