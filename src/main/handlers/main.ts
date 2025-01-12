import type { IMainHandler } from '@tipc/main'
import { defineHandler } from '@byc/tipc'
import { getPlayerInfo, getPlaylist, getPlayUrl } from '@main/apis/bili-api'
import { getPort } from '@main/utils/getPort'
import { MainHandlerProto } from '@tipc/main'

export const MainHandler = defineHandler<IMainHandler>(MainHandlerProto, {

  async getPlayUrl(_req, bvid: string, cid: number, sessdata?: string) {
    return await getPlayUrl(bvid, cid, sessdata)
  },

  async getPlaylist(_req, bvid: string) {
    return await getPlaylist(bvid)
  },

  async getPlayerInfo(_req, bvid: string, cid: number) {
    return await getPlayerInfo(bvid, cid)
  },

  close(req) {
    return req.win.close()
  },

  minimize(req) {
    return req.win.minimize()
  },

  async getPort() {
    return await getPort()
  },
})
