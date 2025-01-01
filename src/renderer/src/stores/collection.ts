export interface CollectionItem {
  bvid: string
  cover: string
  title: string
}

export interface FavoriteItem extends CollectionItem {
  cid: number
}

export const useCollectionStore = defineStore('collection', () => {
  const collections = ref<CollectionItem[]>([
    {
      bvid: 'BV1VAkmYvEre',
      title: '【阿梓歌】2024年12月20日直播翻唱歌曲合集【生日回】',
      cover: 'http://i1.hdslb.com/bfs/archive/83a2e13e1d3f8c50bc62fa7ad9a3ba8011f33446.jpg',
    },
  ])

  const favorites = ref<FavoriteItem[]>([])

  function addCollection(item: CollectionItem) {
    const findIdx = collections.value.findIndex(i => i.bvid === item.bvid)
    if (findIdx !== -1)
      return

    collections.value.push(item)
  }

  return {
    collections,
    favorites,
    addCollection,
  }
}, {
  persist: {
    pick: ['collections', 'favorites'],
  },
})

export function useCollection() {
  const collectionStore = useCollectionStore()
  const { addCollection } = collectionStore
  const { collections } = storeToRefs(collectionStore)

  return {
    collections,
    addCollection,
  }
}
