<script setup lang="ts">
/** 批量导入设置组件 */
const settingComponents
= Object.values(import.meta.glob<{ default: Component }>('@renderer/settings/*.vue', { eager: true })).map(module => module.default)
</script>

<template>
  <div class="box-border p3">
    <NCard :bordered="false" title="设置" class="bg-white/2">
      <template v-for="Component in settingComponents" :key="Component.name">
        <NDivider style="margin: 0;" />
        <Component :is="Component" />
      </template>
    </NCard>
  </div>
</template>
