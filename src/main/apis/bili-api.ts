import type { PlayUrl } from '~types/get-playurl'
import type { PlayerInfo } from '~types/player-info'
import type { VideoPlayerData } from '~types/playlist'
import type { Resp } from '~types/resp'
import { request } from '@main/utils/request'

export async function getPlaylist(bvid: string) {
  const data = await request.get('x/web-interface/wbi/view', {
    searchParams: {
      bvid,
    },
  })
    .json<Resp<VideoPlayerData>>()

  return data
}

export async function getPlayUrl(bvid: string, cid: number, sessdata?: string) {
  let headers = {}

  if (sessdata) {
    headers = {
      Cookie: `SESSDATA=${sessdata}`,
    }
  }

  return await request.get('x/player/playurl', {
    headers,
    searchParams: {
      bvid,
      cid,
      qn: '0',
      fnval: '80',
      fnver: '0',
      fourk: '1',
    },
  }).json<Resp<PlayUrl>>()
}

export async function getPlayerInfo(bvid: string, cid: number) {
  return await request.get('x/player/wbi/v2', {
    searchParams: {
      bvid,
      cid,
    },
  }).json<Resp<PlayerInfo>>()
}
