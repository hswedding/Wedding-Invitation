import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Single-page wedding invitation. No router, no SSR — mirrors the Invifest reference.
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Ignore Visual Studio's .vs index (locks .vsidx files → EBUSY watcher crash) and VCS dirs.
    watch: { ignored: ['**/.vs/**', '**/.git/**'] },
  },
  build: { target: 'es2020', cssCodeSplit: false },
})
