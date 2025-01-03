export interface CollectionItem {
  bvid: string
  cover: string
  title: string
}

export interface FavoriteItem extends CollectionItem {
  cid: number
}

export abstract class SongListDB {
  abstract isInCollection(item: CollectionItem): Promise<boolean>
  abstract isInFavorite(item: FavoriteItem): Promise<boolean>

  abstract addCollection(item: CollectionItem): Promise<void>
  abstract addFavorite(item: FavoriteItem): Promise<void>

  abstract removeCollection(item: CollectionItem): Promise<void>
  abstract removeFavorite(item: FavoriteItem): Promise<void>

  collections = ref<CollectionItem[]>([])
  favorites = ref<FavoriteItem[]>([])
}
