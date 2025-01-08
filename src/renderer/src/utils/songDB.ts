import type { PlaylistSong } from '@renderer/types/playlist'

export interface CollectionItem {
  bvid: string
  cover: string
  title: string
}

export abstract class SongListDB {
  abstract isInCollection(item: CollectionItem): Promise<boolean>
  abstract isInFavorite(item: PlaylistSong): Promise<boolean>

  abstract addCollection(item: CollectionItem): Promise<void>
  abstract addFavorite(item: PlaylistSong): Promise<void>

  abstract removeCollection(bvid: string): Promise<void>
  abstract removeFavorite(item: PlaylistSong): Promise<void>

  abstract modifyCollectionTitle(bvid: string, name: string): Promise<void>

  collections = ref<CollectionItem[]>([])
  favorites = ref<PlaylistSong[]>([])

  hasCollection(bvid: string) {
    return this.collections.value.some(i => i.bvid === bvid)
  }

  hasFavorite(bvid: string, cid: number) {
    return this.favorites.value.some(i => i.bvid === bvid && i.cid === cid)
  }
}
