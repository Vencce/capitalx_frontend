<script setup>
import logoSrc from '../assets/imagens/logo_branco.png'
import { useConfigStore } from '../stores/config'
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-vue-next'

const configStore = useConfigStore()
</script>

<template>
  <footer class="main-footer">
    <div class="footer-pattern"></div>

    <div class="footer-container">
      
      <div class="footer-brand">
        <img :src="logoSrc" alt="Capital X" class="footer-logo" />
        <p class="brand-description">
          Especialistas em cartas contempladas. Transformando planos em conquistas com segurança e transparência.
        </p>
        
        <div class="socials">
          <a :href="configStore.instagram || '#'" target="_blank" class="social-icon" aria-label="Instagram">
            <Instagram :size="20" />
          </a>
          <a :href="configStore.facebook || '#'" target="_blank" class="social-icon" aria-label="Facebook">
            <Facebook :size="20" />
          </a>
        </div>
      </div>

      <div class="footer-links-wrapper">
        <div class="footer-section footer-nav">
          <h4>Navegação</h4>
          <ul>
            <li><router-link to="/">Início</router-link></li>
            <li><router-link to="/">Imóveis</router-link></li>
            <li><router-link to="/">Veículos</router-link></li>
            <li><router-link to="/quem-somos">Sobre Nós</router-link></li>
          </ul>
        </div>

        <div class="footer-section footer-contact">
          <h4>Contato</h4>
          <ul>
            <li>
              <MapPin :size="14" class="contact-icon" />
              <span>São Bento, SC</span>
            </li>
            <li>
              <Phone :size="14" class="contact-icon" />
              <span>{{ configStore.whatsapp || '(47) 99926-3529' }}</span>
            </li>
            <li>
              <Mail :size="14" class="contact-icon" />
              <span>{{ configStore.email || 'contato@capitalx.com.br' }}</span>
            </li>
          </ul>
        </div>
      </div>

    </div>
    
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Capital X Invest.</p>
    </div>
  </footer>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.main-footer {
  background-color: #0f172a;
  color: #94a3b8;
  padding-top: 60px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  overflow-x: hidden;
  width: 100%;
  position: relative;
}

/* TEXTURA DE PONTOS (PATTERN) */
.footer-pattern {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.05;
  background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 20px 20px;
  pointer-events: none;
}

.footer-container {
  position: relative; /* Fica acima do pattern */
  z-index: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 1.2fr;
  gap: 40px;
}

.footer-links-wrapper {
  display: contents;
}

.footer-brand .footer-logo {
  height: 50px; 
  margin-bottom: 20px;
  filter: brightness(0) invert(1);
}

.brand-description {
  line-height: 1.6;
  font-size: 0.9rem;
  max-width: 350px;
  margin-bottom: 25px;
}

h4 {
  color: white;
  font-size: 1rem;
  margin-bottom: 20px;
  font-weight: 700;
  text-transform: uppercase;
}

ul { list-style: none; padding: 0; margin: 0; }
li { margin-bottom: 12px; font-size: 0.9rem; display: flex; align-items: center; gap: 10px; }

.footer-nav a { text-decoration: none; color: #94a3b8; transition: 0.3s; }
.footer-nav a:hover { color: #F6D001; }

.contact-icon { color: #F6D001; flex-shrink: 0; }

.socials { display: flex; gap: 15px; }
.social-icon {
  width: 38px; height: 38px; border-radius: 8px;
  background: rgba(255, 255, 255, 0.05); color: white;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom {
  position: relative;
  z-index: 1;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center; padding: 20px; font-size: 0.8rem;
}

@media (max-width: 992px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
    gap: 30px;
  }
  .footer-brand {
    grid-column: span 2;
    text-align: center;
    width: 100%;
  }
  .brand-description { margin: 0 auto 20px; max-width: 450px; }
  .socials { justify-content: center; }
}

/* AJUSTE FINAL PARA 480PX SEM ESTOURO */
@media (max-width: 480px) {
  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 15px 30px;
  }

  .brand-description {
    font-size: 0.85rem;
    max-width: 100%;
    padding: 0 10px;
  }

  .footer-links-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    gap: 15px;
  }

  .footer-section {
    flex: 1;
    text-align: left; /* Alinhado à esquerda para leitura lado a lado */
  }

  /* No mobile compacto, removemos o wrap para não quebrar a linha do número */
  li {
    font-size: 0.75rem;
    white-space: nowrap; 
    gap: 6px;
  }

  h4 { font-size: 0.9rem; text-align: left; }
}

@media (max-width: 360px) {
  .footer-links-wrapper {
    flex-direction: column;
    align-items: center;
  }
  .footer-section { text-align: center; }
  h4 { text-align: center; }
  li { justify-content: center; }
}
</style>