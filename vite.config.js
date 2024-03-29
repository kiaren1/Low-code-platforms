import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import legacy from '@vitejs/plugin-legacy';
import vueJsx from "@vitejs/plugin-vue-jsx";
import viteCompression from 'vite-plugin-compression'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    legacy({
      // 设置目标浏览器，browserslist 配置语法
      targets: ['> 0.2% and not dead'],
    }),
    vueJsx(),
    viteCompression({
      threshold: 51200, // 对大于 50KB 的文件进行压缩
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@store': path.resolve(__dirname, './src/store/vuexStore'),
      '@api': path.resolve(__dirname, './src/api'),
    }
  },
  server: {
    https: false,
    port: 8099,
    open: process.platform === 'darwin', //启动时自动在浏览器中打开
    cors: true, //为开发服务器配置 CORS
    proxy: { //配置代理
      '/api': {
        target: 'http://localhost:8211',
        changeOrigin: true,
      },
    }
  },
})
