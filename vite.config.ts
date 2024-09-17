import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  base: '', // Adjust this to match your GitHub repo name with leading and trailing slashes
  plugins: [react()],
  server: {
    port: 3000,
  },
  define: { 'process.env': {} },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});