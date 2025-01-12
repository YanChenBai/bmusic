import type { PlaylistSong } from '@renderer/types/playlist'
import type { CollectionItem } from '@renderer/utils/songDB'
import { SongListDB } from '@renderer/utils/songDB'

const useDBStore = defineStore('db', () => {
  const collections = ref<CollectionItem[]>([
    {
      bvid: 'BV1VAkmYvEre',
      title: '【阿梓歌】2024年12月20日直播翻唱歌曲合集【生日回】',
      cover: 'http://i1.hdslb.com/bfs/archive/83a2e13e1d3f8c50bc62fa7ad9a3ba8011f33446.jpg',
    },
  ])

  const favorites = ref<PlaylistSong[]>([])

  return {
    collections,
    favorites,
  }
}, {
  persist: {
    pick: ['collections', 'favorites'],
  },
})

export class LocalStorageDB extends SongListDB {
  protected store = useDBStore()

  collections = toRef(this.store.collections)
  favorites = toRef(this.store.favorites)

  collectionfindIndex(bvid: string) {
    return this.store.collections.findIndex(i => i.bvid === bvid)
  }

  async isInCollection(item: CollectionItem) {
    return this.store.collections.some(i => i.bvid === item.bvid)
  }

  async isInFavorite(item: PlaylistSong) {
    return this.store.favorites.some(i => i.bvid === item.bvid && i.cid === item.cid)
  }

  async addCollection(item: CollectionItem) {
    if (await this.isInCollection(item))
      return
    this.store.collections.push(item)
  }

  async addFavorite(item: PlaylistSong) {
    if (await this.isInFavorite(item))
      return
    this.store.favorites.push(item)
  }

  async removeCollection(bvid: string) {
    const findIdx = this.collectionfindIndex(bvid)
    if (findIdx === -1)
      return

    this.store.collections.splice(findIdx, 1)
  }

  async removeFavorite(item: PlaylistSong) {
    const findIdx = this.store.favorites.findIndex(i => i.bvid === item.bvid && i.cid === item.cid)
    if (findIdx === -1)
      return

    this.store.favorites.splice(findIdx, 1)
  }

  async modifyCollectionTitle(bvid: string, title: string) {
    const findIdx = this.collectionfindIndex(bvid)
    if (findIdx === -1)
      return

    this.store.collections[findIdx].title = title
  }
}
