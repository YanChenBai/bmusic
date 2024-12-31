<script setup lang="ts">
import { darkTheme, NConfigProvider, zhCN } from 'naive-ui'
</script>

<template>
  <NConfigProvider
    abstract
    :theme="darkTheme"
    :locale="zhCN"
    :theme-overrides="{
      common: {
        primaryColor: '#FF6699',
        primaryColorHover: '#eb5e8d',
        primaryColorPressed: '#FF6699',
        primaryColorSuppl: '#eb5e8d',
        borderRadius: '8px',
        baseColor: '#fff',
      },
      Drawer: {
        bodyPadding: '12px 0',
      },
    }"
  >
    <div class="size-screen grid-(~ rows-[60px_1fr_80px])">
      <PlayerHeader />
      <div class="grid-(~ cols-[220px_1fr]) h-full overflow-hidden">
        <PlayerListSidebar />
        <div>
          <RouterView />
        </div>
      </div>
      <PlayerCtrlBar />
    </div>
  </NConfigProvider>
</template>

<style scoped>

</style>
