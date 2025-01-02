import HomeView from '@renderer/views/HomeView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/collection/:bvid',
      name: 'collection',
      component: () => import('@renderer/views/CollectionView.vue'),
      props(to) {
        return {
          bvid: to.params.bvid,
        }
      },
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@renderer/views/SettingView.vue'),
    },
  ],
})

export default router
