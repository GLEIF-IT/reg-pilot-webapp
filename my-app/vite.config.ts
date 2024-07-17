import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import viteTsconfigPaths from "vite-tsconfig-paths";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/

const srcDir = "/src";
const assetsDir = srcDir + "/assets";
const componentsDir = srcDir + "/components";
const servicesDir = srcDir + "/services";
const pagesDir = srcDir + "/pages";
const contextDir = srcDir + "/context";
const testDir = srcDir + "/test";



export default defineConfig({
  resolve: {
    alias: {
      "@src": srcDir,
      "@assets": assetsDir,
      "@components": componentsDir,
      "@services": servicesDir,
      "@pages": pagesDir,
      "@context": contextDir,
      "@test": testDir,
    },
  },
  plugins: [
    react(),
    viteTsconfigPaths(),
    svgr({
      include: "**/*.svg?react",
    }),
  ],
  build: {
    outDir: "build",
  },
  server: {
    open: true,
    port: 3000,
  },
});
