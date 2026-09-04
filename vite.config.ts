import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    global: "globalThis",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-dom") || id.includes("react-router-dom")) {
              return "react-vendor";
            }
            if (id.includes("react/")) {
              return "react-vendor";
            }
            if (
              id.includes("@reduxjs/toolkit") ||
              id.includes("react-redux") ||
              id.includes("immer") ||
              id.includes("redux")
            ) {
              return "redux-vendor";
            }
            if (id.includes("@tanstack")) {
              return "query-vendor";
            }
            if (
              id.includes("recharts") ||
              id.includes("d3-") ||
              id.includes("victory")
            ) {
              return "chart-vendor";
            }
            if (id.includes("sockjs") || id.includes("@stomp")) {
              return "socket-vendor";
            }
            if (
              id.includes("react-hook-form") ||
              id.includes("zod") ||
              id.includes("@hookform")
            ) {
              return "form-vendor";
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
