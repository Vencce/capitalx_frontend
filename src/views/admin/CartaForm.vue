<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const isEditing = computed(() => route.params.id !== undefined)

const form = ref({
  codigo: '',
  tipo: 'IMOVEL',
  administradora: '',
  valor_credito: '',
  valor_entrada: '',
  valor_parcela: '',
  numero_parcelas: '',
  status: 'DISPONIVEL'
})

const loading = ref(false)

onMounted(async () => {
  if (isEditing.value) {
    try {
      const response = await api.get(`cartas/${route.params.id}/`)
      form.value = response.data
    } catch (error) {
      alert('Erro ao carregar dados da carta.')
      router.push('/admin/cartas')
    }
  }
})

const salvar = async () => {
  loading.value = true
  try {
    if (isEditing.value) {
      await api.put(`cartas/${route.params.id}/`, form.value)
      alert('Carta atualizada com sucesso!')
    } else {
      await api.post('cartas/', form.value)
      alert('Carta criada com sucesso!')
    }
    router.push('/admin/cartas')
  } catch (error) {
    console.error(error)
    alert('Erro ao salvar. Verifique os dados.')
  } finally {
    loading.value = false
  }
}

const cancelar = () => {
  router.push('/admin/cartas')
}
</script>

<template>
  <AdminLayout>
    <div class="page-header">
      <h2 class="title">{{ isEditing ? 'Editar Carta' : 'Nova Carta' }}</h2>
    </div>

    <div class="form-card">
      <form @submit.prevent="salvar" class="grid-form">
        
        <div class="form-group">
          <label>Código</label>
          <input type="text" v-model="form.codigo" required placeholder="Ex: C050" :disabled="isEditing" />
        </div>
        
        <div class="form-group">
          <label>Tipo de Bem</label>
          <select v-model="form.tipo" required>
            <option value="IMOVEL">Imóvel</option>
            <option value="AUTOMOVEL">Automóvel</option>
          </select>
        </div>

        <div class="form-group span-2">
          <label>Administradora</label>
          <input type="text" v-model="form.administradora" required placeholder="Ex: Banco do Brasil" />
        </div>

        <div class="form-group">
          <label>Valor do Crédito (R$)</label>
          <input type="number" step="0.01" v-model="form.valor_credito" required />
        </div>

        <div class="form-group">
          <label>Valor da Entrada (R$)</label>
          <input type="number" step="0.01" v-model="form.valor_entrada" required />
        </div>

        <div class="form-group">
          <label>Valor da Parcela (R$)</label>
          <input type="number" step="0.01" v-model="form.valor_parcela" required />
        </div>

        <div class="form-group">
          <label>Nº de Parcelas</label>
          <input type="number" v-model="form.numero_parcelas" required />
        </div>

        <div class="form-group">
          <label>Status</label>
          <select v-model="form.status">
            <option value="DISPONIVEL">Disponível</option>
            <option value="RESERVADO">Reservado</option>
            <option value="VENDIDO">Vendido</option>
          </select>
        </div>

        <div class="form-actions span-full">
          <button type="button" class="btn-cancel" @click="cancelar">Cancelar</button>
          <button type="submit" class="btn-save" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar Carta' }}
          </button>
        </div>

      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
.page-header { margin-bottom: 24px; }
.title { font-size: 1.5rem; color: #111827; }

.form-card {
  background: white;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  max-width: 800px;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.span-2 { grid-column: span 2; }
.span-full { grid-column: 1 / -1; }

label {
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
}

input, select {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  transition: border-color 0.2s;
}
input:focus, select:focus { border-color: #1e3a8a; }
input:disabled { background: #f3f4f6; cursor: not-allowed; }

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 16px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.btn-cancel {
  padding: 10px 20px;
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 6px;
  font-weight: 600;
}
.btn-save {
  padding: 10px 24px;
  background: #10b981; /* Verde */
  border: none;
  color: white;
  border-radius: 6px;
  font-weight: 600;
}
.btn-save:hover { background: #059669; }

@media (max-width: 600px) {
  .grid-form { grid-template-columns: 1fr; }
  .span-2 { grid-column: span 1; }
}
</style>