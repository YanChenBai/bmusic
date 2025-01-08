import HomeView from '@renderer/views/HomeView.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'index',
      redirect: '/home',
    },
    {
      path: '/home',
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
      path: '/favorite',
      name: 'favorite',
      component: () => import('@renderer/views/FavoriteView.vue'),
    },
    {
      path: '/setting',
      name: 'setting',
      component: () => import('@renderer/views/SettingView.vue'),
    },
  ],
})

export default router
