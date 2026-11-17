import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages для репозитория раздаёт сайт с под-пути /purple_studio/
export default defineConfig({
  plugins: [react()],
  base: "/purple_studio/",
});
