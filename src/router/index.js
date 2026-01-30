import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  
  // Rotas do Admin
  { path: '/painel', name: 'Dashboard', component: () => import('../views/admin/Dashboard.vue') },
  { path: '/admin/cartas', name: 'CartasList', component: () => import('../views/admin/CartasList.vue') },
  { path: '/admin/cartas/nova', name: 'CartaCreate', component: () => import('../views/admin/CartaForm.vue') },
  { path: '/admin/cartas/:id', name: 'CartaEdit', component: () => import('../views/admin/CartaForm.vue'), props: true },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router