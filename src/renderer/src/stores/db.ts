import type { PlaylistSong } from '@renderer/types/playlist'
import type { CollectionItem, SongListDB } from '@renderer/utils/songDB'
import { DBModeEnum, useConfigStore } from './config'
import { IndexDB } from './db.indexdb'
import { LocalStorageDB } from './db.localstorage'
import { NotSaveDB } from './db.nosave'

const strategies = {
  [DBModeEnum.LOCAL_STORAGE]: LocalStorageDB,
  [DBModeEnum.NOT_SAVE]: NotSaveDB,
  [DBModeEnum.INDEX_DB]: IndexDB,
}

const instances = new Map<DBModeEnum, SongListDB>()

export const useDB = createSharedComposable(() => {
  // 确保有一个默认的 dbMode
  const configStore = useConfigStore()
  const mode = computed(() => configStore.config.dbMode ?? DBModeEnum.LOCAL_STORAGE)

  const instance = computed(() => {
    if (instances.has(mode.value))
      return instances.get(mode.value)!

    const Strategie = strategies[mode.value]

    const strategie = new Strategie()
    instances.set(mode.value, strategie)

    return strategie
  })

  const db: SongListDB = {
    collections: computed(() => instance.value.collections.value),
    favorites: computed(() => instance.value.favorites.value),

    async isInCollection(item: CollectionItem) {
      return instance.value.isInCollection(item)
    },

    async isInFavorite(item: PlaylistSong) {
      return instance.value.isInFavorite(item)
    },

    async addCollection(item: CollectionItem) {
      return instance.value.addCollection(item)
    },

    async addFavorite(item: PlaylistSong) {
      return instance.value.addFavorite(item)
    },

    async removeCollection(bvid: string) {
      return instance.value.removeCollection(bvid)
    },

    async removeFavorite(item: PlaylistSong) {
      return instance.value.removeFavorite(item)
    },

    async modifyCollectionTitle(bvid, title) {
      return instance.value.modifyCollectionTitle(bvid, title)
    },

    hasCollection(bvid) {
      return instance.value.hasCollection(bvid)
    },

    hasFavorite(bvid, cid: number) {
      return instance.value.hasFavorite(bvid, cid)
    },
  }

  return db
})
