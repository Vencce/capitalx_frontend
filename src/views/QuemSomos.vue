<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { ShieldCheck, Target, Users } from 'lucide-vue-next'
</script>

<template>
  <div class="page-container">
    <AppHeader />

    <section class="hero-page">
      <div class="hero-content">
        <h1>Sua Parceira em <span class="highlight">Conquistas</span></h1>
        <p>A Capital X Invest é referência em cartas contempladas, unindo quem quer vender com quem sonha em comprar.</p>
      </div>
    </section>

    <main class="content-wrapper">
      <div class="about-grid">
        <div class="text-block">
          <h2>Sobre Nós</h2>
          <div class="divider"></div>
          <p>
            Fundada com o objetivo de desburocratizar o acesso ao crédito, a <strong>Capital X Invest</strong> se especializou na intermediação de cotas de consórcio contempladas.
          </p>
          <p>
            Entendemos que o tempo é valioso. Por isso, oferecemos um atalho seguro para quem deseja adquirir bens (imóveis e veículos) sem esperar pelos sorteios tradicionais ou pagar os juros abusivos dos financiamentos bancários.
          </p>
        </div>
        <div class="image-block">
          <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Equipe" />
        </div>
      </div>

      <section class="values-section">
        <div class="value-card">
          <div class="icon-box"><ShieldCheck :size="32" /></div>
          <h3>Segurança</h3>
          <p>Todas as cartas passam por uma rigorosa auditoria jurídica antes de serem ofertadas.</p>
        </div>
        <div class="value-card">
          <div class="icon-box"><Target :size="32" /></div>
          <h3>Agilidade</h3>
          <p>Processo de transferência otimizado para que você acesse seu crédito o mais rápido possível.</p>
        </div>
        <div class="value-card">
          <div class="icon-box"><Users :size="32" /></div>
          <h3>Transparência</h3>
          <p>Sem letras miúdas. Você sabe exatamente quanto vai pagar e quais são as regras do banco.</p>
        </div>
      </section>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.page-container { background: #f8fafc; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }

.hero-page {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%);
  color: white; padding: 100px 20px; text-align: center;
}
.hero-content h1 { font-size: 2.8rem; font-weight: 800; margin-bottom: 20px; letter-spacing: -1px; }
.highlight { color: #F6D001; position: relative; display: inline-block; }
/* Sublinhado estilizado no título */
.highlight::after { content: ''; position: absolute; width: 100%; height: 6px; bottom: 5px; left: 0; background: rgba(246, 208, 1, 0.2); z-index: -1; }

.hero-content p { font-size: 1.2rem; opacity: 0.9; max-width: 700px; margin: 0 auto; color: #cbd5e1; }

.content-wrapper { max-width: 1100px; margin: 0 auto; padding: 80px 20px; }

.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; margin-bottom: 100px; }
.text-block h2 { color: #1e293b; font-size: 2.2rem; font-weight: 800; margin-bottom: 10px; }
.divider { width: 60px; height: 4px; background: #F6D001; margin-bottom: 30px; border-radius: 2px; }
.text-block p { color: #475569; line-height: 1.8; margin-bottom: 20px; font-size: 1.05rem; }
.image-block img { width: 100%; border-radius: 20px; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15); }

.values-section { display: grid; grid-template-columns: repeat(3, 1fr); gap: 30px; }
.value-card { background: white; padding: 40px 30px; border-radius: 16px; text-align: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); transition: transform 0.3s; border-top: 4px solid transparent; }
.value-card:hover { transform: translateY(-10px); border-top-color: #F6D001; box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1); }

/* ÍCONES AMARELOS */
.icon-box { 
  background: #FFFBEB; color: #1e293b; /* Fundo creme, ícone escuro */
  width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 25px; 
  box-shadow: 0 0 0 8px #f8fafc; /* Efeito de anel */
  color: #F6D001; /* Ícone Amarelo */
}
.value-card h3 { color: #1e293b; margin-bottom: 15px; font-size: 1.25rem; }
.value-card p { color: #64748b; font-size: 0.95rem; line-height: 1.6; }

@media (max-width: 900px) {
  .about-grid { grid-template-columns: 1fr; text-align: center; }
  .divider { margin: 0 auto 30px; }
  .values-section { grid-template-columns: 1fr; }
}
</style>