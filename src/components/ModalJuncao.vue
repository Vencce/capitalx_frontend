<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/config'

const props = defineProps({
  show: Boolean,
  cartas: {
    type: Array,
    default: () => [],
  },
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

// LÓGICA CORRIGIDA: Usando 'numero_parcelas' conforme o JSON da API
const parcelamentoDetalhado = computed(() => {
  const grupos = {}
  props.cartas.forEach((c) => {
    // Ajuste aqui: pegando o campo 'numero_parcelas' retornado pela sua API
    const prazoEfetivo = c.numero_parcelas || 0
    const valorEfetivo = parseFloat(c.valor_parcela || 0)

    const chave = `${prazoEfetivo}x${valorEfetivo}`

    if (!grupos[chave]) {
      grupos[chave] = {
        prazo: prazoEfetivo,
        valor: valorEfetivo,
        qtd: 1,
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

  texto += `PARCELAMENTO DETALHADO:\n`
  parcelamentoDetalhado.value.forEach((p) => {
    texto += `- ${p.prazo}x de ${formatCurrency(p.valor)}${p.qtd > 1 ? ` (${p.qtd} cotas)` : ''}\n`
  })
  texto += `Soma das parcelas: ${formatCurrency(totalParcelaMensal.value)}\n\n`

  texto += `COTAS SELECIONADAS:\n`
  props.cartas.forEach((c) => {
    texto += `- Cód: ${c.codigo} | ${formatCurrency(c.valor_credito)}\n`
  })

  try {
    await navigator.clipboard.writeText(texto)
    alert('Resumo copiado!')
  } catch (err) {
    console.error(err)
  }
}

const abrirWhatsapp = () => {
  const codigos = props.cartas.map((c) => c.codigo).join(', ')
  const detalhamento = parcelamentoDetalhado.value
    .map((p) => `${p.prazo}x de ${formatCurrency(p.valor)}`)
    .join(' + ')

  const texto = `Olá! Tenho interesse na junção das cartas (${codigos}).\nTotal Crédito: ${formatCurrency(totalCredito.value)}\nParcelamento: ${detalhamento}`
  const numero = configStore.whatsapp || '5547999999999'
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank')
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
            <p>
              Crédito: <strong>{{ formatCurrency(totalCredito) }}</strong>
            </p>
            <p>
              Entrada: <strong>{{ formatCurrency(totalEntrada) }}</strong>
            </p>

            <div class="section-divider"></div>

            <div class="parcelamento-box">
              <p class="section-label">Parcelamento Detalhado:</p>
              <div v-for="(p, index) in parcelamentoDetalhado" :key="index" class="parcela-item">
                <strong>{{ p.prazo }}x de {{ formatCurrency(p.valor) }}</strong>
                <span v-if="p.qtd > 1" class="cota-badge">{{ p.qtd }} cotas</span>
              </div>
              <p class="parcela-total">
                Soma das parcelas: {{ formatCurrency(totalParcelaMensal) }}
              </p>
            </div>

            <div class="section-divider"></div>

            <div class="secondary-info">
              <p>
                Saldo devedor: <strong>{{ formatCurrency(totalSaldoDevedor) }}</strong>
              </p>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-negotiate" @click="abrirWhatsapp">Negociar no WhatsApp</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}
.modal-juncao {
  background: white;
  width: 100%;
  max-width: 450px;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.modal-header {
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #f3f4f6;
}
.modal-header h2 {
  color: #1e3a8a;
  font-size: 1.25rem;
  margin: 0;
  font-weight: 700;
}
.btn-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #9ca3af;
}
.modal-body {
  padding: 20px;
}
.section-divider {
  height: 1px;
  background: #f3f4f6;
  margin: 16px 0;
}
.parcelamento-box {
  background: #f9fafb;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid #f3f4f6;
}
.section-label {
  color: #6b7280;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 10px;
}
.parcela-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 1rem;
  color: #111827;
}
.cota-badge {
  background: #e5e7eb;
  color: #4b5563;
  font-size: 0.7rem;
  padding: 2px 6px;
  border-radius: 4px;
}
.parcela-total {
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px dashed #d1d5db;
  font-weight: 700;
  color: #1e3a8a;
}
.modal-footer {
  padding: 15px 20px;
  background: #f9fafb;
}
.btn-negotiate {
  width: 100%;
  padding: 14px;
  border-radius: 8px;
  background: #00b37e;
  color: white;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.btn-negotiate:hover {
  background: #009d6e;
}
</style>
