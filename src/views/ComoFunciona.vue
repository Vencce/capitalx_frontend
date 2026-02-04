<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { Search, FileText, RefreshCw, CheckCircle } from 'lucide-vue-next'
</script>

<template>
  <div class="page-container">
    <AppHeader />

    <section class="hero-simple">
      <h1>Como Funciona</h1>
      <p>Entenda o passo a passo para adquirir sua carta contemplada com segurança.</p>
    </section>

    <main class="steps-wrapper">
      <div class="step-card">
        <div class="step-number">1</div>
        <div class="step-icon"><Search :size="32" /></div>
        <h3>Escolha</h3>
        <p>Navegue pelo nosso catálogo e encontre a carta de crédito ideal para o seu objetivo.</p>
      </div>

      <div class="step-arrow">➜</div>

      <div class="step-card">
        <div class="step-number">2</div>
        <div class="step-icon"><FileText :size="32" /></div>
        <h3>Análise</h3>
        <p>A administradora fará uma análise do seu perfil. Nós cuidamos de toda a burocracia.</p>
      </div>

      <div class="step-arrow">➜</div>

      <div class="step-card">
        <div class="step-number">3</div>
        <div class="step-icon"><RefreshCw :size="32" /></div>
        <h3>Transferência</h3>
        <p>Aprovado o cadastro, oficializamos a transferência da titularidade para o seu nome.</p>
      </div>

      <div class="step-arrow">➜</div>

      <div class="step-card">
        <div class="step-number">4</div>
        <div class="step-icon"><CheckCircle :size="32" /></div>
        <h3>Uso</h3>
        <p>Pronto! O crédito fica disponível imediatamente para você comprar seu bem.</p>
      </div>
    </main>

    <section class="faq-section">
      <h2>Dúvidas Frequentes</h2>
      <div class="faq-grid">
        <div class="faq-item">
          <h4>É seguro comprar carta contemplada?</h4>
          <p>Sim! Todo o processo é feito com a anuência da administradora do consórcio.</p>
        </div>
        <div class="faq-item">
          <h4>Posso usar para comprar qualquer bem?</h4>
          <p>Sim, respeitando a categoria (imóvel para imóveis, automóvel para veículos).</p>
        </div>
      </div>
    </section>

    <AppFooter />
  </div>
</template>

<style scoped>
.page-container { background: #f8fafc; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }

.hero-simple { 
  text-align: center; padding: 80px 20px; background: white; border-bottom: 1px solid #e2e8f0; 
}
.hero-simple h1 { color: #1e3a8a; font-size: 2.5rem; font-weight: 800; margin-bottom: 10px; }
.hero-simple p { color: #64748b; font-size: 1.1rem; }

.steps-wrapper { 
  display: flex; align-items: flex-start; justify-content: center; gap: 30px; 
  max-width: 1200px; margin: 80px auto; padding: 0 20px; flex-wrap: wrap; 
}

.step-card { 
  background: white; padding: 40px 20px; border-radius: 16px; width: 240px; text-align: center; 
  box-shadow: 0 10px 20px -5px rgba(0,0,0,0.05); position: relative; border: 1px solid #f1f5f9; 
  transition: transform 0.3s;
}
.step-card:hover { transform: translateY(-5px); border-color: #F6D001; }

/* NÚMERO AMARELO */
.step-number { 
  position: absolute; top: -20px; left: 50%; transform: translateX(-50%); 
  background: #F6D001; color: #1e293b; /* Amarelo com texto escuro */
  width: 40px; height: 40px; border-radius: 50%; 
  display: flex; align-items: center; justify-content: center; 
  font-weight: 800; font-size: 1.2rem;
  box-shadow: 0 4px 6px rgba(246, 208, 1, 0.3);
  border: 4px solid #f8fafc; /* Borda para separar do fundo */
}

.step-icon { color: #1e3a8a; margin: 10px 0 20px; }
.step-card h3 { color: #1e293b; font-size: 1.1rem; margin-bottom: 10px; font-weight: 700; }
.step-card p { color: #64748b; font-size: 0.9rem; line-height: 1.5; }

.step-arrow { font-size: 2rem; color: #cbd5e1; align-self: center; }

.faq-section { max-width: 800px; margin: 0 auto 100px; padding: 0 20px; }
.faq-section h2 { text-align: center; color: #1e3a8a; margin-bottom: 40px; font-size: 2rem; }
.faq-grid { display: grid; gap: 20px; }
.faq-item { 
  background: white; padding: 25px; border-radius: 12px; 
  border-left: 4px solid #F6D001; /* Detalhe amarelo */
  box-shadow: 0 2px 4px rgba(0,0,0,0.02); 
}
.faq-item h4 { margin-bottom: 8px; color: #1e293b; font-size: 1.1rem; }
.faq-item p { color: #475569; font-size: 0.95rem; margin: 0; line-height: 1.6; }

@media (max-width: 900px) {
  .steps-wrapper { flex-direction: column; align-items: center; }
  .step-arrow { transform: rotate(90deg); margin: 10px 0; }
  .step-card { width: 100%; max-width: 350px; }
}
</style>