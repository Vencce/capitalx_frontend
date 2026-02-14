<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { Target, ShieldCheck, TrendingUp, Clock } from 'lucide-vue-next'
</script>

<template>
  <div class="about-page">
    <AppHeader />

    <section class="about-hero">
      <div class="hero-pattern"></div>
      <div class="container">
        <div class="hero-content">
          <span class="gold-tag">Excelência em Crédito</span>
          <h1>Sobre a <span>Capital X</span></h1>
          <p>Transformando planejamento financeiro em crescimento patrimonial e oportunidades reais.</p>
        </div>
      </div>
    </section>

    <main class="about-main">
      <div class="container">
        <section class="about-intro">
          <div class="intro-grid">
            <div class="intro-text">
              <h2 class="section-title">Nossa História</h2>
              <p>
                Fundada com o objetivo de conectar clientes às melhores soluções de crédito, a 
                <strong>Capital X Consórcios</strong> se especializou em crédito imobiliário e mobiliário, 
                atuando por meio de diferentes estratégias como cartas contempladas, home equity, 
                fundos financiadores e modelos de investimento seguros e de alto rendimento.
              </p>
              <p>
                Entendemos que <strong>tempo é dinheiro</strong>. Por isso, desenvolvemos soluções que permitem a 
                liberação de crédito de forma estratégica, atendendo quem busca a aquisição de imóveis, 
                veículos ou construção, sem a necessidade de aguardar longos prazos.
              </p>
            </div>
            <div class="intro-stats">
              <div class="stat-card">
                <Clock class="stat-icon" :size="32" />
                <h3>Agilidade</h3>
                <p>Crédito liberado de forma estratégica, sem esperas tradicionais.</p>
              </div>
              <div class="stat-card gold-border">
                <TrendingUp class="stat-icon" :size="32" />
                <h3>Rentabilidade</h3>
                <p>Modelos de investimento focados em alto rendimento seguro.</p>
              </div>
            </div>
          </div>
        </section>

        <section class="about-values">
          <h2 class="section-title text-center">Nosso Compromisso</h2>
          <div class="values-grid">
            <div class="value-card">
              <div class="value-icon">
                <Target :size="24" />
              </div>
              <h3>Soluções Personalizadas</h3>
              <p>Cada cliente possui um objetivo. Criamos a estratégia ideal para a sua necessidade específica.</p>
            </div>
            <div class="value-card">
              <div class="value-icon">
                <ShieldCheck :size="24" />
              </div>
              <h3>Segurança Jurídica</h3>
              <p>Operações transparentes e acompanhadas por especialistas em todas as etapas do processo.</p>
            </div>
            <div class="value-card">
              <div class="value-icon">
                <TrendingUp :size="24" />
              </div>
              <h3>Crescimento Patrimonial</h3>
              <p>Transformamos o acesso ao crédito em uma ferramenta poderosa de expansão de bens.</p>
            </div>
          </div>
        </section>

        <section class="about-cta">
          <div class="cta-inner">
            <div class="cta-text">
              <h2>Pronto para o próximo passo?</h2>
              <p>Deixe nosso time de especialistas planejar sua próxima conquista.</p>
            </div>
            <router-link to="/" class="btn-cta-gold">
              Ver Cartas Disponíveis
            </router-link>
          </div>
        </section>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.about-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section - PRETO E DOURADO COM TEXTURA */
.about-hero {
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

.about-hero h1 {
  font-size: clamp(2.2rem, 6vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 15px;
}

.about-hero h1 span {
  color: #F6D001;
}

.about-hero p {
  font-size: 1.15rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
  color: #e2e8f0;
}

/* Main Content - FUNDO CLARO PARA LEITURA */
.about-main {
  padding: 80px 0;
  background-color: #f8fafc;
}

.intro-grid {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 100px;
}

.section-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 25px;
  position: relative;
}

.section-title::after {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  background: #F6D001;
  margin-top: 10px;
}

.text-center.section-title::after { margin: 10px auto; }

.intro-text p {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #334155;
  margin-bottom: 20px;
}

.intro-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
  border-left: 4px solid #0f172a;
}

.stat-card.gold-border {
  border-left-color: #F6D001;
}

.stat-icon {
  color: #F6D001;
  margin-bottom: 15px;
}

.stat-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 10px;
}

.stat-card p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
}

/* Values Grid */
.values-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-top: 40px;
  margin-bottom: 100px;
}

.value-card {
  background: white;
  padding: 40px 30px;
  border-radius: 12px;
  text-align: center;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
}

.value-card:hover {
  transform: translateY(-5px);
  border-color: #F6D001;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
}

.value-icon {
  width: 50px;
  height: 50px;
  background: #fffbeb;
  color: #0f172a;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.value-card h3 {
  font-size: 1.1rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 15px;
}

.value-card p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.6;
}

/* CTA - PRETO E DOURADO */
.about-cta {
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
  justify-content: center;
  gap: 12px;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-cta-gold:hover {
  background: #ffffff;
  transform: scale(1.05);
}

/* --- MEDIA QUERIES --- */

@media (max-width: 1024px) {
  .intro-grid {
    gap: 40px;
  }
  .values-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .about-hero {
    padding: 60px 0;
  }
  .about-main {
    padding: 40px 0;
  }
  .intro-grid {
    grid-template-columns: 1fr;
    gap: 40px;
    margin-bottom: 60px;
  }
  .values-grid {
    grid-template-columns: 1fr;
    margin-bottom: 60px;
  }
  .cta-inner {
    flex-direction: column;
    text-align: center;
    padding: 40px 20px;
    gap: 30px;
  }
  .cta-text h2 {
    font-size: 1.5rem;
  }
  .btn-cta-gold {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .about-hero h1 {
    font-size: 1.8rem;
  }
  .about-hero p {
    font-size: 1rem;
  }
  .section-title {
    font-size: 1.6rem;
  }
  .intro-text p {
    font-size: 1rem;
  }
  .stat-card {
    padding: 20px;
  }
  .value-card {
    padding: 30px 20px;
  }
}
</style>