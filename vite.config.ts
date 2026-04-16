import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import type { PluginOption } from 'vite';

// Force a full page reload on any src/ change during dev. Module-level
// singletons (appStore, pageCreated, bootstrapPromise) must reset in lockstep
// with the Even bridge, which does not survive HMR patches cleanly.
const evenHudFullReload = (): PluginOption => ({
  name: 'even-hud-full-reload',
  apply: 'serve',
  handleHotUpdate({ server, file }) {
    if (file.endsWith('index.html') || file.includes('/src/') || file.includes('\\src\\')) {
      server.ws.send({ type: 'full-reload', path: '*' });
      return [];
    }
  },
});

export default defineConfig({
  plugins: [react(), tailwindcss(), evenHudFullReload()],
  base: './',
  server: {
    host: true,
    port: 5173,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000,
  },
});
