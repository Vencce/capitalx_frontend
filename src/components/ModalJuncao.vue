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

// Lógica para o escalonamento de parcelas
const fluxoPagamento = computed(() => {
  if (props.cartas.length < 2) return null

  // Ordenamos as cotas por prazo (menor para o maior)
  const cotasOrdenadas = [...props.cartas].sort((a, b) => parseInt(a.numero_parcelas) - parseInt(b.numero_parcelas))
  
  const prazoMenor = parseInt(cotasOrdenadas[0].numero_parcelas)
  const prazoMaior = parseInt(cotasOrdenadas[cotasOrdenadas.length - 1].numero_parcelas)
  
  const valorCotaCurta = parseFloat(cotasOrdenadas[0].valor_parcela)
  const valorCotaLonga = parseFloat(cotasOrdenadas[cotasOrdenadas.length - 1].valor_parcela)

  return {
    periodo1: {
      meses: prazoMenor,
      valor: valorCotaCurta + valorCotaLonga
    },
    periodo2: {
      meses: prazoMaior - prazoMenor,
      valor: valorCotaLonga
    },
    prazoTotal: prazoMaior
  }
})

const copiarTudo = async () => {
  let texto = `📊 RESULTADO DA JUNÇÃO\n`
  texto += `Crédito Total: ${formatCurrency(totalCredito.value)}\n`
  texto += `Entrada Total: ${formatCurrency(totalEntrada.value)}\n\n`
  
  if (fluxoPagamento.value) {
    const f = fluxoPagamento.value
    texto += `PLANO DE PAGAMENTO:\n`
    texto += `- Primeiras ${f.periodo1.meses} parcelas: ${formatCurrency(f.periodo1.valor)}\n`
    texto += `- Próximas ${f.periodo2.meses} parcelas: ${formatCurrency(f.periodo2.valor)}\n`
    texto += `Prazo total: ${f.prazoTotal} meses\n\n`
  }

  texto += `COTAS SELECIONADAS:\n`
  props.cartas.forEach(c => {
    texto += `- Cód: ${c.codigo} | ${c.administradora_detalhes?.nome}: ${formatCurrency(c.valor_credito)}\n`
  })

  try {
    await navigator.clipboard.writeText(texto)
    alert('Resumo copiado!')
  } catch (err) { console.error(err) }
}

const abrirWhatsapp = () => {
  const f = fluxoPagamento.value
  let parcelamento = ""
  if (f) {
    parcelamento = `${f.periodo1.meses}x de ${formatCurrency(f.periodo1.valor)} + ${f.periodo2.meses}x de ${formatCurrency(f.periodo2.valor)}`
  }

  const texto = `Olá! Tenho interesse na junção das cartas que totalizam ${formatCurrency(totalCredito.value)} de crédito.\n\nPlano: ${parcelamento}.\nPrazo total: ${f?.prazoTotal} meses.`
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
              <button class="btn-copy-small" @click="copiarTudo">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>

            <div class="section-divider"></div>

            <div v-if="fluxoPagamento" class="parcelamento-box">
              <p class="section-label">Plano de Pagamento Escalonado:</p>
              
              <div class="step-container">
                <div class="step-item">
                  <span class="step-time">{{ fluxoPagamento.periodo1.meses }} meses de</span>
                  <strong class="step-price">{{ formatCurrency(fluxoPagamento.periodo1.valor) }}</strong>
                  <small>(Cotas juntas)</small>
                </div>
                
                <div class="step-divider">+</div>

                <div class="step-item highlight">
                  <span class="step-time">{{ fluxoPagamento.periodo2.meses }} meses de</span>
                  <strong class="step-price">{{ formatCurrency(fluxoPagamento.periodo2.valor) }}</strong>
                  <small>(Cota restante)</small>
                </div>
              </div>

              <div class="total-parcelas-footer">
                <span>Duração total: <strong>{{ fluxoPagamento.prazoTotal }} meses</strong></span>
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

/* Estilo do Escalonamento */
.parcelamento-box { background: #f0f7ff; padding: 25px; border-radius: 18px; border: 1px solid #dbeafe; text-align: center; }
.section-label { color: #1e3a8a; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; margin-bottom: 20px; letter-spacing: 1px; }
.step-container { display: flex; align-items: center; justify-content: center; gap: 15px; margin-bottom: 20px; }
.step-item { display: flex; flex-direction: column; gap: 4px; }
.step-time { font-size: 0.85rem; color: #64748b; font-weight: 600; }
.step-price { font-size: 1.2rem; color: #1e3a8a; font-weight: 800; }
.step-item small { font-size: 0.65rem; color: #94a3b8; font-weight: 700; text-transform: uppercase; }
.step-divider { font-size: 1.5rem; font-weight: 900; color: #cbd5e1; }
.step-item.highlight .step-price { color: #059669; }

.total-parcelas-footer { border-top: 1px dashed #dbeafe; padding-top: 15px; font-size: 0.95rem; color: #1e293b; }
.cotas-selecionadas h3 { font-size: 1rem; margin-bottom: 12px; color: #1e293b; }
.cota-item { font-size: 0.85rem; color: #64748b; padding: 8px; border-left: 3px solid #e2e8f0; margin-bottom: 5px; background: #f8fafc; }
.modal-footer { padding: 20px; background: #f8fafc; }
.btn-negotiate { width: 100%; background: #059669; color: white; border: none; padding: 15px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; transition: 0.3s; }
.btn-negotiate:hover { background: #047857; transform: translateY(-2px); }
</style>