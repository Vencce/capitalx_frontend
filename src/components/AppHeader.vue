<script setup>
import { ref } from 'vue'
import logoSrc from '../assets/imagens/logo_preto.png'
import { RouterLink } from 'vue-router'
import { useConfigStore } from '../stores/config'
import { Menu, X } from 'lucide-vue-next'

const configStore = useConfigStore()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="main-header">
    <div class="header-container">
      <div class="logo-area">
        <RouterLink to="/" @click="closeMenu">
          <img :src="logoSrc" alt="Capital X Invest" class="brand-logo" />
        </RouterLink>
      </div>
      
      <div v-if="isMenuOpen" class="menu-overlay" @click="closeMenu"></div>

      <nav class="nav-menu" :class="{ 'is-open': isMenuOpen }">
        <button class="btn-close-menu" @click="toggleMenu">
          <X :size="30" />
        </button>

        <RouterLink to="/quem-somos" class="nav-link" active-class="active" @click="closeMenu">Quem Somos</RouterLink>
        <RouterLink to="/como-funciona" class="nav-link" active-class="active" @click="closeMenu">Como Funciona</RouterLink>
        <RouterLink to="/" class="nav-link" active-class="active" @click="closeMenu">Cartas Contempladas</RouterLink>
        <RouterLink to="/duvidas" class="nav-link" active-class="active" @click="closeMenu">Duvidas</RouterLink>
        <RouterLink to="/onde-encontrar" class="nav-link" active-class="active" @click="closeMenu">Onde Estamos</RouterLink>
        
        <div class="mobile-only-cta">
          <a :href="`https://wa.me/${configStore.whatsapp}`" target="_blank" class="btn-whatsapp-mobile">
            Fale Conosco
          </a>
        </div>
      </nav>

      <div class="cta-area">
        <a :href="`https://wa.me/${configStore.whatsapp}`" target="_blank" class="btn-whatsapp-desktop">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          Fale Conosco
        </a>

        <button class="btn-hamburguer" @click="toggleMenu">
          <Menu :size="32" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background: white;
  height: 90px;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05);
  display: flex;
  align-items: center;
}

.header-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* LOGO MAIOR */
.brand-logo {
  height: 65px;
  width: auto;
  object-fit: contain;
}

.nav-menu {
  display: flex;
  gap: 30px;
}

.nav-link {
  text-decoration: none;
  color: #4b5563;
  font-weight: 600;
  font-size: 0.95rem;
  transition: color 0.2s;
  position: relative;
}

.nav-link:hover, .nav-link.active { color: #F6D001; }

.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 3px;
  bottom: -6px;
  left: 0;
  background-color: #F6D001;
  transition: width 0.3s;
  border-radius: 2px;
}
.nav-link:hover::after, .nav-link.active::after { width: 100%; }

/* BOTÃO DESKTOP */
.btn-whatsapp-desktop {
  background-color: #25D366;
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: 700;
  font-size: 0.9rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s;
}

.btn-whatsapp-desktop:hover {
  background-color: #1da851;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2);
}

/* ELEMENTOS QUE FICAM ESCONDIDOS NO PC */
.btn-hamburguer, .btn-close-menu, .mobile-only-cta {
  display: none;
}

/* RESPONSIVIDADE (MOBILE) */
@media (max-width: 1024px) {
  .nav-menu {
    position: fixed;
    top: 0;
    right: -100%;
    width: 280px;
    height: 100vh;
    background: white;
    flex-direction: column;
    padding: 100px 30px;
    gap: 20px;
    box-shadow: -10px 0 30px rgba(0,0,0,0.1);
    transition: right 0.4s ease;
    z-index: 1001;
  }

  .nav-menu.is-open {
    right: 0;
  }

  .btn-hamburguer {
    display: block;
    background: none;
    border: none;
    cursor: pointer;
    color: #1e3a8a;
  }

  .btn-close-menu {
    display: block;
    position: absolute;
    top: 30px;
    right: 20px;
    background: none;
    border: none;
    color: #64748b;
  }

  .menu-overlay {
    position: fixed;
    top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.4);
    z-index: 1000;
  }

  .btn-whatsapp-desktop {
    display: none; /* ESCONDE O BOTÃO DO HEADER NO MOBILE */
  }

  .mobile-only-cta {
    display: block;
    margin-top: 20px;
  }

  .btn-whatsapp-mobile {
    background-color: #25D366;
    color: white;
    padding: 15px;
    border-radius: 12px;
    text-align: center;
    text-decoration: none;
    font-weight: 800;
    display: block;
  }

  .nav-link {
    font-size: 1.1rem;
    padding: 10px 0;
    border-bottom: 1px solid #f1f5f9;
  }

  .brand-logo {
    height: 50px;
  }
}
</style>