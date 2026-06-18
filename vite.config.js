import { defineConfig } from 'vite';

// Static site, no framework. Vite is used only as a dev server + bundler.
export default defineConfig({
  root: '.',
  server: { open: true, host: true },
  build: {
    target: 'es2018',
    outDir: 'dist',
    emptyOutDir: true
  }
});
