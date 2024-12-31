import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Component from 'unplugin-vue-components/vite'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@main': resolve('src/main'),
        '@tipc': resolve('src/tipc'),
        '~types': resolve('src/types'),
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@preload': resolve('src/preload'),
        '@tipc': resolve('src/tipc'),
        '~types': resolve('src/types'),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@tipc': resolve('src/tipc'),
        '~types': resolve('src/types'),
      },
    },
    plugins: [
      vue(),
      UnoCSS(),
      AutoImport({
        imports: [
          'vue',
          'pinia',
          'vue-router',
          '@vueuse/core',
          {
            '@pinia/colada': ['useQuery', 'useQueryCache'],
          },
        ],
        dirs: [
          'src/stores',
          'src/router',
          'src/apis',
          'src/utils',
        ],
      }),
      Component({
        resolvers: [
          NaiveUiResolver(),
        ],
      }),
    ],
    server: {
      proxy: {
        '/api': {
          target: 'https://api.bilibili.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          headers: {
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0',
            'referer': 'https://www.bilibili.com',
          },
        },
      },
    },
  },
})
