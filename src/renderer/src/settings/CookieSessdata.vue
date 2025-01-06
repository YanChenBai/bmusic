<script setup lang="ts">
import { useConfigStore } from '@renderer/stores/config'

defineOptions({ name: 'CookieSessdata' })

const { config } = storeToRefs(useConfigStore())
</script>

<template>
  <SettingItem title="Cookie (SESSDATA)">
    <div class="w-50">
      <NInput v-model:value="config.sessdata" type="password" show-password-on="click" />
    </div>
  </SettingItem>
</template>
