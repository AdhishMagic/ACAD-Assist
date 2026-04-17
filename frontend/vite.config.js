import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command, mode }) => {
  // Load environment variables properly
  const env = loadEnv(mode, process.cwd(), '');
  // For dev server: use VITE_PROXY_API_TARGET (points to actual backend service)
  // For browser runtime: use VITE_API_BASE_URL (what browser can access)
  const apiProxyTarget = env.VITE_PROXY_API_TARGET || env.VITE_API_BASE_URL || "http://localhost:8000";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      proxy: {
        "/auth": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
        "/media": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
        "/api": {
          target: apiProxyTarget,
          changeOrigin: true,
        },
        "/ai": {
          target: env.VITE_AI_SERVICE_URL || "http://localhost:8001",
          changeOrigin: true,
        },
        "/rag": {
          target: env.VITE_RAG_SERVICE_URL || "http://localhost:8002",
          changeOrigin: true,
        },
      },
    },
    build: {
      outDir: "dist",
      sourcemap: true,
    },
  };
});
