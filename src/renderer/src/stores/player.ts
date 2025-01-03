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
  const { on: onPlayerState, trigger: playerStateTrigger } = createEventHook<PlayerStateEnum>()
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
  const playlistSet = computed(() => new Set(playlist.value.map(i => `${i.bvid}:${i.cid}`)))

  function delPlaylist(bvid: string, cid: number) {
    const index = playlist.value.findIndex(i => i.bvid === bvid && i.cid === cid)
    if (index === -1)
      return
    playlist.value.splice(index, 1)
  }

  /** 播放列表末尾插入 */
  function pushPlaylist(data: PlaylistSong) {
    if (playlist.value.some(i => i.bvid === data.bvid && i.cid === data.cid)) {
      return
    }
    playlist.value.push(data)
  }

  /** 播放列表头部插入 */
  function unshiftPlaylist(data: PlaylistSong) {
    if (playlist.value.some(i => i.bvid === data.bvid && i.cid === data.cid)) {
      return
    }
    playlist.value.unshift(data)
  }

  /** 切换播放状态值 */
  function playerStateToggle(state?: PlayerStateEnum) {
    if (state !== undefined) {
      playerInfo.state = state
      playerStateTrigger(PlayerStateEnum.PAUSE)
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
        unshiftPlaylist(song)
        playerStateToggle(PlayerStateEnum.PLAY)
      })
      .catch((err) => {
        message.error(err.message)
      })
  }

  /** 修改音量 */
  function modifyVolume(value: number) {
    playerInfo.volume = Math.max(0, Math.min(100, value))
  }

  /** 当前播放歌曲在播放列表中的索引 */
  function curPlaySongIndex() {
    const song = curPlaySong.value
    if (!song)
      return -1
    return playlist.value.findIndex(i => i.bvid === song.bvid && i.cid === song.cid)
  }

  function cleatPlaylist() {
    playlist.value = []
  }

  /** 是否在播放列表中 */
  function hasPlaylist(song: PlaylistSong) {
    return playlistSet.value.has(`${song.bvid}:${song.cid}`)
  }

  /** 检查传入的歌曲是否为当前播放歌曲 */
  function isCurPlaySong(song: PlaylistSong) {
    return curPlaySong.value?.bvid === song.bvid && curPlaySong.value?.cid === song.cid
  }

  return {
    playlist,
    playerInfo,
    curPlaySong,
    unshiftPlaylist,
    pushPlaylist,
    setPlaySong,
    delPlaylist,
    modifyVolume,
    curPlaySongIndex,
    hasPlaylist,
    isCurPlaySong,
    playerStateTrigger,
    onPlayerState,
    playerStateToggle,
    cleatPlaylist,
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

  next(): void {
    const currentIndex = this.store.curPlaySongIndex()
    const nextIndex = currentIndex === this.store.playlist.length - 1 ? 0 : currentIndex + 1
    this.store.setPlaySong(this.store.playlist[nextIndex])
  }

  prev(): void {
    const currentIndex = this.store.curPlaySongIndex()
    const prevIndex = currentIndex <= 0 ? this.store.playlist.length - 1 : currentIndex - 1
    this.store.setPlaySong(this.store.playlist[prevIndex])
  }
}

/** 列表循环 */
class PlayerListLoop extends PlayerMode {
  autoNext() {
    this.next()
  }
}

/** 单曲循环 */
class PlayerSingleLoop extends PlayerMode {
  autoNext() {
    const song = this.store.curPlaySong
    if (!song)
      return
    this.store.setPlaySong(song)
  }
}

/** 顺序播放 */
class PlayerLinear extends PlayerMode {
  autoNext() {
    const currentIndex = this.store.curPlaySongIndex()
    const isLast = currentIndex === this.store.playlist.length - 1
    if (!isLast)
      this.next()
  }
}

/** 随机播放 */
class PlayerRandom extends PlayerMode {
  next() {
    const randomIndex = Math.floor(Math.random() * this.store.playlist.length)
    this.store.setPlaySong(this.store.playlist[randomIndex])
  }

  autoNext() {
    this.next()
  }
}

export const usePlayerCtrl = createSharedComposable(() => {
  const store = usePlayerStore()
  const { playerInfo } = usePlayerStoreRefs()

  const instances = {
    [PlayerModeEnum.LIST_LOOP]: new PlayerListLoop(store),
    [PlayerModeEnum.SINGLE_LOOP]: new PlayerSingleLoop(store),
    [PlayerModeEnum.LINEAR]: new PlayerLinear(store),
    [PlayerModeEnum.RANDOM]: new PlayerRandom(store),
  }

  const mode = computed(() => playerInfo.value.mode ?? PlayerModeEnum.LIST_LOOP)

  const instance = computed(() => {
    const instance = instances[mode.value]

    if (!instance)
      throw new Error(`Unknown player mode: ${mode.value}`)

    return instance
  })

  const playerCtrl: Omit<PlayerMode, 'store'> = {
    next() {
      instance.value.next()
    },
    prev() {
      instance.value.prev()
    },
    autoNext() {
      instance.value.autoNext()
    },
  }

  return playerCtrl
})
