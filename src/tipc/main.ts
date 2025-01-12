import type { PlayUrl } from '~types/get-playurl'
import type { PlayerInfo } from '~types/player-info'
import type { VideoPlayerData } from '~types/playlist'
import type { Resp } from '~types/resp'
import { defineProto, Method } from '@byc/tipc'

export const MainHandlerProto = defineProto('MainWin', {
  /** 获取播放列表 */
  getPlaylist: Method as (bvid: string) => Promise<Resp<VideoPlayerData>>,

  /** 获取播放url */
  getPlayUrl: Method as (bvid: string, cid: number, sessdata?: string) => Promise<Resp<PlayUrl>>,

  getPlayerInfo: Method as (bvid: string, cid: number, sessdata?: string) => Promise<Resp<PlayerInfo>>,

  /** 关闭窗口 */
  close: Method as () => void,

  /** 最小化窗口 */
  minimize: Method as () => void,

  /** 获取server端口 */
  getPort: Method as () => Promise<number>,
})

export type IMainHandler = typeof MainHandlerProto
