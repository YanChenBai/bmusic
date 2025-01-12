export enum DBModeEnum {
  /** 本地存储 */
  LOCAL_STORAGE,
  /** indexDB */
  INDEX_DB,
  /** 不保存 */
  NOT_SAVE,
}

export const useConfigStore = defineStore('config', () => {
  const config = reactive<{
    dbMode: DBModeEnum
    sessdata: string | undefined
  }>({
    dbMode: DBModeEnum.LOCAL_STORAGE,
    sessdata: undefined,
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
