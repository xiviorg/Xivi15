import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react(), runtimeErrorOverlay(), themePlugin()],
  resolve: {
    alias: {
      "@db": path.resolve(__dirname, "db"),
      "@": path.resolve(__dirname, "client", "src"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
  optimizeDeps: {
    exclude: [
      '@radix-ui/react-icons', 
      '@radix-ui/react-tooltip',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-primitive',
      'framer-motion',
      'recharts',
      'vaul',
      'cmdk',
      '@replit/vite-plugin-runtime-error-modal'
    ]
  }
});
