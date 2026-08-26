import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '../views/AdminView.vue'
import SiswaView from '../views/SiswaView.vue'
import DetailMenuView from '../views/DetailMenuView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/siswa'
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/siswa',
      name: 'siswa',
      component: SiswaView
    },
    {
      path: '/detail/:slug',
      name: 'detail-menu',
      component: DetailMenuView
    }
  ]
})

export default router