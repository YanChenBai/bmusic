export enum DBModeEnum {
  /** 本地存储 */
  LOCAL_STORAGE,
  /** 不保存 */
  NOT_SAVE,
}

export const useConfigStore = defineStore('config', () => {
  const config = reactive({
    dbMode: DBModeEnum.LOCAL_STORAGE,
  })

  return {
    config,
  }
}, {
  persist: {
    pick: [
      'config',
    ],
  },
})
