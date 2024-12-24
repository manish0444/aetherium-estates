import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    server: {
      proxy: {
        "/api": {
          target: mode === 'production' 
            ? env.VITE_API_BASE_URL 
            : "http://localhost:3000",
          secure: false,
          changeOrigin: true
        },
      },
    },
    plugins: [react()],
    optimizeDeps: {
      include: ["react-leaflet"],
    },
  };
});