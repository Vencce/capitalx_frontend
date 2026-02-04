<script setup>
import { ref, computed } from 'vue'
import CartaCard from './CartaCard.vue'
import ModalJuncao from './ModalJuncao.vue'

const props = defineProps({
  cartas: {
    type: Array,
    default: () => []
  }
})

const cartasSelecionadas = ref([])
const showModalJuncao = ref(false)

const handleToggleSelection = (carta) => {
  const index = cartasSelecionadas.value.findIndex(c => c.codigo === carta.codigo)
  if (index > -1) {
    cartasSelecionadas.value.splice(index, 1)
  } else {
    cartasSelecionadas.value.push(carta)
  }
}

const isSelected = (codigo) => {
  return cartasSelecionadas.value.some(c => c.codigo === codigo)
}

const formatCurrency = (value) => {
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const totalCreditoSelecionado = computed(() => {
  return cartasSelecionadas.value.reduce((acc, c) => acc + parseFloat(c.valor_credito || 0), 0)
})
</script>

<template>
  <div class="container">
    <div class="table-header">
      <span>CÓD / TIPO</span>
      <span>ADMINISTRADORA</span>
      <span>CRÉDITO</span>
      <span>ENTRADA</span>
      <span>SALDO DEVEDOR</span>
      <span>SEGURO</span>
      <span>STATUS</span>
      <span class="text-center">AÇÕES</span>
    </div>

    <div class="grid-cartas">
      <CartaCard 
        v-for="carta in cartas" 
        :key="carta.codigo"
        :carta="carta"
        :selected="isSelected(carta.codigo)"
        :disabled="carta.status !== 'DISPONIVEL' && !isSelected(carta.codigo)"
        @toggle-selection="handleToggleSelection"
      />
    </div>

    <Transition name="fade-up">
      <div v-if="cartasSelecionadas.length > 1" class="barra-juncao">
        <div class="info-juncao">
          <span class="count">{{ cartasSelecionadas.length }} selecionadas</span>
          <span class="total">Total: {{ formatCurrency(totalCreditoSelecionado) }}</span>
        </div>
        <button class="btn-abrir-juncao" @click="showModalJuncao = true">
          <i class="pi pi-plus-circle"></i> Ver Junção
        </button>
      </div>
    </Transition>

    <ModalJuncao 
      :show="showModalJuncao" 
      :cartas="cartasSelecionadas" 
      @close="showModalJuncao = false"
    />
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  position: relative;
  min-height: 100vh;
  background: #f8fafc;
}

.table-header {
  display: grid;
  grid-template-columns: 140px 180px 1fr 1fr 1fr 120px 130px 100px;
  padding: 0 20px 12px 20px;
  color: #64748b;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
}

.text-center {
  text-align: center;
}

th.actions-head {
    text-align: center;
}

.grid-cartas {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 1200px;
  margin: 0 auto;
}

.barra-juncao {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #1e3a8a;
  padding: 15px 25px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 25px rgba(30, 58, 138, 0.3);
  z-index: 1000;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.info-juncao {
  display: flex;
  flex-direction: column;
}

.info-juncao .count {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 700;
  opacity: 0.8;
}

.info-juncao .total {
  font-size: 1.1rem;
  font-weight: 800;
}

.btn-abrir-juncao {
  background: #F6D001;
  color: #1e3a8a;
  border: none;
  padding: 10px 20px;
  border-radius: 25px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s;
}

.btn-abrir-juncao:hover {
  transform: scale(1.05);
  background: #ffe033;
}

.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.3s ease-out;
}

.fade-up-enter-from,
.fade-up-leave-to {
  opacity: 0;
  transform: translate(-50%, 20px);
}

@media (max-width: 1100px) {
  .table-header { display: none; }
}
</style>