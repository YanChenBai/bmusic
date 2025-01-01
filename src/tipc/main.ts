import type { MediaInfo } from '~types/media-info'
import type { VideoPlayerData } from '~types/playlist'
import type { Resp } from '~types/resp'
import { defineProto, Method } from '@byc/tipc'

export const MainHandlerProto = defineProto('MainWin', {
  getPlaylist: Method as (bvid: string) => Promise<Resp<VideoPlayerData>>,
  getMediaInfo: Method as (bvid: string, cid: number) => Promise<Resp<MediaInfo>>,
  close: Method as () => void,
  minimize: Method as () => void,
})

export type IMainHandler = typeof MainHandlerProto
