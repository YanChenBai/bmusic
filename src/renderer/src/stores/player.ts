import type { PlaylistSong } from '@renderer/types/playlist'
import type { QualityID } from '~types/get-playurl'
import { defineStore } from 'pinia'
import { usePlaylistStore } from './playlist'

export enum PlayerModeEnum {
  /** 列表循环 */
  REPEAT_ALL,
  /** 单曲循环 */
  REPEAT_ONE,
  /** 随机播放 */
  SHUFFLE,
  /** 顺序播放 */
  SEQUENTIAL,
  /** 单次播放 */
  PLAY_ONCE,
}

export enum PlayerStateEnum {
  /** 播放 */
  PLAY,
  /** 暂停 */
  PAUSE,
}

export interface PlayerInfo {
  /** 播放进度(秒) */
  progress: number
  /** 音量 */
  volume: number
  /** 播放地址 */
  url: string | null
  /** 播放模式 */
  mode: PlayerModeEnum
  /** 音频时长 */
  longTime: number
  /** 播放状态 */
  state: PlayerStateEnum
  /** 输出设备ID */
  deviceId: string | null
  /** 播放质量 */
  quality: QualityID | null
}

export interface PlayQuality {
  /** 音质ID */
  id: QualityID
  /** 播放地址 */
  url: string
}

let ip: number
async function getPlayUrl(bvid: string, cid: number, sessdata?: string) {
  if (ip === undefined)
    ip = await window.invokes.getPort()

  const { data, code, message: msg } = await window.invokes.getPlayUrl(bvid, cid, sessdata)

  if (code !== 0)
    throw new Error(msg ?? '获取数据失败')

  // 如果有flac就添加进去
  if (data.dash.flac?.audio)
    data.dash.audio.unshift(data.dash.flac.audio)

  const list: PlayQuality[] = data.dash.audio.map((item) => {
    return {
      id: item.id,
      url: `http://localhost:${ip}/proxy/audio?url=${encodeURIComponent(item.backupUrl[0])}`,
    }
  })

  return {
    longTime: data.timelength,
    list,
  }
}

export const { on: onPlayerState, trigger: playerStateTrigger } = createEventHook<PlayerStateEnum>()

export const {
  /** 监听跳转播放进度 */
  on: onJumpProgress,
  /** 跳转播放进度 */
  trigger: jumpProgress,
} = createEventHook<number>()

export const { on: onSongChange, trigger: songChangeTrigger } = createEventHook()
export const { on: onQualityChange, trigger: qualityChangeTrigger } = createEventHook<PlayQuality>()

export const usePlayerStore = defineStore('player', () => {
  const { config } = useConfigStore()
  const playlistStore = usePlaylistStore()

  const playQuality = ref<PlayQuality[]>([])

  const curPlaySong = ref<PlaylistSong>()
  const playerInfo = reactive<PlayerInfo>({
    progress: 0,
    volume: 50,
    url: null,
    mode: PlayerModeEnum.REPEAT_ALL,
    state: PlayerStateEnum.PAUSE,
    longTime: 0,
    deviceId: null,
    quality: null,
  })

  /** 切换播放状态值 */
  function playerStateToggle(state?: PlayerStateEnum) {
    if (state !== undefined) {
      playerInfo.state = state
      playerStateTrigger(state)
      return
    }

    if (playerInfo.state === PlayerStateEnum.PLAY) {
      playerInfo.state = PlayerStateEnum.PAUSE
      playerStateTrigger(PlayerStateEnum.PAUSE)
    }
    else {
      playerInfo.state = PlayerStateEnum.PLAY
      playerStateTrigger(PlayerStateEnum.PLAY)
    }
  }

  /** 设置播放歌曲 */
  async function setPlaySong(song: PlaylistSong) {
    try {
      const { longTime, list } = await getPlayUrl(song.bvid, song.cid, config.sessdata)

      curPlaySong.value = song
      playerInfo.longTime = longTime / 1000
      playerInfo.url = list[0].url
      playerInfo.quality = list[0].id
      playQuality.value = list

      playlistStore.unshift(song)
      playerStateToggle(PlayerStateEnum.PLAY)
      songChangeTrigger(song)
    }
    catch {
      message.error('获取播放地址失败')
    }
  }

  /** 切换播放质量 */
  function modifyQuality(id: QualityID) {
    const quality = playQuality.value.find(item => item.id === id)
    if (quality) {
      playerInfo.url = quality.url
      jumpProgress(playerInfo.progress)
      qualityChangeTrigger(quality)
    }
  }

  /** 恢复播放 */
  function recoverPlaySong() {
    const song = curPlaySong.value
    if (!song)
      return
    setPlaySong(song)
  }

  /** 修改音量 */
  function modifyVolume(value: number) {
    playerInfo.volume = Math.max(0, Math.min(100, value))
  }

  /** 检查传入的歌曲是否为当前播放歌曲 */
  function isCurPlaySong(song: PlaylistSong) {
    return curPlaySong.value?.bvid === song.bvid && curPlaySong.value?.cid === song.cid
  }

  /** 更新播放进度 */
  function updateProgress(progress: number) {
    playerInfo.progress = progress
  }

  return {
    playerInfo,
    curPlaySong,
    playQuality,
    setPlaySong,
    modifyVolume,
    isCurPlaySong,
    playerStateToggle,
    recoverPlaySong,
    updateProgress,
    modifyQuality,
  }
}, {
  persist: {
    pick: [
      'curPlaySong',
      'playerInfo',
    ],
    omit: [
      'playerInfo.state',
    ],
  },
})

export const usePlayerStoreRefs = () => storeToRefs(usePlayerStore())
