<script setup lang="ts">
import ControlBar from '@renderer/components/controlBar'
import SideBar from '@renderer/components/sideBar'
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
        bodyPadding: '0',
        headerPadding: '0',
      },
    }"
  >
    <div class="size-screen grid-(~ rows-[60px_1fr_80px]) overflow-hidden">
      <HeaderBar />
      <div class="grid-(~ cols-[220px_1fr]) h-full overflow-hidden">
        <SideBar />
        <div class="overflow-hidden pos-relative h-full overflow-hidden">
          <RouterView v-slot="{ Component, route }">
            <Transition name="fade">
              <KeepAlive>
                <component :is="Component" :key="route.path" class="w-full" />
              </KeepAlive>
            </Transition>
          </RouterView>
        </div>
      </div>
      <ControlBar />
      <!-- 播放器 -->
      <MusicPlayer />
    </div>
  </NConfigProvider>
</template>

<style scoped>
/* 路由切换动画 */
/* fade-transform */
.fade-leave-active,
.fade-enter-active {
  transition: all 0.2s;
}

/* 可能为enter失效，拆分为 enter-from和enter-to */
.fade-enter-from {
  opacity: 0;
  transform: translateX(-8px);
  position: fixed;
}
.fade-enter-to {
  opacity: 1;
  transform: translateX(0px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateX(8px);
  position: fixed;
}
</style>
