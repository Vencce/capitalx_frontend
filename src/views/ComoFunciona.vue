<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { Search, FileCheck, RefreshCw, Key, ArrowRight } from 'lucide-vue-next'

const passos = [
  {
    icon: Search,
    titulo: 'Escolha seu Crédito',
    descricao: 'Navegue em nosso estoque e encontre a carta contemplada que melhor se adapta ao seu objetivo, seja imóvel ou veículo.'
  },
  {
    icon: FileCheck,
    titulo: 'Análise e Reserva',
    descricao: 'Nossa equipe realiza a análise do seu perfil e reserva a cota escolhida enquanto validamos a documentação necessária.'
  },
  {
    icon: RefreshCw,
    titulo: 'Transferência da Cota',
    descricao: 'Realizamos todo o trâmite formal de transferência da titularidade da cota junto à administradora do consórcio com total segurança.'
  },
  {
    icon: Key,
    titulo: 'Liberação do Crédito',
    descricao: 'Com a transferência aprovada, o crédito fica disponível para você adquirir seu bem à vista, com total poder de negociação.'
  }
]
</script>

<template>
  <div class="process-page">
    <AppHeader />

    <section class="process-hero">
      <div class="hero-pattern"></div>
      <div class="container">
        <div class="hero-content">
          <span class="gold-tag">Passo a Passo</span>
          <h1>Como <span>Funciona?</span></h1>
          <p>Entenda como a Capital X simplifica o acesso ao crédito contemplado para você realizar seus projetos hoje.</p>
        </div>
      </div>
    </section>

    <main class="process-main">
      <div class="container">
        <div class="steps-grid">
          <div v-for="(passo, index) in passos" :key="index" class="step-card">
            <div class="step-number">0{{ index + 1 }}</div>
            <div class="step-icon-box">
              <component :is="passo.icon" :size="32" />
            </div>
            <h3>{{ passo.titulo }}</h3>
            <p>{{ passo.descricao }}</p>
            <div v-if="index < passos.length - 1" class="step-arrow">
              <ArrowRight :size="20" />
            </div>
          </div>
        </div>

        <section class="comparison-section">
          <div class="comparison-card">
            <div class="comp-header">
              <h2>Por que escolher uma Carta Contemplada?</h2>
              <div class="divider"></div>
            </div>
            <div class="comp-grid">
              <div class="comp-item">
                <div class="check-icon">✓</div>
                <div>
                  <strong>Sem Juros de Financiamento</strong>
                  <p>Você paga apenas a taxa administrativa, economizando milhares de reais.</p>
                </div>
              </div>
              <div class="comp-item">
                <div class="check-icon">✓</div>
                <div>
                  <strong>Compra à Vista</strong>
                  <p>O crédito liberado permite negociar descontos agressivos com o vendedor do bem.</p>
                </div>
              </div>
              <div class="comp-item">
                <div class="check-icon">✓</div>
                <div>
                  <strong>Rapidez Estratégica</strong>
                  <p>Diferente do consórcio comum, você não precisa esperar sorteios ou dar lances altos.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="process-cta">
          <div class="cta-inner">
            <div class="cta-text">
              <h2>Pronto para começar?</h2>
              <p>Confira as cartas disponíveis agora ou fale com um consultor.</p>
            </div>
            <div class="cta-actions">
              <router-link to="/" class="btn-cta-gold">Ver Estoque</router-link>
            </div>
          </div>
        </section>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.process-page {
  background-color: #f8fafc;
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section - PRETO E DOURADO COM TEXTURA */
.process-hero {
  background: #000000;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  padding: 100px 0;
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
  opacity: 0.15;
  background-image: radial-gradient(#64748b 0.8px, transparent 0.8px);
  background-size: 24px 24px;
}

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

.process-hero h1 {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 15px;
}

.process-hero h1 span {
  color: #F6D001;
}

.process-hero p {
  font-size: 1.15rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
  padding: 0 10px;
  color: #e2e8f0;
}

/* Main Content - FUNDO CLARO PARA LEITURA */
.process-main {
  padding: 80px 0;
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
  margin-bottom: 100px;
  position: relative;
}

.step-card {
  background: white;
  padding: 40px 30px;
  border-radius: 16px;
  text-align: center;
  border: 1px solid #e2e8f0;
  position: relative;
  transition: transform 0.3s ease;
  height: 100%;
}

.step-card:hover {
  transform: translateY(-10px);
  border-color: #F6D001;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05);
}

.step-number {
  position: absolute;
  top: 15px;
  right: 20px;
  font-size: 1.5rem;
  font-weight: 900;
  color: #f1f5f9;
  z-index: 1;
}

.step-icon-box {
  width: 70px;
  height: 70px;
  background: #f8fafc;
  color: #000000;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 25px;
  position: relative;
  z-index: 2;
  border: 1px solid #e2e8f0;
}

.step-card:hover .step-icon-box {
  background: #F6D001;
  color: #000000;
  border-color: #F6D001;
}

.step-card h3 {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 15px;
}

.step-card p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
}

.step-arrow {
  position: absolute;
  right: -25px;
  top: 50%;
  transform: translateY(-50%);
  color: #F6D001;
  z-index: 3;
}

/* Comparison Section */
.comparison-section {
  margin-bottom: 80px;
}

.comparison-card {
  background: white;
  border-radius: 24px;
  padding: 60px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border-top: 6px solid #F6D001;
  width: 100%;
}

.comp-header {
  text-align: center;
  margin-bottom: 40px;
}

.comp-header h2 {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  color: #0f172a;
}

.divider {
  width: 60px;
  height: 4px;
  background: #F6D001;
  margin: 15px auto;
}

.comp-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 40px;
}

.comp-item {
  display: flex;
  gap: 15px;
}

.check-icon {
  width: 24px;
  height: 24px;
  background: #F6D001;
  color: #000000;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  flex-shrink: 0;
}

.comp-item strong {
  display: block;
  font-size: 1.1rem;
  color: #0f172a;
  margin-bottom: 8px;
}

.comp-item p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
}

/* CTA - PRETO E DOURADO */
.process-cta {
  margin-top: 40px;
}

.cta-inner {
  background: #000000;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  border-radius: 20px;
  padding: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  border-bottom: 5px solid #F6D001;
}

.cta-text h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.cta-text p {
  opacity: 0.8;
  font-size: 1.1rem;
}

.btn-cta-gold {
  background: #F6D001;
  color: #000000;
  border: none;
  padding: 18px 36px;
  border-radius: 8px;
  font-weight: 900;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s;
  font-size: 1rem;
  white-space: nowrap;
}

.btn-cta-gold:hover {
  background: #ffffff;
  transform: scale(1.05);
}

/* --- REGRAS DE RESPONSIVIDADE --- */

@media (max-width: 1024px) {
  .steps-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 20px;
  }
  .step-arrow { display: none; }
  .comp-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .process-main { padding: 40px 0; }
  .steps-grid { grid-template-columns: 1fr; }
  
  .cta-inner { 
    flex-direction: column; 
    text-align: center; 
    padding: 40px 20px; 
    gap: 30px; 
  }
  
  .comparison-card { padding: 30px 20px; }
  .comp-grid { grid-template-columns: 1fr; }
  
  .cta-text h2 { font-size: 1.5rem; }
}

@media (max-width: 490px) {
  .process-hero { padding: 60px 0; }
  .gold-tag { font-size: 0.7rem; padding: 4px 12px; }
  .step-card { padding: 30px 20px; }
  .step-number { font-size: 1.2rem; top: 10px; right: 15px; }
  .btn-cta-gold { 
    width: 100%; 
    justify-content: center; 
    padding: 15px;
  }
  .comp-header h2 { font-size: 1.3rem; }
}
</style>