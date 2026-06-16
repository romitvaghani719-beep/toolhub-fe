import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const beUrl = env.VITE_BE_URL || "http://localhost:3001";

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@toolhub/shared": path.resolve(__dirname, "./shared/src/index.ts"),
      },
    },
    server: {
      proxy: {
        "/api": {
          target: beUrl,
          changeOrigin: true,
        },
      },
    },
  };
});
