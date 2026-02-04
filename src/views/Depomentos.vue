<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { Quote } from 'lucide-vue-next'
</script>

<template>
  <div class="page-container">
    <AppHeader />

    <section class="hero-simple">
      <h1>O que dizem nossos clientes</h1>
      <p>Histórias reais de quem realizou sonhos com a Capital X Invest.</p>
    </section>

    <div class="testimonials-grid">
      <div class="testimonial-card">
        <Quote class="quote-icon" :size="40" />
        <p class="text">"Consegui comprar meu caminhão novo em menos de 15 dias. O processo foi muito transparente e a equipe me deu suporte total na transferência."</p>
        <div class="author">
          <div class="avatar">RN</div>
          <div class="info">
            <strong>Roberto Nunes</strong>
            <span>Empresário - Transportes</span>
          </div>
        </div>
      </div>

      <div class="testimonial-card">
        <Quote class="quote-icon" :size="40" />
        <p class="text">"Estava procurando um imóvel e os juros do financiamento eram inviáveis. Com a carta contemplada economizei muito. Recomendo!"</p>
        <div class="author">
          <div class="avatar">AM</div>
          <div class="info">
            <strong>Ana Maria Souza</strong>
            <span>Médica</span>
          </div>
        </div>
      </div>

      <div class="testimonial-card">
        <Quote class="quote-icon" :size="40" />
        <p class="text">"Excelente atendimento. Desde a escolha da carta até a assinatura no banco, fui muito bem assessorado. Confiança total."</p>
        <div class="author">
          <div class="avatar">CS</div>
          <div class="info">
            <strong>Carlos Silva</strong>
            <span>Investidor</span>
          </div>
        </div>
      </div>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.page-container { background: #f8fafc; min-height: 100vh; font-family: 'Segoe UI', sans-serif; }
.hero-simple { text-align: center; padding: 80px 20px; }
.hero-simple h1 { color: #1e3a8a; font-size: 2.5rem; font-weight: 800; margin-bottom: 10px; }
.hero-simple p { color: #64748b; font-size: 1.1rem; }

.testimonials-grid { max-width: 1100px; margin: 0 auto 100px; padding: 0 20px; display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; }

.testimonial-card { 
  background: white; padding: 35px; border-radius: 16px; 
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; 
  display: flex; flex-direction: column; transition: transform 0.3s;
}
.testimonial-card:hover { transform: translateY(-5px); }

/* ASPAS AMARELAS */
.quote-icon { color: #F6D001; margin-bottom: 20px; fill: #F6D001; opacity: 0.2; }

.text { color: #334155; font-size: 1.05rem; line-height: 1.6; font-style: italic; flex: 1; margin-bottom: 25px; }

.author { display: flex; align-items: center; gap: 15px; border-top: 1px solid #f1f5f9; padding-top: 20px; }

/* AVATAR AMARELO */
.avatar { 
  width: 50px; height: 50px; 
  background: #F6D001; color: #1e293b; /* Amarelo com texto escuro */
  border-radius: 50%; display: flex; align-items: center; justify-content: center; 
  font-weight: 800; font-size: 1.1rem; 
}

.info { display: flex; flex-direction: column; }
.info strong { color: #1e293b; font-size: 0.95rem; }
.info span { font-size: 0.85rem; color: #64748b; }
</style>