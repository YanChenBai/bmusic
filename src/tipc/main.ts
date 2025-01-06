import type { PlayUrl } from '~types/get-playurl'
import type { MediaInfo } from '~types/media-info'
import type { VideoPlayerData } from '~types/playlist'
import type { Resp } from '~types/resp'
import { defineProto, Method } from '@byc/tipc'

export const MainHandlerProto = defineProto('MainWin', {
  /** 获取播放列表 */
  getPlaylist: Method as (bvid: string) => Promise<Resp<VideoPlayerData>>,
  /**
   * @deprecated
   * 获取媒体信息
   */
  getMediaInfo: Method as (bvid: string, cid: number) => Promise<Resp<MediaInfo>>,

  /** 获取播放url */
  getPlayUrl: Method as (bvid: string, cid: number, sessdata?: string) => Promise<Resp<PlayUrl>>,

  /** 关闭窗口 */
  close: Method as () => void,

  /** 最小化窗口 */
  minimize: Method as () => void,

  /** 获取server端口 */
  getPort: Method as () => Promise<number>,
})

export type IMainHandler = typeof MainHandlerProto
