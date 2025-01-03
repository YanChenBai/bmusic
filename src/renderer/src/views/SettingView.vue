<script setup lang="ts">
import { DBModeEnum, useConfigStore } from '@renderer/stores/config'

const { config } = storeToRefs(useConfigStore())
const dbModeOptions = [
  {
    label: '本地存储',
    value: DBModeEnum.LOCAL_STORAGE,
  },
  {
    label: '不保存',
    value: DBModeEnum.NOT_SAVE,
  },
]
</script>

<template>
  <div class="box-border p3">
    <NCard :bordered="false" title="设置" class="mt-3">
      <NDivider style="margin: 0;" />
      <div class="flex items-center py3">
        <NText class="text-3.5 font-500">
          播放器
        </NText>

        <NSelect v-model:value="config.dbMode" class="ml-a w-50" :options="dbModeOptions" />
      </div>
    </NCard>
  </div>
</template>

<style scoped>

</style>
