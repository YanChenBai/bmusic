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
    <NCard :bordered="false" title="设置" class="bg-white/2">
      <NDivider style="margin: 0;" />
      <SettingItem title="存储模式">
        <NSelect v-model:value="config.dbMode" class="w-50" :options="dbModeOptions" />
      </SettingItem>

      <SettingItem title="Cookie (SESSDATA)">
        <div class="w-50">
          <NInput v-model:value="config.sessdata" type="password" show-password-on="click" />
        </div>
      </SettingItem>
    </NCard>
  </div>
</template>

<style scoped>

</style>
