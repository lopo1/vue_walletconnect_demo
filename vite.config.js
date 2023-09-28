import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import mkcert from "vite-plugin-mkcert";
import fs from "fs";
import path from "path";
// const fs = require('fs')
// const path = require('path')
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src')
    }
  },
  server:{
    host: '0.0.0.0',
    open: true,
    https: {
      // 主要是下面两行的配置文件，不要忘记引入 fs 和 path 两个对象
      cert: fs.readFileSync(path.join(__dirname, 'src/ssl/cert.crt')),
      key: fs.readFileSync(path.join(__dirname, 'src/ssl/cert.key'))
    }
  },
  plugins: [vue()],
})
