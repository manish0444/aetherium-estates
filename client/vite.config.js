import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: mode === 'production' 
            ? env.VITE_API_BASE_URL 
            : 'http://localhost:3000',
          changeOrigin: true,
          secure: false
        }
      }
    },
    optimizeDeps: {
      include: ['react-leaflet'],
    }
  };
});