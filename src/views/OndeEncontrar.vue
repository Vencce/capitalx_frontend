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
  googleMapsLink: 'https://www.google.com/maps/dir//R.+Erhardt+Pauli,+221+-+Colonial,+S%C3%A3o+Bento+do+Sul+-+SC,+89288-040'
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.218556513437!2d-49.3813872!3d-26.2545307!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94de1103c8000001%3A0x67c063497d397686!2sR.%20Erhardt%20Pauli%2C%20221%20-%20Colonial%2C%20S%C3%A3o%20Bento%20do%20Sul%20-%20SC%2C%2089288-040!5e0!3m2!1spt-BR!2sbr!4v1707865000000!5m2!1spt-BR!2sbr"
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
* {
  box-sizing: border-box;
}

.location-page { background-color: #f8fafc; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Hero Section - PRETO E DOURADO COM TEXTURA */
.location-hero {
  background: #000000;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  padding: 60px 0 80px;
  position: relative;
  text-align: center;
  color: white;
}
.hero-pattern {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.15; 
  background-image: radial-gradient(#64748b 0.8px, transparent 0.8px);
  background-size: 24px 24px;
}
.hero-inner { position: relative; z-index: 2; }
.gold-tag { color: #F6D001; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; }
.location-hero h1 { font-size: 2.5rem; font-weight: 900; margin: 10px 0 0; }
.location-hero h1 span { color: #F6D001; }

/* Layout Split */
.location-main { margin-top: -40px; padding-bottom: 60px; position: relative; z-index: 10; }

.split-layout {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 25px;
}

.contact-sidebar {
  background: white;
  padding: 35px;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  height: fit-content;
}

.brand-badge {
  background: #fef3c7; color: #b45309;
  padding: 4px 12px; border-radius: 4px;
  font-size: 0.7rem; font-weight: 900;
  display: inline-block; margin-bottom: 15px;
}

.contact-sidebar .title { font-size: 1.6rem; font-weight: 900; color: #0f172a; margin-bottom: 30px; }

.info-group { display: flex; flex-direction: column; gap: 25px; margin-bottom: 35px; }
.info-card { display: flex; gap: 15px; }
.icon-accent { color: #F6D001; flex-shrink: 0; }
.info-card label { display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #64748b; margin-bottom: 4px; }
.info-card span { display: block; color: #1e293b; font-weight: 600; font-size: 1rem; line-height: 1.4; }

.btn-gps-full {
  background: #000000; color: white; padding: 18px; border-radius: 12px;
  text-decoration: none; font-weight: 800; display: flex;
  align-items: center; justify-content: center; gap: 10px; 
  transition: all 0.3s ease;
  border-bottom: 4px solid #F6D001;
}
.btn-gps-full:hover { background: #F6D001; color: #000000; transform: translateY(-3px); }

/* Direita */
.visual-content { display: flex; flex-direction: column; gap: 25px; }

.image-box-modern {
  background: white; border-radius: 20px; overflow: hidden;
  border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  position: relative; line-height: 0;
}
.image-box-modern img { width: 100%; height: auto; display: block; max-height: 450px; object-fit: cover; }
.img-label {
  position: absolute; bottom: 20px; right: 20px;
  background: rgba(0, 0, 0, 0.75); color: white;
  padding: 8px 16px; border-radius: 50px; font-weight: 700;
  font-size: 0.75rem; display: flex; align-items: center; gap: 8px;
}

.map-box-modern {
  background: white; border-radius: 20px; overflow: hidden;
  border: 1px solid #e2e8f0; height: 350px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

@media (max-width: 992px) {
  .split-layout { grid-template-columns: 1fr; }
  .location-main { margin-top: -20px; }
}

@media (max-width: 480px) {
  .location-hero h1 { font-size: 1.8rem; }
  .contact-sidebar { padding: 25px; }
  .map-box-modern { height: 280px; }
}
</style>