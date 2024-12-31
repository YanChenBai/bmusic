import { exposeInvokes } from '@byc/tipc/preload'
import { MainHandlerProto } from '@tipc/main'
import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('invokes', {
  ...exposeInvokes(MainHandlerProto),
})
