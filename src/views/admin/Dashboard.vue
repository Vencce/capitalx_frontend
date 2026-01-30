<script setup>
import { RouterLink } from 'vue-router'
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
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
          Dashboard
        </RouterLink>
        <a href="#" class="menu-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          Cartas
        </a>
        <a href="#" class="menu-item">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
          Clientes
        </a>

        <p class="menu-label">Sistema</p>
        <RouterLink to="/" class="menu-item back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
          Voltar ao Site
        </RouterLink>
      </nav>
    </aside>

    <div class="main-area">
      <header class="topbar">
        <h3 class="page-title">Visão Geral</h3>
        <div class="user-profile">
          <div class="avatar">A</div>
          <span>Admin</span>
        </div>
      </header>

      <div class="content-scroll">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-wrapper {
  display: flex;
  height: 100vh;
  background-color: #f3f4f6;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  overflow: hidden;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: #ffffff;
  border-right: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  padding: 24px;
}

.sidebar-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}

.brand {
  font-size: 1.5rem;
  color: #111827;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.highlight { color: #10b981; }

.badge-admin {
  background: #eff6ff;
  color: #1e3a8a;
  font-size: 0.7rem;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.menu-label {
  font-size: 0.75rem;
  color: #9ca3af;
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 12px;
  margin-top: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  color: #4b5563;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  margin-bottom: 4px;
}

.menu-item:hover {
  background-color: #f3f4f6;
  color: #111827;
}

.menu-item.active {
  background-color: #ecfdf5; /* Verde bem claro */
  color: #059669;
}

.back-link {
  margin-top: auto;
  color: #ef4444;
}

.back-link:hover {
  background-color: #fef2f2;
  color: #dc2626;
}

/* Main Area */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 70px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 36px;
  height: 36px;
  background: #1e3a8a;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
}

.content-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 32px;
}
</style>