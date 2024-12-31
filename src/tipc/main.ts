import type { MediaInfo } from '~types/media-info'
import type { VideoPlayerData } from '~types/playlist'
import { defineProto, Method } from '@byc/tipc'

export const MainHandlerProto = defineProto('MainWin', {
  getPlaylist: Method as (bvid: string) => Promise<VideoPlayerData>,
  getMediaInfo: Method as (bvid: string, cid: number) => Promise<MediaInfo>,
})

export type IMainHandler = typeof MainHandlerProto
