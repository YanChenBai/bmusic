// electron.vite.config.ts
import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import UnoCSS from 'unocss/vite'
import AutoImport from 'unplugin-auto-import/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import Component from 'unplugin-vue-components/vite'

const electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
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
          {
            '@pinia/colada': ['useQuery', 'useQueryCache'],
          },
        ],
        dirs: [
          'src/store',
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
  },
})
export {
  electron_vite_config_default as default,
}
