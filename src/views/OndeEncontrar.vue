<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { MapPin, Phone, Mail, Clock, Navigation, Camera } from 'lucide-vue-next'

const unidadePrincipal = {
  nome: 'Capital-X Consórcios',
  endereco: 'R. Erhardt Pauli, 221 - Colonial',
  cidade: 'São Bento do Sul - SC',
  cep: '89288-040',
  telefone: '(47) 3170-3656',
  email: 'contato@capitalxinvest.com.br',
  horario: 'Segunda a Sexta: 08:30 às 17:30',
  googleMapsLink: 'https://www.google.com/maps/search/?api=1&query=Capital-X+Consórcios&query_place_id=ChIJBagipaXV3ZQRO5g6YjcEoOc'
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
        <p>Visite nossa sede em São Bento do Sul e receba uma consultoria personalizada.</p>
      </div>
    </section>

    <main class="location-main">
      <div class="container">
        
        <section class="office-preview">
          <div class="image-card">
            <div class="image-wrapper">
              <img src="/src/assets/imagens/encontrar.jpeg" alt="Fachada Capital X Consórcios" class="office-img" />
              <div class="image-overlay">
                <Camera :size="24" />
                <span>Nossa Sede em São Bento do Sul</span>
              </div>
            </div>
            <div class="image-caption">
              <p>Ambiente preparado para oferecer total conforto e segurança em suas negociações.</p>
            </div>
          </div>
        </section>

        <div class="location-grid">
          <div class="contact-info">
            <h2 class="section-title">Informações de Contato</h2>
            
            <div class="info-cards">
              <div class="info-item">
                <div class="info-icon"><MapPin :size="24" /></div>
                <div>
                  <h3>Endereço</h3>
                  <p>{{ unidadePrincipal.endereco }}</p>
                  <p>{{ unidadePrincipal.cidade }}</p>
                  <p>CEP: {{ unidadePrincipal.cep }}</p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon"><Clock :size="24" /></div>
                <div>
                  <h3>Horário de Atendimento</h3>
                  <p>{{ unidadePrincipal.horario }}</p>
                </div>
              </div>

              <div class="info-item">
                <div class="info-icon"><Phone :size="24" /></div>
                <div>
                  <h3>Telefone</h3>
                  <p>{{ unidadePrincipal.telefone }}</p>
                </div>
              </div>
            </div>

            <a :href="unidadePrincipal.googleMapsLink" target="_blank" class="btn-navigation">
              <Navigation :size="20" />
              Como Chegar pelo GPS
            </a>
          </div>

          <div class="map-container">
            <div class="map-wrapper">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.359286460113!2d-49.4055108237583!3d-26.2272302652136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94de16a5a8a92805%3A0xe7a00437623a983b!2sCapital-X%20Cons%C3%B3rcios!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
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
.location-page { background-color: #f4f7f9; min-height: 100vh; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }

.location-hero {
  background: #0f172a;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  padding: 100px 0 120px;
  position: relative;
  overflow: hidden;
  text-align: center;
  color: white;
}

.hero-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: 1;
}

.hero-inner { position: relative; z-index: 2; }

.gold-tag {
  color: #F6D001;
  text-transform: uppercase;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 2px;
  border: 1px solid #F6D001;
  padding: 6px 16px;
  border-radius: 4px;
  display: inline-block;
  margin-bottom: 20px;
}

.location-hero h1 { font-size: clamp(2.5rem, 6vw, 3.5rem); font-weight: 900; margin-bottom: 15px; }
.location-hero h1 span { color: #F6D001; }
.location-hero p { font-size: 1.15rem; max-width: 600px; margin: 0 auto; opacity: 0.9; }

.office-preview { margin-top: -60px; margin-bottom: 60px; position: relative; z-index: 10; }
.image-card { background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
.image-wrapper { position: relative; height: 450px; width: 100%; }
.office-img { width: 100%; height: 100%; object-fit: cover; }
.image-overlay { position: absolute; bottom: 20px; left: 20px; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(5px); color: white; padding: 10px 20px; border-radius: 50px; display: flex; align-items: center; gap: 10px; font-weight: 600; font-size: 0.9rem; }
.image-caption { padding: 20px 30px; background: #f8fafc; text-align: center; color: #64748b; font-weight: 500; }

.location-main { padding-bottom: 100px; }
.location-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 50px; }

.section-title { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-bottom: 30px; }

.info-cards { display: flex; flex-direction: column; gap: 25px; margin-bottom: 40px; }
.info-item { display: flex; gap: 20px; }
.info-icon { width: 50px; height: 50px; background: white; color: #1e3a8a; border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); flex-shrink: 0; border-bottom: 3px solid #F6D001; }

.info-item h3 { font-size: 1.1rem; font-weight: 800; color: #0f172a; margin-bottom: 5px; }
.info-item p { color: #64748b; line-height: 1.5; }

.btn-navigation { background: #0f172a; color: white; padding: 18px 30px; border-radius: 8px; text-decoration: none; font-weight: 800; display: inline-flex; align-items: center; gap: 12px; transition: all 0.3s; }
.btn-navigation:hover { background: #F6D001; color: #0f172a; transform: translateY(-3px); }

.map-container { min-height: 450px; }
.map-wrapper { width: 100%; height: 100%; border-radius: 24px; overflow: hidden; border: 4px solid white; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); }

@media (max-width: 992px) {
  .location-grid { grid-template-columns: 1fr; }
  .image-wrapper { height: 300px; }
}
</style>