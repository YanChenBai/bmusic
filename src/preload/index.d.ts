import type { ExposeInvokes } from '@byc/tipc/renderer'
import type { IMainHandler } from '@tipc/main'

declare global {
  interface Window {
    invokes: ExposeInvokes<IMainHandler>
  }
}

export {}
