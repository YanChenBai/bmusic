import type { PlaylistSong } from '@renderer/types/playlist'

export const usePlaylistStore = defineStore('playlist', () => {
  const playlist = ref<PlaylistSong[]>([])
  const playlistSet = computed(() => new Set(playlist.value.map(i => `${i.bvid}:${i.cid}`)))

  /** 清除歌单 */
  function clear() {
    playlist.value = []
  }

  /** 获取播放列表索引 */
  function findIndex(bvid: string, cid: number) {
    return playlist.value.findIndex(i => i.bvid === bvid && i.cid === cid)
  }

  /** 删除指定歌曲 */
  function remove(bvid: string, cid: number) {
    const index = findIndex(bvid, cid)

    if (index === -1)
      throw new Error('not found')

    playlist.value.splice(index, 1)
  }

  /** 是否在播放列表中 */
  function has(bvid: string, cid: number) {
    return playlistSet.value.has(`${bvid}:${cid}`)
  }

  /** 添加到尾部歌曲 */
  function push(data: PlaylistSong | PlaylistSong[]) {
    const arr = Array.isArray(data) ? data : [data]
    for (const item of arr) {
      if (!has(item.bvid, item.cid))
        playlist.value.push(item)
    }
  }

  /** 添加歌曲到头部 */
  function unshift(data: PlaylistSong | PlaylistSong[]) {
    const arr = Array.isArray(data) ? data : [data]
    for (const item of arr) {
      if (!has(item.bvid, item.cid))
        playlist.value.unshift(item)
    }
  }

  return {
    playlist,
    clear,
    has,
    push,
    unshift,
    remove,
    findIndex,
  }
}, {
  persist: {
    pick: ['playlist'],
  },
})
