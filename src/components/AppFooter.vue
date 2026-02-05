<script setup>
import logoSrc from '../assets/imagens/logo_branco.png'
import { useConfigStore } from '../stores/config'

// A store providencia os contatos configurados no painel
const configStore = useConfigStore()
</script>

<template>
  <footer class="main-footer">
    <div class="footer-container">
      
      <div class="footer-brand">
        <img :src="logoSrc" alt="Capital X" class="footer-logo" />
        <p>Especialistas em cartas contempladas. Transformando planos em conquistas com segurança e transparência.</p>
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
            <span class="icon">📍</span>
            Balneário Camboriú, SC
          </li>
          <li>
            <span class="icon">📞</span>
            {{ configStore.whatsapp || '(47) 99999-9999' }}
          </li>
          <li>
            <span class="icon">✉️</span>
            {{ configStore.email || 'contato@capitalx.com.br' }}
          </li>
        </ul>
        
        <div class="socials">
          <a :href="configStore.instagram || '#'" target="_blank" class="social-icon">IG</a>
          <a :href="configStore.facebook || '#'" target="_blank" class="social-icon">FB</a>
        </div>
      </div>

    </div>
    
    <div class="footer-bottom">
      <p>&copy; {{ new Date().getFullYear() }} Capital X Invest. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
.main-footer {
  background-color: #0f172a; /* Slate 900 */
  color: #94a3b8; /* Slate 400 */
  padding-top: 60px;
  margin-top: auto;
}

.footer-container {
  max-width: 1200px; margin: 0 auto; padding: 0 20px 60px;
  display: grid; grid-template-columns: 1.5fr 1fr 1.2fr; gap: 60px;
}

.footer-brand .footer-logo {
  height: 40px; margin-bottom: 20px;
  filter: brightness(0) invert(1); /* Deixa a logo branca */
  opacity: 0.9;
}

.footer-brand p { line-height: 1.6; font-size: 0.95rem; }

h4 { color: white; font-size: 1.1rem; margin-bottom: 24px; font-weight: 700; }

ul { list-style: none; padding: 0; margin: 0; }
li { margin-bottom: 12px; font-size: 0.95rem; }

.footer-nav a {
  text-decoration: none; color: #94a3b8; transition: color 0.2s;
}
.footer-nav a:hover { color: #38bdf8; } /* Azul claro */

.footer-contact li { display: flex; align-items: center; gap: 12px; }
.icon { font-size: 1.1rem; }

.socials { display: flex; gap: 12px; margin-top: 24px; }
.social-icon {
  width: 40px; height: 40px; border-radius: 50%;
  background: rgba(255,255,255,0.05); color: white;
  display: flex; align-items: center; justify-content: center;
  text-decoration: none; font-size: 0.8rem; font-weight: 700;
  transition: all 0.2s;
}
.social-icon:hover { background: #38bdf8; color: #0f172a; transform: translateY(-3px); }

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.05);
  text-align: center; padding: 24px; font-size: 0.85rem;
}

@media (max-width: 800px) {
  .footer-container { grid-template-columns: 1fr; gap: 40px; text-align: center; }
  .footer-contact li { justify-content: center; }
  .socials { justify-content: center; }
  .footer-brand .footer-logo { margin: 0 auto 20px; }
}
</style>