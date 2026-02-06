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
/* Reset global de box-sizing para este componente */
* {
  box-sizing: border-box;
}

.main-footer {
  background-color: #0f172a;
  color: #94a3b8;
  padding-top: 60px;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  /* Blindagem absoluta contra scroll horizontal */
  overflow-x: hidden;
  width: 100%;
  position: relative;
}

.footer-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 40px;
  display: grid;
  grid-template-columns: 1.5fr 0.8fr 1.2fr;
  gap: 40px;
}

.footer-links-wrapper {
  display: contents; /* Mantém o grid no desktop */
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
  margin-bottom: 20px;
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
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  text-align: center; padding: 20px; font-size: 0.8rem;
}

/* --- REGRAS DE ADAPTAÇÃO PARA MÚLTIPLAS RESOLUÇÕES --- */

/* Tablet e Telas Médias (992px) */
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
  .brand-description {
    margin: 0 auto 20px;
    max-width: 450px;
  }
  .socials { justify-content: center; }
}

/* Celulares (480px e inferiores) */
@media (max-width: 480px) {
  .footer-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 0 15px 30px;
    width: 100%; /* Força o container a não ultrapassar a tela */
  }

  .footer-brand {
    width: 100%;
    margin-bottom: 30px;
  }

  .footer-brand .footer-logo {
    margin: 0 auto 15px;
  }

  .brand-description {
    font-size: 0.85rem;
    max-width: 100%; /* Permite que o texto quebre para evitar estouro */
    padding: 0 10px;
    line-height: 1.5;
  }

  /* Organiza colunas Lado a Lado centralizadas */
  .footer-links-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
    max-width: 400px; /* Limita largura para não encostar na borda */
    gap: 10px;
  }

  .footer-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h4 {
    font-size: 0.95rem;
    width: 100%;
    text-align: center;
  }

  ul {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  li {
    justify-content: center;
    text-align: center;
    width: 100%;
    white-space: nowrap; /* Evita quebra de palavras curtas */
  }

  .socials { margin-bottom: 10px; }
}

/* iPhone Mini e Telas Pequenas (abaixo de 360px) */
@media (max-width: 360px) {
  .footer-links-wrapper {
    flex-direction: column; /* Em telas muito estreitas, empilha para evitar texto cortado */
    gap: 25px;
  }
}
</style>