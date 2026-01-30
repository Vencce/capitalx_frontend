<script setup>
defineProps({
  carta: {
    type: Object,
    required: true
  }
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const abrirWhatsapp = (carta) => {
  // Substitua pelo número de telefone da Capital X Invest (apenas números, com código do país e DDD)
  const telefone = "5547999999999" 
  
  const mensagem = `Olá! Vi no site a carta *${carta.codigo}* (${carta.tipo} - ${carta.administradora}).
  
Detalhes:
- Crédito: ${formatCurrency(carta.valor_credito)}
- Entrada: ${formatCurrency(carta.valor_entrada)}
- Parcelas: ${carta.numero_parcelas}x ${formatCurrency(carta.valor_parcela)}

Gostaria de mais informações.`

  const url = `https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`
  window.open(url, '_blank')
}
</script>

<template>
  <div class="card">
    <div class="card-header">
      <div class="header-top">
        <span class="code">#{{ carta.codigo }}</span>
        <h3>{{ carta.tipo }}</h3>
      </div>
      <span class="admin-name">{{ carta.administradora }}</span>
    </div>

    <div class="card-body">
      <div class="info-row">
        <span class="label">Crédito</span>
        <span class="value credit">{{ formatCurrency(carta.valor_credito) }}</span>
      </div>

      <div class="info-row">
        <span class="label">Entrada</span>
        <span class="value entry">{{ formatCurrency(carta.valor_entrada) }}</span>
      </div>

      <div class="info-row last">
        <span class="label">Parcelas</span>
        <span class="value">{{ carta.numero_parcelas }}x {{ formatCurrency(carta.valor_parcela) }}</span>
      </div>
      
      <div class="action-area">
        <button class="btn-interest" @click="abrirWhatsapp(carta)">
            Tenho Interesse
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  background-color: var(--white);
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid var(--gray-light);
  display: flex;
  flex-direction: column;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

.card-header {
  background-color: var(--primary-color);
  padding: 15px;
  color: var(--white);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.header-top h3 {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
}

.code {
  font-size: 0.75rem;
  background-color: rgba(255,255,255,0.2);
  padding: 2px 6px;
  border-radius: 4px;
}

.admin-name {
  display: block;
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.9;
}

.card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--gray-light);
}

.info-row.last {
  border-bottom: none;
}

.label {
  font-size: 0.9rem;
  color: #6b7280;
}

.value {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-color);
}

.value.credit {
  color: var(--primary-color);
  font-size: 1.2rem;
}

.value.entry {
  color: var(--secondary-color);
  font-size: 1.1rem;
}

.btn-interest {
  width: 100%;
  background-color: #16a34a;
  color: white;
  padding: 12px;
  border-radius: 6px;
  font-weight: bold;
  font-size: 1rem;
  transition: background-color 0.2s;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.btn-interest:hover {
  background-color: #15803d;
}
</style>