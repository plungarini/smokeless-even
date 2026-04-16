import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    root: 'link-site',
    plugins: [react(), tailwindcss()],
    base: env.PAGES_BASE_PATH || '/',
    server: {
      host: true,
      port: 4174,
    },
    build: {
      outDir: '../link-dist',
      emptyOutDir: true,
    },
  };
});
