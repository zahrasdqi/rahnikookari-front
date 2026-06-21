import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:80",
        changeOrigin: true,
        secure: false,
        configure: (proxy) => {
          proxy.on("proxyReq", (proxyReq, req) => {
            console.log("[vite proxy]", req.method, req.url);
          });
          proxy.on("proxyRes", (proxyRes, req) => {
            console.log("[vite proxy response]", proxyRes.statusCode, req.url);
          });
        },
      },
    },
  },
});
