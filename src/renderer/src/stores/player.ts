import type { Ref } from 'vue'
import { defineStore } from 'pinia'

export enum PlayerModeEnum {
  /** 列表循环 */
  LIST_LOOP,
  /** 单曲循环 */
  SINGLE_LOOP,
  /** 随机播放 */
  RANDOM,
  /** 顺序播放 */
  LINEAR,
}

export enum PlayerStateEnum {
  /** 播放 */
  PLAY,
  /** 暂停 */
  PAUSE,
}

export interface PlaylistSong {
  bvid: string
  cid: number
  cover: string
  name: string
  author: string
  longTime: number
}

export interface PlayerInfo {
  progress: number
  volume: number
  url: string | null
  mode: PlayerModeEnum
  longTime: number
  state: PlayerStateEnum
}

export const usePlayerStore = defineStore('player', () => {
  const curPlaySong = ref<PlaylistSong>()
  const playlist = ref<PlaylistSong[]>([])
  const playerInfo = reactive<PlayerInfo>({
    progress: 0,
    volume: 50,
    url: null,
    mode: PlayerModeEnum.LIST_LOOP,
    state: PlayerStateEnum.PAUSE,
    longTime: 0,
  })

  function delPlaylist(bvid: string, cid: number) {
    const index = playlist.value.findIndex(i => i.bvid === bvid && i.cid === cid)
    if (index === -1)
      return
    playlist.value.splice(index, 1)
  }

  function pushPlaylist(data: PlaylistSong) {
    if (playlist.value.some(i => i.bvid === data.bvid && i.cid === data.cid)) {
      return
    }
    playlist.value.push(data)
  }

  function unshiftPlaylist(data: PlaylistSong) {
    if (playlist.value.some(i => i.bvid === data.bvid && i.cid === data.cid)) {
      return
    }
    playlist.value.unshift(data)
  }

  function setStateToPlay() {
    playerInfo.state = PlayerStateEnum.PLAY
  }

  function setStateToPause() {
    playerInfo.state = PlayerStateEnum.PAUSE
  }

  function setPlaySong(song: PlaylistSong) {
    window.invokes.getMediaInfo(song.bvid, song.cid)
      .then(({ data, code, message: msg }) => {
        if (code !== 0) {
          message.error(msg ?? '获取数据失败')
          return
        }
        curPlaySong.value = song
        playerInfo.url = data.durl[0].url
        playerInfo.longTime = data.timelength / 1000
        setStateToPlay()
      })
  }

  function modifyVolume(value: number) {
    playerInfo.volume = Math.max(0, Math.min(100, value))
  }

  function curPlaySongIndex() {
    const song = curPlaySong.value
    if (!song)
      return -1
    return playlist.value.findIndex(i => i.bvid === song.bvid && i.cid === song.cid)
  }

  return {
    playlist,
    playerInfo,
    curPlaySong,
    unshiftPlaylist,
    pushPlaylist,
    setStateToPause,
    setPlaySong,
    delPlaylist,
    modifyVolume,
    curPlaySongIndex,
  }
}, {
  persist: {
    pick: [
      'playlist',
      'curPlaySong',
      'playerInfo.longTime',
      'playerInfo.mode',
      'playerInfo.progress',
      'playerInfo.url',
      'playerInfo.volume',
    ],
  },
})

export const usePlayerStoreRefs = () => storeToRefs(usePlayerStore())

abstract class PlayerMode {
  constructor(protected store: ReturnType<typeof usePlayerStore>) {}

  abstract autoNext(): void
  abstract autoPrev(): void
  abstract next(): void
  abstract prev(): void
}

class PlayerListLoop extends PlayerMode {
  next(): void {
    const currentIndex = this.store.curPlaySongIndex()
    const nextIndex = currentIndex === this.store.playlist.length - 1 ? 0 : currentIndex + 1
    this.store.setPlaySong(this.store.playlist[nextIndex])
  }

  autoNext() {
    this.next()
  }

  prev(): void {
    const currentIndex = this.store.curPlaySongIndex()
    const prevIndex = currentIndex <= 0 ? this.store.playlist.length - 1 : currentIndex - 1
    this.store.setPlaySong(this.store.playlist[prevIndex])
  }

  autoPrev() {
    this.prev()
  }
}

export function usePlayerCtrl() {
  const store = usePlayerStore()
  const { playerInfo } = usePlayerStoreRefs()

  const modeInstances = {
    [PlayerModeEnum.LINEAR]: new PlayerListLoop(store),
    // [PlayerModeEnum.SINGLE_LOOP]: new PlayerSingleLoop(store),
    // [PlayerModeEnum.LINEAR]: new PlayerLinear(store),
    // [PlayerModeEnum.RANDOM]: new PlayerRandom(store),
  }

  function createModeInstance(mode: PlayerModeEnum): PlayerMode {
    const instance = modeInstances[mode]
    if (!instance) {
      throw new Error(`Unknown player mode: ${mode}`)
    }
    return instance
  }

  const instance = computed(() => createModeInstance(playerInfo.value.mode))

  return instance
}
