import { createRouter, createWebHistory } from 'vue-router'
import AdminView from '../views/AdminView.vue'
import DetailMenuView from '../views/DetailMenuView.vue'
import SiswaView from '../views/SiswaView.vue'
// ... (impor komponen lainnya jika ada)

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/admin',
      name: 'admin',
      component: AdminView
    },
    {
      path: '/detail/:slug',
      name: 'detail-menu',
      component: DetailMenuView
    },
    {
      path: '/siswa',
      name: 'siswa',
      component: SiswaView
    }
    // ... rute lainnya
  ]
})

export default router