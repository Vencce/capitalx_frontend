<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { MapPin, Phone, Clock, Navigation, Camera } from 'lucide-vue-next'

const unidadePrincipal = {
  nome: 'Capital-X Consórcios',
  endereco: 'R. Erhardt Pauli, 221 - Colonial',
  cidade: 'São Bento do Sul - SC',
  cep: '89288-040',
  telefone: '(47) 3170-3656',
  horario: 'Segunda a Sexta: 08:30 às 17:30',
  // Link direto para abertura no aplicativo de GPS
  googleMapsLink: 'https://www.google.com/maps/dir//Capital-X+Cons%C3%B3rcios+-+R.+Erhardt+Pauli,+221+-+Colonial,+S%C3%A3o+Bento+do+Sul+-+SC,+89288-040/@-26.2415128,-49.378902,17z/'
}
</script>

<template>
  <div class="location-page">
    <AppHeader />

    <section class="location-hero">
      <div class="hero-pattern"></div>
      <div class="container hero-inner">
        <span class="gold-tag">Atendimento Presencial</span>
        <h1>Onde nos <span>Encontrar</span></h1>
        <p>Visite nossa sede em São Bento do Sul e receba uma consultoria especializada.</p>
      </div>
    </section>

    <main class="location-main">
      <div class="container">
        <div class="mosaico-grid">
          
          <div class="mosaico-card image-area">
            <div class="image-wrapper">
              <img src="/src/assets/imagens/encontrar.jpeg" alt="Sede Capital X" />
              <div class="badge-overlay">
                <Camera :size="16" />
                <span>Sede Oficial</span>
              </div>
            </div>
          </div>

          <div class="mosaico-card info-area">
            <div class="accent-line"></div>
            <h2>Capital-X Consórcios</h2>
            
            <div class="details-list">
              <div class="detail-item">
                <MapPin class="icon" :size="20" />
                <p>{{ unidadePrincipal.endereco }}<br>{{ unidadePrincipal.cidade }}</p>
              </div>
              <div class="detail-item">
                <Clock class="icon" :size="20" />
                <p>{{ unidadePrincipal.horario }}</p>
              </div>
              <div class="detail-item">
                <Phone class="icon" :size="20" />
                <p>{{ unidadePrincipal.telefone }}</p>
              </div>
            </div>

            <a :href="unidadePrincipal.googleMapsLink" target="_blank" class="btn-gps-action">
              <Navigation :size="20" />
              Como Chegar pelo GPS
            </a>
          </div>

          <div class="mosaico-card map-area">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m13!1m1!1s0x94de16a5a9a46809:0xec900424363a983b!2m2!1d-49.378902!2d-26.2415128!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94de16a5a9a46809%3A0xec900424363a983b!2sCapital-X%20Cons%C3%B3rcios!5e0!3m2!1spt-BR!2sbr!4v1707160000000!5m2!1spt-BR!2sbr" 
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
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.location-page { background-color: #f8fafc; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

/* Hero Section Identidade Capital X */
.location-hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  padding: 80px 0 100px;
  position: relative;
  text-align: center;
  color: white;
  overflow: hidden;
}

.hero-pattern {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.05;
  background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 30px 30px;
}

.hero-inner { position: relative; z-index: 2; }

.gold-tag {
  color: #F6D001;
  border: 1px solid rgba(246, 208, 1, 0.4);
  padding: 5px 15px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 20px;
  display: inline-block;
}

.location-hero h1 { font-size: 3rem; font-weight: 900; margin-bottom: 10px; }
.location-hero h1 span { color: #F6D001; }
.location-hero p { opacity: 0.8; font-size: 1.1rem; }

/* Mosaico Moderno */
.location-main { margin-top: -50px; padding-bottom: 80px; position: relative; z-index: 10; }

.mosaico-grid {
  display: grid;
  grid-template-columns: 350px 1fr 400px;
  gap: 20px;
  align-items: stretch;
}

.mosaico-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

/* Área da Imagem */
.image-wrapper { position: relative; height: 100%; min-height: 400px; background: #0f172a; }
.image-wrapper img { width: 100%; height: 100%; object-fit: cover; }
.badge-overlay {
  position: absolute; bottom: 20px; left: 20px;
  background: rgba(15, 23, 42, 0.85); color: white;
  padding: 8px 16px; border-radius: 50px;
  display: flex; align-items: center; gap: 8px; font-size: 0.8rem;
}

/* Área de Informações */
.info-area { padding: 40px; display: flex; flex-direction: column; justify-content: center; }
.accent-line { width: 40px; height: 5px; background: #F6D001; border-radius: 10px; margin-bottom: 20px; }
.info-area h2 { font-size: 1.8rem; font-weight: 900; color: #1e3a8a; margin-bottom: 30px; }

.details-list { display: flex; flex-direction: column; gap: 25px; margin-bottom: 35px; }
.detail-item { display: flex; gap: 15px; align-items: flex-start; }
.detail-item .icon { color: #F6D001; flex-shrink: 0; }
.detail-item p { color: #64748b; font-size: 1rem; line-height: 1.5; font-weight: 500; }

.btn-gps-action {
  background: #1e3a8a; color: white; border: none; padding: 18px;
  border-radius: 12px; font-weight: 800; text-decoration: none;
  display: flex; align-items: center; justify-content: center; gap: 12px;
  transition: all 0.3s ease;
}

.btn-gps-action:hover { background: #F6D001; color: #1e3a8a; transform: translateY(-3px); }

/* Área do Mapa */
.map-area { min-height: 400px; }

@media (max-width: 1150px) {
  .mosaico-grid { grid-template-columns: 1fr 1fr; }
  .image-area { display: none; } /* Oculta a foto em tablets para priorizar info/mapa */
}

@media (max-width: 768px) {
  .mosaico-grid { grid-template-columns: 1fr; }
  .location-hero h1 { font-size: 2.2rem; }
  .info-area { padding: 30px; }
}
</style>