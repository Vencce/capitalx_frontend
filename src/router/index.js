import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Login from '../views/Login.vue'
// Novas Páginas Públicas
import QuemSomos from '../views/QuemSomos.vue'
import ComoFunciona from '../views/ComoFunciona.vue'
import Depoimentos from '../views/Depomentos.vue'

// Admin
import Dashboard from '../views/admin/Dashboard.vue'
import CartasList from '../views/admin/CartasList.vue'
import CartaForm from '../views/admin/CartaForm.vue'

const routes = [
  // Área Pública
  { path: '/', name: 'Home', component: Home },
  { path: '/quem-somos', name: 'QuemSomos', component: QuemSomos },
  { path: '/como-funciona', name: 'ComoFunciona', component: ComoFunciona },
  { path: '/depoimentos', name: 'Depoimentos', component: Depoimentos },
  { path: '/login', name: 'Login', component: Login },

  // Área Administrativa (Protegida)
  { 
    path: '/painel', 
    name: 'Dashboard', 
    component: Dashboard, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/admin/cartas', 
    name: 'CartasList', 
    component: CartasList, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/admin/cartas/nova', 
    name: 'CartaCreate', 
    component: CartaForm, 
    meta: { requiresAuth: true } 
  },
  { 
    path: '/admin/cartas/:id', 
    name: 'CartaEdit', 
    component: CartaForm, 
    meta: { requiresAuth: true } 
  },
  {
    path: '/admin/empresas',
    name: 'AdminEmpresas', // Corrigido 'nome' para 'name'
    component: () => import('../views/admin/AdminEmpresas.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/empresas/nova',
    name: 'AdminEmpresaForm', // Corrigido 'nome' para 'name'
    component: () => import('../views/admin/AdminEmpresaForm.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/configuracoes',
    name: 'AdminConfig',
    component: () => import('../views/admin/AdminConfig.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Rola para o topo ao mudar de página
  scrollBehavior(to, from, savedPosition) {
    return { top: 0 }
  }
})

// Guarda de Rota
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/painel')
  } else {
    next()
  }
})

export default router