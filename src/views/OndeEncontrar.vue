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
  googleMapsLink: 'https://www.google.com/maps/dir//Capital-X+Cons%C3%B3rcios+-+R.+Erhardt+Pauli,+221+-+Colonial,+S%C3%A3o+Bento+do+Sul+-+SC,+89288-040/@-26.2427814,-49.3739726,17z'
}
</script>

<template>
  <div class="location-page">
    <AppHeader />

    <section class="location-hero">
      <div class="hero-pattern"></div>
      <div class="container hero-inner">
        <span class="gold-tag">Nossa Sede</span>
        <h1>Onde nos <span>Encontrar</span></h1>
      </div>
    </section>

    <main class="location-main">
      <div class="container">
        <div class="mosaico-wrapper">
          
          <div class="mosaico-card card-img">
            <div class="image-box">
              <img src="/src/assets/imagens/encontrar.jpeg" alt="Fachada Capital X" />
              <div class="badge-office">
                <Camera :size="14" />
                <span>Sede Oficial</span>
              </div>
            </div>
          </div>

          <div class="mosaico-card card-info">
            <div class="gold-line"></div>
            <h2>Capital-X <br/> Consórcios</h2>
            
            <div class="info-list">
              <div class="info-row">
                <MapPin class="icon-gold" :size="20" />
                <p>{{ unidadePrincipal.endereco }} <br/> {{ unidadePrincipal.cidade }}</p>
              </div>
              
              <div class="info-row">
                <Clock class="icon-gold" :size="20" />
                <p>{{ unidadePrincipal.horario }}</p>
              </div>

              <div class="info-row">
                <Phone class="icon-gold" :size="20" />
                <p>{{ unidadePrincipal.telefone }}</p>
              </div>
            </div>

            <a :href="unidadePrincipal.googleMapsLink" target="_blank" class="btn-route">
              <Navigation :size="18" />
              Iniciar Rota no GPS
            </a>
          </div>

          <div class="mosaico-card card-map">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m12!1m3!1d3587.408479589136!2d-49.3739726!3d-26.2427814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94de16a989a0a805%3A0xed082427323a983b!2sCapital-X%20Cons%C3%B3rcios!5e0!3m2!1spt-BR!2sbr!4v1710000000000!5m2!1spt-BR!2sbr" 
              width="100%" 
              height="100%" 
              style="border:0;" 
              allowfullscreen="" 
              loading="lazy">
            </iframe>
          </div>

        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.location-page { background-color: #f1f5f9; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

.location-hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  padding: 60px 0 100px;
  position: relative;
  text-align: center;
  color: white;
}

.hero-pattern {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.05;
  background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 30px 30px;
}

.gold-tag {
  color: #F6D001;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 0.7rem;
  letter-spacing: 2px;
  background: rgba(246, 208, 1, 0.1);
  padding: 5px 15px;
  border-radius: 4px;
  margin-bottom: 15px;
  display: inline-block;
}

.location-hero h1 { font-size: 2.5rem; font-weight: 900; }
.location-hero h1 span { color: #F6D001; }

/* Mosaico Estilizado */
.location-main { margin-top: -60px; padding-bottom: 100px; position: relative; z-index: 10; }

.mosaico-wrapper {
  display: grid;
  grid-template-columns: 320px 1fr 380px;
  gap: 20px;
  align-items: start;
}

.mosaico-card {
  background: white;
  border-radius: 24px;
  box-shadow: 0 15px 35px -5px rgba(0,0,0,0.07);
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.8);
}

/* Card Imagem */
.image-box { position: relative; line-height: 0; }
.image-box img { width: 100%; height: auto; display: block; }
.badge-office {
  position: absolute; bottom: 15px; left: 15px;
  background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(4px);
  color: white; padding: 6px 14px; border-radius: 50px;
  display: flex; align-items: center; gap: 8px; font-size: 0.75rem; font-weight: 600;
}

/* Card Info */
.card-info { padding: 40px; min-height: 400px; display: flex; flex-direction: column; }
.gold-line { width: 40px; height: 5px; background: #F6D001; margin-bottom: 20px; border-radius: 10px; }
.card-info h2 { font-size: 1.8rem; font-weight: 900; color: #0f172a; margin-bottom: 35px; line-height: 1.2; }

.info-list { display: flex; flex-direction: column; gap: 25px; flex-grow: 1; }
.info-row { display: flex; gap: 15px; align-items: flex-start; }
.icon-gold { color: #F6D001; flex-shrink: 0; }
.info-row p { color: #64748b; font-size: 1rem; font-weight: 500; line-height: 1.5; }

.btn-route {
  margin-top: 30px; background: #1e3a8a; color: white; padding: 18px; 
  border-radius: 14px; text-decoration: none; font-weight: 800; 
  display: flex; align-items: center; justify-content: center; gap: 10px; 
  transition: all 0.3s;
}

.btn-route:hover { background: #F6D001; color: #1e3a8a; transform: translateY(-3px); }

/* Card Mapa */
.card-map { height: 450px; }

@media (max-width: 1100px) {
  .mosaico-wrapper { grid-template-columns: 1fr 1fr; }
  .card-img { display: none; }
}

@media (max-width: 768px) {
  .mosaico-wrapper { grid-template-columns: 1fr; }
  .card-map { height: 350px; }
  .card-info { padding: 30px; }
}
</style>