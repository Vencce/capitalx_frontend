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
  googleMapsLink: 'https://www.google.com/maps/dir//Capital-X+Cons%C3%B3rcios,+R.+Erhardt+Pauli,+221+-+Colonial,+S%C3%A3o+Bento+do+Sul+-+SC,+89288-040/@-26.241517,-49.4047545,17z'
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
            <p class="subtitle">Visite-nos para uma consultoria exclusiva e personalizada.</p>

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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3587.3190822646675!2d-49.40732942459427!3d-26.241512165997277!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94de15a689a16205%3A0x27a00437363a983b!2sCapital-X%20Cons%C3%B3rcios!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr" 
                width="100%" 
                height="100%" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy">
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

/* Hero */
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
  opacity: 0.05; background-image: radial-gradient(#ffffff 1px, transparent 1px);
  background-size: 30px 30px;
}
.hero-inner { position: relative; z-index: 2; }
.gold-tag { color: #F6D001; font-weight: 800; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 2px; }
.location-hero h1 { font-size: 2.5rem; font-weight: 900; }
.location-hero h1 span { color: #F6D001; }

/* Layout Split */
.location-main { margin-top: -40px; padding-bottom: 80px; position: relative; z-index: 10; }

.split-layout {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 30px;
}

/* Sidebar Esquerda */
.contact-sidebar {
  background: white;
  padding: 40px;
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

.brand-badge {
  background: #fef3c7; color: #b45309;
  padding: 4px 12px; border-radius: 6px;
  font-size: 0.7rem; font-weight: 900;
  display: inline-block; margin-bottom: 15px;
}

.contact-sidebar .title { font-size: 1.8rem; font-weight: 900; color: #1e3a8a; margin-bottom: 10px; }
.contact-sidebar .subtitle { color: #64748b; font-size: 0.95rem; margin-bottom: 35px; line-height: 1.5; }

.info-group { display: flex; flex-direction: column; gap: 25px; margin-bottom: 40px; }
.info-card { display: flex; gap: 15px; }
.icon-accent { color: #F6D001; flex-shrink: 0; }
.info-card label { display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 800; color: #94a3b8; margin-bottom: 4px; }
.info-card span { display: block; color: #1e293b; font-weight: 600; font-size: 1rem; line-height: 1.4; }

.btn-gps-full {
  background: #1e3a8a; color: white; padding: 18px; border-radius: 12px;
  text-decoration: none; font-weight: 800; display: flex;
  align-items: center; justify-content: center; gap: 10px; transition: 0.3s;
}
.btn-gps-full:hover { background: #F6D001; color: #1e3a8a; transform: translateY(-3px); }

/* Conteúdo Visual Direita */
.visual-content { display: flex; flex-direction: column; gap: 25px; }

.image-box-modern {
  background: white; border-radius: 24px; overflow: hidden;
  border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  position: relative; line-height: 0;
}
.image-box-modern img { width: 100%; height: auto; display: block; max-height: 450px; object-fit: cover; }
.img-label {
  position: absolute; top: 20px; right: 20px;
  background: rgba(255, 255, 255, 0.9); color: #1e3a8a;
  padding: 8px 16px; border-radius: 50px; font-weight: 800;
  font-size: 0.75rem; display: flex; align-items: center; gap: 8px;
}

.map-box-modern {
  background: white; border-radius: 24px; overflow: hidden;
  border: 1px solid #e2e8f0; height: 350px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

@media (max-width: 992px) {
  .split-layout { grid-template-columns: 1fr; }
  .contact-sidebar { order: 2; }
  .visual-content { order: 1; }
}
</style>