import type { DropdownOption } from 'naive-ui'

export type Option = DropdownOption & {
  label: string
  key: string
}

export type GetActionMap<T extends Option[]> = {
  [K in T[number]['key']]?: (attrVal: string) => void
}

export function useContextMenu(targetAttrName = 'contextmenu', options: Option[], actions: GetActionMap<typeof options>) {
  const x = ref(0)
  const y = ref(0)
  const showDropdown = ref(false)
  const curClickAttrVal = ref<string>()

  function onContextmenu(e: MouseEvent) {
    const target = e.target as HTMLDivElement
    const el = target.closest(`[${targetAttrName}]`)

    if (!el)
      return

    const val = el.getAttribute(targetAttrName)

    if (!val)
      return

    curClickAttrVal.value = val
    showDropdown.value = false
    nextTick()
      .then(() => {
        showDropdown.value = true
        x.value = e.clientX
        y.value = e.clientY
      })
  }

  function onClickoutside() {
    showDropdown.value = false
  }

  function handleSelect(key: string) {
    showDropdown.value = false

    const func = actions[key]

    if (func)
      func(curClickAttrVal.value!)
  }

  return {
    onContextmenu,
    handleSelect,
    onClickoutside,
    showDropdown,
    x,
    y,
  }
}
