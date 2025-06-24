import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron/simple'
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import vueDevTool from 'vite-plugin-vue-devtools'

export default defineConfig(async () => {
  const UnoCSS = (await import('unocss/vite')).default

  return {
    plugins: [
      vue(),
      AutoImport({
        imports: ['vue', '@vueuse/core'],
      }),
      electron({
        main: {
          entry: 'electron/main.ts', // 主进程入口文件
          vite: {
            build: {
              outDir: 'dist/electron', // 主进程输出目录
            },
          },
        },
      }),
      UnoCSS(),
      // vueDevTool(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      outDir: 'dist/web', // 渲染进程输出目录
    },
  }
})
