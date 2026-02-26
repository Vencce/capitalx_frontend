<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/config'
import { 
  Share2, MessageCircle, Copy, X, 
  ChevronDown, Calendar, ShieldCheck, Landmark
} from 'lucide-vue-next'

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

const formatDate = (dateString) => {
  if (!dateString) return 'A consultar'
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const totalCredito = computed(() => props.cartas.reduce((acc, c) => acc + parseFloat(c.valor_credito || 0), 0))
const totalEntrada = computed(() => props.cartas.reduce((acc, c) => acc + parseFloat(c.valor_entrada || 0), 0))
const totalSaldoDevedor = computed(() => props.cartas.reduce((acc, c) => acc + parseFloat(c.saldo_devedor || 0), 0))

const fluxoPagamentoDinamico = computed(() => {
  if (props.cartas.length < 1) return []
  const cotas = props.cartas.map(c => ({
    prazo: parseInt(c.numero_parcelas),
    valor: parseFloat(c.valor_parcela)
  })).sort((a, b) => a.prazo - b.prazo)

  const prazosUnicos = [...new Set(cotas.map(c => c.prazo))].sort((a, b) => a - b)
  const degraus = []
  let mesesAnteriores = 0

  prazosUnicos.forEach(prazoAtual => {
    const duracaoDegrau = prazoAtual - mesesAnteriores
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
  texto += `Entrada Total: ${formatCurrency(totalEntrada.value)}\n`
  texto += `Saldo Devedor: ${formatCurrency(totalSaldoDevedor.value)}\n\n`
  
  texto += `PARCELAMENTO:\n`
  const parcelasTexto = props.cartas.map(c => `${c.numero_parcelas}x de ${formatCurrency(c.valor_parcela)}`).join(' + ')
  texto += `${parcelasTexto}\n`
  texto += `Total de meses: ${prazoMaximo.value}\n`
  
  const resumoOperacao = fluxoPagamentoDinamico.value.map(d => `${d.meses} meses ${formatCurrency(d.valor)}`).join(' + ')
  texto += `Resumo da Operação: ${resumoOperacao}\n\n`

  texto += `COTAS SELECIONADAS:\n`
  props.cartas.forEach(c => {
    texto += ` • Cód: ${c.codigo} | ${c.tipo} | ${c.administradora_detalhes?.nome || 'Adm'}: ${formatCurrency(c.valor_credito)}\n`
  })

  try {
    await navigator.clipboard.writeText(texto)
    alert('Resumo copiado no novo padrão!')
  } catch (err) { console.error(err) }
}

const abrirWhatsapp = () => {
  const f = fluxoPagamentoDinamico.value
  const resumoOperacao = f.map(d => `${d.meses} meses ${formatCurrency(d.valor)}`).join(' + ')
  const texto = `Olá! Tenho interesse na junção das cartas que totalizam ${formatCurrency(totalCredito.value)} de crédito.\n\nResumo da Operação: ${resumoOperacao}.\nPrazo total: ${prazoMaximo.value} meses.`
  const numero = configStore.whatsapp || '5547999999999'
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank')
}

const compartilhar = async () => {
  const f = fluxoPagamentoDinamico.value
  const resumoOperacao = f.map(d => `${d.meses} meses ${formatCurrency(d.valor)}`).join(' + ')
  const dados = {
    title: 'Junção de Cartas - Capital X',
    text: `Crédito de ${formatCurrency(totalCredito.value)} | Resumo: ${resumoOperacao}.`,
    url: window.location.href
  }
  try {
    if (navigator.share) await navigator.share(dados)
    else {
      await navigator.clipboard.writeText(`${dados.text} ${dados.url}`)
      alert('Link copiado!')
    }
  } catch (err) { console.error(err) }
}
</script>

<template>
  <Teleport to="body">
    <div v-if="show" class="modal-overlay" @click.self="emit('close')">
      <div class="modal-juncao">
        <header class="modal-header">
          <h2>Resultado da junção</h2>
          <button class="btn-close" @click="emit('close')"><X :size="20" /></button>
        </header>

        <div class="modal-body">
          <div class="clean-summary">
            <div class="summary-item">
              <div class="label-box">
                <Landmark :size="14" /> <span>Crédito Total</span>
              </div>
              <div class="value-row">
                <strong>{{ formatCurrency(totalCredito) }}</strong>
                <button class="btn-copy-inline" @click="copiarTudo" title="Copiar Junção">
                  <Copy :size="16" />
                </button>
              </div>
            </div>

            <div class="summary-item">
              <div class="label-box">
                <Wallet :size="14" /> <span>Entrada Total</span>
              </div>
              <strong>{{ formatCurrency(totalEntrada) }}</strong>
            </div>
          </div>

          <div class="plan-box">
            <h3 class="section-title">PLANO DE PAGAMENTO ESCALONADO</h3>
            <div class="steps-list">
              <div v-for="(degrau, index) in fluxoPagamentoDinamico" :key="index" class="step-entry">
                <div class="step-card">
                  <span class="months"><strong>{{ degrau.meses }}</strong> meses de</span>
                  <span class="value" :class="{ 'highlight-green': degrau.isFinal }">
                    {{ formatCurrency(degrau.valor) }}
                  </span>
                </div>
                <div v-if="!degrau.isFinal" class="connector"><ChevronDown :size="14" /></div>
              </div>
            </div>
            <div class="plan-info">
              Prazo máximo: <strong>{{ prazoMaximo }} meses</strong>
            </div>
          </div>

          <div class="extra-details">
            <div class="detail-row">
              <div class="detail-label"><ShieldCheck :size="14" /> Saldo Devedor</div>
              <div class="detail-val">{{ formatCurrency(totalSaldoDevedor) }}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label"><Calendar :size="14" /> Vencimento Médio</div>
              <div class="detail-val">{{ formatDate(props.cartas[0]?.vencimento) }}</div>
            </div>
          </div>

          <div class="selected-tags">
            <p>Cotas: <span v-for="c in cartas" :key="c.id">#{{ c.codigo }}</span></p>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn-footer share" @click="compartilhar">
            <Share2 :size="18" /> Compartilhar
          </button>
          <button class="btn-footer whatsapp" @click="abrirWhatsapp">
            <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
            </svg>
            Negociar Junção
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center; z-index: 10000; padding: 20px;
}

.modal-juncao {
  background: white; width: 100%; max-width: 480px;
  border-radius: 28px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
  overflow: hidden; display: flex; flex-direction: column;
}

.modal-header {
  padding: 24px 28px; display: flex; justify-content: space-between; align-items: center;
}
.modal-header h2 { color: #1e3a8a; font-size: 1.4rem; font-weight: 800; margin: 0; }
.btn-close { background: #f1f5f9; border: none; padding: 8px; border-radius: 50%; color: #64748b; cursor: pointer; }

.modal-body { padding: 0 28px 28px; max-height: 75vh; overflow-y: auto; }

.clean-summary { margin-bottom: 30px; }
.summary-item { margin-bottom: 15px; }
.label-box { display: flex; align-items: center; gap: 8px; color: #64748b; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 4px; }
.value-row { display: flex; align-items: center; justify-content: space-between; }
.value-row strong { font-size: 1.8rem; color: #0f172a; font-weight: 800; letter-spacing: -0.5px; }
.summary-item strong:not(.value-row strong) { font-size: 1.4rem; color: #334155; font-weight: 700; }

.btn-copy-inline { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px; border-radius: 10px; color: #1e3a8a; cursor: pointer; }

.plan-box { background: #f0f7ff; border-radius: 24px; padding: 24px; margin-bottom: 24px; }
.section-title { text-align: center; font-size: 0.8rem; font-weight: 800; color: #1e3a8a; margin: 0 0 20px 0; letter-spacing: 0.5px; }
.steps-list { display: flex; flex-direction: column; align-items: center; }
.step-card { background: white; width: 100%; padding: 16px 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
.months { font-size: 0.9rem; color: #64748b; }

/* AJUSTE: Margem à esquerda para o valor não colar no "de" */
.value { font-size: 1.2rem; font-weight: 800; color: #1e3a8a; margin-left: 8px; }
.value.highlight-green { color: #10b981; }

.connector { color: #cbd5e1; margin: 4px 0; }
.plan-info { text-align: center; margin-top: 15px; font-size: 0.85rem; color: #475569; border-top: 1px dashed #cbd5e1; padding-top: 12px; }

.extra-details { border-top: 1px solid #f1f5f9; padding-top: 20px; display: flex; flex-direction: column; gap: 12px; }
.detail-row { display: flex; justify-content: space-between; align-items: center; }
.detail-label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #64748b; font-weight: 600; }
.detail-val { font-size: 0.95rem; font-weight: 700; color: #1e293b; }

.selected-tags { margin-top: 20px; font-size: 0.75rem; color: #94a3b8; }
.selected-tags span { margin-left: 5px; font-weight: 700; color: #64748b; }

.modal-footer { padding: 20px 28px; background: #f8fafc; border-top: 1px solid #f1f5f9; display: grid; grid-template-columns: 1fr 1.5fr; gap: 12px; }
.btn-footer { height: 52px; border: none; border-radius: 16px; font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
.btn-footer.share { background: white; border: 1px solid #e2e8f0; color: #475569; }
.btn-footer.whatsapp { background: #10b981; color: white; }
.btn-footer.whatsapp:hover { background: #059669; transform: translateY(-2px); }

@media (max-width: 440px) { .modal-footer { grid-template-columns: 1fr; } }
</style>