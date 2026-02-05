<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { MapPin, Phone, Clock, Navigation, Camera, Mail } from 'lucide-vue-next'

const unidadePrincipal = {
  nome: 'Capital-X Consórcios',
  endereco: 'R. Erhardt Pauli, 221 - Colonial',
  cidade: 'São Bento do Sul - SC',
  cep: '89288-040',
  telefone: '(47) 3170-3656',
  email: 'contato@capitalxinvest.com.br',
  horario: 'Segunda a Sexta: 08:30 às 17:30',
  // Link para o botão abrir no aplicativo de GPS do celular
  googleMapsLink: 'https://www.google.com/maps/dir/?api=1&destination=-26.241512,-49.366405'
}
</script>

<template>
  <div class="location-page">
    <AppHeader />

    <section class="location-hero">
      <div class="hero-pattern"></div>
      <div class="container hero-inner">
        <span class="gold-tag">Canais de Atendimento</span>
        <h1>Onde nos <span>Encontrar</span></h1>
      </div>
    </section>

    <main class="location-main">
      <div class="container">
        <div class="split-layout">
          
          <aside class="contact-sidebar">
            <div class="brand-badge">Capital X</div>
            <h2 class="title">Nossa Sede</h2>

            <div class="info-group">
              <div class="info-card">
                <MapPin class="icon-accent" :size="22" />
                <div class="texts">
                  <label>Endereço</label>
                  <span>{{ unidadePrincipal.endereco }}</span>
                  <span>{{ unidadePrincipal.cidade }}</span>
                </div>
              </div>

              <div class="info-card">
                <Clock class="icon-accent" :size="22" />
                <div class="texts">
                  <label>Horário</label>
                  <span>{{ unidadePrincipal.horario }}</span>
                </div>
              </div>

              <div class="info-card">
                <Phone class="icon-accent" :size="22" />
                <div class="texts">
                  <label>Telefone</label>
                  <span>{{ unidadePrincipal.telefone }}</span>
                </div>
              </div>

              <div class="info-card">
                <Mail class="icon-accent" :size="22" />
                <div class="texts">
                  <label>E-mail</label>
                  <span>{{ unidadePrincipal.email }}</span>
                </div>
              </div>
            </div>

            <a :href="unidadePrincipal.googleMapsLink" target="_blank" class="btn-gps-full">
              <Navigation :size="20" />
              Abrir no Google Maps
            </a>
          </aside>

          <div class="visual-content">
            <div class="image-box-modern">
              <img src="/src/assets/imagens/encontrar.jpeg" alt="Fachada Capital X" />
              <div class="img-label">
                <Camera :size="16" />
                Fachada Oficial
              </div>
            </div>

            <div class="map-box-modern">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.512686762319!2d-49.36859368497843!3d-26.24151218342082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94de95a896a06205%3A0xed8404373636983b!2sR.%20Erhardt%20Pauli%2C%20221%20-%20Colonial%2C%20S%C3%A3o%20Bento%20do%20Sul%20-%20SC%2C%2089288-040!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>
          </div>

        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.location-page { background-color: #f8fafc; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Hero Compacto */
.location-hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  padding: 40px 0 60px;
  position: relative;
  text-align: center;
  color: white;
}
.hero-pattern {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.05; background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 30px 30px;
}
.hero-inner { position: relative; z-index: 2; }
.gold-tag { color: #F6D001; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; }
.location-hero h1 { font-size: 2.2rem; font-weight: 900; margin: 0; }
.location-hero h1 span { color: #F6D001; }

/* Layout Split */
.location-main { margin-top: -30px; padding-bottom: 50px; position: relative; z-index: 10; }

.split-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 25px;
}

.contact-sidebar {
  background: white;
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  height: fit-content;
}

.brand-badge {
  background: #fef3c7; color: #b45309;
  padding: 3px 10px; border-radius: 4px;
  font-size: 0.65rem; font-weight: 900;
  display: inline-block; margin-bottom: 12px;
}

.contact-sidebar .title { font-size: 1.5rem; font-weight: 900; color: #1e3a8a; margin-bottom: 25px; }

.info-group { display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px; }
.info-card { display: flex; gap: 12px; }
.icon-accent { color: #F6D001; flex-shrink: 0; }
.info-card label { display: block; font-size: 0.7rem; text-transform: uppercase; font-weight: 800; color: #94a3b8; margin-bottom: 2px; }
.info-card span { display: block; color: #1e293b; font-weight: 600; font-size: 0.95rem; line-height: 1.3; }

.btn-gps-full {
  background: #1e3a8a; color: white; padding: 15px; border-radius: 10px;
  text-decoration: none; font-weight: 800; display: flex;
  align-items: center; justify-content: center; gap: 8px; transition: 0.3s;
}
.btn-gps-full:hover { background: #F6D001; color: #1e3a8a; transform: translateY(-2px); }

/* Direita */
.visual-content { display: flex; flex-direction: column; gap: 20px; }

.image-box-modern {
  background: white; border-radius: 20px; overflow: hidden;
  border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  position: relative; line-height: 0;
}
.image-box-modern img { width: 100%; height: auto; display: block; max-height: 400px; object-fit: cover; }
.img-label {
  position: absolute; bottom: 15px; right: 15px;
  background: rgba(15, 23, 42, 0.8); color: white;
  padding: 6px 12px; border-radius: 50px; font-weight: 700;
  font-size: 0.7rem; display: flex; align-items: center; gap: 6px;
}

.map-box-modern {
  background: white; border-radius: 20px; overflow: hidden;
  border: 1px solid #e2e8f0; height: 320px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
}

@media (max-width: 992px) {
  .split-layout { grid-template-columns: 1fr; }
}
</style>