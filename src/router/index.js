import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import CartasList from '../views/admin/CartasList.vue'
import CartaForm from '../views/admin/CartaForm.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },

  // Rotas Protegidas (meta: { requiresAuth: true })
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
    nome: 'AdminEmpresas',
    component: () => import('../views/admin/AdminEmpresas.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin/empresas/nova',
    nome: 'AdminEmpresaForm',
    component: () => import('../views/admin/AdminEmpresaForm.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guarda de Rota (Navigation Guard)
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // Se a rota precisa de autenticação e não tem token
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } 
  // Se já estiver logado e tentar ir pro login, manda pro painel
  else if (to.path === '/login' && token) {
    next('/painel')
  }
  else {
    next()
  }
})

export default router