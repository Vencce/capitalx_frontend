<script setup>
import { ref } from 'vue'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
import { ChevronDown, HelpCircle } from 'lucide-vue-next'

const duvidas = ref([
  {
    pergunta: 'O que é uma carta de consórcio contemplada?',
    resposta: 'É uma cota de consórcio que já foi contemplada por sorteio ou lance, ou seja, o crédito já está liberado para utilização imediata na compra de imóveis ou veículos, conforme as regras do grupo.',
    aberta: false
  },
  {
    pergunta: 'Qual a diferença entre carta contemplada e financiamento?',
    resposta: 'No financiamento, há a incidência de juros elevados, o que aumenta significativamente o custo total da operação ao longo do prazo. Já na carta contemplada, não existem juros, apenas a taxa administrativa, tornando essa opção mais econômica e planejada. Em ambos os casos, normalmente há exigência de valor de entrada, mas a carta contemplada se destaca pelo custo total menor e maior agilidade na liberação.',
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
    resposta: 'É possível adquirir imóveis residenciais ou comerciais, terrenos, construção, reforma, quitação de financiamento e veículos automotores (carro, moto, caminhão, ônibus, van, barco e jet ski), conforme a modalidade e o regulamento do grupo.',
    aberta: false
  },
  {
    pergunta: 'Existe entrada para adquirir uma carta contemplada?',
    resposta: 'Sim. A entrada corresponde aos valores já pagos pelo atual titular da cota, além de custos de intermediação e procuração, podendo variar conforme o valor do crédito, saldo devedor e as condições da cota.',
    aberta: false
  },
  {
    pergunta: 'Posso descontar o valor da entrada do crédito da carta contemplada?',
    resposta: 'Não. O valor da entrada não pode ser descontado do valor do crédito. No entanto, em alguns casos, é possível financiar o valor da entrada e, no momento do faturamento, utilizar parte do crédito para quitar esse financiamento, destinando o saldo restante para o bem.',
    aberta: false
  },
  {
    pergunta: 'Como a Capital X Consórcios atua nesse processo?',
    resposta: 'Atuamos na intermediação e análise das melhores oportunidades, auxiliando o cliente desde a escolha da cota até a transferência e liberação do crédito, com acompanhamento especializado.',
    aberta: false
  },
  {
    pergunta: 'A administradora precisa aprovar a transferência?',
    resposta: 'Sim. Toda transferência de cota contemplada passa pela aprovação da administradora, garantindo que o processo seja regular e conforme as normas do consórcio.',
    aberta: false
  },
  {
    pergunta: 'Como faço para saber qual carta é ideal para mim?',
    resposta: 'Basta entrar em contato conosco. Avaliamos seu perfil, objetivo e capacidade de pagamento para indicar a carta contemplada mais adequada à sua estratégia financeira.',
    aberta: false
  }
])

const toggleDuvida = (index) => {
  duvidas.value[index].aberta = !duvidas.value[index].aberta
}
</script>

<template>
  <div class="page-wrapper">
    <AppHeader />

    <header class="faq-hero">
      <div class="container">
        <HelpCircle class="hero-icon" :size="48" />
        <h1>Dúvidas Frequentes</h1>
        <p>Tudo o que você precisa saber sobre Cartas Contempladas e como realizar seu sonho.</p>
      </div>
    </header>

    <main class="faq-content">
      <div class="container small">
        <div class="faq-list">
          <div 
            v-for="(item, index) in duvidas" 
            :key="index" 
            class="faq-item"
            :class="{ active: item.aberta }"
          >
            <button class="faq-question" @click="toggleDuvida(index)">
              <span>{{ item.pergunta }}</span>
              <ChevronDown class="arrow" :size="20" />
            </button>
            <Transition name="expand">
              <div v-if="item.aberta" class="faq-answer">
                <p>{{ item.resposta }}</p>
              </div>
            </Transition>
          </div>
        </div>

        <section class="cta-section">
          <h3>Ainda tem dúvidas?</h3>
          <p>Nossa equipe está pronta para te atender e explicar cada detalhe.</p>
          <a href="https://wa.me/5547999999999" target="_blank" class="btn-whatsapp">
            Falar com um Especialista
          </a>
        </section>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.page-wrapper {
  background-color: #f8fafc;
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.container.small {
  max-width: 800px;
}

.faq-hero {
  background: #1e3a8a;
  color: white;
  padding: 80px 0 60px;
  text-align: center;
}

.hero-icon {
  margin-bottom: 16px;
  color: #f6d001;
}

.faq-hero h1 {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 12px;
}

.faq-hero p {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  margin: 0 auto;
}

.faq-content {
  padding: 60px 0;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.faq-item {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-item:hover {
  border-color: #1e3a8a;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.faq-item.active {
  border-color: #1e3a8a;
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.1);
}

.faq-question {
  width: 100%;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
}

.arrow {
  transition: transform 0.3s ease;
  color: #64748b;
}

.faq-item.active .arrow {
  transform: rotate(180deg);
  color: #1e3a8a;
}

.faq-answer {
  padding: 0 24px 20px 24px;
  color: #475569;
  line-height: 1.6;
}

.cta-section {
  margin-top: 60px;
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 20px;
  border: 2px dashed #e2e8f0;
}

.cta-section h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 8px;
}

.cta-section p {
  color: #64748b;
  margin-bottom: 24px;
}

.btn-whatsapp {
  display: inline-block;
  background: #22c55e;
  color: white;
  padding: 14px 32px;
  border-radius: 12px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-whatsapp:hover {
  background: #16a34a;
}

/* Animação de Expansão */
.expand-enter-active, .expand-leave-active {
  transition: all 0.3s ease-in-out;
  max-height: 500px;
}

.expand-enter-from, .expand-leave-to {
  max-height: 0;
  opacity: 0;
  padding-bottom: 0;
}

@media (max-width: 768px) {
  .faq-hero h1 { font-size: 2rem; }
  .faq-question { font-size: 1rem; padding: 16px; }
}
</style>