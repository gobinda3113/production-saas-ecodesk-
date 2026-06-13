import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const resolve = (p: string) => path.resolve(__dirname, p);

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve("src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve("index.html"),
        login: resolve("login.html"),
        "admin-login": resolve("admin-login.html"),
        "forgot-password": resolve("forgot-password.html"),
        "reset-password": resolve("reset-password.html"),
        privacy: resolve("privacy.html"),
        terms: resolve("terms.html"),
        help: resolve("help.html"),
        dashboard: resolve("dashboard.html"),
        admin: resolve("admin.html"),
        "not-found": resolve("404.html"),
      },
    },
  },
});
