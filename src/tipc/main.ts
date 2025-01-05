import type { PlayUrl } from '~types/get-playurl'
import type { MediaInfo } from '~types/media-info'
import type { VideoPlayerData } from '~types/playlist'
import type { Resp } from '~types/resp'
import { defineProto, Method } from '@byc/tipc'

export const MainHandlerProto = defineProto('MainWin', {
  getPlaylist: Method as (bvid: string) => Promise<Resp<VideoPlayerData>>,
  getMediaInfo: Method as (bvid: string, cid: number) => Promise<Resp<MediaInfo>>,
  getPlayUrl: Method as (bvid: string, cid: number, sessdata?: string) => Promise<Resp<PlayUrl>>,
  close: Method as () => void,
  minimize: Method as () => void,
  getPort: Method as () => Promise<number>,
})

export type IMainHandler = typeof MainHandlerProto
