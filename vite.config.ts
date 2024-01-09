import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { pathResolve } from './scripts/utils';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': pathResolve('src'),
    },
  },
  css: {
    modules: {
      localsConvention: 'camelCaseOnly',
    },
  },
  plugins: [react()],
});
