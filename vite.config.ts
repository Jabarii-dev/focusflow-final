import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

const port = Number(process.env.PORT) || 3000;

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0',
    port,
    strictPort: false,
    allowedHosts: 'all',
    hmr: {
      port,
    },
  },
});
