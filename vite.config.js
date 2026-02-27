import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import eslintPlugin from "vite-plugin-eslint";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    eslintPlugin({
      cache: false,
      include: ["src/**/*.js", "src/**/*.jsx", "src/**/*.ts", "src/**/*.tsx", "src/**/*.vue"],
      exclude: ["node_modules", "dist"],
      emitWarning: true,
      emitError: false,
    }),
  ],
 
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    // 添加API代理配置
    port: 5173,
    host: true,
  },
  // 性能优化配置
  build: {
    // 启用代码分割
    rollupOptions: {
      output: {
        // 手动分割代码块 - 使用函数形式避免与动态导入冲突
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("vue") || id.includes("pinia") || id.includes("vue-router")) {
              return "vue-vendor";
            }
            if (id.includes("element-plus") || id.includes("@element-plus")) {
              return "element-plus";
            }
            if (id.includes("axios")) {
              return "utils";
            }
          }
        },
        // 优化 chunk 文件名
        chunkFileNames: "assets/js/[name]-[hash].js",
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
      },
    },
    // 启用 gzip 压缩提示
    reportCompressedSize: true,
    // 设置 chunk 大小警告阈值
    chunkSizeWarningLimit: 1000,
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 启用 source map（生产环境可关闭）
    sourcemap: false,
    // 使用 esbuild 压缩（默认，无需额外安装依赖）
    minify: "esbuild",
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ["vue", "vue-router", "pinia", "axios", "element-plus", "@element-plus/icons-vue"],
  },
});
