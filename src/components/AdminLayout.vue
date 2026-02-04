<script setup>
import { useRouter, useRoute } from 'vue-router'
import { 
  LayoutDashboard, FileText, Building2, Settings, LogOut, Globe 
} from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const logout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

const isActive = (path) => route.path === path
</script>

<template>
  <div class="admin-layout">
    <aside class="sidebar">
      <div class="brand">
        <h1>Capital<span class="highlight">X</span> <span class="tag">ADMIN</span></h1>
      </div>

      <div class="menu-container">
        <span class="menu-label">Gestão</span>
        
        <nav class="menu">
          <router-link to="/painel" class="menu-item" :class="{ active: isActive('/painel') }">
            <LayoutDashboard :size="20" /> Dashboard
          </router-link>

          <router-link to="/admin/cartas" class="menu-item" :class="{ active: isActive('/admin/cartas') }">
            <FileText :size="20" /> Cartas
          </router-link>

          <router-link to="/admin/empresas" class="menu-item" :class="{ active: isActive('/admin/empresas') }">
            <Building2 :size="20" /> Parceiros
          </router-link>
        </nav>

        <span class="menu-label mt-6">Sistema</span>
        <nav class="menu">
          <router-link to="/admin/configuracoes" class="menu-item" :class="{ active: isActive('/admin/configuracoes') }">
            <Settings :size="20" /> Configurações
          </router-link>
        </nav>
      </div>

      <div class="sidebar-footer">
        <button @click="logout" class="menu-item btn-logout">
          <LogOut :size="20" /> Sair
        </button>
        <router-link to="/" class="btn-site">
          <Globe :size="16" /> Ir para o Site
        </router-link>
      </div>
    </aside>

    <main class="main-content">
      <header class="top-bar">
        <div class="breadcrumbs">
          <span>Painel</span> <span class="separator">/</span> <span class="current">{{ route.name }}</span>
        </div>
        <div class="user-profile">
          <div class="avatar">CX</div>
        </div>
      </header>

      <div class="content-area">
        <slot></slot>
      </div>
    </main>
  </div>
</template>

<style scoped>
.admin-layout { display: flex; min-height: 100vh; background-color: var(--bg-app); }

/* SIDEBAR REFINADA */
.sidebar {
  width: 260px; background: white; border-right: 1px solid var(--border-color);
  display: flex; flex-direction: column; position: fixed; height: 100vh; z-index: 50;
  box-shadow: var(--shadow-sm);
}

.brand { 
  height: 80px; display: flex; align-items: center; padding: 0 24px;
  border-bottom: 1px solid transparent; 
}
.brand h1 { font-size: 1.5rem; font-weight: 800; color: var(--primary-dark); margin: 0; letter-spacing: -0.5px; }
.highlight { color: var(--brand-yellow); }
.tag { 
  font-size: 0.65rem; background: var(--brand-yellow-soft); color: #b45309; 
  padding: 2px 6px; border-radius: 4px; font-weight: 700; margin-left: 8px; vertical-align: middle; border: 1px solid #fcd34d;
}

.menu-container { flex: 1; padding: 24px 16px; overflow-y: auto; }
.menu-label { 
  font-size: 0.75rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; display: block; padding-left: 12px;
}
.mt-6 { margin-top: 32px; }

.menu { display: flex; flex-direction: column; gap: 4px; }

.menu-item {
  display: flex; align-items: center; gap: 12px; padding: 12px 16px;
  color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 0.95rem;
  border-radius: 8px; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  border: none; background: none; width: 100%; cursor: pointer; text-align: left;
  position: relative;
}

.menu-item:hover { background-color: #f8fafc; color: var(--primary-blue); }

/* ACTIVE STATE - O PULO DO GATO */
.menu-item.active {
  background-color: var(--brand-yellow-soft); /* Fundo muito suave */
  color: #854d0e; /* Texto escuro amarelado para contraste */
  font-weight: 600;
}
.menu-item.active::before {
  content: ''; position: absolute; left: 0; top: 10%; height: 80%; width: 4px;
  background-color: var(--brand-yellow); border-radius: 0 4px 4px 0;
}

.sidebar-footer { padding: 20px; border-top: 1px solid var(--border-color); display: flex; flex-direction: column; gap: 10px; }
.btn-logout { color: #ef4444; }
.btn-logout:hover { background-color: #fef2f2; color: #dc2626; }

.btn-site {
  display: flex; align-items: center; justify-content: center; gap: 8px;
  padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;
  color: var(--text-muted); text-decoration: none; font-size: 0.85rem; font-weight: 600;
  transition: all 0.2s;
}
.btn-site:hover { border-color: var(--brand-yellow); color: #854d0e; background: white; box-shadow: var(--shadow-sm); }

/* MAIN CONTENT */
.main-content { flex: 1; margin-left: 260px; display: flex; flex-direction: column; width: calc(100% - 260px); }

.top-bar {
  height: 80px; background: rgba(255,255,255,0.8); backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; padding: 0 40px; position: sticky; top: 0; z-index: 40;
}
.breadcrumbs { font-size: 0.9rem; color: var(--text-muted); }
.breadcrumbs .current { color: var(--text-main); font-weight: 600; }
.separator { margin: 0 8px; opacity: 0.5; }

.avatar { 
  width: 40px; height: 40px; background: var(--brand-yellow); color: var(--primary-dark);
  border-radius: 10px; display: flex; align-items: center; justify-content: center; 
  font-weight: 800; font-size: 0.95rem; box-shadow: var(--shadow-yellow);
}

.content-area { padding: 40px; width: 100%; max-width: 1400px; margin: 0 auto; }

@media (max-width: 1024px) {
  .sidebar { width: 80px; padding: 0; }
  .brand h1 span, .menu-label, .menu-item span:not(:first-child), .btn-site span { display: none; }
  .brand, .menu-container, .sidebar-footer { padding-left: 10px; padding-right: 10px; align-items: center; }
  .menu-item { justify-content: center; padding: 12px; }
  .main-content { margin-left: 80px; width: calc(100% - 80px); }
  .content-area { padding: 20px; }
}
</style>