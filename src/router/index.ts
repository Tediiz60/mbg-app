import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminView from '../views/AdminView.vue'
import SiswaView from '../views/SiswaView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/admin', name: 'admin', component: AdminView },
    { path: '/siswa', name: 'siswa', component: SiswaView },
    // rute lainnya...
  ]
})

export default router