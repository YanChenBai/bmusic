<script setup lang="ts">
defineOptions({ name: 'DBMode' })

const { config } = storeToRefs(useConfigStore())

const dbModeOptions = [
  {
    label: '本地存储',
    value: DBModeEnum.LOCAL_STORAGE,
  },
  {
    label: 'IndexDB',
    value: DBModeEnum.INDEX_DB,
  },
  {
    label: '不保存',
    value: DBModeEnum.NOT_SAVE,
  },
]
</script>

<template>
  <SettingItem title="歌单存储模式">
    <NSelect v-model:value="config.dbMode" class="w-50" :options="dbModeOptions" />
  </SettingItem>
</template>
