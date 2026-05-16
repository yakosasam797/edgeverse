import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        technology: resolve(__dirname, 'technology.html'),
        industries: resolve(__dirname, 'industries.html'),
        safety: resolve(__dirname, 'safety.html'),
        about: resolve(__dirname, 'about.html'),
        investors: resolve(__dirname, 'investors.html'),
        careers: resolve(__dirname, 'careers.html'),
        contact: resolve(__dirname, 'contact.html'),
      },
    },
  },
  server: {
    port: 5173,
    open: true,
  },
});
