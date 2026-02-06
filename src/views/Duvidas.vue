<script setup>
import { ref, computed } from 'vue'
import { useConfigStore } from '../stores/config'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { Plus, Minus, Search, MessageCircle, HelpCircle } from 'lucide-vue-next'

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
    pergunta: 'Quais bens posso adquirir com a carta contemplada?',
    resposta: 'É possível adquirir imóveis residenciais ou comerciais, terrenos, construção, reforma, quitação de financiamento e veículos automotores (carro, moto, caminhão, etc).',
    aberta: false
  },
  {
    pergunta: 'Existe entrada para adquirir uma carta contemplada?',
    resposta: 'Sim. A entrada corresponde aos valores já pagos pelo atual titular da cota, além de custos de intermediação, variando conforme o valor do crédito e as condições da cota.',
    aberta: false
  },
  {
    pergunta: 'Posso descontar o valor da entrada do crédito da carta?',
    resposta: 'Não. O valor da entrada não pode ser descontado do crédito. Porém, existem alternativas estratégicas para viabilizar a operação conforme as regras da administradora.',
    aberta: false
  },
  {
    pergunta: 'Como faço para saber qual carta é ideal para mim?',
    resposta: 'Basta entrar em contato. Avaliamos seu perfil, objetivo e capacidade de pagamento para indicar a carta contemplada mais adequada à sua estratégia financeira.',
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
  todasDuvidas.value[index].aberta = !todasDuvidas.value[index].aberta
}

const abrirWhatsapp = () => {
  const numero = configStore.whatsapp || '5547999999999'
  const texto = encodeURIComponent('Olá! Gostaria de tirar dúvidas sobre as cartas contempladas.')
  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank')
}
</script>

<template>
  <div class="faq-page">
    <AppHeader />

    <section class="faq-hero">
      <div class="hero-pattern"></div>
      <div class="container">
        <div class="hero-content">
          <span class="gold-tag">Atendimento Exclusivo</span>
          <h1>Dúvidas <span>Frequentes</span></h1>
          <p>Tudo o que você precisa saber sobre o mercado de cartas contempladas com a segurança da Capital X.</p>
          
          <div class="search-box">
            <Search class="search-icon" :size="20" />
            <input type="text" v-model="searchQuery" placeholder="O que você deseja saber?" />
          </div>
        </div>
      </div>
    </section>

    <main class="faq-main">
      <div class="container">
        <div class="faq-grid" v-if="duvidasFiltradas.length > 0">
          <div class="faq-col">
            <div 
              v-for="(item, index) in duvidasFiltradas.filter((_, i) => i % 2 === 0)" 
              :key="'col1-'+index"
              class="faq-card"
              :class="{ active: item.aberta }"
              @click="toggleDuvida(todasDuvidas.indexOf(item))"
            >
              <div class="faq-header-card">
                <h3>{{ item.pergunta }}</h3>
                <div class="faq-icon">
                  <Plus v-if="!item.aberta" :size="20" />
                  <Minus v-else :size="20" />
                </div>
              </div>
              <Transition name="fade-height">
                <div v-if="item.aberta" class="faq-body-card">
                  <p>{{ item.resposta }}</p>
                </div>
              </Transition>
            </div>
          </div>

          <div class="faq-col">
            <div 
              v-for="(item, index) in duvidasFiltradas.filter((_, i) => i % 2 !== 0)" 
              :key="'col2-'+index"
              class="faq-card"
              :class="{ active: item.aberta }"
              @click="toggleDuvida(todasDuvidas.indexOf(item))"
            >
              <div class="faq-header-card">
                <h3>{{ item.pergunta }}</h3>
                <div class="faq-icon">
                  <Plus v-if="!item.aberta" :size="20" />
                  <Minus v-else :size="20" />
                </div>
              </div>
              <Transition name="fade-height">
                <div v-if="item.aberta" class="faq-body-card">
                  <p>{{ item.resposta }}</p>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <div v-else class="no-results">
          <HelpCircle :size="48" />
          <p>Nenhuma dúvida encontrada para sua pesquisa.</p>
        </div>

        <section class="faq-cta">
          <div class="cta-inner">
            <div class="cta-text">
              <h2>Ainda restam dúvidas?</h2>
              <p>Nossos consultores estão prontos para realizar uma análise personalizada do seu perfil.</p>
            </div>
            <button class="btn-cta-gold" @click="abrirWhatsapp">
              <MessageCircle :size="22" />
              Falar com um Consultor
            </button>
          </div>
        </section>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
/* Reset global de box-sizing para evitar estouro horizontal */
* {
  box-sizing: border-box;
}

.faq-page {
  background-color: #f4f7f9;
  min-height: 100vh;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.faq-hero {
  background: #1e3a8a;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  padding: 80px 0 100px;
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

.faq-hero h1 {
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 900;
  margin-bottom: 15px;
}

.faq-hero h1 span {
  color: #F6D001;
}

.faq-hero p {
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 30px;
  opacity: 0.9;
  padding: 0 15px;
}

/* Barra de Busca */
.search-box {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 5;
  padding: 0 15px;
}

.search-icon {
  position: absolute;
  left: 35px; /* Ajustado para considerar o padding */
  top: 50%;
  transform: translateY(-50%);
  color: #1e3a8a;
}

.search-box input {
  width: 100%;
  padding: 16px 20px 16px 55px;
  border-radius: 12px;
  border: none;
  font-size: 1rem;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1);
  outline: none;
}

/* FAQ Grid */
.faq-main {
  padding: 60px 0;
  margin-top: -40px;
}

.faq-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.faq-col {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.faq-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  height: fit-content;
}

.faq-card:hover {
  transform: translateY(-3px);
  border-color: #F6D001;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
}

.faq-card.active {
  border-left: 4px solid #F6D001;
}

.faq-header-card h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  margin: 0;
}

.faq-body-card {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f1f5f9;
}

.faq-body-card p {
  color: #64748b;
  line-height: 1.6;
  font-size: 0.9rem;
  margin: 0;
}

/* CTA Section */
.cta-inner {
  background: #0f172a;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  border-bottom: 5px solid #F6D001;
  width: 100%;
  margin-top: 60px;
}

.cta-text h2 {
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 10px;
}

.btn-cta-gold {
  background: #F6D001;
  color: #0f172a;
  border: none;
  padding: 16px 30px;
  border-radius: 8px;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  white-space: nowrap;
}

/* Responsividade Geral */
@media (max-width: 900px) {
  .faq-grid { grid-template-columns: 1fr; }
  .cta-inner { flex-direction: column; text-align: center; gap: 30px; padding: 30px 20px; }
  .btn-cta-gold { width: 100%; justify-content: center; }
}

@media (max-width: 490px) {
  .faq-hero { padding: 60px 0 80px; }
  .search-box { padding: 0 10px; }
  .faq-main { padding: 40px 0; margin-top: -30px; }
  .faq-card { padding: 15px; }
  .faq-header-card h3 { font-size: 0.95rem; }
  .cta-text h2 { font-size: 1.4rem; }
  .cta-text p { font-size: 1rem; }
}

/* Animações */
.fade-height-enter-active, .fade-height-leave-active {
  transition: all 0.3s ease;
  max-height: 400px;
  overflow: hidden;
}
.fade-height-enter-from, .fade-height-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>