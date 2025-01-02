<script setup lang="ts">
import { NInputGroup } from 'naive-ui'

const inputVal = ref('')
const router = useRouter()
const [isFocus, focusToggle] = useToggle(false)
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
      <NGradientText :size="22" class="font-900">
        BMUSIC
      </NGradientText>
    </div>
    <div class="flex justify-end items-center">
      <NPageHeader class="no-drag" @back="onBack" />
      <div class="flex w-full justify-end">
        <div class="transition-all" :class="[isFocus ? 'w-560px mr-89px' : 'w-300px']">
          <NInputGroup class="no-drag">
            <NInput
              v-model:value="inputVal"
              :autofocus="false"
              @keydown.enter="search"
              @focus="() => focusToggle(true)"
              @blur="() => focusToggle(false)"
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

      <div class="px-5 flex items-center gap-0">
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

</style>
