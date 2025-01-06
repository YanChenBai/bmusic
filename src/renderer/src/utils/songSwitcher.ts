abstract class SongSwitcher {
  constructor(protected store: ReturnType<typeof usePlayerStore>) {}

  abstract autoNext(): void

  next() {
    const currentIndex = this.store.curPlaySongIndex()
    const nextIndex = currentIndex === this.store.playlist.length - 1 ? 0 : currentIndex + 1
    this.store.setPlaySong(this.store.playlist[nextIndex])
  }

  prev() {
    const currentIndex = this.store.curPlaySongIndex()
    const prevIndex = currentIndex <= 0 ? this.store.playlist.length - 1 : currentIndex - 1
    this.store.setPlaySong(this.store.playlist[prevIndex])
  }
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
    const song = this.store.curPlaySong
    if (!song)
      return
    this.store.setPlaySong(song)
  }
}

/** 顺序播放 */
class Sequential extends SongSwitcher {
  autoNext() {
    const currentIndex = this.store.curPlaySongIndex()
    const isLast = currentIndex === this.store.playlist.length - 1
    if (!isLast)
      this.next()
  }
}

/** 随机播放 */
class Shuffle extends SongSwitcher {
  next() {
    const randomIndex = Math.floor(Math.random() * this.store.playlist.length)
    this.store.setPlaySong(this.store.playlist[randomIndex])
  }

  autoNext() {
    this.next()
  }
}

/** 单曲播放 */
class PlayOnce extends SongSwitcher {
  autoNext() {}
}

export const useSongSwitcher = createSharedComposable(() => {
  const store = usePlayerStore()
  const { playerInfo } = store

  const instances = {
    [PlayerModeEnum.REPEAT_ALL]: new RepeatAll(store),
    [PlayerModeEnum.REPEAT_ONE]: new RepeatOne(store),
    [PlayerModeEnum.SEQUENTIAL]: new Sequential(store),
    [PlayerModeEnum.SHUFFLE]: new Shuffle(store),
    [PlayerModeEnum.PLAY_ONCE]: new PlayOnce(store),
  }

  const mode = computed(() => playerInfo.mode ?? PlayerModeEnum.REPEAT_ALL)

  const instance = computed(() => {
    const instance = instances[mode.value]

    if (!instance)
      throw new Error(`Unknown player mode: ${mode.value}`)

    return instance
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
