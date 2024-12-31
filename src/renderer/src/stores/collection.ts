export interface CollectionItem {
  bvid: string
  cover: string
  title: string
}

export const useCollectionStore = defineStore('collection', () => {
  const collections = ref<CollectionItem[]>([
    {
      bvid: 'BV1VAkmYvEre',
      title: '【阿梓歌】2024年12月20日直播翻唱歌曲合集【生日回】',
      cover: 'http://i1.hdslb.com/bfs/archive/83a2e13e1d3f8c50bc62fa7ad9a3ba8011f33446.jpg',
    },
  ])

  function addCollection(item: CollectionItem) {
    collections.value.push(item)
  }

  return {
    collections,
    addCollection,
  }
}, {
  persist: {
    pick: ['collections'],
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
