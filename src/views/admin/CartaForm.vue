<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { ArrowLeft, Save } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const isEditing = computed(() => route.params.id !== undefined)
const loading = ref(false)
const administradoras = ref([]) 

const form = ref({
  codigo: '', tipo: 'IMOVEL', administradora: '', valor_credito: '', valor_entrada: '', 
  valor_parcela: '', numero_parcelas: '', status: 'DISPONIVEL', vencimento: '', 
  taxa_transferencia: '', tipo_contemplacao: 'Sorteio', observacoes: '', saldo_devedor: '', seguro_vida: ''
})

onMounted(async () => {
  try {
    const resAdmin = await api.get('administradoras/')
    administradoras.value = resAdmin.data
    if (isEditing.value) {
      const resCarta = await api.get(`cartas/${route.params.id}/`)
      form.value = { ...form.value, ...resCarta.data }
    }
  } catch (error) { console.error(error) }
})

const salvar = async () => {
  loading.value = true
  const formData = new FormData()
  Object.keys(form.value).forEach(key => {
    if (key !== 'administradora_detalhes' && form.value[key] !== null && form.value[key] !== undefined) {
      formData.append(key, form.value[key])
    }
  })
  try {
    if (isEditing.value) await api.put(`cartas/${route.params.id}/`, formData, { headers: {'Content-Type': 'multipart/form-data'} })
    else await api.post('cartas/', formData, { headers: {'Content-Type': 'multipart/form-data'} })
    router.push('/admin/cartas')
  } catch (error) { alert('Erro ao salvar.') } finally { loading.value = false }
}
</script>

<template>
  <AdminLayout>
    <div class="form-header">
      <button class="btn-back" @click="router.push('/admin/cartas')">
        <ArrowLeft :size="20" /> Voltar
      </button>
      <h2>{{ isEditing ? 'Editar Carta' : 'Nova Carta' }}</h2>
    </div>

    <div class="form-card">
      <form @submit.prevent="salvar">
        <div class="form-grid">
          
          <div class="section-label">Dados Principais</div>
          
          <div class="field">
            <label>Código da Carta</label>
            <input v-model="form.codigo" type="text" placeholder="Ex: C-123" required />
          </div>
          
          <div class="field">
            <label>Tipo</label>
            <select v-model="form.tipo">
              <option value="IMOVEL">Imóvel</option>
              <option value="AUTOMOVEL">Automóvel</option>
            </select>
          </div>

          <div class="field full">
            <label>Administradora</label>
            <select v-model="form.administradora" required>
              <option value="" disabled>Selecione...</option>
              <option v-for="adm in administradoras" :key="adm.id" :value="adm.id">{{ adm.nome }}</option>
            </select>
          </div>

          <div class="section-label mt-4">Financeiro</div>

          <div class="field"><label>Crédito (R$)</label><input type="number" step="0.01" v-model="form.valor_credito" required /></div>
          <div class="field"><label>Entrada (R$)</label><input type="number" step="0.01" v-model="form.valor_entrada" required /></div>
          <div class="field"><label>Parcela (R$)</label><input type="number" step="0.01" v-model="form.valor_parcela" required /></div>
          <div class="field"><label>Qtd. Parcelas</label><input type="number" v-model="form.numero_parcelas" required /></div>
          <div class="field"><label>Saldo Devedor (R$)</label><input type="number" step="0.01" v-model="form.saldo_devedor" placeholder="Opcional" /></div>
          <div class="field"><label>Seguro de Vida (R$)</label><input type="number" step="0.01" v-model="form.seguro_vida" placeholder="Opcional" /></div>

          <div class="section-label mt-4">Detalhes</div>

          <div class="field"><label>Taxa Transf.</label><input type="text" v-model="form.taxa_transferencia" placeholder="Ex: Grátis" /></div>
          <div class="field"><label>Vencimento</label><input type="date" v-model="form.vencimento" /></div>
          <div class="field full"><label>Observações</label><textarea v-model="form.observacoes" rows="3"></textarea></div>
          
          <div class="field full">
            <label>Status</label>
            <select v-model="form.status" class="status-select">
              <option value="DISPONIVEL">Disponível</option>
              <option value="RESERVADO">Reservado</option>
              <option value="VENDIDO">Vendido</option>
            </select>
          </div>

        </div>

        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="router.push('/admin/cartas')">Cancelar</button>
          <button type="submit" class="btn-save" :disabled="loading">
            <Save :size="18" /> {{ loading ? 'Salvando...' : 'Salvar Carta' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
.form-header { display: flex; align-items: center; gap: 16px; margin-bottom: 32px; }
.form-header h2 { font-size: 1.8rem; font-weight: 800; color: #111827; margin: 0; }
.btn-back { background: white; border: 1px solid #e5e7eb; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; color: #6b7280; transition: all 0.2s; }
.btn-back:hover { background: #f8fafc; color: #111827; }

.form-card { background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.section-label { grid-column: 1 / -1; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 16px; }
.mt-4 { margin-top: 24px; }
.full { grid-column: 1 / -1; }
.field { display: flex; flex-direction: column; gap: 8px; }
label { font-size: 0.9rem; font-weight: 600; color: #111827; }

input, select, textarea { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 1rem; color: #111827; background: #fdfdfd; transition: all 0.2s; }
input:focus, select:focus, textarea:focus { border-color: #F6D001; outline: none; box-shadow: 0 0 0 3px rgba(246, 208, 1, 0.2); background: white; }

.form-actions { margin-top: 40px; display: flex; justify-content: flex-end; gap: 16px; border-top: 1px solid #e5e7eb; padding-top: 24px; }
.btn-cancel { background: transparent; border: none; color: #6b7280; font-weight: 600; cursor: pointer; padding: 12px 24px; }

/* Botão Salvar com a identidade da Capital X */
.btn-save { 
  background: #000000; 
  color: white; 
  border: none; 
  padding: 12px 32px; 
  border-radius: 8px; 
  font-weight: 700; 
  cursor: pointer; 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  transition: all 0.2s; 
  border-bottom: 3px solid #F6D001;
}

.btn-save:hover:not(:disabled) { 
  background: #F6D001; 
  color: #000000; 
  transform: translateY(-2px); 
}

.btn-save:disabled {
  background: #9ca3af;
  border-bottom-color: #6b7280;
  cursor: not-allowed;
}
</style>