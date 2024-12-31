import type { MediaInfo } from '~types/media-info'
import type { VideoPlayerData } from '~types/playlist'
import type { Resp } from '~types/resp'
import { message } from '@renderer/utils/feedback'
import { request } from '@renderer/utils/request'

export async function getPlaylist(bvid: string) {
  const data = await request.get('x/web-interface/wbi/view', {
    searchParams: {
      bvid,
    },
  })
    .json<Resp<VideoPlayerData>>()

  if (data.code !== 0)
    throw message.error(`获取视频信息失败: ${data.message}`)

  return data.data
}

export async function getMediaInfo(bvid: string, cid: number) {
  const data = await request.get('x/player/playurl', {
    searchParams: {
      bvid,
      cid,
      platform: 'html5',
    },
  }).json<Resp<MediaInfo>>()

  return data
}
