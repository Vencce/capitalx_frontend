<script setup>
import logoSrc from '../assets/imagens/logo.png';
// Se quiser usar uma versão branca da logo no footer, substitua a importação acima.
// Por enquanto, usarei um filtro CSS para deixar a logo atual branca.
</script>

<template>
  <footer class="main-footer">
    <div class="footer-content">
      
      <div class="footer-col company-info">
        <div class="logo-wrapper">
           <img :src="logoSrc" alt="Capital X Invest" class="footer-logo" style="filter: brightness(0) invert(1);" />
        </div>
        <p class="company-desc">
          Especialistas em cartas contempladas de consórcio. Oferecemos as melhores oportunidades com segurança, agilidade e transparência para você realizar seus sonhos.
        </p>
      </div>

      <div class="footer-col links-col">
        <h3>Navegação</h3>
        <ul class="footer-links">
          <li><a href="#">Quem Somos</a></li>
          <li><a href="#">Como Funciona</a></li>
          <li><a href="#">Cartas Disponíveis</a></li>
          <li><a href="#">Dúvidas Frequentes</a></li>
          <li><a href="#">Política de Privacidade</a></li>
        </ul>
      </div>

      <div class="footer-col contact-col">
        <h3>Atendimento</h3>
        <ul class="contact-list">
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.05 12.05 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.05 12.05 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            (47) 99999-9999
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            contato@capitalxinvest.com.br
          </li>
          <li>
             <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            Balneário Camboriú - SC
          </li>
        </ul>

        <div class="social-links">
          <a href="#" class="social-btn instagram">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
          <a href="#" class="social-btn facebook">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
          </a>
           <a href="#" class="social-btn whatsapp">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
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
  background-color: #1f2937; /* Cor escura do tema */
  color: #e5e7eb; /* Texto claro */
  padding-top: 60px;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 50px;
  display: grid;
  grid-template-columns: 1.5fr 1fr 1.2fr;
  gap: 40px;
}

.footer-logo {
  height: 45px;
  width: auto;
  margin-bottom: 20px;
}

.company-desc {
  font-size: 0.95rem;
  line-height: 1.6;
  opacity: 0.8;
}

.footer-col h3 {
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 25px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Links List */
.footer-links, .contact-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: 12px;
}

.footer-links a {
  text-decoration: none;
  color: #e5e7eb;
  transition: all 0.2s;
  font-size: 0.95rem;
  display: inline-block;
}

.footer-links a:hover {
  color: #10b981; /* Cor secundária (verde) */
  transform: translateX(5px);
}

/* Contact List */
.contact-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  font-size: 0.95rem;
  opacity: 0.9;
}

.contact-list svg {
  stroke: #10b981;
  flex-shrink: 0;
}

/* Social Media Buttons */
.social-links {
  display: flex;
  gap: 15px;
  margin-top: 25px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255,255,255,0.1);
  border-radius: 50%;
  color: white;
  transition: all 0.3s ease;
}

.social-btn:hover {
  background-color: #10b981;
  transform: translateY(-3px);
}

/* Bottom Bar */
.footer-bottom {
  background-color: #111827; /* Um tom mais escuro que o footer principal */
  text-align: center;
  padding: 20px;
  font-size: 0.85rem;
  border-top: 1px solid rgba(255,255,255,0.05);
  opacity: 0.7;
}

/* Responsividade */
@media (max-width: 900px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
  }
  .company-info {
    grid-column: span 2;
  }
}

@media (max-width: 600px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
  }

  .footer-logo {
    margin: 0 auto 20px;
  }

  .contact-list li {
    justify-content: center;
  }
  
  .social-links {
    justify-content: center;
  }
}
</style>