<script setup lang="ts">
import { NButton, NInputGroup } from 'naive-ui'

const inputVal = ref('')
const router = useRouter()

function search() {
  if (inputVal.value.trim().length === 0)
    return

  router.push({
    name: 'collection',
    params: {
      bvid: inputVal.value,
    },
  })
}

const close = () => window.invokes.close()
const minimize = () => window.invokes.minimize()

function onBack() {
  router.back()
}
</script>

<template>
  <div class="border-(0 b-1px solid #2E2E30) drag grid-(~ cols-[220px_1fr]) content-center">
    <div class="flex items-center gap0.5 pl5 pt1">
      <div class="i-material-symbols:music-cast-rounded size-7.8 text-#EE5F8E" />
      <NGradientText :size="22" class="font-900 select-none">
        BMUSIC
      </NGradientText>
    </div>
    <div class="flex justify-end items-center">
      <NPageHeader class="no-drag" @back="onBack">
        <template #back>
          <NButton text>
            <template #icon>
              <NIcon size="24">
                <div class="i-material-symbols:arrow-back-rounded" />
              </NIcon>
            </template>
          </NButton>
        </template>
        <template #avatar>
          <Transition name="home-btn">
            <NButton
              v-show="$route.name !== 'home'" text
              @click="$router.push({ name: 'home' })"
            >
              <template #icon>
                <NIcon size="24">
                  <div class="i-material-symbols:home-rounded" />
                </NIcon>
              </template>
            </NButton>
          </Transition>
        </template>
      </NPageHeader>
      <div class="flex w-full justify-end">
        <div class="w-300px">
          <NInputGroup class="no-drag">
            <NInput
              v-model:value="inputVal"
              :autofocus="false"
              placeholder="请输入BV号"
              @keydown.enter="search"
            />
            <NButton type="primary" ghost @click="search">
              <template #icon>
                <NIcon size="22">
                  <div class="i-material-symbols:search-rounded" />
                </NIcon>
              </template>
            </NButton>
          </NInputGroup>
        </div>
      </div>

      <div class="px-3 flex items-center gap-0">
        <NButton class="no-drag" :focusable="false" quaternary @click="$router.push({ name: 'setting' })">
          <template #icon>
            <NIcon size="20">
              <div class="i-material-symbols:settings-rounded" />
            </NIcon>
          </template>
        </NButton>

        <NButton class="no-drag" quaternary :focusable="false" @click="minimize">
          <template #icon>
            <NIcon size="32">
              <div class="i-material-symbols:check-indeterminate-small-rounded" />
            </NIcon>
          </template>
        </NButton>

        <NButton class="no-drag" quaternary :focusable="false" @click="close">
          <template #icon>
            <NIcon size="32">
              <div class="i-material-symbols:close-small-rounded" />
            </NIcon>
          </template>
        </NButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-btn-enter-active,
.home-btn-leave-active {
  transition: opacity 0.2s ease;
}

.home-btn-enter-from,
.home-btn-leave-to {
  opacity: 0;
}
</style>
