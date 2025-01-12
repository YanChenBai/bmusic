import type { PlaylistSong } from '@renderer/types/playlist'
import type { CollectionItem } from '@renderer/utils/songDB'
import { SongListDB } from '@renderer/utils/songDB'

export class NotSaveDB extends SongListDB {
  collections = ref<CollectionItem[]>([])
  favorites = ref<PlaylistSong[]>([])

  collectionfindIndex(bvid: string) {
    return this.collections.value.findIndex(i => i.bvid === bvid)
  }

  async isInCollection(item: CollectionItem) {
    return this.collections.value.some(i => i.bvid === item.bvid)
  }

  async isInFavorite(item: PlaylistSong) {
    return this.favorites.value.some(i => i.bvid === item.bvid && i.cid === item.cid)
  }

  async addCollection(item: CollectionItem) {
    if (await this.isInCollection(item))
      return
    this.collections.value.push(item)
  }

  async addFavorite(item: PlaylistSong) {
    if (await this.isInFavorite(item))
      return
    this.favorites.value.push(item)
  }

  async removeCollection(bvid: string) {
    const findIdx = this.collectionfindIndex(bvid)
    if (findIdx === -1)
      return

    this.collections.value.splice(findIdx, 1)
  }

  async removeFavorite(item: PlaylistSong) {
    const findIdx = this.favorites.value.findIndex(i => i.bvid === item.bvid && i.cid === item.cid)
    if (findIdx === -1)
      return

    this.favorites.value.splice(findIdx, 1)
  }

  async modifyCollectionTitle(bvid: string, title: string) {
    const findIdx = this.collectionfindIndex(bvid)
    if (findIdx === -1)
      return

    this.collections.value[findIdx].title = title
  }
}
