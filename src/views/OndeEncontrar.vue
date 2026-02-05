<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { MapPin, Phone, Clock, Navigation, Camera, Globe } from 'lucide-vue-next'

const unidadePrincipal = {
  nome: 'Capital-X Consórcios',
  endereco: 'R. Erhardt Pauli, 221 - Colonial',
  cidade: 'São Bento do Sul - SC',
  cep: '89288-040',
  telefone: '(47) 3170-3656',
  email: 'contato@capitalxinvest.com.br',
  horario: 'Segunda a Sexta: 08:30 às 17:30',
  googleMapsLink: 'https://www.google.com/maps/dir/?api=1&destination=-26.2415,-49.3815'
}
</script>

<template>
  <div class="location-page">
    <AppHeader />

    <section class="location-hero">
      <div class="hero-pattern"></div>
      <div class="container hero-inner">
        <span class="gold-tag">Contato & Localização</span>
        <h1>Onde nos <span>Encontrar</span></h1>
      </div>
    </section>

    <main class="location-main">
      <div class="container">
        <div class="main-mosaico">
          
          <div class="side-card office-image">
            <div class="image-container">
              <img src="/src/assets/imagens/encontrar.jpeg" alt="Sede Capital X" />
              <div class="img-badge">
                <Camera :size="16" />
                Sede Oficial
              </div>
            </div>
          </div>

          <div class="side-card info-content">
            <div class="info-header">
              <div class="brand-line"></div>
              <h2>Capital-X Consórcios</h2>
            </div>
            
            <div class="contact-list">
              <div class="contact-item">
                <MapPin class="c-icon" :size="20" />
                <div>
                  <p>{{ unidadePrincipal.endereco }}</p>
                  <p>{{ unidadePrincipal.cidade }}</p>
                </div>
              </div>

              <div class="contact-item">
                <Clock class="c-icon" :size="20" />
                <p>{{ unidadePrincipal.horario }}</p>
              </div>

              <div class="contact-item">
                <Phone class="c-icon" :size="20" />
                <p>{{ unidadePrincipal.telefone }}</p>
              </div>
            </div>

            <a :href="unidadePrincipal.googleMapsLink" target="_blank" class="btn-gps">
              <Navigation :size="18" />
              Iniciar Rota no GPS
            </a>
          </div>

          <div class="side-card map-box">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.356345862083!2d-49.38374242371999!3d-26.24194096594247!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94de15a489a26105%3A0x27a00437623a983b!2sR.%20Erhardt%20Pauli%2C%20221%20-%20Colonial%2C%20S%C3%A3o%20Bento%20do%20Sul%20-%20SC%2C%2089288-040!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
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
.location-page { background-color: #f8fafc; min-height: 100vh; }
.container { max-width: 1300px; margin: 0 auto; padding: 0 20px; }

/* Hero Compacto para não empurrar o conteúdo para baixo */
.location-hero {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  padding: 60px 0 80px;
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
  font-size: 0.75rem;
  letter-spacing: 2px;
  border: 1px solid rgba(246, 208, 1, 0.3);
  padding: 4px 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  display: inline-block;
}

.location-hero h1 { font-size: 2.5rem; font-weight: 900; }
.location-hero h1 span { color: #F6D001; }

/* Mosaico Principal */
.location-main { margin-top: -40px; padding-bottom: 80px; position: relative; z-index: 10; }

.main-mosaico {
  display: grid;
  grid-template-columns: 350px 1fr 400px;
  gap: 20px;
  align-items: stretch;
}

.side-card {
  background: white;
  border-radius: 20px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05);
  overflow: hidden;
}

/* Coluna Imagem */
.image-container { position: relative; height: 100%; min-height: 350px; }
.image-container img { width: 100%; height: 100%; object-fit: cover; }
.img-badge {
  position: absolute; bottom: 15px; left: 15px;
  background: rgba(15, 23, 42, 0.85); color: white;
  padding: 6px 12px; border-radius: 8px; font-size: 0.75rem;
  display: flex; align-items: center; gap: 6px;
}

/* Coluna Info */
.info-content { padding: 40px; display: flex; flex-direction: column; justify-content: center; }
.brand-line { width: 40px; height: 4px; background: #F6D001; margin-bottom: 15px; }
.info-content h2 { font-size: 1.5rem; font-weight: 900; color: #0f172a; margin-bottom: 30px; }

.contact-list { display: flex; flex-direction: column; gap: 25px; margin-bottom: 35px; }
.contact-item { display: flex; gap: 15px; align-items: flex-start; }
.c-icon { color: #F6D001; flex-shrink: 0; margin-top: 3px; }
.contact-item p { color: #64748b; line-height: 1.5; font-size: 0.95rem; font-weight: 500; }

.btn-gps {
  background: #1e3a8a; color: white; padding: 15px 25px; border-radius: 12px;
  text-decoration: none; font-weight: 800; display: inline-flex;
  align-items: center; justify-content: center; gap: 10px; transition: all 0.3s;
}

.btn-gps:hover { background: #F6D001; color: #1e3a8a; transform: translateY(-3px); }

/* Coluna Mapa */
.map-box { min-height: 350px; }

@media (max-width: 1200px) {
  .main-mosaico { grid-template-columns: 1fr 1fr; }
  .office-image { display: none; } /* Esconde a foto em tablets para focar no mapa/info */
}

@media (max-width: 768px) {
  .main-mosaico { grid-template-columns: 1fr; }
  .location-hero h1 { font-size: 2rem; }
  .info-content { padding: 30px; }
}
</style>