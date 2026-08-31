import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

/**
 * Vite configuration for building the demo site.
 * Used explicitly via: vite build --config vite.config.site.ts
 */
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist/site',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
});
