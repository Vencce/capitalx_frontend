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

const API_BASE_URL = 'http://localhost:8000'

const formatCurrency = (value) => {
  if (!value && value !== 0) return ''
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const formatDate = (dateString) => {
  if (!dateString) return 'A consultar'
  const [year, month, day] = dateString.split('-')
  return `${day}/${month}/${year}`
}

const formatTaxa = (valor) => {
  if (!valor || valor === '0' || valor === 0) return 'Grátis'
  return valor
}

const adminDetalhes = computed(() => props.carta.administradora_detalhes || {})
const showModal = ref(false)

const custoTotal = computed(() => {
  const totalParcelas = props.carta.numero_parcelas * parseFloat(props.carta.valor_parcela)
  return parseFloat(props.carta.valor_entrada) + totalParcelas
})

const getLogoUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  const separator = path.startsWith('/') ? '' : '/'
  return `${API_BASE_URL}${separator}${path}`
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
Saldo Devedor: ${props.carta.saldo_devedor ? formatCurrency(props.carta.saldo_devedor) : 'N/A'}
Taxa de Transf.: ${formatTaxa(props.carta.taxa_transferencia)}
Vencimento: ${formatDate(props.carta.vencimento)}
Contemplação: ${props.carta.tipo_contemplacao || 'N/A'}
  `.trim()

  try {
    await navigator.clipboard.writeText(texto)
    alert('Informações copiadas com sucesso!')
  } catch (err) {
    console.error(err)
  }
}

const abrirWhatsapp = () => {
  const nomeBanco = adminDetalhes.value.nome || 'Banco'
  const texto = `Olá! Tenho interesse na carta Cód: ${props.carta.codigo} (${nomeBanco}) de ${formatCurrency(props.carta.valor_credito)}.`
  const numeroDestino = configStore.whatsapp || '5547999999999'
  window.open(`https://wa.me/${numeroDestino}?text=${encodeURIComponent(texto)}`, '_blank')
}

const compartilhar = async () => {
  const dados = {
    title: 'Carta Contemplada',
    text: `Confira esta carta: ${formatCurrency(props.carta.valor_credito)}`,
    url: window.location.href
  }
  try {
    if (navigator.share) await navigator.share(dados)
    else {
      await navigator.clipboard.writeText(`${dados.text} - ${dados.url}`)
      alert('Link copiado!')
    }
  } catch (err) { console.error(err) }
}

const handleCardClick = () => {
  if (props.disabled || props.carta.status !== 'DISPONIVEL') return
  emit('toggle-selection', props.carta)
}
</script>

<template>
  <div 
    class="card-horizontal" 
    :class="[
      carta.status.toLowerCase(), 
      { 'is-selected': selected, 'is-disabled': disabled || carta.status !== 'DISPONIVEL' }
    ]"
    @click="handleCardClick"
  >
    <div v-if="carta.status === 'DISPONIVEL'" class="selection-indicator">
      <div class="checkbox-custom" :class="{ checked: selected }"></div>
    </div>
    
    <div class="card-main">
      <div class="primary-section">
        <div class="icon-box">
          <svg v-if="carta.tipo === 'AUTOMOVEL'" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" fill="currentColor">
             <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
          </svg>
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
        <img 
          v-if="adminDetalhes.logo" 
          :src="getLogoUrl(adminDetalhes.logo)" 
          class="logo-img" 
          :alt="adminDetalhes.nome" 
        />
      </div>
    </div>

    <div class="card-footer">
      <div class="footer-left">
         <span class="status-badge" :class="carta.status.toLowerCase()">
            <span class="dot"></span> {{ props.carta.status }}
         </span>
      </div>

      <div class="actions">
        <button class="btn-icon" @click.stop="copiarConteudo" title="Copiar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
        <button class="btn-secondary" @click.stop="showModal = true">Detalhes</button>
        <button class="btn-whatsapp" @click.stop="abrirWhatsapp">
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-icon">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          WhatsApp
        </button>
      </div>
    </div>

    <Teleport to="body">
        <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
          <div class="modal-content" :class="carta.status.toLowerCase()">
            <button class="close-btn" @click="showModal = false">✕</button>
            <div class="modal-header">
              <div class="modal-icon-box">
                <svg v-if="carta.tipo === 'AUTOMOVEL'" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="currentColor">
                   <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
                </svg>
              </div>
              <div>
                <span class="modal-subtitle">Detalhes da Oportunidade</span>
                <h2 class="modal-title">{{ adminDetalhes.nome }}</h2>
                <span class="status-badge modal-badge" :class="carta.status.toLowerCase()">
                  {{ props.carta.status }}
                </span>
              </div>
            </div>
            <div class="modal-section-title">Financeiro</div>
            <div class="modal-grid">
              <div class="modal-item highlight">
                <span>Crédito</span>
                <strong style="color: #1e3a8a">{{ formatCurrency(props.carta.valor_credito) }}</strong>
              </div>
              <div class="modal-item">
                <span>Entrada</span>
                <strong style="color: #F6D001">{{ formatCurrency(props.carta.valor_entrada) }}</strong>
              </div>
              <div class="modal-item">
                <span>Parcelas</span>
                <strong>{{ props.carta.numero_parcelas }}x {{ formatCurrency(props.carta.valor_parcela) }}</strong>
              </div>
              <div class="modal-item">
                 <span>Custo Total</span>
                 <strong>{{ formatCurrency(custoTotal) }}</strong>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-whatsapp block" @click="abrirWhatsapp">
                Chamar no WhatsApp
              </button>
            </div>
          </div>
        </div>
    </Teleport>
  </div>
</template>

<style scoped>
.card-horizontal {
  background: white; border: 1px solid #e5e7eb; border-radius: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.04);
  width: 100%; overflow: hidden; transition: all 0.3s ease; position: relative;
  border-left: 5px solid #e5e7eb; cursor: pointer;
}
.card-horizontal:hover:not(.is-disabled) { transform: translateY(-2px); box-shadow: 0 12px 20px -5px rgba(0,0,0,0.08); }
.card-horizontal.is-selected { border-color: #1e3a8a; background-color: #f0f7ff; }
.card-horizontal.is-disabled { opacity: 0.5; cursor: not-allowed; filter: grayscale(0.8); }

.selection-indicator { position: absolute; top: 12px; left: 12px; z-index: 5; }
.checkbox-custom { width: 22px; height: 22px; border: 2px solid #cbd5e1; border-radius: 6px; background: white; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.checkbox-custom.checked { background: #1e3a8a; border-color: #1e3a8a; }
.checkbox-custom.checked::after { content: '✓'; color: white; font-weight: bold; font-size: 14px; }

.card-horizontal.disponivel { border-left-color: #22c55e; }
.card-horizontal.reservado { border-left-color: #F6D001; }
.card-horizontal.vendido { border-left-color: #ef4444; }

/* LAYOUT DESKTOP */
.card-main { padding: 24px; display: grid; grid-template-columns: 1.5fr 2.5fr 1fr; gap: 24px; align-items: center; }
.primary-section { display: flex; align-items: center; gap: 16px; padding-left: 20px; }
.icon-box { width: 52px; height: 52px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: white; background: #1e3a8a; }
.icon-box svg { width: 26px; height: 26px; fill: currentColor; }

.info-principal { display: flex; flex-direction: column; }
.bank-name { font-size: 0.7rem; color: #6b7280; font-weight: 700; text-transform: uppercase; margin-bottom: 2px; }
.credit-value { margin: 0; font-size: 1.4rem; font-weight: 800; color: #111827; line-height: 1.1; }
.subtitle { font-size: 0.8rem; color: #9ca3af; }

.details-section { display: flex; justify-content: flex-start; gap: 40px; border-left: 2px solid #f3f4f6; padding-left: 30px; }
.detail-group { display: flex; flex-direction: column; gap: 2px; }
.label { font-size: 0.7rem; color: #6b7280; text-transform: uppercase; font-weight: 700; }
.val { font-size: 1.05rem; font-weight: 600; color: #374151; white-space: nowrap; }
.val.destaque { color: #F6D001; font-weight: 800; }

.logo-section { display: flex; justify-content: flex-end; align-items: center; }
.logo-img { max-height: 45px; max-width: 120px; object-fit: contain; }

.card-footer { background: #f8fafc; padding: 12px 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center; }
.status-badge { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; padding: 4px 10px; border-radius: 6px; display: flex; align-items: center; gap: 6px; }
.status-badge .dot { width: 8px; height: 8px; border-radius: 50%; background: currentColor; }
.status-badge.disponivel { background: #dcfce7; color: #166534; }
.status-badge.reservado { background: #fffbeb; color: #92400e; }
.status-badge.vendido { background: #fee2e2; color: #991b1b; }

.actions { display: flex; gap: 8px; }
button { display: flex; align-items: center; justify-content: center; gap: 6px; padding: 8px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; border: none; font-size: 0.85rem; transition: 0.2s; }
.btn-icon { background: white; border: 1px solid #e5e7eb; color: #6b7280; width: 38px; padding: 0; }
.btn-secondary { background: white; border: 1px solid #e5e7eb; color: #4b5563; }
.btn-whatsapp { background-color: #25D366; color: white; }
.w-icon { width: 16px; height: 16px; fill: white; }

/* MODAL STYLES ... (mantido padrão) */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(4px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal-content { background: white; width: 100%; max-width: 500px; border-radius: 20px; padding: 24px; position: relative; border-top: 6px solid #1e3a8a; }
.close-btn { position: absolute; top: 15px; right: 15px; background: #f3f4f6; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; }
.modal-header { display: flex; gap: 16px; margin-bottom: 20px; }
.modal-icon-box { width: 50px; height: 50px; background: #1e3a8a; color: white; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
.modal-title { margin: 0; font-size: 1.25rem; }
.modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
.modal-item { display: flex; flex-direction: column; }
.modal-item span { font-size: 0.7rem; color: #6b7280; text-transform: uppercase; font-weight: 700; }
.modal-item strong { font-size: 1rem; color: #111827; }
.block { width: 100%; margin-top: 10px; padding: 12px; }

/* RESPONSIVIDADE HORIZONTAL COMPACTA (MOBILE) */
@media (max-width: 480px) {
  .card-main { 
    grid-template-columns: 1fr auto; /* Texto esquerda, Logo direita */
    padding: 12px 12px 12px 35px; /* Espaço para o checkbox */
    gap: 10px;
  }
  
  .primary-section { 
    padding-left: 0;
    gap: 10px;
  }

  .icon-box { 
    width: 32px; height: 32px; border-radius: 8px;
  }
  .icon-box svg { width: 16px; height: 16px; }

  .credit-value { font-size: 1.1rem; }
  .bank-name { font-size: 0.6rem; }
  .subtitle { font-size: 0.7rem; }

  /* Detalhes ficam em linha compacta abaixo do crédito */
  .details-section { 
    grid-column: 1 / -1; 
    border-left: none; 
    padding-left: 0;
    gap: 15px;
    margin-top: 5px;
    border-top: 1px solid #f1f5f9;
    padding-top: 8px;
  }
  
  .val { font-size: 0.85rem; }
  .label { font-size: 0.6rem; }

  /* Logo reduzida na lateral direita do topo */
  .logo-section { 
    display: flex; 
    grid-row: 1; 
    grid-column: 2; 
    align-self: flex-start;
  }
  .logo-img { max-height: 25px; max-width: 60px; }

  /* Footer mais estreito */
  .card-footer { 
    padding: 10px 12px; 
    flex-direction: row; /* Mantém horizontal */
    justify-content: space-between;
  }

  .status-badge { font-size: 0.65rem; padding: 3px 6px; }
  
  .actions { gap: 4px; }
  button { padding: 6px 8px; font-size: 0.75rem; }
  .btn-icon { width: 30px; height: 30px; }
  .w-icon { width: 12px; height: 12px; }
}
</style>