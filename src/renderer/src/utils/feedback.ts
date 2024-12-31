import { createDiscreteApi, darkTheme } from 'naive-ui'

export const { message, notification, dialog, loadingBar, modal } = createDiscreteApi(
  ['message', 'dialog', 'notification', 'loadingBar', 'modal'],
  {
    configProviderProps: {
      theme: darkTheme,
    },
  },
)
