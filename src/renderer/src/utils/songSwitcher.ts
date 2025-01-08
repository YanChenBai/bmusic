import type { PlaylistSong } from '@renderer/types/playlist'
import { PlayerModeEnum } from '@renderer/stores/player'
import { usePlaylistStore } from '@renderer/stores/playlist'

abstract class SongSwitcher {
  constructor(
    protected playerStore: ReturnType<typeof usePlayerStore>,
    protected playlistStore: ReturnType<typeof usePlaylistStore>,
  ) {}

  get playlistLength() {
    return this.playlistStore.playlist.length
  }

  get curIndex() {
    const song = this.playerStore.curPlaySong
    if (!song)
      return -1
    return this.playlistStore.findIndex(song.bvid, song.cid)
  }

  setPlaySong(song: PlaylistSong) {
    this.playerStore.setPlaySong(song)
  }

  next() {
    const nextIndex = this.curIndex === this.playlistLength - 1 ? 0 : this.curIndex + 1
    this.setPlaySong(this.playlistStore.playlist[nextIndex])
  }

  prev() {
    const prevIndex = this.curIndex <= 0 ? this.playlistLength - 1 : this.curIndex - 1
    this.setPlaySong(this.playlistStore.playlist[prevIndex])
  }

  abstract autoNext(): void
}

/** 列表循环 */
class RepeatAll extends SongSwitcher {
  autoNext() {
    this.next()
  }
}

/** 单曲循环 */
class RepeatOne extends SongSwitcher {
  autoNext() {
    const song = this.playerStore.curPlaySong
    if (!song)
      return

    this.setPlaySong(song)
  }
}

/** 顺序播放 */
class Sequential extends SongSwitcher {
  autoNext() {
    const isLast = this.curIndex === this.playlistLength - 1
    if (!isLast)
      this.next()
  }
}

/** 随机播放 */
class Shuffle extends SongSwitcher {
  next() {
    const randomIndex = Math.floor(Math.random() * this.playlistLength)
    this.setPlaySong(this.playlistStore.playlist[randomIndex])
  }

  autoNext() {
    this.next()
  }
}

/** 单曲播放 */
class PlayOnce extends SongSwitcher {
  autoNext() {}
}

const strategies = {
  [PlayerModeEnum.REPEAT_ALL]: RepeatAll,
  [PlayerModeEnum.REPEAT_ONE]: RepeatOne,
  [PlayerModeEnum.SEQUENTIAL]: Sequential,
  [PlayerModeEnum.SHUFFLE]: Shuffle,
  [PlayerModeEnum.PLAY_ONCE]: PlayOnce,
} as const

const instances = new Map<PlayerModeEnum, SongSwitcher>()

export const useSongSwitcher = createSharedComposable(() => {
  const playerStore = usePlayerStore()
  const playlistStore = usePlaylistStore()

  const args = [playerStore, playlistStore] as const

  const mode = computed(() => playerStore.playerInfo.mode ?? PlayerModeEnum.REPEAT_ALL)

  const instance = computed(() => {
    // new 过的直接返回
    if (instances.has(mode.value))
      return instances.get(mode.value)!

    const Strategie = strategies[mode.value]

    const strategie = new Strategie(...args)
    instances.set(mode.value, strategie)

    return strategie
  })

  return {
    next() {
      instance.value.next()
    },
    prev() {
      instance.value.prev()
    },
    autoNext() {
      instance.value.autoNext()
    },
  } as Omit<SongSwitcher, 'store'>
})
