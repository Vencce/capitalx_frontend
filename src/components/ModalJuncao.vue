<script setup>
import { computed } from 'vue'
import { useConfigStore } from '../stores/config'
// Importando ícones para manter o padrão do seu projeto
import { 
  Share2, MessageCircle, Copy, X, 
  ChevronDown, CreditCard, Wallet 
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

const totalCredito = computed(() => props.cartas.reduce((acc, c) => acc + parseFloat(c.valor_credito || 0), 0))
const totalEntrada = computed(() => props.cartas.reduce((acc, c) => acc + parseFloat(c.valor_entrada || 0), 0))

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
  let texto = `📊 RESULTADO DA JUNÇÃO - CAPITAL X\n`
  texto += `Crédito: ${formatCurrency(totalCredito.value)}\n`
  texto += `Entrada: ${formatCurrency(totalEntrada.value)}\n\n`
  texto += `PLANO ESCALONADO:\n`
  fluxoPagamentoDinamico.value.forEach((d) => {
    texto += `- ${d.meses} meses de ${formatCurrency(d.valor)}\n`
  })
  try {
    await navigator.clipboard.writeText(texto)
    alert('Resumo copiado com sucesso!')
  } catch (err) { console.error(err) }
}

const abrirWhatsapp = () => {
  const f = fluxoPagamentoDinamico.value
  const parcelamento = f.map(d => `${d.meses}x de ${formatCurrency(d.valor)}`).join(' + ')
  const texto = `Olá! Tenho interesse na junção das cartas que totalizam ${formatCurrency(totalCredito.value)} de crédito.\n\nPlano: ${parcelamento}.\nPrazo total: ${prazoMaximo.value} meses.`
  const numero = configStore.whatsapp || '5547999999999'
  window.open(`https://wa.me/${numero}?text=${encodeURIComponent(texto)}`, '_blank')
}

const compartilhar = async () => {
  const f = fluxoPagamentoDinamico.value
  const parcelasTexto = f.map(d => `${d.meses}x de ${formatCurrency(d.valor)}`).join(' + ')
  const dados = {
    title: 'Oportunidade de Junção - Capital X',
    text: `Crédito de ${formatCurrency(totalCredito.value)} com plano escalonado: ${parcelasTexto}.`,
    url: window.location.href
  }
  try {
    if (navigator.share) await navigator.share(dados)
    else {
      await navigator.clipboard.writeText(`${dados.text} ${dados.url}`)
      alert('Link de compartilhamento copiado!')
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
          <div class="summary-cards">
            <div class="sum-card">
              <div class="sum-icon blue"><CreditCard :size="18" /></div>
              <div class="sum-data">
                <span>Crédito</span>
                <strong>{{ formatCurrency(totalCredito) }}</strong>
              </div>
              <button class="btn-copy-float" @click="copiarTudo"><Copy :size="16" /></button>
            </div>
            
            <div class="sum-card">
              <div class="sum-icon yellow"><Wallet :size="18" /></div>
              <div class="sum-data">
                <span>Entrada</span>
                <strong>{{ formatCurrency(totalEntrada) }}</strong>
              </div>
            </div>
          </div>

          <div class="plan-container">
            <div class="plan-header">
              <h3>PLANO DE PAGAMENTO ESCALONADO</h3>
            </div>

            <div class="steps-wrapper">
              <div v-for="(degrau, index) in fluxoPagamentoDinamico" :key="index" class="step-group">
                <div class="step-box">
                  <span class="step-months"><strong>{{ degrau.meses }}</strong> meses de</span>
                  <span class="step-value" :class="{ 'final-price': degrau.isFinal }">
                    {{ formatCurrency(degrau.valor) }}
                  </span>
                </div>
                <div v-if="!degrau.isFinal" class="step-connector">
                  <ChevronDown :size="16" />
                </div>
              </div>
            </div>
            
            <div class="plan-footer">
              <p>Prazo total da operação: <strong>{{ prazoMaximo }} meses</strong></p>
            </div>
          </div>
        </div>

        <footer class="modal-footer">
          <button class="btn-action share" @click="compartilhar">
            <Share2 :size="18" /> Compartilhar
          </button>
          <button class="btn-action whatsapp" @click="abrirWhatsapp">
            <MessageCircle :size="18" /> Negociar Junção
          </button>
        </footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center;
  z-index: 10000; padding: 20px;
}

.modal-juncao {
  background: white; width: 100%; max-width: 460px;
  border-radius: 24px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  overflow: hidden; display: flex; flex-direction: column;
  animation: modalEnter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.modal-header {
  padding: 20px 24px; display: flex; justify-content: space-between;
  align-items: center; border-bottom: 1px solid #f1f5f9;
}

.modal-header h2 { color: #1e3a8a; font-size: 1.25rem; font-weight: 800; margin: 0; }

.btn-close {
  background: #f1f5f9; border: none; padding: 6px; border-radius: 50%;
  color: #64748b; cursor: pointer; transition: 0.2s;
}
.btn-close:hover { background: #e2e8f0; color: #1e293b; }

.modal-body { padding: 24px; max-height: 70vh; overflow-y: auto; }

/* CARDS DE RESUMO */
.summary-cards { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 24px; }
.sum-card {
  background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px;
  border-radius: 16px; display: flex; align-items: center; gap: 16px; position: relative;
}
.sum-icon {
  width: 40px; height: 40px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.sum-icon.blue { background: #eff6ff; color: #1e3a8a; }
.sum-icon.yellow { background: #fffbeb; color: #f59e0b; }

.sum-data span { display: block; font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; }
.sum-data strong { font-size: 1.15rem; color: #0f172a; font-weight: 800; }

.btn-copy-float {
  position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  background: white; border: 1px solid #e2e8f0; padding: 8px; border-radius: 10px;
  color: #64748b; cursor: pointer; transition: 0.2s;
}
.btn-copy-float:hover { border-color: #1e3a8a; color: #1e3a8a; }

/* CONTAINER DO PLANO */
.plan-container {
  background: #f0f7ff; border: 1px solid #dbeafe; border-radius: 20px; padding: 24px;
}
.plan-header h3 {
  text-align: center; font-size: 0.8rem; font-weight: 800; color: #1e3a8a;
  margin: 0 0 20px 0; letter-spacing: 0.5px;
}

.steps-wrapper { display: flex; flex-direction: column; align-items: center; }
.step-group { display: flex; flex-direction: column; align-items: center; width: 100%; }

.step-box {
  background: white; width: 100%; padding: 14px 20px; border-radius: 14px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}
.step-months { font-size: 0.85rem; color: #64748b; }
.step-value { font-size: 1.1rem; font-weight: 800; color: #1e3a8a; }
.step-value.final-price { color: #10b981; }

.step-connector { color: #cbd5e1; margin: 4px 0; }

.plan-footer {
  margin-top: 15px; border-top: 1px dashed #cbd5e1; padding-top: 12px;
  text-align: center; font-size: 0.85rem; color: #475569;
}

/* RODAPÉ */
.modal-footer {
  padding: 20px 24px; background: #f8fafc; border-top: 1px solid #f1f5f9;
  display: grid; grid-template-columns: 110px 1fr; gap: 12px;
}

.btn-action {
  height: 48px; border: none; border-radius: 14px; font-weight: 800;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  cursor: pointer; transition: 0.2s; font-size: 0.9rem;
}

.btn-action.share { background: white; border: 1px solid #e2e8f0; color: #475569; }
.btn-action.share:hover { background: #f1f5f9; }

.btn-action.whatsapp { background: #10b981; color: white; }
.btn-action.whatsapp:hover { background: #059669; transform: translateY(-2px); }

@keyframes modalEnter {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@media (max-width: 400px) {
  .modal-footer { grid-template-columns: 1fr; }
  .step-box { flex-direction: column; gap: 5px; text-align: center; }
}
</style>