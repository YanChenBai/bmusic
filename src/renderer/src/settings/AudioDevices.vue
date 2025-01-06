<script setup lang="ts">
import { NTooltip, type SelectOption } from 'naive-ui'

defineOptions({ name: 'AudioDevices' })

const { playerInfo } = usePlayerStoreRefs()
const audioDeviceOptions = ref<SelectOption[]>([])

function renderOption({ node, option }: { node: VNode, option: SelectOption }) {
  return h(NTooltip, null, {
    trigger: () => node,
    default: () => `Rubber Soul -${option.label}`,
  })
}

onMounted(() => {
  navigator.mediaDevices.enumerateDevices()
    .then((devices) => {
      audioDeviceOptions.value = devices
        .filter(device => device.kind === 'audiooutput')
        .map(device => ({
          label: device.label,
          value: device.deviceId,
        }))
    })
})
</script>

<template>
  <SettingItem title="输出设备">
    <NSelect v-model:value="playerInfo.deviceId" class="w-50" :options="audioDeviceOptions" :render-option="renderOption" />
  </SettingItem>
</template>
