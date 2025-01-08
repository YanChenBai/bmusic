import type { CollectionItem, FavoriteItem, SongListDB } from '@renderer/utils/songDB'
import { DBModeEnum, useConfigStore } from './config'
import { LocalStorageDB } from './db.localstorage'
import { NotSaveDB } from './db.nosave'

const strategies = {
  [DBModeEnum.LOCAL_STORAGE]: LocalStorageDB,
  [DBModeEnum.NOT_SAVE]: NotSaveDB,
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

    async isInFavorite(item: FavoriteItem) {
      return instance.value.isInFavorite(item)
    },

    async addCollection(item: CollectionItem) {
      return instance.value.addCollection(item)
    },

    async addFavorite(item: FavoriteItem) {
      return instance.value.addFavorite(item)
    },

    async removeCollection(item: CollectionItem) {
      return instance.value.removeCollection(item)
    },

    async removeFavorite(item: FavoriteItem) {
      return instance.value.removeFavorite(item)
    },
  }

  return db
})
