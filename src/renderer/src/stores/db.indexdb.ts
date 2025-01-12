import type { PlaylistSong } from '@renderer/types/playlist'
import type { CollectionItem } from '@renderer/utils/songDB'
import { SongListDB } from '@renderer/utils/songDB'
import localForage from 'localforage'

localForage.config({
  name: 'bmusic',
  storeName: 'db',
  version: 1.0,
  driver: localForage.INDEXEDDB,
})

type OrNull<T> = T | null

const clone = <T>(obj: T) => JSON.parse(JSON.stringify(obj)) as T

export class IndexDB extends SongListDB {
  collections = ref<CollectionItem[]>([])
  favorites = ref<PlaylistSong[]>([])

  constructor() {
    super()
    this.init()
  }

  init() {
    localForage.getItem('collections')
      .then((value) => {
        this.collections.value = value as OrNull<CollectionItem[]> ?? []
      })

    localForage.getItem('favorites')
      .then((value) => {
        this.favorites.value = value as OrNull<PlaylistSong[]> ?? []
      })
  }

  async setCollections(data: CollectionItem[]) {
    await localForage.setItem('collections', clone(data))
    this.collections.value = data
  }

  async setFavorites(data: PlaylistSong[]) {
    await localForage.setItem('favorites', clone(data))
    this.favorites.value = data
  }

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

    await this.setCollections([
      ...toValue(this.collections.value),
      item,
    ])
  }

  async addFavorite(item: PlaylistSong) {
    if (await this.isInFavorite(item))
      return

    await this.setFavorites([
      ...toValue(this.favorites.value),
      item,
    ])
  }

  async removeCollection(bvid: string) {
    await this.setCollections(
      this.collections.value.filter(item => item.bvid !== bvid),
    )
  }

  async removeFavorite(item: PlaylistSong) {
    await this.setFavorites(
      this.favorites.value.filter(i => !(i.bvid === item.bvid && i.cid === item.cid)),
    )
  }

  async modifyCollectionTitle(bvid: string, title: string) {
    const findIdx = this.collectionfindIndex(bvid)
    if (findIdx === -1)
      return

    const oldVal = this.collections.value[findIdx].title
    this.collections.value[findIdx].title = title

    await this.setCollections(this.collections.value)
      .catch(() => {
        this.collections.value[findIdx].title = oldVal
      })
  }
}
