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

const totalCredito = computed(() => props.cartas.reduce((acc, c) => acc + parseFloat(c.valor_credito || 0), 0))
const totalEntrada = computed(() => props.cartas.reduce((acc, c) => acc + parseFloat(c.valor_entrada || 0), 0))
const totalSaldoDevedor = computed(() => props.cartas.reduce((acc, c) => acc + parseFloat(c.saldo_devedor || 0), 0))

const fluxoPagamentoDinamico = computed(() => {
  if (props.cartas.length < 1) return []

  // 1. Extrair prazos e valores únicos
  const cotas = props.cartas.map(c => ({
    prazo: parseInt(c.numero_parcelas),
    valor: parseFloat(c.valor_parcela)
  })).sort((a, b) => a.prazo - b.prazo)

  const prazosUnicos = [...new Set(cotas.map(c => c.prazo))].sort((a, b) => a - b)
  
  const degraus = []
  let mesesAnteriores = 0

  // 2. Calcular o valor pago em cada intervalo de tempo
  prazosUnicos.forEach(prazoAtual => {
    const duracaoDegrau = prazoAtual - mesesAnteriores
    
    // Soma o valor de todas as cotas que ainda possuem parcelas a pagar neste período
    const valorMensalNoPeriodo = cotas
      .filter(c => c.prazo >= prazoAtual)
      .reduce((acc, c) => acc + c.valor, 0)

    degraus.push({
      meses: duracaoDegrau,
      valor: valorMensalNoPeriodo,
      isFinal: prazoAtual === Math.max(...prazosUnicos.map(p => p))
    })

    mesesAnteriores = prazoAtual
  })

  return degraus
})

const prazoMaximo = computed(() => {
  if (props.cartas.length === 0) return 0
  return Math.max(...props.cartas.map(c => parseInt(c.numero_parcelas || 0)))
})

const copiarTudo = async () => {
  let texto = `📊 RESULTADO DA JUNÇÃO\n`
  texto += `Crédito Total: ${formatCurrency(totalCredito.value)}\n`
  texto += `Entrada Total: ${formatCurrency(totalEntrada.value)}\n\n`
  
  texto += `PLANO DE PAGAMENTO ESCALONADO:\n`
  fluxoPagamentoDinamico.value.forEach((d, i) => {
    texto += `- Etapa ${i+1}: ${d.meses} meses de ${formatCurrency(d.valor)}\n`
  })
  texto += `\nPrazo total da operação: ${prazoMaximo.value} meses\n`

  try {
    await navigator.clipboard.writeText(texto)
    alert('Resumo copiado!')
  } catch (err) { console.error(err) }
}

const abrirWhatsapp = () => {
  const f = fluxoPagamentoDinamico.value
  const parcelamento = f.map(d => `${d.meses}x de ${formatCurrency(d.valor)}`).join(' + ')

  const texto = `Olá! Tenho interesse na junção das cartas que totalizam ${formatCurrency(totalCredito.value)} de crédito.\n\nPlano Escalonado: ${parcelamento}.\nPrazo total: ${prazoMaximo.value} meses.`
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
            <div class="copy-wrapper">
              <p>Crédito: <strong>{{ formatCurrency(totalCredito) }}</strong></p>
              <p>Entrada: <strong>{{ formatCurrency(totalEntrada) }}</strong></p>
              <button class="btn-copy-small" @click="copiarTudo" title="Copiar resumo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>

            <div class="section-divider"></div>

            <div v-if="fluxoPagamentoDinamico.length" class="parcelamento-box">
              <p class="section-label">Plano de Pagamento Escalonado:</p>
              
              <div class="steps-vertical">
                <div v-for="(degrau, index) in fluxoPagamentoDinamico" :key="index" class="step-line">
                  <div class="step-info">
                    <span class="step-duration"><strong>{{ degrau.meses }} meses</strong> de</span>
                    <strong class="step-price" :class="{ 'last': degrau.isFinal }">
                      {{ formatCurrency(degrau.valor) }}
                    </strong>
                  </div>
                  <div v-if="!degrau.isFinal" class="step-arrow">↓</div>
                </div>
              </div>

              <div class="total-parcelas-footer">
                <span>Prazo máximo: <strong>{{ prazoMaximo }} meses</strong></span>
              </div>
            </div>

            <div class="section-divider"></div>

            <div class="secondary-info">
              <p>Saldo devedor total: <strong>{{ formatCurrency(totalSaldoDevedor) }}</strong></p>
              <p>Transferência e Seguro: <strong>Consultar</strong></p>
            </div>

            <div class="cotas-selecionadas">
              <h3>Cotas na junção:</h3>
              <div v-for="c in cartas" :key="c.codigo" class="cota-item">
                Cód: {{ c.codigo }} - {{ c.administradora_detalhes?.nome }}: {{ formatCurrency(c.valor_credito) }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-negotiate" @click="abrirWhatsapp">Negociar Junção</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 10000; padding: 20px; }
.modal-juncao { background: white; width: 100%; max-width: 480px; border-radius: 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); overflow: hidden; display: flex; flex-direction: column; border-top: 8px solid #1e3a8a; }
.modal-header { padding: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #f1f5f9; }
.modal-header h2 { color: #1e3a8a; font-size: 1.3rem; font-weight: 800; margin: 0; }
.btn-close { background: none; border: none; font-size: 1.2rem; color: #94a3b8; cursor: pointer; }
.modal-body { padding: 25px; max-height: 75vh; overflow-y: auto; }
.copy-wrapper { position: relative; }
.btn-copy-small { position: absolute; top: 0; right: 0; background: #f1f5f9; border: none; padding: 8px; border-radius: 8px; cursor: pointer; }
.main-info p { margin: 10px 0; font-size: 1.1rem; color: #1e293b; }
.section-divider { height: 1px; background: #f1f5f9; margin: 20px 0; }

/* Escalonamento Vertical para 3+ Cartas */
.parcelamento-box { background: #f0f7ff; padding: 25px; border-radius: 18px; border: 1px solid #dbeafe; }
.section-label { color: #1e3a8a; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px; text-align: center; }

.steps-vertical { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.step-line { display: flex; flex-direction: column; align-items: center; width: 100%; }
.step-info { background: white; padding: 12px 20px; border-radius: 12px; border: 1px solid #e2e8f0; width: 100%; display: flex; justify-content: space-between; align-items: center; }
.step-duration { font-size: 0.9rem; color: #64748b; }
.step-price { font-size: 1.1rem; color: #1e3a8a; font-weight: 800; }
.step-price.last { color: #059669; }
.step-arrow { color: #cbd5e1; font-weight: 900; margin-top: 5px; }

.total-parcelas-footer { border-top: 1px dashed #dbeafe; padding-top: 15px; margin-top: 10px; font-size: 0.95rem; color: #1e293b; text-align: center; }
.cotas-selecionadas h3 { font-size: 1rem; margin-bottom: 12px; color: #1e293b; }
.cota-item { font-size: 0.85rem; color: #64748b; padding: 8px; border-left: 3px solid #e2e8f0; margin-bottom: 5px; background: #f8fafc; }
.modal-footer { padding: 20px; background: #f8fafc; }
.btn-negotiate { width: 100%; background: #059669; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.3s; }
.btn-negotiate:hover { background: #047857; transform: translateY(-2px); }

@media (max-width: 480px) { .step-info { flex-direction: column; gap: 5px; text-align: center; } }
</style>