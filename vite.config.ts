import { devtools } from '@tanstack/devtools-vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const config = defineConfig({
  plugins: [
    devtools(),
    tsconfigPaths({ projects: ['./tsconfig.json'] }),
    tanstackStart(),
    // react's vite plugin must come after start's vite plugin
    viteReact(),
  ],
  preview: {
    port: 8080,
  },
  server: {
    port: 3000,
  },
});

export default config;
