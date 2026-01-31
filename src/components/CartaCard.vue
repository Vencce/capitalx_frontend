<script setup>
import { computed } from 'vue'

const props = defineProps({
  carta: Object
})

const formatCurrency = (value) => {
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// Garante que não quebre se o detalhes vier vazio
const adminDetalhes = computed(() => props.carta.administradora_detalhes || {})

// Ícones SVG
const tipoIcon = computed(() => {
  if (props.carta.tipo === 'AUTOMOVEL') {
    return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>'
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/><path d="M18 10h2v10h-2z"/><path d="M18 14h2"/><path d="M18 18h2"/></svg>'
})

const abrirWhatsapp = () => {
  const nomeBanco = adminDetalhes.value.nome || 'Banco'
  const texto = `Olá! Tenho interesse na carta Cód: ${props.carta.codigo} (${nomeBanco}) de ${formatCurrency(props.carta.valor_credito)}.`
  window.open(`https://wa.me/5547999999999?text=${encodeURIComponent(texto)}`, '_blank')
}

const compartilhar = async () => {
  const nomeBanco = adminDetalhes.value.nome || 'Consórcio'
  const dados = {
    title: `Carta Contemplada - ${nomeBanco}`,
    text: `Olha essa carta de crédito de ${formatCurrency(props.carta.valor_credito)}!`,
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
  <div class="card-horizontal">
    <div class="card-main">
      
      <div class="primary-section">
        <div class="icon-box" v-html="tipoIcon"></div>
        <div>
          <span class="bank-name">{{ adminDetalhes.nome || 'Administradora' }}</span>
          <h3 class="credit-value">{{ formatCurrency(carta.valor_credito) }}</h3>
        </div>
      </div>

      <div class="details-section">
        <div class="detail-group">
          <span class="label">Entrada</span>
          <span class="val">{{ formatCurrency(carta.valor_entrada) }}</span>
        </div>
        <div class="detail-group">
          <span class="label">Parcelas</span>
          <span class="val">{{ carta.numero_parcelas }}x {{ formatCurrency(carta.valor_parcela) }}</span>
        </div>
        <div class="detail-group">
          <span class="label">Código</span>
          <span class="val code">{{ carta.codigo }}</span>
        </div>
      </div>

      <div class="logo-section">
        <img v-if="adminDetalhes.logo" :src="adminDetalhes.logo" class="logo-img" />
      </div>
    </div>

    <div class="card-footer">
      <label class="selection">
        <input type="checkbox"> <span>Selecionar</span>
      </label>

      <div class="actions">
        <button class="btn-icon" @click="compartilhar" title="Compartilhar">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
        </button>
        
        <button class="btn-gray">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="8"></line><line x1="11" y1="11" x2="11" y2="14"></line></svg>
          Detalhes
        </button>

        <button class="btn-green" @click="abrirWhatsapp">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/></svg>
          Negociar
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-horizontal {
  background: white; border: 1px solid #e2e8f0; border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03); overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  width: 100%; /* Ocupa 100% do pai (Home) */
}
.card-horizontal:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); border-color: #cbd5e1; }

.card-main {
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 1.5fr 2fr 1fr; /* Colunas bem distribuídas */
  gap: 20px;
  align-items: center;
}

.primary-section { display: flex; align-items: center; gap: 16px; }
.bank-name { font-size: 0.85rem; color: #1e3a8a; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px; }
.credit-value { margin: 0; font-size: 1.8rem; font-weight: 800; color: #10b981; line-height: 1; }

.details-section { 
  display: flex; justify-content: space-around; 
  border-left: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; 
  padding: 0 16px; 
}
.detail-group { display: flex; flex-direction: column; gap: 2px; }
.label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
.val { font-size: 0.95rem; font-weight: 700; color: #334155; }
.code { font-family: monospace; color: #64748b; }

.logo-section { display: flex; justify-content: flex-end; }
.logo-img { max-height: 45px; max-width: 120px; object-fit: contain; }

.card-footer {
  background: #f8fafc; padding: 12px 24px; border-top: 1px solid #f1f5f9;
  display: flex; justify-content: space-between; align-items: center;
}
.selection { font-size: 0.9rem; color: #64748b; display: flex; align-items: center; gap: 8px; cursor: pointer; }
.actions { display: flex; gap: 10px; }

button { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; border: none; font-size: 0.9rem; transition: 0.2s; }
.btn-icon { background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 8px; }
.btn-icon:hover { border-color: #10b981; color: #10b981; }
.btn-gray { background: #e2e8f0; color: #475569; }
.btn-gray:hover { background: #cbd5e1; color: #1e293b; }
.btn-green { background: #10b981; color: white; }
.btn-green:hover { background: #059669; }

/* Responsividade */
@media (max-width: 900px) {
  .card-main { grid-template-columns: 1fr 1fr; grid-template-areas: "prim logo" "det det"; }
  .primary-section { grid-area: prim; }
  .logo-section { grid-area: logo; }
  .details-section { grid-area: det; border: none; border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 5px; justify-content: space-between; }
}

@media (max-width: 600px) {
  .card-main { display: flex; flex-direction: column; align-items: flex-start; gap: 16px; }
  .details-section { width: 100%; padding: 16px 0 0 0; justify-content: space-between; }
  .logo-section { display: none; }
  .card-footer { flex-direction: column; gap: 12px; align-items: stretch; }
  .actions { justify-content: space-between; }
  .btn-gray, .btn-green { flex: 1; justify-content: center; }
}
</style>