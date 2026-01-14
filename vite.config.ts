import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 1234,
    host: '0.0.0.0',
  },
  build: {
    outDir: 'dist',
  },
  esbuild: {
    drop: ['console'],
  },
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['lcov', 'json-summary'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      exclude: ['src/**/*.d.ts'],
    },
  },
});
