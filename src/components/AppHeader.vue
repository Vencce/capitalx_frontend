<script setup>
import logoSrc from '../assets/imagens/logo.png'
</script>

<template>
  <header class="main-header">
    <div class="header-content">
      <div class="logo-area">
        <img :src="logoSrc" alt="Capital X Invest" class="logo-image" />
      </div>
      
      <nav class="nav-links">
        <a href="#" class="nav-item">Quem Somos</a>
        <a href="#" class="nav-item">Consórcio</a>
        <a href="#" class="nav-item">Como Investir</a>
        <a href="#" class="nav-item active">Contemplados</a>
        <a href="#" class="nav-item">Contato</a>
      </nav>

      <button class="btn-header">Fale Conosco</button>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background-color: white;
  height: 80px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-image {
  height: 50px;
  width: auto;
}

.nav-links {
  display: flex;
  gap: 30px;
}

.nav-item {
  text-decoration: none;
  color: #333;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.nav-item:hover, .nav-item.active {
  color: #1e3a8a; /* primary-color hardcoded caso a variavel nao propague */
  font-weight: 700;
}

.btn-header {
  background-color: #10b981; /* secondary-color */
  color: white;
  padding: 10px 25px;
  border-radius: 5px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: opacity 0.2s;
}

.btn-header:hover {
  opacity: 0.9;
}

@media (max-width: 900px) {
  .nav-links {
    display: none;
  }
}
</style>