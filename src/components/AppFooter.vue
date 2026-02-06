<script setup>
import logoSrc from '../assets/imagens/logo_branco.png'
import { useConfigStore } from '../stores/config'
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-vue-next'

const configStore = useConfigStore()
</script>

<template>
  <footer class="main-footer">
    <div class="footer-container">
      
      <div class="footer-brand">
        <img :src="logoSrc" alt="Capital X" class="footer-logo" />
        <p>Especialistas em cartas contempladas. Transformando planos em conquistas com segurança e transparência.</p>
        
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
        <div class="footer-nav">
          <h4>Navegação</h4>
          <ul>
            <li><router-link to="/">Início</router-link></li>
            <li><router-link to="/">Imóveis</router-link></li>
            <li><router-link to="/">Veículos</router-link></li>
            <li><router-link to="/quem-somos">Sobre Nós</router-link></li>
          </ul>
        </div>

        <div class="footer-contact">
          <h4>Contato</h4>
          <ul>
            <li>
              <MapPin :size="14" class="contact-icon" />
              <span>São Bento, SC</span>
            </li>
            <li>
              <Phone :size="14" class="contact-icon" />
              <span>WhatsApp</span>
            </li>
            <li>
              <Mail :size="14" class="contact-icon" />
              <span>E-mail</span>
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
.main-footer {
  background-color: #0f172a;
  color: #94a3b8;
  padding-top: 80px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 1.2fr;
  gap: 80px;
}

.footer-links-wrapper {
  display: contents; /* No desktop ele se comporta como se não existisse para manter o grid pai */
}

.footer-brand .footer-logo {
  height: 60px; 
  margin-bottom: 25px;
  filter: brightness(0) invert(1);
}

.footer-brand p {
  line-height: 1.7;
  font-size: 0.95rem;
  max-width: 350px;
  margin-bottom: 25px;
}

h4 {
  color: white;
  font-size: 1.1rem;
  margin-bottom: 30px;
  font-weight: 700;
  text-transform: uppercase;
}

ul { list-style: none; padding: 0; margin: 0; }
li { margin-bottom: 16px; font-size: 0.95rem; display: flex; align-items: center; gap: 12px; }

.footer-nav a { text-decoration: none; color: #94a3b8; transition: 0.3s; }
.footer-nav a:hover { color: #F6D001; }

.contact-icon { color: #F6D001; flex-shrink: 0; }

.socials { display: flex; gap: 15px; }
.social-icon {
  width: 42px; height: 42px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.05); color: white;
  display: flex; align-items: center; justify-content: center;
  transition: 0.3s; border: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center; padding: 30px; font-size: 0.85rem;
}

/* --- RESPONSIVIDADE PARA CELULAR (480px) --- */
@media (max-width: 480px) {
  .main-footer { padding-top: 40px; }

  .footer-container {
    display: flex;
    flex-direction: column;
    gap: 30px;
    text-align: center;
  }

  .footer-brand {
    order: 1; /* Logo em cima */
  }

  .footer-brand .footer-logo {
    height: 50px;
    margin: 0 auto 15px;
  }

  .footer-brand p {
    font-size: 0.85rem;
    margin: 0 auto 20px;
  }

  .socials { justify-content: center; }

  /* COLOCA LADO A LADO */
  .footer-links-wrapper {
    order: 2;
    display: flex;
    justify-content: space-between;
    width: 100%;
    text-align: left;
    gap: 10px;
  }

  .footer-nav, .footer-contact {
    flex: 1;
  }

  h4 {
    font-size: 0.9rem;
    margin-bottom: 15px;
  }

  li {
    font-size: 0.8rem;
    gap: 8px;
    margin-bottom: 10px;
  }

  .footer-bottom {
    padding: 20px;
  }
}
</style>