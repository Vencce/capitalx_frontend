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

      <div class="footer-nav">
        <h4>Navegação</h4>
        <ul>
          <li><router-link to="/">Início</router-link></li>
          <li><router-link to="/">Cartas de Imóveis</router-link></li>
          <li><router-link to="/">Cartas de Veículos</router-link></li>
          <li><router-link to="/quem-somos">Sobre Nós</router-link></li>
        </ul>
      </div>

      <div class="footer-contact">
        <h4>Fale Conosco</h4>
        <ul>
          <li>
            <MapPin :size="18" class="contact-icon" />
            <span>São Bento do Sul, SC</span>
          </li>
          <li>
            <Phone :size="18" class="contact-icon" />
            <span>{{ configStore.whatsapp || '(47) 99999-9999' }}</span>
          </li>
          <li>
            <Mail :size="18" class="contact-icon" />
            <span>{{ configStore.email || 'contato@capitalx.com.br' }}</span>
          </li>
        </ul>
      </div>

    </div>
    
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Capital X Invest. Todos os direitos reservados.</p>
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
  /* Impede o scroll horizontal */
  overflow-x: hidden; 
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 60px;
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 1.2fr;
  gap: 80px;
}

/* Logo aumentada */
.footer-brand .footer-logo {
  height: 60px; 
  margin-bottom: 25px;
  filter: brightness(0) invert(1);
  opacity: 1;
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
  letter-spacing: 1px;
}

ul { list-style: none; padding: 0; margin: 0; }
li { margin-bottom: 16px; font-size: 0.95rem; display: flex; align-items: center; gap: 12px; }

.footer-nav a {
  text-decoration: none;
  color: #94a3b8;
  transition: all 0.3s ease;
}

.footer-nav a:hover {
  color: #F6D001;
  padding-left: 5px;
}

.contact-icon {
  color: #F6D001;
  flex-shrink: 0;
}

.socials {
  display: flex;
  gap: 15px;
}

.social-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-icon:hover {
  background: #F6D001;
  color: #0f172a;
  transform: translateY(-5px);
  border-color: #F6D001;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center;
  padding: 30px;
  font-size: 0.85rem;
  background: rgba(0, 0, 0, 0.2);
}

/* --- REGRAS DE RESPONSIVIDADE ADICIONAIS --- */

@media (max-width: 1024px) {
  .footer-container {
    gap: 40px;
    /* Reduz as colunas para caber em tablets sem quebrar */
    grid-template-columns: 1fr 1fr; 
  }
  .footer-brand {
    grid-column: span 2; /* Logo ocupa a largura toda no tablet */
    margin-bottom: 20px;
  }
}

@media (max-width: 768px) {
  .main-footer {
    padding-top: 40px; /* Reduzido de 80px */
  }

  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 30px; /* Reduzido de 80px/50px para compactar */
    text-align: center;
    padding-bottom: 30px;
  }

  /* Faz Navegação e Contato ficarem lado a lado se couberem, ou apenas reduz o gap */
  .footer-nav, .footer-contact {
    width: 100%;
    margin-bottom: 10px;
  }

  .footer-brand .footer-logo {
    height: 45px; /* Logo um pouco menor no mobile */
    margin-bottom: 15px;
  }

  .footer-brand p {
    font-size: 0.85rem;
    margin-bottom: 15px;
  }

  h4 {
    margin-bottom: 15px; /* Reduzido de 30px */
    font-size: 1rem;
  }

  li {
    margin-bottom: 8px; /* Lista mais compacta */
  }

  .socials {
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .footer-container {
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>