import react from '@vitejs/plugin-react';
import copy from 'rollup-plugin-copy';
import { defineConfig } from 'vite';

const cesiumSource = 'node_modules/cesium/Build/Cesium';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    copy({
      targets: [
        { src: `${cesiumSource}/Workers/**/*`, dest: 'public/Workers' },
        { src: `${cesiumSource}/Assets/**/*`, dest: 'public/Assets' },
        { src: `${cesiumSource}/Widgets/**/*`, dest: 'public/Widgets' },
        { src: `${cesiumSource}/ThirdParty/**/*`, dest: 'public/ThirdParty' },
      ],
    }),
  ],
});
