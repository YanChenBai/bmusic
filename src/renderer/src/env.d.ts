/// <reference types="vite/client" />
/// <reference types="naive-ui/volar" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<object, object, any>
  export default component
}

export {}