import type { CollectionItem, FavoriteItem } from '@renderer/utils/songDB'
import { SongListDB } from '@renderer/utils/songDB'

export class NotSaveDB extends SongListDB {
  collections = ref<CollectionItem[]>([])
  favorites = ref<FavoriteItem[]>([])
  async isInCollection(item: CollectionItem) {
    return this.collections.value.some(i => i.bvid === item.bvid)
  }

  async isInFavorite(item: FavoriteItem) {
    return this.favorites.value.some(i => i.bvid === item.bvid)
  }

  async addCollection(item: CollectionItem) {
    if (await this.isInCollection(item))
      return
    this.collections.value.push(item)
  }

  async addFavorite(item: FavoriteItem) {
    if (await this.isInFavorite(item))
      return
    this.favorites.value.push(item)
  }

  async removeCollection(item: CollectionItem) {
    const findIdx = this.collections.value.findIndex(i => i.bvid === item.bvid)
    if (findIdx === -1)
      return

    this.collections.value.splice(findIdx, 1)
  }

  async removeFavorite(item: FavoriteItem) {
    const findIdx = this.favorites.value.findIndex(i => i.bvid === item.bvid)
    if (findIdx === -1)
      return

    this.favorites.value.splice(findIdx, 1)
  }

  async getCollection() {
    return this.collections.value
  }

  async getFavorite() {
    return this.favorites.value
  }
}
