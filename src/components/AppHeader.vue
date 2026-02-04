<script setup>
import logoSrc from '../assets/imagens/logo.png'
import { RouterLink } from 'vue-router'
import { useConfigStore } from '../stores/config'

const configStore = useConfigStore()
</script>

<template>
  <header class="main-header">
    <div class="header-container">
      <div class="logo-area">
        <RouterLink to="/">
          <img :src="logoSrc" alt="Capital X Invest" class="brand-logo" />
        </RouterLink>
      </div>
      
      <nav class="nav-menu">
        <RouterLink to="/quem-somos" class="nav-link" active-class="active">Quem Somos</RouterLink>
        <RouterLink to="/como-funciona" class="nav-link" active-class="active">Como Funciona</RouterLink>
        <RouterLink to="/" class="nav-link" active-class="active">Cartas Contempladas</RouterLink>
        <RouterLink to="/depoimentos" class="nav-link" active-class="active">Depoimentos</RouterLink>
      </nav>

      <div class="cta-area">
        <a :href="`https://wa.me/${configStore.whatsapp}`" target="_blank" class="btn-whatsapp">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          Fale Conosco
        </a>
      </div>
    </div>
  </header>
</template>

<style scoped>
.main-header {
  background: white; height: 80px; position: sticky; top: 0; z-index: 100;
  box-shadow: 0 4px 20px -5px rgba(0,0,0,0.05); display: flex; align-items: center;
}

.header-container {
  max-width: 1200px; width: 100%; margin: 0 auto; padding: 0 20px;
  display: flex; justify-content: space-between; align-items: center;
}

.brand-logo { height: 45px; width: auto; object-fit: contain; }

.nav-menu { display: flex; gap: 32px; }

.nav-link {
  text-decoration: none; color: #4b5563; font-weight: 600; font-size: 0.95rem;
  transition: color 0.2s; position: relative;
}

/* HOVER E ATIVO EM AMARELO/DOURADO */
.nav-link:hover, .nav-link.active { color: #F6D001; /* Dourado */ }

/* Sublinhado animado */
.nav-link::after {
  content: ''; position: absolute; width: 0; height: 3px; bottom: -6px; left: 0;
  background-color: #F6D001; /* Amarelo vibrante */
  transition: width 0.3s; border-radius: 2px;
}
.nav-link:hover::after, .nav-link.active::after { width: 100%; }

.btn-whatsapp {
  background-color: #25D366; color: white; /* Whatsapp mantem verde padrão */
  padding: 10px 24px; border-radius: 30px; font-weight: 700; font-size: 0.9rem;
  text-decoration: none; display: flex; align-items: center; gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-whatsapp:hover {
  transform: translateY(-2px); box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3); background-color: #1da851;
}

@media (max-width: 900px) { .nav-menu { display: none; } }
</style>