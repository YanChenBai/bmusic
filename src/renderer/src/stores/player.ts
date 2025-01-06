import { defineStore } from 'pinia'

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

export interface PayQuality {
  id: number
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

  const list: PayQuality[] = data.dash.audio.map((item) => {
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

export const usePlayerStore = defineStore('player', () => {
  const { on: onPlayerState, trigger: playerStateTrigger } = createEventHook<PlayerStateEnum>()
  const { on: onSetProgress, trigger: setProgress } = createEventHook<number>()
  const { config } = useConfigStore()
  const curPlaySong = ref<PlaylistSong>()
  const playlist = ref<PlaylistSong[]>([])
  const playerInfo = reactive<PlayerInfo>({
    progress: 0,
    volume: 50,
    url: null,
    mode: PlayerModeEnum.REPEAT_ALL,
    state: PlayerStateEnum.PAUSE,
    longTime: 0,
  })
  const playQuality = ref<PayQuality[]>([])
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
  async function setPlaySong(song: PlaylistSong) {
    try {
      const { longTime, list } = await getPlayUrl(song.bvid, song.cid, config.sessdata)

      curPlaySong.value = song
      playerInfo.longTime = longTime / 1000
      playerInfo.url = list[0].url
      playQuality.value = list

      unshiftPlaylist(song)
      playerStateToggle(PlayerStateEnum.PLAY)
    }
    catch {
      message.error('获取播放地址失败')
    }
  }

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
    playQuality,
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
    recoverPlaySong,
    setProgress,
    onSetProgress,
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
    [PlayerModeEnum.REPEAT_ALL]: new PlayerListLoop(store),
    [PlayerModeEnum.REPEAT_ONE]: new PlayerSingleLoop(store),
    [PlayerModeEnum.SEQUENTIAL]: new PlayerLinear(store),
    [PlayerModeEnum.SHUFFLE]: new PlayerRandom(store),
  }

  const mode = computed(() => playerInfo.value.mode ?? PlayerModeEnum.REPEAT_ALL)

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
