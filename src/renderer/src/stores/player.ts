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
  const { on: onPlayerState, trigger: playerStateTrigger } = createEventHook<PlayerStateEnum>()
  const playlistMap = computed(() => {
    return new Set(playlist.value.map(item => `${item.bvid}:${item.cid}`))
  })
  const playerInfo = reactive<PlayerInfo>({
    progress: 0,
    volume: 0.5,
    url: null,
    mode: PlayerModeEnum.LINEAR,
    state: PlayerStateEnum.PAUSE,
    longTime: 0,
  })

  function findindexPlaylistSong(bvid: string, cid: number) {
    return playlist.value.findIndex(item => item.bvid === bvid && item.cid === cid)
  }

  function addPlaylist(data: PlaylistSong) {
    const idx = findindexPlaylistSong(data.bvid, data.cid)

    if (idx === -1) {
      return playlist.value.push(data)
    }

    playlist.value.splice(idx, 1)
    return playlist.value.unshift(data)
  }

  function delPlaylist(data: PlaylistSong) {
    const idx = findindexPlaylistSong(data.bvid, data.cid)

    if (idx === -1)
      return

    playlist.value.splice(idx, 1)
  }

  function addListToPlaylist(data: PlaylistSong[]) {
    data.forEach(item => addPlaylist(item))
  }

  function playSong(song: PlaylistSong) {
    const idx = findindexPlaylistSong(song.bvid, song.cid)
    if (idx !== -1)
      delPlaylist(song)

    curPlaySong.value = song
    window.invokes.getMediaInfo(song.bvid, song.cid)
      .then((data) => {
        playerInfo.url = data.durl[0].url
        playerInfo.longTime = data.timelength / 1000
      })
  }

  function isInPlaylist(song: PlaylistSong) {
    return playlistMap.value.has(`${song.bvid}:${song.cid}`)
  }

  function modifyPlayerState(state: PlayerStateEnum) {
    if (!playerInfo.url)
      return

    playerInfo.state = state
    playerStateTrigger(state)
  }

  const play = () => modifyPlayerState(PlayerStateEnum.PLAY)
  const pause = () => modifyPlayerState(PlayerStateEnum.PAUSE)

  return {
    playlist,
    playerInfo,
    curPlaySong,
    addPlaylist,
    delPlaylist,
    addListToPlaylist,
    playSong,
    isInPlaylist,
    play,
    pause,
    onPlayerState,
  }
}, {
  persist: {
    pick: ['playlist', 'curPlaySong', 'playerInfo'],
  },
})

export function usePlayer() {
  const playerStore = usePlayerStore()
  const { addPlaylist, delPlaylist, addListToPlaylist, playSong, onPlayerState, play, pause } = playerStore
  const { playerInfo, playlist, curPlaySong } = storeToRefs(playerStore)

  return {
    playerInfo,
    playlist,
    curPlaySong,
    addPlaylist,
    delPlaylist,
    addListToPlaylist,
    playSong,
    onPlayerState,
    play,
    pause,
  }
}
