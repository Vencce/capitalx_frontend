<script setup>
import { RouterLink, useRouter } from 'vue-router'
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  LogOut, 
  Globe,
  User
} from 'lucide-vue-next'

const router = useRouter()

const fazerLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<template>
  <div class="admin-wrapper">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h2 class="brand">Capital<span class="highlight">X</span></h2>
        <span class="badge-admin">Admin</span>
      </div>

      <nav class="sidebar-menu">
        <p class="menu-label">Principal</p>
        
        <RouterLink to="/painel" class="menu-item" active-class="active">
          <LayoutDashboard :size="20" />
          Dashboard
        </RouterLink>
        
        <RouterLink to="/admin/cartas" class="menu-item" active-class="active">
          <FileText :size="20" />
          Gerenciar Cartas
        </RouterLink>

        <RouterLink to="/admin/empresas" class="menu-item" active-class="active">
          <Building2 :size="20" />
          Administradoras
        </RouterLink>

        <p class="menu-label">Sistema</p>
        
        <button @click="fazerLogout" class="menu-item logout-btn">
          <LogOut :size="20" />
          Sair
        </button>

        <RouterLink to="/" class="menu-item back-link">
          <Globe :size="20" />
          Voltar ao Site
        </RouterLink>
      </nav>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <h3 class="page-title">Painel Administrativo</h3>
        <div class="user-profile">
          <div class="avatar">
            <User :size="20" />
          </div>
        </div>
      </header>

      <div class="content-scroll">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-wrapper { display: flex; height: 100vh; background-color: #f3f4f6; font-family: 'Inter', sans-serif; overflow: hidden; }
.sidebar { width: 280px; background: white; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; padding: 24px; }
.sidebar-header { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
.brand { font-size: 1.5rem; color: #111827; font-weight: 800; letter-spacing: -0.5px; }
.highlight { color: #10b981; }
.badge-admin { background: #eff6ff; color: #1e3a8a; font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; font-weight: 600; text-transform: uppercase; }
.menu-label { font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 12px; margin-top: 24px; letter-spacing: 0.05em; }

.menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 16px; color: #4b5563; text-decoration: none; border-radius: 8px; font-weight: 500; transition: all 0.2s; margin-bottom: 4px; border: none; background: none; width: 100%; cursor: pointer; font-size: 0.95rem; font-family: inherit; }
.menu-item:hover { background-color: #f3f4f6; color: #111827; }
.menu-item.active { background-color: #1e3a8a; color: white; }
.menu-item svg { opacity: 0.7; }
.menu-item.active svg { opacity: 1; }

.logout-btn { color: #4b5563; text-align: left; margin-top: 4px; }
.logout-btn:hover { background-color: #fee2e2; color: #b91c1c; }

.back-link { margin-top: auto; color: #6366f1; border: 1px solid #e0e7ff; }
.back-link:hover { background-color: #f5f3ff; color: #4338ca; }

.main-area { flex: 1; display: flex; flex-direction: column; }
.topbar { height: 72px; background: white; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 40px; }
.page-title { font-size: 1.1rem; font-weight: 600; color: #111827; }
.avatar { width: 40px; height: 40px; background: #f3f4f6; color: #1e3a8a; border-radius: 10px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.avatar:hover { background: #e5e7eb; }
.content-scroll { flex: 1; overflow-y: auto; padding: 40px; background-color: #f9fafb; }
</style>