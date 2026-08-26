import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import SiswaView from '../views/SiswaView.vue'
import DetailMenuView from '../views/DetailMenuView.vue' // Pastikan file ini ada di views

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: HomeView 
    },
    { 
      path: '/portal-admin-rahasia', 
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