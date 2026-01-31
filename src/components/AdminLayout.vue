<script setup>
import { RouterLink, useRouter } from 'vue-router'

const router = useRouter()

const fazerLogout = () => {
  // Remove o token inválido
  localStorage.removeItem('token')
  // Manda para o login
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
          Dashboard
        </RouterLink>
        
        <RouterLink to="/admin/cartas" class="menu-item" active-class="active">
          Gerenciar Cartas
        </RouterLink>

        <RouterLink to="/admin/empresas" class="menu-item" active-class="active">
          Administradoras
        </RouterLink>

        <p class="menu-label">Sistema</p>
        
        <button @click="fazerLogout" class="menu-item logout-btn">
          Sair
        </button>

        <RouterLink to="/" class="menu-item back-link">
          Voltar ao Site
        </RouterLink>
      </nav>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <h3 class="page-title">Painel Administrativo</h3>
        <div class="user-profile">
          <div class="avatar">A</div>
        </div>
      </header>

      <div class="content-scroll">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-wrapper { display: flex; height: 100vh; background-color: #f3f4f6; font-family: 'Segoe UI', sans-serif; overflow: hidden; }
.sidebar { width: 260px; background: white; border-right: 1px solid #e5e7eb; display: flex; flex-direction: column; padding: 24px; }
.sidebar-header { display: flex; align-items: center; gap: 10px; margin-bottom: 40px; }
.brand { font-size: 1.5rem; color: #111827; font-weight: 800; }
.highlight { color: #10b981; }
.badge-admin { background: #eff6ff; color: #1e3a8a; font-size: 0.7rem; padding: 2px 8px; border-radius: 12px; font-weight: 600; text-transform: uppercase; }
.menu-label { font-size: 0.75rem; color: #9ca3af; text-transform: uppercase; font-weight: 600; margin-bottom: 12px; margin-top: 20px; }

.menu-item { display: flex; align-items: center; gap: 12px; padding: 12px; color: #4b5563; text-decoration: none; border-radius: 8px; font-weight: 500; transition: all 0.2s; margin-bottom: 4px; border: none; background: none; width: 100%; cursor: pointer; font-size: 1rem; font-family: inherit; }
.menu-item:hover { background-color: #f3f4f6; color: #111827; }
.menu-item.active { background-color: #ecfdf5; color: #059669; }

.logout-btn { color: #4b5563; text-align: left; }
.logout-btn:hover { background-color: #fee2e2; color: #b91c1c; }

.back-link { margin-top: auto; color: #ef4444; }
.back-link:hover { background-color: #fef2f2; color: #dc2626; }

.main-area { flex: 1; display: flex; flex-direction: column; }
.topbar { height: 70px; background: white; border-bottom: 1px solid #e5e7eb; display: flex; align-items: center; justify-content: space-between; padding: 0 32px; }
.page-title { font-size: 1.25rem; font-weight: 600; color: #111827; }
.avatar { width: 36px; height: 36px; background: #1e3a8a; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 600; }
.content-scroll { flex: 1; overflow-y: auto; padding: 32px; }
</style>