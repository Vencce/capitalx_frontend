<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/config'

const props = defineProps({
  show: Boolean,
  cartas: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

const configStore = useConfigStore()

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const totalCredito = computed(() => {
  return props.cartas.reduce((acc, c) => acc + parseFloat(c.valor_credito || 0), 0)
})

const totalEntrada = computed(() => {
  return props.cartas.reduce((acc, c) => acc + parseFloat(c.valor_entrada || 0), 0)
})

const totalSaldoDevedor = computed(() => {
  return props.cartas.reduce((acc, c) => acc + parseFloat(c.saldo_devedor || 0), 0)
})

const totalParcelaMensal = computed(() => {
  return props.cartas.reduce((acc, c) => acc + parseFloat(c.valor_parcela || 0), 0)
})

// Lógica para agrupar as parcelas individualmente
const parcelamentoDetalhado = computed(() => {
  const grupos = {}
  props.cartas.forEach(c => {
    const chave = `${c.prazo}x${c.valor_parcela}`
    if (!grupos[chave]) {
      grupos[chave] = {
        prazo: c.prazo,
        valor: parseFloat(c.valor_parcela),
        qtd: 1
      }
    } else {
      grupos[chave].qtd++
    }
  })
  return Object.values(grupos)
})

const copiarTudo = async () => {
  let texto = `📊 RESULTADO DA JUNÇÃO\n`
  texto += `Crédito Total: ${formatCurrency(totalCredito.value)}\n`
  texto += `Entrada Total: ${formatCurrency(totalEntrada.value)}\n`
  texto += `Saldo Devedor: ${formatCurrency(totalSaldoDevedor.value)}\n\n`
  
  texto += `PARCELAMENTO:\n`
  parcelamentoDetalhado.value.forEach(p => {
    texto += `- ${p.prazo}x de ${formatCurrency(p.valor)}${p.qtd > 1 ? ` (${p.qtd} cotas)` : ''}\n`
  })
  texto += `Soma das parcelas: ${formatCurrency(totalParcelaMensal.value)}\n\n`

  texto += `COTAS SELECIONADAS:\n`
  props.cartas.forEach(c => {
    texto += `- Cód: ${c.codigo} | ${c.tipo} | ${c.administradora_detalhes?.nome}: ${formatCurrency(c.valor_credito)}\n`
  })

  try {
    await navigator.clipboard.writeText(texto)
    alert('Resumo copiado!')
  } catch (err) {
    console.error(err)
  }
}

const abrirWhatsapp = () => {
  const codigos = props.cartas.map(c => c.codigo).join(', ')
  let parcelasTexto = parcelamentoDetalhado.value
    .map(p => `${p.prazo}x de ${formatCurrency(p.valor)}`)
    .join(' e ')

  const texto = `Olá! Tenho interesse na junção das cartas (${codigos}) que totalizam ${formatCurrency(totalCredito.value)} de crédito. Parcelamento: ${parcelasTexto}.`
  const numero = configStore.whatsapp || '5547999999999'
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank')
}

const compartilhar = async () => {
  const texto = `Confira essa oportunidade de junção: ${formatCurrency(totalCredito.value)} de crédito com entrada de ${formatCurrency(totalEntrada.value)}.`
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Resultado da Junção', text: texto, url: window.location.href })
    } else {
      await navigator.clipboard.writeText(texto)
      alert('Link copiado!')
    }
  } catch (err) { console.error(err) }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-juncao">
        <div class="modal-header">
          <h2>Resultado da junção</h2>
          <button class="btn-close" @click="emit('close')">✕</button>
        </div>

        <div class="modal-body">
          <div class="main-info">
            <div class="copy-wrapper">
              <p>Crédito: <strong>{{ formatCurrency(totalCredito) }}</strong></p>
              <p>Entrada: <strong>{{ formatCurrency(totalEntrada) }}</strong></p>
              <button class="btn-copy-small" @click="copiarTudo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>

            <div class="section-divider"></div>

            <div class="parcelamento-box">
              <p class="section-label">Parcelamento Detalhado:</p>
              <div v-for="(p, index) in parcelamentoDetalhado" :key="index" class="parcela-item">
                <strong>{{ p.prazo }}x de {{ formatCurrency(p.valor) }}</strong>
                <span v-if="p.qtd > 1" class="cota-badge">{{ p.qtd }} cotas</span>
              </div>
              <p class="parcela-total">Soma das parcelas: {{ formatCurrency(totalParcelaMensal) }}</p>
            </div>

            <div class="section-divider"></div>

            <div class="secondary-info">
              <p>Saldo devedor: <strong>{{ formatCurrency(totalSaldoDevedor) }}</strong></p>
              <p>Transferência: <strong>Consultar</strong></p>
              <p>Seguro de vida: <strong>Consultar</strong></p>
            </div>

            <div class="cotas-selecionadas">
              <h3>Cotas selecionadas:</h3>
              <div v-for="c in cartas" :key="c.codigo" class="cota-item">
                Cód: {{ c.codigo }} - {{ c.tipo }} - {{ c.administradora_detalhes?.nome }}: {{ formatCurrency(c.valor_credito) }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-share" @click="compartilhar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
              <polyline points="16 6 12 2 8 6"></polyline>
              <line x1="12" y1="2" x2="12" y2="15"></line>
            </svg>
            Compartilhar
          </button>
          <button class="btn-negotiate" @click="abrirWhatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Negociar
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex; justify-content: center; align-items: center;
  z-index: 10000; padding: 20px;
}

.modal-juncao {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  color: #1e3a8a;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
}

.btn-close {
  background: none; border: none; font-size: 1.2rem; color: #9ca3af; cursor: pointer;
}

.modal-body {
  padding: 0 20px 20px 20px;
  max-height: 70vh;
  overflow-y: auto;
}

.copy-wrapper {
  position: relative;
  padding-right: 40px;
}

.btn-copy-small {
  position: absolute;
  top: 0; right: 0;
  background: none; border: none; color: #111827; cursor: pointer;
  padding: 5px;
}

.main-info p, .secondary-info p {
  margin: 8px 0;
  font-size: 0.95rem;
  color: #374151;
}

.main-info strong, .secondary-info strong {
  color: #111827;
}

.section-divider {
  height: 1px; background: #f3f4f6; margin: 16px 0;
}

.section-label {
  color: #6b7280; font-size: 0.85rem; margin-bottom: 8px; font-weight: 600; text-transform: uppercase;
}

.parcelamento-box {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}

.parcela-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
  font-size: 1rem;
}

.cota-badge {
  background: #e5e7eb;
  color: #4b5563;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.parcela-total {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed #d1d5db;
  font-weight: 700;
  color: #1e3a8a;
  font-size: 0.9rem;
}

.cotas-selecionadas {
  margin-top: 24px;
}

.cotas-selecionadas h3 {
  font-size: 1rem; color: #111827; font-weight: 700; margin-bottom: 12px;
}

.cota-item {
  font-size: 0.9rem; color: #4b5563; margin-bottom: 6px;
  padding-left: 8px; border-left: 3px solid #e5e7eb;
}

.modal-footer {
  padding: 16px 20px;
  display: flex; gap: 12px;
  background: #f9fafb;
}

.modal-footer button {
  flex: 1;
  padding: 12px; border-radius: 8px;
  font-weight: 700; font-size: 0.95rem;
  display: flex; align-items: center; justify-content: center; gap: 8px;
  cursor: pointer; border: none; transition: 0.2s;
}

.btn-share { background: #f3f4f6; color: #374151; }
.btn-share:hover { background: #e5e7eb; }

.btn-negotiate { background: #00b37e; color: white; }
.btn-negotiate:hover { background: #009d6e; }

@media (max-width: 480px) {
  .modal-footer { flex-direction: column; }
}
</style>