import path from 'node:path';
import react from '@vitejs/plugin-react';
import vercelBuild from '@hono/vite-build/vercel';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      plugins: [react()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
        },
      },
      build: {
        outDir: '.vercel/output/static',
        emptyOutDir: true,
      },
    };
  }

  if (mode === 'server') {
    return {
      plugins: [
        vercelBuild({
          entry: './server/app.ts',
          emptyOutDir: false,
          entryContentAfterHooks: [() => "import { getRequestListener } from '@hono/node-server'"],
          entryContentDefaultExportHook: (appName) =>
            `export default getRequestListener(${appName}.fetch)`,
          vercel: {
            name: 'api',
            routes: [{ src: '^/api(?:/.*)?$' }],
          },
        }),
      ],
    };
  }

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      },
    },
  };
});
