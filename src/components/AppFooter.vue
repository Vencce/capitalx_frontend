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
              <MapPin :size="16" class="contact-icon" />
              <div class="address-text">
                <span>R. Erhardt Pauli, 221 - Colonial</span>
                <span>São Bento do Sul - SC</span>
              </div>
            </li>
            <li>
              <Phone :size="16" class="contact-icon" />
              <span>{{ configStore.whatsapp || '(47) 3170-3656' }}</span>
            </li>
            <li>
              <Mail :size="16" class="contact-icon" />
              <span>{{ configStore.email || 'contato@capitalxinvest.com.br' }}</span>
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
  background-color: #000000;
  background: linear-gradient(180deg, #111111 0%, #000000 100%);
  color: #cccccc;
  padding-top: 60px;
  margin-top: auto;
  border-top: 1px solid rgba(246, 208, 1, 0.2);
  overflow-x: hidden;
  width: 100%;
  position: relative;
}

/* TEXTURA DE PONTOS (PATTERN) */
.footer-pattern {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.15;
  background-image: radial-gradient(#64748b 0.8px, transparent 0.8px);
  background-size: 24px 24px;
  pointer-events: none;
}

.footer-container {
  position: relative;
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
  font-size: 0.95rem;
  max-width: 350px;
  margin-bottom: 25px;
  color: #999999;
}

h4 {
  color: #F6D001;
  font-size: 1rem;
  margin-bottom: 25px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

ul { list-style: none; padding: 0; margin: 0; }
li { margin-bottom: 18px; font-size: 0.95rem; display: flex; align-items: flex-start; gap: 12px; }

.address-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.footer-nav a { text-decoration: none; color: #cccccc; transition: 0.3s; }
.footer-nav a:hover { color: #F6D001; padding-left: 5px; }

.contact-icon { color: #F6D001; flex-shrink: 0; margin-top: 2px; }

.socials { display: flex; gap: 15px; }
.social-icon {
  width: 42px; height: 42px; border-radius: 10px;
  background: rgba(255, 255, 255, 0.05); color: white;
  display: flex; align-items: center; justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.social-icon:hover {
  background: #F6D001;
  color: #000000;
  transform: translateY(-3px);
  border-color: #F6D001;
}

.footer-bottom {
  position: relative;
  z-index: 1;
  background: rgba(0,0,0,0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center; padding: 25px; font-size: 0.85rem;
  color: #666666;
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

@media (max-width: 480px) {
  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 15px 40px;
  }

  .brand-description {
    font-size: 0.9rem;
    max-width: 100%;
    padding: 0 10px;
  }

  .footer-links-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 30px;
  }

  .footer-section {
    text-align: center;
  }

  li {
    font-size: 0.9rem;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    white-space: normal;
  }

  .address-text { align-items: center; }

  h4 { text-align: center; margin-bottom: 15px; }
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