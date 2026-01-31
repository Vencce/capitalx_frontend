<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  carta: Object
})

const formatCurrency = (value) => {
  return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const adminDetalhes = computed(() => props.carta.administradora_detalhes || {})
const showModal = ref(false)

// --- LÓGICA DOS ÍCONES (FontAwesome) ---
// Retorna a classe do ícone baseada no tipo
const iconeClasse = computed(() => {
  if (props.carta.tipo === 'AUTOMOVEL') {
    return 'fa-solid fa-car' // Ícone de Carro
  }
  return 'fa-solid fa-house-chimney' // Ícone de Casa
})

const abrirWhatsapp = () => {
  const nomeBanco = adminDetalhes.value.nome || 'Banco'
  const texto = `Olá! Tenho interesse na carta Cód: ${props.carta.codigo} (${nomeBanco}) de ${formatCurrency(props.carta.valor_credito)}.`
  window.open(`https://wa.me/5547999999999?text=${encodeURIComponent(texto)}`, '_blank')
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
</script>

<template>
  <div class="card-horizontal">
    
    <div class="card-main">
      <div class="primary-section">
        <div class="icon-box">
          <i :class="iconeClasse"></i>
        </div>
        
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
        <button class="btn-icon" @click.stop="compartilhar" title="Compartilhar">
          <i class="fa-solid fa-share-nodes"></i>
        </button>
        
        <button class="btn-gray" @click.stop="showModal = true">
          <i class="fa-solid fa-magnifying-glass"></i> Detalhes
        </button>

        <button class="btn-green" @click.stop="abrirWhatsapp">
          <i class="fa-brands fa-whatsapp"></i> Negociar
        </button>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <button class="close-btn" @click="showModal = false">
            <i class="fa-solid fa-xmark"></i>
          </button>
          
          <div class="modal-header">
            <div class="icon-box-large">
              <i :class="iconeClasse"></i>
            </div>
            <div>
              <span class="modal-subtitle">Carta Contemplada</span>
              <h2 class="modal-title">{{ adminDetalhes.nome }}</h2>
            </div>
          </div>

          <div class="modal-grid">
            <div class="modal-item highlight">
              <span>Valor do Crédito</span>
              <strong>{{ formatCurrency(carta.valor_credito) }}</strong>
            </div>
            <div class="modal-item">
              <span>Entrada</span>
              <strong>{{ formatCurrency(carta.valor_entrada) }}</strong>
            </div>
            <div class="modal-item">
              <span>Parcelas Restantes</span>
              <strong>{{ carta.numero_parcelas }}x</strong>
            </div>
            <div class="modal-item">
              <span>Valor da Parcela</span>
              <strong>{{ formatCurrency(carta.valor_parcela) }}</strong>
            </div>
            <div class="modal-item">
              <span>Código de Venda</span>
              <strong>{{ carta.codigo }}</strong>
            </div>
            <div class="modal-item">
              <span>Status</span>
              <strong :class="carta.status.toLowerCase()">{{ carta.status }}</strong>
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn-green block" @click="abrirWhatsapp">
              <i class="fa-brands fa-whatsapp"></i> Chamar no WhatsApp
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<style scoped>
/* --- CARD PRINCIPAL --- */
.card-horizontal {
  background: white; border: 1px solid #e2e8f0; border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.03); width: 100%; overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.card-horizontal:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.08); border-color: #cbd5e1; }

.card-main {
  padding: 20px 24px; display: grid; grid-template-columns: 1.5fr 2fr 1fr; gap: 20px; align-items: center;
}

.primary-section { display: flex; align-items: center; gap: 16px; }

/* ESTILO DO ÍCONE FONTAWESOME */
.icon-box i {
  font-size: 2.2rem; /* Tamanho do ícone */
  color: #f59e0b;    /* Cor Laranja */
}

.bank-name { font-size: 0.85rem; color: #1e3a8a; font-weight: 700; text-transform: uppercase; display: block; margin-bottom: 2px; }
.credit-value { margin: 0; font-size: 1.8rem; font-weight: 800; color: #10b981; line-height: 1; }

.details-section { 
  display: flex; justify-content: space-around; 
  border-left: 1px solid #f1f5f9; border-right: 1px solid #f1f5f9; padding: 0 16px; 
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

/* BOTÕES */
button { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 6px; font-weight: 600; cursor: pointer; border: none; font-size: 0.9rem; transition: 0.2s; }
.btn-icon { background: white; border: 1px solid #e2e8f0; color: #64748b; padding: 8px 12px; }
.btn-icon:hover { border-color: #10b981; color: #10b981; }
.btn-gray { background: #e2e8f0; color: #475569; }
.btn-gray:hover { background: #cbd5e1; color: #1e293b; }
.btn-green { background: #25D366; color: white; } /* Cor Whats Oficial */
.btn-green:hover { background: #20b85a; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.2); }

/* Ícones dentro dos botões */
button i { font-size: 1rem; }

/* --- MODAL --- */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);
  z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px;
}

.modal-content {
  background: white; width: 100%; max-width: 500px;
  border-radius: 16px; padding: 32px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  position: relative; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.close-btn {
  position: absolute; top: 16px; right: 16px;
  background: #f1f5f9; color: #64748b; width: 32px; height: 32px;
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  font-size: 1rem; padding: 0; cursor: pointer;
}
.close-btn:hover { background: #fee2e2; color: #ef4444; }

.modal-header { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9; }
.icon-box-large i { font-size: 2.5rem; color: #f59e0b; }
.modal-subtitle { font-size: 0.85rem; color: #64748b; text-transform: uppercase; font-weight: 600; }
.modal-title { margin: 0; color: #1e3a8a; font-size: 1.5rem; }

.modal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
.modal-item { display: flex; flex-direction: column; gap: 4px; }
.modal-item span { font-size: 0.8rem; color: #94a3b8; text-transform: uppercase; font-weight: 600; }
.modal-item strong { font-size: 1.1rem; color: #334155; }
.modal-item.highlight strong { color: #10b981; font-size: 1.3rem; }
.disponivel { color: #10b981; } .reservado { color: #f59e0b; } .vendido { color: #ef4444; }

.block { width: 100%; justify-content: center; padding: 14px; font-size: 1rem; }

@keyframes popIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* RESPONSIVIDADE */
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
  .modal-grid { grid-template-columns: 1fr; gap: 15px; }
}
</style>