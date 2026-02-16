<script setup>
import { computed, ref } from 'vue'
import { useConfigStore } from '../stores/config'

const props = defineProps({
  carta: Object,
  selected: Boolean,
  disabled: Boolean
})

const emit = defineEmits(['toggle-selection'])
const configStore = useConfigStore()
const API_BASE_URL = 'https://capitalxinvest.onrender.com'

// Formatação universal: se vazio, nulo ou zero, vira "A consultar"
const formatCurrency = (value) => {
  if (!value || value === 0 || value === '0.00' || value === '') return 'A consultar'
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatDate = (dateString) => {
  if (!dateString || dateString === '') return 'A consultar'
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const formatTaxa = (valor) => {
  if (!valor || valor === '' || valor === '0' || valor === 0) return 'A consultar'
  return valor
}

const adminDetalhes = computed(() => props.carta.administradora_detalhes || {})
const showModal = ref(false)

const custoTotal = computed(() => {
  if (!props.carta.valor_parcela || !props.carta.valor_entrada) return 0
  const totalParcelas = props.carta.numero_parcelas * parseFloat(props.carta.valor_parcela)
  return parseFloat(props.carta.valor_entrada) + totalParcelas
})

const getLogoUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`
}

const copiarConteudo = async () => {
  const texto = `
📌 DETALHES DA CARTA DE CRÉDITO
-----------------------------------
Código: #${props.carta.codigo}
Administradora: ${adminDetalhes.value.nome || 'N/A'}
Tipo: ${props.carta.tipo}
-----------------------------------
Valor do Crédito: ${formatCurrency(props.carta.valor_credito)}
Valor da Entrada: ${formatCurrency(props.carta.valor_entrada)}
Parcelas: ${props.carta.numero_parcelas}x de ${formatCurrency(props.carta.valor_parcela)}
-----------------------------------
Saldo Devedor: ${formatCurrency(props.carta.saldo_devedor)}
Seguro de Vida: ${formatCurrency(props.carta.seguro_vida)}
Taxa de Transf.: ${formatTaxa(props.carta.taxa_transferencia)}
Vencimento: ${formatDate(props.carta.vencimento)}
Contemplação: ${props.carta.tipo_contemplacao || 'A consultar'}
  `.trim()

  try {
    await navigator.clipboard.writeText(texto)
    alert('Informações copiadas!')
  } catch (err) { console.error(err) }
}

const abrirWhatsapp = () => {
  const texto = `Olá! Tenho interesse na carta Cód: ${props.carta.codigo} de ${formatCurrency(props.carta.valor_credito)}.`
  const numeroDestino = configStore.whatsapp || '5547999999999'
  window.open(`https://wa.me/${numeroDestino}?text=${encodeURIComponent(texto)}`, '_blank')
}

const compartilhar = async () => {
  const dados = { title: 'Carta Contemplada', text: `Confira: ${formatCurrency(props.carta.valor_credito)}`, url: window.location.href }
  try {
    if (navigator.share) await navigator.share(dados)
    else { await navigator.clipboard.writeText(`${dados.text} - ${dados.url}`); alert('Link copiado!') }
  } catch (err) { console.error(err) }
}

const handleCardClick = () => {
  if (props.disabled || props.carta.status !== 'DISPONIVEL') return
  emit('toggle-selection', props.carta)
}
</script>

<template>
  <div class="card-horizontal" :class="[carta.status.toLowerCase(), { 'is-selected': selected, 'is-disabled': disabled || carta.status !== 'DISPONIVEL' }]" @click="handleCardClick">
    
    <div v-if="carta.status === 'DISPONIVEL'" class="selection-indicator">
      <div class="checkbox-custom" :class="{ checked: selected }"></div>
    </div>
    
    <div class="card-main">
      <div class="primary-section">
        <div class="icon-box">
          <svg v-if="carta.tipo === 'AUTOMOVEL'" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </div>
        <div class="info-principal">
          <span class="bank-name">{{ adminDetalhes.nome || 'Administradora' }}</span>
          <h3 class="credit-value">{{ formatCurrency(props.carta.valor_credito) }}</h3>
          <span class="subtitle">Crédito</span>
        </div>
      </div>

      <div class="details-section">
        <div class="detail-group">
          <span class="label">Entrada</span>
          <span class="val destaque">{{ formatCurrency(props.carta.valor_entrada) }}</span>
        </div>
        <div class="detail-group">
          <span class="label">Parcelas</span>
          <span class="val">{{ props.carta.numero_parcelas }}x {{ formatCurrency(props.carta.valor_parcela) }}</span>
        </div>
      </div>

      <div class="logo-section">
        <img v-if="adminDetalhes.logo" :src="getLogoUrl(adminDetalhes.logo)" class="logo-img" />
      </div>
    </div>

    <div class="card-footer">
      <div class="footer-left">
         <span class="status-badge" :class="carta.status.toLowerCase()">
            <span class="dot"></span> {{ props.carta.status }}
         </span>
      </div>
      <div class="actions">
        <button class="btn-icon" @click.stop="copiarConteudo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg></button>
        <button class="btn-secondary" @click.stop="showModal = true">Mais Detalhes</button>
        <button class="btn-primary btn-whatsapp" @click.stop="abrirWhatsapp">WhatsApp</button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content" :class="carta.status.toLowerCase()">
          <button class="close-btn" @click="showModal = false">✕</button>
          <div class="modal-header">
            <div class="modal-icon-box">
              <svg v-if="carta.tipo === 'AUTOMOVEL'" viewBox="0 0 24 24" fill="currentColor"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <div>
              <h2 class="modal-title">{{ adminDetalhes.nome }}</h2>
              <span class="status-badge modal-badge" :class="carta.status.toLowerCase()">{{ props.carta.status }}</span>
            </div>
          </div>
          <div class="modal-section-title">Financeiro</div>
          <div class="modal-grid">
            <div class="modal-item"><span>Crédito</span><strong>{{ formatCurrency(props.carta.valor_credito) }}</strong></div>
            <div class="modal-item"><span>Entrada</span><strong>{{ formatCurrency(props.carta.valor_entrada) }}</strong></div>
            <div class="modal-item"><span>Parcelas</span><strong>{{ props.carta.numero_parcelas }}x {{ formatCurrency(props.carta.valor_parcela) }}</strong></div>
            <div class="modal-item"><span>Seguro de Vida</span><strong>{{ formatCurrency(props.carta.seguro_vida) }}</strong></div>
            <div class="modal-item"><span>Saldo Devedor</span><strong>{{ formatCurrency(props.carta.saldo_devedor) }}</strong></div>
            <div class="modal-item"><span>Custo Total</span><strong>{{ custoTotal > 0 ? formatCurrency(custoTotal) : 'A consultar' }}</strong></div>
          </div>
          <div class="modal-section-title">Especificações</div>
          <div class="modal-grid secondary">
            <div class="modal-item"><span>Taxa Transf.</span><strong>{{ formatTaxa(props.carta.taxa_transferencia) }}</strong></div>
            <div class="modal-item"><span>Vencimento</span><strong>{{ formatDate(props.carta.vencimento) }}</strong></div>
            <div class="modal-item"><span>Código</span><strong>#{{ props.carta.codigo }}</strong></div>
          </div>
          <button class="btn-primary block btn-whatsapp" @click="abrirWhatsapp">Falar com Consultor</button>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
/* RESET DE BOX SIZING PARA EVITAR ESTOURO */
* {
  box-sizing: border-box;
}

.card-horizontal {
  background: white; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  width: 100%; overflow: hidden; transition: all 0.3s ease; position: relative;
  border-left: 5px solid #e5e7eb; cursor: pointer;
}
.card-horizontal:hover:not(.is-disabled) { transform: translateY(-3px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.1); border-color: #1e3a8a; }
.card-horizontal.is-selected { border-color: #1e3a8a; background-color: #f0f7ff; }
.card-horizontal.is-disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(0.8); }

.selection-indicator { position: absolute; top: 10px; right: 10px; z-index: 5; }
.checkbox-custom { width: 22px; height: 22px; border: 2px solid #cbd5e1; border-radius: 6px; background: white; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.checkbox-custom.checked { background: #1e3a8a; border-color: #1e3a8a; }
.checkbox-custom.checked::after { content: '✓'; color: white; font-weight: bold; font-size: 14px; }

.card-horizontal.disponivel { border-left-color: #22c55e; }
.card-horizontal.reservado { border-left-color: #F6D001; }
.card-horizontal.vendido { border-left-color: #ef4444; }

/* LAYOUT DESKTOP */
.card-main { padding: 24px; display: grid; grid-template-columns: 1.8fr 3fr 1fr; gap: 24px; align-items: center; }
.primary-section { display: flex; align-items: center; gap: 16px; }
.icon-box { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); color: white; background: #1e3a8a; }
.icon-box svg { width: 26px; height: 26px; fill: currentColor; }
.info-principal { display: flex; flex-direction: column; }
.bank-name { font-size: 0.7rem; color: #6b7280; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
.credit-value { margin: 0; font-size: 1.4rem; font-weight: 800; color: #111827; line-height: 1.1; }
.subtitle { font-size: 0.8rem; color: #9ca3af; }

.details-section { display: flex; justify-content: flex-start; gap: 40px; border-left: 2px solid #f3f4f6; padding-left: 30px; }
.detail-group { display: flex; flex-direction: column; gap: 2px; }
.label { font-size: 0.7rem; color: #6b7280; text-transform: uppercase; font-weight: 700; }
.val { font-size: 1.05rem; font-weight: 600; color: #374151; white-space: nowrap; }
.val.destaque { color: #F6D001; font-weight: 800; text-shadow: 0px 0px 1px rgba(0,0,0,0.1); }
.code { font-family: ui-monospace, monospace; color: #6b7280; background: #f3f4f6; padding: 2px 8px; border-radius: 6px; font-size: 0.85rem; font-weight: 500; }

.logo-section { display: flex; justify-content: center; align-items: center; height: 100%; }
.logo-img { max-height: 60px; max-width: 180px; object-fit: contain; transition: all 0.3s; }

.card-footer { background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
.footer-left { display: flex; align-items: center; gap: 10px; }
.status-badge { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 6px 12px; border-radius: 6px; letter-spacing: 0.5px; display: flex; align-items: center; gap: 6px; }
.status-badge .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.status-badge.disponivel { background: #dcfce7; color: #166534; }
.status-badge.reservado { background: #F6D001; color: #1e293b; }
.status-badge.vendido { background: #fee2e2; color: #991b1b; }

.actions { display: flex; gap: 10px; }
button { display: flex; align-items: center; justify-content: center; gap: 8px; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; font-size: 0.9rem; transition: all 0.2s; }
.btn-icon { background: white; border: 1px solid #e5e7eb; color: #6b7280; padding: 8px; width: 40px; height: 40px; }
.btn-icon svg { width: 20px; height: 20px; }
.btn-icon:hover { border-color: #F6D001; color: #F6D001; background: #FFFBEB; }
.btn-secondary { background: white; border: 1px solid #e5e7eb; color: #4b5563; }
.btn-secondary:hover { background: #f3f4f6; border-color: #d1d5db; color: #111827; }
.btn-primary { background: #1e3a8a; color: white; box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.25); }
.btn-primary:hover { background: #1e40af; transform: translateY(-2px); }
.btn-whatsapp { background-color: #25D366; box-shadow: 0 4px 6px -1px rgba(37, 211, 102, 0.25); }
.btn-whatsapp:hover { background-color: #1da851; }
.w-icon { width: 20px; height: 20px; fill: white; }

/* MODAL STYLES (MANTIDOS) */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-content { background: white; width: 100%; max-width: 550px; border-radius: 24px; padding: 32px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); position: relative; animation: popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); max-height: 90vh; overflow-y: auto; border-top: 8px solid #1e3a8a; }
.modal-content.disponivel { border-top-color: #16a34a; }
.modal-content.reservado { border-top-color: #F6D001; }
.modal-content.vendido { border-top-color: #dc2626; }
.close-btn { position: absolute; top: 20px; right: 20px; background: #f3f4f6; color: #9ca3af; width: 32px; height: 32px; border-radius: 50%; padding: 0; border: none; font-size: 1rem; }
.modal-header { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; }
.modal-icon-box { width: 64px; height: 64px; border-radius: 16px; display: flex; align-items: center; justify-content: center; background: #1e3a8a; color: white; }
.modal-subtitle { font-size: 0.75rem; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; }
.modal-title { margin: 4px 0 10px 0; color: #111827; font-size: 1.5rem; font-weight: 800; line-height: 1.1; }
.modal-badge { display: inline-flex; font-size: 0.7rem; padding: 4px 10px; }
.modal-section-title { font-size: 0.85rem; color: #1e3a8a; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 20px; margin-bottom: 12px; border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
.modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 10px; }
.modal-grid.secondary { background: #f9fafb; padding: 15px; border-radius: 12px; gap: 15px; }
.modal-item { display: flex; flex-direction: column; gap: 4px; }
.modal-item span { font-size: 0.75rem; color: #6b7280; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; }
.modal-item strong { font-size: 1.1rem; color: #1f2937; font-weight: 700; }
.modal-item p { font-size: 0.95rem; color: #374151; line-height: 1.5; margin: 0; white-space: pre-wrap; }
.modal-item.highlight strong { color: #1e3a8a; font-size: 1.4rem; font-weight: 900; }
.modal-item.full-width { grid-column: 1 / -1; }
.block { width: 100%; justify-content: center; padding: 14px; font-size: 1rem; margin-top: 20px; }

@keyframes popIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

/* RESPONSIVIDADE HORIZONTAL COMPACTA (RESOLUÇÃO 490px) */
@media (max-width: 600px) {
  .card-main { 
    grid-template-columns: 1fr auto; 
    padding: 10px 10px 10px 32px; /* Reduzido padding */
    gap: 8px;
  }
  
  .primary-section { gap: 8px; }
  .icon-box { width: 36px; height: 36px; border-radius: 6px; }
  .icon-box svg { width: 18px; height: 18px; }

  .credit-value { font-size: 1.05rem; }
  .bank-name { font-size: 0.55rem; }
  .subtitle { font-size: 0.65rem; }

  .details-section { 
    grid-column: 1 / -1; 
    border-left: none; 
    padding-left: 0;
    gap: 12px;
    margin-top: 6px;
    border-top: 1px solid #f1f5f9;
    padding-top: 8px;
    justify-content: flex-start;
  }
  
  .val { font-size: 0.8rem; letter-spacing: -0.2px; }
  .label { font-size: 0.55rem; }

  .logo-section { 
    grid-row: 1; 
    grid-column: 2; 
    align-self: center; /* Centralizado para caber melhor na linha */
  }
  .logo-img { max-height: 22px; max-width: 65px; }

  .card-footer { 
    padding: 8px 12px; 
    flex-wrap: wrap;
    gap: 8px;
  }

  .status-badge { font-size: 0.6rem; padding: 2px 6px; }
  
  .actions { 
    gap: 5px; 
    width: 100%; 
    justify-content: space-between; 
    border-top: 1px solid #f1f5f9;
    padding-top: 8px;
  }
  
  button { padding: 6px 8px; font-size: 0.75rem; flex: 1; height: 32px; }
  .btn-icon { width: 32px; height: 32px; flex: 0 0 auto; }
  .btn-secondary { font-size: 0.7rem; }
  .btn-whatsapp { font-size: 0.75rem; }
  .w-icon { width: 12px; height: 12px; }
  
  .selection-indicator { top: 8px; left: 8px; }
  .checkbox-custom { width: 18px; height: 18px; }
}

/* AJUSTE PARA TELAS EXTREMAMENTE PEQUENAS (ABAIXO DE 380px) */
@media (max-width: 380px) {
  .details-section { gap: 8px; }
  .val { font-size: 0.75rem; }
  .credit-value { font-size: 1rem; }
}
</style>