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
    resposta: 'É possível adquirir imóveis residenciais ou comerciais, terrenos, construção, reforma, quitação de financiamento e veículos automotores (carro, moto, caminhão, etc), conforme o regulamento.',
    aberta: false
  },
  {
    pergunta: 'Existe entrada para adquirir uma carta contemplada?',
    resposta: 'Sim. A entrada corresponde aos valores já pagos pelo atual titular da cota, além de custos de intermediação, variando conforme o valor do crédito e condições da cota.',
    aberta: false
  },
  {
    pergunta: 'Posso descontar o valor da entrada do crédito da carta?',
    resposta: 'Não. O valor da entrada não pode ser descontado do crédito. Mas existem estratégias para usar parte do crédito para quitar financiamentos de entrada após o faturamento.',
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
  todasDuvidas.value[index].aberta = !todasDuvidas.value[index].aberta
}

const abrirWhatsapp = () => {
  const numero = configStore.whatsapp || '5547999999999'
  const texto = encodeURIComponent('Olá! Estava vendo as dúvidas no site e gostaria de conversar.')
  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank')
}
</script>

<template>
  <div class="faq-modern-light">
    <AppHeader />

    <header class="header-section">
      <div class="sun-flare"></div>
      <div class="container">
        <div class="top-info">
          <span class="badge-new">Suporte Especializado</span>
          <h1>Dúvidas <span>Frequentes</span></h1>
          <p>Tudo o que você precisa saber para investir com segurança na Capital X.</p>
        </div>

        <div class="search-wrapper">
          <div class="search-field">
            <Search class="icon" :size="20" />
            <input type="text" v-model="searchQuery" placeholder="Busque por termos como 'entrada', 'imóvel'..." />
          </div>
        </div>
      </div>
    </header>

    <main class="faq-body">
      <div class="container">
        <div class="faq-layout">
          <div class="faq-column">
             <div 
              v-for="(item, index) in duvidasFiltradas.slice(0, Math.ceil(duvidasFiltradas.length / 2))" 
              :key="index"
              class="faq-box"
              :class="{ active: item.aberta }"
              @click="toggleDuvida(todasDuvidas.indexOf(item))"
            >
              <div class="faq-trigger">
                <h3>{{ item.pergunta }}</h3>
                <div class="state-icon">
                  <Plus v-if="!item.aberta" :size="18" />
                  <Minus v-else :size="18" />
                </div>
              </div>
              <Transition name="expand">
                <div v-if="item.aberta" class="faq-content">
                  <p>{{ item.resposta }}</p>
                </div>
              </Transition>
            </div>
          </div>

          <div class="faq-column">
             <div 
              v-for="(item, index) in duvidasFiltradas.slice(Math.ceil(duvidasFiltradas.length / 2))" 
              :key="index"
              class="faq-box"
              :class="{ active: item.aberta }"
              @click="toggleDuvida(todasDuvidas.indexOf(item))"
            >
              <div class="faq-trigger">
                <h3>{{ item.pergunta }}</h3>
                <div class="state-icon">
                  <Plus v-if="!item.aberta" :size="18" />
                  <Minus v-else :size="18" />
                </div>
              </div>
              <Transition name="expand">
                <div v-if="item.aberta" class="faq-content">
                  <p>{{ item.resposta }}</p>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <div v-if="duvidasFiltradas.length === 0" class="no-results">
            <HelpCircle :size="40" />
            <p>Não encontramos resultados para sua busca.</p>
        </div>

        <div class="contact-banner">
          <div class="banner-inner">
            <div class="banner-text">
              <h2>Ainda precisa de ajuda?</h2>
              <p>Fale agora pelo WhatsApp e tire suas dúvidas com um consultor real.</p>
            </div>
            <button @click="abrirWhatsapp" class="btn-yellow-main">
              <MessageCircle :size="20" />
              Chamar no WhatsApp
            </button>
          </div>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.faq-modern-light {
  background-color: #fcfcfc;
  color: #1a202c;
  min-height: 100vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}

/* Header Estilo Apple/Moderno */
.header-section {
  position: relative;
  padding: 100px 0 60px;
  background: white;
  overflow: hidden;
  text-align: center;
}

.sun-flare {
  position: absolute;
  top: -150px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(246, 208, 1, 0.1) 0%, rgba(255,255,255,0) 70%);
  z-index: 1;
}

.top-info { position: relative; z-index: 2; }

.badge-new {
  display: inline-block;
  background: #f1f5f9;
  padding: 6px 16px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  color: #64748b;
  text-transform: uppercase;
  margin-bottom: 20px;
}

.header-section h1 {
  font-size: clamp(2rem, 5vw, 3.2rem);
  font-weight: 900;
  color: #1e3a8a;
  letter-spacing: -1px;
}

.header-section h1 span {
  color: #F6D001;
}

.header-section p {
  color: #64748b;
  font-size: 1.15rem;
  max-width: 500px;
  margin: 15px auto 40px;
}

/* Busca */
.search-wrapper {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.search-field {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #f1f5f9;
  border-radius: 16px;
  padding: 5px 20px;
  transition: all 0.3s ease;
}

.search-field:focus-within {
  background: white;
  border-color: #F6D001;
  box-shadow: 0 10px 25px -5px rgba(246, 208, 1, 0.15);
}

.search-field .icon { color: #94a3b8; }

.search-field input {
  border: none;
  background: transparent;
  width: 100%;
  padding: 15px;
  font-size: 1rem;
  outline: none;
  font-weight: 500;
}

/* Corpo do FAQ */
.faq-body { padding: 80px 0; }

.faq-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  align-items: start;
}

.faq-box {
  background: white;
  border: 1px solid #f1f5f9;
  border-radius: 20px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.faq-box:hover {
  border-color: #F6D001;
  transform: translateY(-2px);
}

.faq-box.active {
  background: white;
  border-color: #F6D001;
  box-shadow: 0 10px 20px -5px rgba(0,0,0,0.03);
}

.faq-trigger {
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.faq-trigger h3 {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
}

.state-icon {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #fcfcfc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F6D001;
  transition: all 0.2s;
}

.faq-box.active .state-icon {
  background: #F6D001;
  color: #1e3a8a;
}

.faq-content {
  padding: 0 24px 24px;
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Banner Final */
.contact-banner {
  margin-top: 80px;
  background: #1e3a8a;
  border-radius: 30px;
  padding: 40px;
  color: white;
  position: relative;
  overflow: hidden;
}

.banner-inner {
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 30px;
}

.banner-text h2 {
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 8px;
}

.banner-text p { opacity: 0.8; font-size: 1rem; }

.btn-yellow-main {
  background: #F6D001;
  color: #1e3a8a;
  border: none;
  padding: 16px 32px;
  border-radius: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-yellow-main:hover {
  background: #ffffff;
  transform: scale(1.05);
}

.no-results {
    text-align: center;
    padding: 40px;
    color: #94a3b8;
}

/* Animação */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-out;
  max-height: 300px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (max-width: 900px) {
  .faq-layout { grid-template-columns: 1fr; }
  .banner-inner { flex-direction: column; text-align: center; }
}
</style>