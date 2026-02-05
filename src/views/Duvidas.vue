<script setup>
import { ref, computed } from 'vue'
import { useConfigStore } from '../stores/config'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { ChevronRight, MessageCircle, Search, Sparkles } from 'lucide-vue-next'

const configStore = useConfigStore()
const searchQuery = ref('')

const todasDuvidas = ref([
  {
    pergunta: 'O que é uma carta de consórcio contemplada?',
    resposta: 'É uma cota de consórcio que já foi contemplada por sorteio ou lance, ou seja, o crédito já está liberado para utilização imediata na compra de imóveis ou veículos, conforme as regras do grupo.',
    aberta: false
  },
  {
    pergunta: 'Qual a diferença entre carta contemplada e financiamento?',
    resposta: 'No financiamento, há incidência de juros elevados. Na carta contemplada, não existem juros, apenas taxa administrativa, proporcionando uma forma mais econômica e planejada de adquirir bens.',
    aberta: false
  },
  {
    pergunta: 'É seguro comprar uma carta contemplada?',
    resposta: 'Sim. A negociação é feita com análise documental, transferência formal da cota e acompanhamento de todo o processo junto à administradora do consórcio, garantindo segurança e transparência.',
    aberta: false
  },
  {
    pergunta: 'A carta contemplada pode ser usada como compra à vista?',
    resposta: 'Sim. Após a contemplação e aprovação da administradora, o crédito permite compra à vista, o que aumenta o poder de negociação com o vendedor.',
    aberta: false
  },
  {
    pergunta: 'Posso usar a carta contemplada para investir?',
    resposta: 'Sim. Muitas pessoas utilizam cartas contempladas para investimento imobiliário, construção ou ampliação patrimonial, sempre respeitando as regras do consórcio.',
    aberta: false
  },
  {
    pergunta: 'Quais bens posso adquirir com a carta contemplada?',
    resposta: 'É possível adquirir imóveis residenciais ou comerciais, terrenos, construção, reforma, quitação de financiamento e veículos automotores, como carro, moto, caminhão, ônibus, van, barco e jet ski.',
    aberta: false
  },
  {
    pergunta: 'Existe entrada para adquirir uma carta contemplada?',
    resposta: 'Sim. A entrada corresponde aos valores já pagos pelo atual titular da cota, além de custos de intermediação e procuração, variando conforme o valor do crédito.',
    aberta: false
  },
  {
    pergunta: 'Como a Capital X Consórcios atua nesse processo?',
    resposta: 'Atuamos na intermediação e análise das melhores oportunidades, auxiliando o cliente desde a escolha da cota até a transferência e liberação do crédito com acompanhamento especializado.',
    aberta: false
  }
])

const duvidasFiltradas = computed(() => {
  if (!searchQuery.value) return todasDuvidas.value
  return todasDuvidas.value.filter(d => 
    d.pergunta.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

const toggleDuvida = (index) => {
  // Fecha as outras ao abrir uma (opcional, estilo sanfona)
  todasDuvidas.value.forEach((d, i) => {
    if (i !== index) d.aberta = false
  })
  todasDuvidas.value[index].aberta = !todasDuvidas.value[index].aberta
}

const abrirWhatsapp = () => {
  const numero = configStore.whatsapp || '5547999999999'
  const texto = encodeURIComponent('Olá! Vi o FAQ no site e gostaria de um atendimento personalizado.')
  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank')
}
</script>

<template>
  <div class="modern-faq">
    <AppHeader />

    <div class="ambient-bg">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="content-wrapper">
      <section class="faq-header">
        <div class="tag-modern">
          <Sparkles :size="14" />
          <span>Central de Conhecimento</span>
        </div>
        <h1>Como podemos <br/> <span class="text-gradient">te ajudar hoje?</span></h1>
        
        <div class="search-container">
          <div class="search-box">
            <Search class="search-icon" :size="22" />
            <input type="text" v-model="searchQuery" placeholder="Busque por uma dúvida ou palavra-chave..." />
          </div>
        </div>
      </section>

      <main class="faq-section">
        <div class="faq-container" v-if="duvidasFiltradas.length > 0">
          <div 
            v-for="(item, index) in duvidasFiltradas" 
            :key="index" 
            class="glass-card"
            :class="{ 'is-active': item.aberta }"
            @click="toggleDuvida(index)"
          >
            <div class="card-inner">
              <div class="question-row">
                <span class="q-number">0{{ index + 1 }}</span>
                <h3>{{ item.pergunta }}</h3>
                <div class="icon-circle">
                  <ChevronRight class="chevron" :size="20" />
                </div>
              </div>
              <Transition name="expand">
                <div v-if="item.aberta" class="answer-row">
                  <p>{{ item.resposta }}</p>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <div class="cta-floating">
          <div class="cta-content">
            <div class="cta-text">
              <h3>Ainda com dúvida?</h3>
              <p>Chame no WhatsApp agora.</p>
            </div>
            <button class="btn-action-yellow" @click="abrirWhatsapp">
              <MessageCircle :size="24" />
            </button>
          </div>
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<style scoped>
.modern-faq {
  background-color: #0a0f1d; /* Fundo escuro profundo para realçar o neon/vidro */
  min-height: 100vh;
  position: relative;
  overflow-x: hidden;
  color: #ffffff;
}

/* Ambient Blobs */
.ambient-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.blob {
  position: absolute;
  filter: blur(120px);
  border-radius: 50%;
  opacity: 0.15;
}

.blob-1 { width: 500px; height: 500px; background: #F6D001; top: -100px; right: -100px; }
.blob-2 { width: 600px; height: 600px; background: #1e3a8a; bottom: -200px; left: -100px; }
.blob-3 { width: 300px; height: 300px; background: #ffffff; top: 40%; left: 50%; }

.content-wrapper {
  position: relative;
  z-index: 2;
  padding-top: 60px;
}

.faq-header {
  text-align: center;
  padding: 80px 20px 40px;
}

.tag-modern {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(246, 208, 1, 0.1);
  border: 1px solid rgba(246, 208, 1, 0.3);
  color: #F6D001;
  padding: 8px 20px;
  border-radius: 100px;
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 24px;
}

.faq-header h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  line-height: 1.1;
  font-weight: 900;
  margin-bottom: 40px;
}

.text-gradient {
  background: linear-gradient(to right, #F6D001, #ffffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.search-container {
  max-width: 700px;
  margin: 0 auto;
}

.search-box {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  padding: 8px 10px 8px 25px;
  transition: all 0.3s;
}

.search-box:focus-within {
  border-color: #F6D001;
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 30px rgba(246, 208, 1, 0.1);
}

.search-icon { color: #F6D001; }

.search-box input {
  background: transparent;
  border: none;
  width: 100%;
  padding: 15px;
  color: white;
  font-size: 1.1rem;
  outline: none;
}

/* Grid de Cards Freestyle */
.faq-section {
  max-width: 900px;
  margin: 60px auto 120px;
  padding: 0 20px;
  position: relative;
}

.faq-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
}

.glass-card:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(246, 208, 1, 0.4);
  transform: translateX(10px);
}

.glass-card.is-active {
  background: rgba(255, 255, 255, 0.08);
  border-color: #F6D001;
}

.card-inner { padding: 30px; }

.question-row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.q-number {
  font-size: 0.9rem;
  font-weight: 800;
  color: #F6D001;
  opacity: 0.5;
  font-family: serif;
}

.question-row h3 {
  flex: 1;
  font-size: 1.2rem;
  font-weight: 700;
  color: #e2e8f0;
}

.icon-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.chevron {
  transition: transform 0.4s;
  color: #64748b;
}

.glass-card.is-active .chevron {
  transform: rotate(90deg);
  color: #F6D001;
}

.glass-card.is-active .icon-circle {
  background: #F6D001;
}

.glass-card.is-active .icon-circle .chevron {
  color: #0a0f1d;
}

.answer-row {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.answer-row p {
  color: #94a3b8;
  line-height: 1.8;
  font-size: 1.05rem;
}

/* Floating CTA */
.cta-floating {
  position: fixed;
  bottom: 40px;
  right: 40px;
  z-index: 100;
}

.cta-content {
  background: #F6D001;
  padding: 10px 10px 10px 25px;
  border-radius: 100px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 30px rgba(246, 208, 1, 0.3);
  animation: float 3s ease-in-out infinite;
}

.cta-text h3 {
  color: #0a0f1d;
  font-size: 0.9rem;
  font-weight: 800;
  margin: 0;
}

.cta-text p {
  color: #0a0f1d;
  font-size: 0.75rem;
  margin: 0;
  opacity: 0.7;
}

.btn-action-yellow {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #0a0f1d;
  color: #F6D001;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
}

.btn-action-yellow:hover {
  transform: scale(1.1) rotate(10deg);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  max-height: 400px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (max-width: 768px) {
  .faq-header h1 { font-size: 2.2rem; }
  .glass-card:hover { transform: none; }
  .cta-floating { right: 20px; left: 20px; bottom: 20px; }
  .cta-content { width: 100%; justify-content: space-between; }
}
</style>