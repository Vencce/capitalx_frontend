<script setup>
import { ref, computed } from 'vue'
import { useConfigStore } from '../stores/config'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { ChevronDown, MessageCircle, HelpCircle, Search } from 'lucide-vue-next'

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
    resposta: 'No financiamento, há incidência de juros elevados. Na carta contemplada, não existem juros, apenas taxa administrativa, proporcionando uma forma mais econômica e planejada de adquirir bens. A carta costuma ter custo total menor e prazos flexíveis.',
    aberta: false
  },
  {
    pergunta: 'É seguro comprar uma carta contemplada?',
    resposta: 'Sim. A negociação é feita com análise documental, transferência formal da cota e acompanhamento de todo o processo junto à administradora do consórcio, garantindo segurança e transparência.',
    aberta: false
  },
  {
    pergunta: 'A carta contemplada pode ser usada como compra à vista?',
    resposta: 'Sim. Após a contemplação e aprovação da administradora, o crédito permite compra à vista, o que aumenta significativamente o seu poder de negociação com o vendedor.',
    aberta: false
  },
  {
    pergunta: 'Quais bens posso adquirir com a carta contemplada?',
    resposta: 'É possível adquirir imóveis residenciais ou comerciais, terrenos, construção, reforma, quitação de financiamento e veículos automotores como carros, motos e caminhões, conforme o regulamento do grupo.',
    aberta: false
  },
  {
    pergunta: 'Existe entrada para adquirir uma carta contemplada?',
    resposta: 'Sim. A entrada corresponde aos valores já pagos pelo atual titular da cota, além de custos de intermediação, podendo variar conforme o valor do crédito e saldo devedor.',
    aberta: false
  },
  {
    pergunta: 'Posso descontar o valor da entrada do crédito da carta?',
    resposta: 'Não. O valor da entrada não pode ser descontado do crédito. No entanto, existem alternativas estratégicas, como utilizar parte do crédito para quitar financiamentos de entrada após o faturamento.',
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
  const texto = encodeURIComponent('Olá! Gostaria de tirar algumas dúvidas sobre as cartas contempladas.')
  window.open(`https://wa.me/${numero}?text=${texto}`, '_blank')
}
</script>

<template>
  <div class="faq-page">
    <AppHeader />

    <section class="faq-hero">
      <div class="container">
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
            <div class="card-header">
              <h3>{{ item.pergunta }}</h3>
              <ChevronDown class="arrow" :size="20" />
            </div>
            <Transition name="fade-slide">
              <div v-if="item.aberta" class="card-body">
                <p>{{ item.resposta }}</p>
              </div>
            </Transition>
          </div>
        </div>

        <div v-else class="no-results">
          <HelpCircle :size="48" />
          <p>Nenhum resultado encontrado para sua busca.</p>
        </div>

        <section class="support-cta">
          <div class="cta-box">
            <div class="cta-info">
              <h3>Não encontrou o que procurava?</h3>
              <p>Nossos especialistas estão online para te ajudar agora mesmo.</p>
            </div>
            <button class="btn-whatsapp-dynamic" @click="abrirWhatsapp">
              <MessageCircle :size="20" />
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
.faq-page {
  background-color: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Moderno sem fundo azul chapado */
.faq-hero {
  padding: 80px 0 60px;
  text-align: center;
  background: white;
  border-bottom: 1px solid #edf2f7;
}

.top-tag {
  background: #fef3c7;
  color: #b45309;
  padding: 5px 15px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.faq-hero h1 {
  font-size: 2.8rem;
  color: #1e3a8a;
  font-weight: 900;
  margin: 15px 0;
}

.faq-hero p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 30px;
}

.search-bar {
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}

.search-icon {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-bar input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-bar input:focus {
  border-color: #1e3a8a;
  outline: none;
  box-shadow: 0 4px 12px rgba(30, 58, 138, 0.08);
}

/* Grid de Dúvidas */
.faq-main {
  padding: 60px 0;
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.faq-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  height: fit-content;
}

.faq-card:hover {
  border-color: #1e3a8a;
  transform: translateY(-2px);
}

.faq-card.active {
  border-color: #1e3a8a;
  background: #f0f7ff;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
}

.card-header h3 {
  font-size: 1rem;
  font-weight: 700;
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
  border-top: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* CTA */
.support-cta {
  margin-top: 60px;
}

.cta-box {
  background: white;
  border-radius: 20px;
  padding: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.cta-info h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e3a8a;
}

.cta-info p {
  color: #64748b;
  margin-top: 5px;
}

.btn-whatsapp-dynamic {
  background: #25d366;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-whatsapp-dynamic:hover {
  background: #1da851;
  transform: scale(1.05);
}

.no-results {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

/* Animação */
.fade-slide-enter-active {
  transition: all 0.3s ease-out;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 850px) {
  .faq-grid { grid-template-columns: 1fr; }
  .cta-box { flex-direction: column; text-align: center; gap: 20px; }
  .faq-hero h1 { font-size: 2rem; }
}
</style>