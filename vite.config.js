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
      // هر چیزی که با /api شروع شه → به Gateway فوروارد می‌شه
      "/api": {
        target: "http://localhost:80",
        changeOrigin: true,
      },
    },
  },
});
