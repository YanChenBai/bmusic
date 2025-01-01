import type { IMainHandler } from '@tipc/main'
import { defineHandler } from '@byc/tipc'
import { getMediaInfo, getPlaylist } from '@main/apis/bili-api'
import { MainHandlerProto } from '@tipc/main'

export const MainHandler = defineHandler<IMainHandler>(MainHandlerProto, {
  async getMediaInfo(_req, bvid: string, cid: number) {
    return await getMediaInfo(bvid, cid)
  },

  async getPlaylist(_req, bvid: string) {
    return await getPlaylist(bvid)
  },

  close(req) {
    return req.win.close()
  },

  minimize(req) {
    return req.win.minimize()
  },
})
