<script setup>
import { ref, computed } from 'vue'
import { useConfigStore } from '../stores/config'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { ChevronDown, MessageCircle, Search, HelpCircle } from 'lucide-vue-next'

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
  todasDuvidas.value[index].aberta = !todasDuvidas.value[index].aberta
}

const abrirWhatsapp = () => {
  const numero = configStore.whatsapp || '5547999999999'
  const texto = encodeURIComponent('Olá! Gostaria de tirar algumas dúvidas sobre as cartas contempladas.')
  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank')
}
</script>

<template>
  <div class="faq-page">
    <AppHeader />

    <section class="faq-hero">
      <div class="hero-bg-shapes">
        <div class="shape s1"></div>
        <div class="shape s2"></div>
        <div class="shape s3"></div>
      </div>
      
      <div class="container hero-inner">
        <span class="top-tag">FAQ</span>
        <h1>Central de Ajuda</h1>
        <p>Encontre respostas rápidas para as dúvidas mais comuns sobre consórcios contemplados.</p>
        
        <div class="search-bar">
          <Search class="search-icon" :size="20" />
          <input type="text" v-model="searchQuery" placeholder="Qual a sua dúvida?" />
        </div>
      </div>
    </section>

    <main class="faq-main">
      <div class="container">
        <div class="faq-grid" v-if="duvidasFiltradas.length > 0">
          <div 
            v-for="(item, index) in duvidasFiltradas" 
            :key="index" 
            class="faq-card"
            :class="{ active: item.aberta }"
            @click="toggleDuvida(index)"
          >
            <div class="card-indicator">?</div>
            <div class="card-content">
              <div class="card-header">
                <h3>{{ item.pergunta }}</h3>
                <ChevronDown class="arrow" :size="20" />
              </div>
              <Transition name="expand">
                <div v-if="item.aberta" class="card-body">
                  <p>{{ item.resposta }}</p>
                </div>
              </Transition>
            </div>
          </div>
        </div>

        <div v-else class="no-results">
          <HelpCircle :size="64" color="#cbd5e1" />
          <p>Não encontramos resultados para sua busca.</p>
          <button @searchQuery="" @click="searchQuery = ''" class="btn-reset">Ver todas as dúvidas</button>
        </div>

        <section class="support-cta">
          <div class="cta-box">
            <div class="cta-text">
              <h3>Ainda tem alguma dúvida específica?</h3>
              <p>Fale agora com um de nossos especialistas e receba atendimento personalizado.</p>
            </div>
            <button class="btn-whatsapp-capital" @click="abrirWhatsapp">
              <MessageCircle :size="22" />
              Falar com um Especialista
            </button>
          </div>
        </section>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
/* Variáveis de Cor */
:export {
  primary: #1e3a8a;
  accent: #F6D001;
}

.faq-page {
  background-color: #f4f7fa;
  min-height: 100vh;
}

.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Background Dinâmico com Formas */
.faq-hero {
  position: relative;
  padding: 100px 0 80px;
  text-align: center;
  background: #ffffff;
  overflow: hidden;
  border-bottom: 1px solid #e2e8f0;
}

.hero-bg-shapes {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  opacity: 0.4;
}

.shape {
  position: absolute;
  filter: blur(80px);
  border-radius: 50%;
}

.s1 { width: 400px; height: 400px; background: #1e3a8a; top: -200px; left: -100px; }
.s2 { width: 300px; height: 300px; background: #F6D001; bottom: -150px; right: -50px; }
.s3 { width: 250px; height: 250px; background: #cbd5e1; top: 50px; right: 20%; }

.hero-inner {
  position: relative;
  z-index: 2;
}

.top-tag {
  background: #F6D001;
  color: #1e3a8a;
  padding: 6px 18px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 1px;
}

.faq-hero h1 {
  font-size: 3.2rem;
  color: #1e3a8a;
  font-weight: 900;
  margin: 20px 0;
}

.faq-hero p {
  color: #475569;
  font-size: 1.2rem;
  max-width: 650px;
  margin: 0 auto 40px;
}

/* Barra de Busca */
.search-bar {
  max-width: 600px;
  margin: 0 auto;
  position: relative;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  border-radius: 16px;
}

.search-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  color: #1e3a8a;
}

.search-bar input {
  width: 100%;
  padding: 20px 20px 20px 55px;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s;
}

.search-bar input:focus {
  border-color: #F6D001;
  box-shadow: 0 0 0 4px rgba(246, 208, 1, 0.15);
}

/* Grid em Duas Colunas */
.faq-main {
  padding: 80px 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 25px;
}

.faq-card {
  background: white;
  border-radius: 18px;
  border: 1px solid #e2e8f0;
  padding: 25px;
  display: flex;
  gap: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: fit-content;
}

.card-indicator {
  width: 40px;
  height: 40px;
  background: #f1f5f9;
  color: #F6D001;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  font-size: 1.2rem;
  flex-shrink: 0;
  transition: all 0.3s;
}

.faq-card:hover {
  transform: translateY(-5px);
  border-color: #F6D001;
  box-shadow: 0 15px 30px rgba(0,0,0,0.05);
}

.faq-card.active {
  border-color: #1e3a8a;
  background: #ffffff;
}

.faq-card.active .card-indicator {
  background: #1e3a8a;
  color: #F6D001;
}

.card-content {
  flex: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 1.05rem;
  font-weight: 800;
  color: #1e293b;
  line-height: 1.4;
}

.arrow {
  color: #94a3b8;
  transition: transform 0.3s;
}

.faq-card.active .arrow {
  transform: rotate(180deg);
  color: #1e3a8a;
}

.card-body {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f1f5f9;
  color: #64748b;
  line-height: 1.7;
}

/* CTA Estilizado */
.support-cta {
  margin-top: 80px;
}

.cta-box {
  background: #1e3a8a;
  background-image: linear-gradient(135deg, #1e3a8a 0%, #152b63 100%);
  border-radius: 24px;
  padding: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  position: relative;
  overflow: hidden;
}

.cta-box::before {
  content: '';
  position: absolute;
  right: -50px;
  top: -50px;
  width: 200px;
  height: 200px;
  background: #F6D001;
  opacity: 0.1;
  border-radius: 50%;
}

.cta-text h3 {
  font-size: 1.8rem;
  font-weight: 900;
  margin-bottom: 10px;
}

.cta-text p {
  opacity: 0.8;
  font-size: 1.1rem;
}

.btn-whatsapp-capital {
  background: #F6D001;
  color: #1e3a8a;
  border: none;
  padding: 18px 35px;
  border-radius: 14px;
  font-weight: 900;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 10px 20px rgba(246, 208, 1, 0.2);
}

.btn-whatsapp-capital:hover {
  background: #ffffff;
  transform: scale(1.05);
  box-shadow: 0 15px 30px rgba(255, 255, 255, 0.2);
}

/* Animações */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease;
  max-height: 300px;
  overflow: hidden;
}
.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
}

@media (max-width: 992px) {
  .faq-grid { grid-template-columns: 1fr; }
  .cta-box { flex-direction: column; text-align: center; gap: 30px; padding: 40px 20px; }
  .faq-hero h1 { font-size: 2.5rem; }
}
</style>