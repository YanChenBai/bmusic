<script setup lang="ts">
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
</script>

<template>
  <div class="border-(0 b-1px solid #2E2E30) drag grid-(~ cols-[220px_1fr]) content-center">
    <div />
    <div class="flex justify-between">
      <div class="w-400px">
        <NInput v-model:value="inputVal" class="no-drag" :autofocus="false" @keydown.enter="search" />
      </div>

      <div class="px-5 flex items-center gap-4">
        <NButton class="no-drag" circle quaternary :focusable="false">
          <template #icon>
            <NIcon size="42">
              <div class="i-material-symbols:check-indeterminate-small-rounded" />
            </NIcon>
          </template>
        </NButton>

        <NButton class="no-drag" circle quaternary :focusable="false">
          <template #icon>
            <NIcon size="42">
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
