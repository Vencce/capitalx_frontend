<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const isEditing = computed(() => route.params.id !== undefined)
const loading = ref(false)

// Listas para os Selects
const administradoras = ref([]) 

// Estado do Formulário
const form = ref({
  codigo: '',
  tipo: 'IMOVEL',
  administradora: '', // Aqui vai o ID do banco selecionado
  valor_credito: '',
  valor_entrada: '',
  valor_parcela: '',
  numero_parcelas: '',
  status: 'DISPONIVEL'
})

onMounted(async () => {
  try {
    // 1. Carregar lista de Bancos para o Select
    const resAdmin = await api.get('administradoras/')
    administradoras.value = resAdmin.data

    // 2. Se for edição, carregar dados da carta
    if (isEditing.value) {
      const resCarta = await api.get(`cartas/${route.params.id}/`)
      form.value = resCarta.data
    }
  } catch (error) {
    alert('Erro ao carregar dados.')
    console.error(error)
  }
})

const salvar = async () => {
  loading.value = true
  
  // Cria o FormData para enviar os dados (mantido para compatibilidade com o backend)
  const formData = new FormData()
  
  // Adiciona campos de texto
  Object.keys(form.value).forEach(key => {
    // Não envia campos desnecessários ou nulos
    if (key !== 'imagem' && key !== 'administradora_detalhes' && form.value[key] !== null) {
      formData.append(key, form.value[key])
    }
  })

  try {
    if (isEditing.value) {
      await api.put(`cartas/${route.params.id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('Carta atualizada!')
    } else {
      await api.post('cartas/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      alert('Carta criada!')
    }
    router.push('/admin/cartas')
  } catch (error) {
    console.error(error)
    alert('Erro ao salvar. Verifique se todos os campos estão preenchidos.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminLayout>
    <div class="header-action">
      <h2 class="page-title">{{ isEditing ? 'Editar Carta' : 'Nova Carta' }}</h2>
      <button class="btn-text" @click="router.push('/admin/cartas')">Cancelar</button>
    </div>

    <div class="card-clean form-wrapper">
      <form @submit.prevent="salvar">
        <div class="form-grid">
          
          <div class="section-title">Dados Principais</div>
          
          <div class="form-group">
            <label>Código</label>
            <input v-model="form.codigo" class="input-clean" placeholder="Ex: C-102" :disabled="isEditing" required>
          </div>
          
          <div class="form-group">
            <label>Tipo de Bem</label>
            <select v-model="form.tipo" class="input-clean" required>
              <option value="IMOVEL">Imóvel</option>
              <option value="AUTOMOVEL">Automóvel</option>
            </select>
          </div>

          <div class="form-group span-2">
            <label>Administradora (Banco)</label>
            <select v-model="form.administradora" class="input-clean" required>
              <option value="" disabled>Selecione a empresa...</option>
              <option v-for="adm in administradoras" :key="adm.id" :value="adm.id">
                {{ adm.nome }}
              </option>
            </select>
            <small v-if="administradoras.length === 0" style="color: #ef4444;">Nenhuma empresa cadastrada. Vá em "Administradoras" primeiro.</small>
          </div>

          <div class="section-title mt-4">Financeiro</div>

          <div class="form-group">
            <label>Valor Crédito (R$)</label>
            <input type="number" step="0.01" v-model="form.valor_credito" class="input-clean" required>
          </div>

          <div class="form-group">
            <label>Valor Entrada (R$)</label>
            <input type="number" step="0.01" v-model="form.valor_entrada" class="input-clean" required>
          </div>

          <div class="form-group">
            <label>Valor Parcela (R$)</label>
            <input type="number" step="0.01" v-model="form.valor_parcela" class="input-clean" required>
          </div>

          <div class="form-group">
            <label>Nº Parcelas</label>
            <input type="number" v-model="form.numero_parcelas" class="input-clean" required>
          </div>

          <div class="form-group span-2">
            <label>Status</label>
            <select v-model="form.status" class="input-clean">
              <option value="DISPONIVEL">Disponível</option>
              <option value="RESERVADO">Reservado</option>
              <option value="VENDIDO">Vendido</option>
            </select>
          </div>

        </div>

        <div class="form-footer">
          <button type="submit" class="btn-primary large" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
.header-action { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.btn-text { background: none; border: none; color: var(--text-muted); font-weight: 600; cursor: pointer; }

.form-wrapper { max-width: 800px; padding: 40px; margin: 0 auto; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.span-2 { grid-column: 1 / -1; }
.mt-4 { margin-top: 24px; }

.section-title { 
  grid-column: 1 / -1; font-size: 0.85rem; text-transform: uppercase; 
  letter-spacing: 0.05em; color: var(--text-muted); font-weight: 700; 
  border-bottom: 1px solid var(--border-light); padding-bottom: 8px; margin-bottom: 8px; 
}

.form-group { display: flex; flex-direction: column; gap: 8px; }
label { font-size: 0.9rem; font-weight: 600; color: var(--text-main); }

.input-clean {
  padding: 12px; border: 1px solid var(--border-light); border-radius: 8px;
  background: #f8fafc; font-size: 1rem; color: var(--text-main); outline: none; transition: var(--transition);
}
.input-clean:focus { background: white; border-color: var(--accent); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }

.form-footer { margin-top: 40px; display: flex; justify-content: flex-end; }
.large { padding: 12px 32px; font-size: 1rem; }

@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }
</style>