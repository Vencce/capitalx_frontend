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
  codigo: '', 
  tipo: 'IMOVEL', 
  administradora: '', 
  valor_credito: '', 
  valor_entrada: '', 
  valor_parcela: '', 
  numero_parcelas: '', 
  status: 'DISPONIVEL', 
  vencimento: '', 
  taxa_transferencia: '', 
  tipo_contemplacao: 'Sorteio', 
  observacoes: '', 
  saldo_devedor: '', 
  seguro_vida: ''
})

onMounted(async () => {
  try {
    const resAdmin = await api.get('administradoras/')
    administradoras.value = resAdmin.data
    if (isEditing.value) {
      const resCarta = await api.get(`cartas/${route.params.id}/`)
      form.value = { ...form.value, ...resCarta.data }
    }
  } catch (error) { 
    console.error('Erro ao carregar dados:', error) 
  }
})

const salvar = async () => {
  loading.value = true
  
  const formData = new FormData()
  
  // Lista de campos que são numéricos no seu models.py
  const camposNumericos = [
    'valor_credito', 'valor_entrada', 'valor_parcela', 
    'numero_parcelas', 'saldo_devedor', 'seguro_vida'
  ]

  Object.keys(form.value).forEach(key => {
    if (key === 'administradora_detalhes') return

    let value = form.value[key]

    // TRATAMENTO CRUCIAL:
    // Se o campo for numérico e estiver vazio ou nulo, não enviamos nada 
    // ou enviamos uma string vazia para que o Django trate como NULL.
    if (camposNumericos.includes(key)) {
      if (value === '' || value === null || value === undefined) {
        // Não adicionamos ao formData ou adicionamos vazio se o backend permitir
        return 
      }
    }

    // Para campos de data vazios
    if (key === 'vencimento' && !value) {
      return
    }

    formData.append(key, value)
  })

  try {
    const url = isEditing.value 
      ? `cartas/${route.params.id}/` 
      : 'cartas/'
    
    // Usamos PUT para editar e POST para criar
    if (isEditing.value) {
      await api.put(url, formData)
    } else {
      await api.post(url, formData)
    }
    
    router.push('/admin/cartas')
  } catch (error) { 
    // Isso aqui vai te mostrar EXATAMENTE qual campo está dando erro no console
    console.error('Erro detalhado do Django:', error.response?.data)
    
    const erroMsg = error.response?.data 
      ? JSON.stringify(error.response.data) 
      : 'Erro desconhecido'
      
    alert('Erro ao salvar: ' + erroMsg) 
  } finally { 
    loading.value = false 
  }
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

          <div class="field">
            <label>Crédito (R$)</label>
            <input type="number" step="0.01" v-model="form.valor_credito" required />
          </div>
          <div class="field">
            <label>Entrada (R$)</label>
            <input type="number" step="0.01" v-model="form.valor_entrada" required />
          </div>
          <div class="field">
            <label>Parcela (R$)</label>
            <input type="number" step="0.01" v-model="form.valor_parcela" required />
          </div>
          <div class="field">
            <label>Qtd. Parcelas</label>
            <input type="number" v-model="form.numero_parcelas" required />
          </div>
          <div class="field">
            <label>Saldo Devedor (R$)</label>
            <input type="number" step="0.01" v-model="form.saldo_devedor" placeholder="Opcional" />
          </div>
          
          <div class="field">
            <label>Seguro de Vida (R$)</label>
            <input type="number" step="0.01" v-model="form.seguro_vida" placeholder="Vazio para 'A Consultar'" />
          </div>

          <div class="section-label mt-4">Detalhes</div>

          <div class="field">
            <label>Taxa Transf.</label>
            <input type="text" v-model="form.taxa_transferencia" placeholder="Vazio para 'A Consultar'" />
          </div>
          <div class="field">
            <label>Vencimento</label>
            <input type="date" v-model="form.vencimento" />
          </div>
          <div class="field full"><label>Observações</label><textarea v-model="form.observacoes" rows="3"></textarea></div>
          
          <div class="field full">
            <label>Status</label>
            <select v-model="form.status">
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
.btn-back { background: white; border: 1px solid #e5e7eb; padding: 8px 16px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; color: #6b7280; }
.form-card { background: white; border-radius: 16px; padding: 40px; max-width: 800px; margin: 0 auto; border: 1px solid #e5e7eb; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.section-label { grid-column: 1 / -1; font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: #6b7280; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; margin-top: 16px; }
.full { grid-column: 1 / -1; }
.field { display: flex; flex-direction: column; gap: 8px; }
label { font-size: 0.9rem; font-weight: 600; color: #111827; }
input, select, textarea { padding: 12px; border: 1px solid #e5e7eb; border-radius: 8px; font-size: 1rem; color: #111827; background: #fdfdfd; }
input:focus, select:focus, textarea:focus { border-color: #F6D001; outline: none; box-shadow: 0 0 0 3px rgba(246, 208, 1, 0.2); }
.form-actions { margin-top: 40px; display: flex; justify-content: flex-end; gap: 16px; border-top: 1px solid #e5e7eb; padding-top: 24px; }
.btn-save { background: #000; color: white; border: none; padding: 12px 32px; border-radius: 8px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 8px; border-bottom: 3px solid #F6D001; }
.btn-save:hover:not(:disabled) { background: #1a1a1a; transform: translateY(-2px); }
</style>