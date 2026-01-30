<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'

const router = useRouter()
const cartas = ref([])
const loading = ref(true)
const termoBusca = ref('')

const carregarCartas = async () => {
  try {
    const response = await api.get('cartas/')
    cartas.value = response.data
  } catch (error) {
    alert('Erro ao carregar cartas')
  } finally {
    loading.value = false
  }
}

const deletarCarta = async (id) => {
  if (!confirm('Tem certeza que deseja excluir esta carta?')) return
  try {
    await api.delete(`cartas/${id}/`)
    cartas.value = cartas.value.filter(c => c.id !== id)
  } catch (error) {
    alert('Erro ao excluir')
  }
}

const editarCarta = (id) => {
  router.push(`/admin/cartas/${id}`)
}

const novaCarta = () => {
  router.push('/admin/cartas/nova')
}

// Filtro simples no frontend
const cartasFiltradas = computed(() => {
  if (!termoBusca.value) return cartas.value
  return cartas.value.filter(c => 
    c.codigo.toLowerCase().includes(termoBusca.value.toLowerCase()) ||
    c.administradora.toLowerCase().includes(termoBusca.value.toLowerCase())
  )
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

onMounted(() => {
  carregarCartas()
})
</script>

<template>
  <AdminLayout>
    <div class="page-header">
      <div>
        <h2 class="title">Gerenciar Cartas</h2>
        <p class="subtitle">Visualize e gerencie todo o seu estoque</p>
      </div>
      <button class="btn-primary" @click="novaCarta">
        + Nova Carta
      </button>
    </div>

    <div class="content-card">
      <div class="toolbar">
        <div class="search-box">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" v-model="termoBusca" placeholder="Buscar por código ou administradora..." />
        </div>
      </div>

      <div v-if="loading" class="loading">Carregando...</div>
      
      <div v-else class="table-responsive">
        <table class="clean-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Administradora</th>
              <th>Crédito</th>
              <th>Entrada</th>
              <th>Status</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carta in cartasFiltradas" :key="carta.id">
              <td class="code">#{{ carta.codigo }}</td>
              <td>
                <span :class="['badge-type', carta.tipo === 'IMOVEL' ? 'blue' : 'yellow']">
                  {{ carta.tipo }}
                </span>
              </td>
              <td>{{ carta.administradora }}</td>
              <td>{{ formatCurrency(carta.valor_credito) }}</td>
              <td>{{ formatCurrency(carta.valor_entrada) }}</td>
              <td>
                <span :class="['status-dot', carta.status.toLowerCase()]"></span>
                {{ carta.status }}
              </td>
              <td class="actions text-right">
                <button class="btn-icon edit" @click="editarCarta(carta.id)" title="Editar">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon delete" @click="deletarCarta(carta.id)" title="Excluir">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        
        <div v-if="cartasFiltradas.length === 0" class="empty-state">
          Nenhuma carta encontrada.
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.title { font-size: 1.5rem; color: #111827; margin: 0; }
.subtitle { color: #6b7280; font-size: 0.9rem; margin-top: 4px; }

.btn-primary {
  background-color: #1e3a8a;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  transition: background 0.2s;
}
.btn-primary:hover { background-color: #1e40af; }

.content-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
  overflow: hidden;
}

.toolbar { padding: 16px; border-bottom: 1px solid #f3f4f6; }
.search-box {
  display: flex;
  align-items: center;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 8px 12px;
  width: 300px;
}
.search-box input {
  border: none;
  background: transparent;
  margin-left: 8px;
  outline: none;
  width: 100%;
  color: #374151;
}

.table-responsive { overflow-x: auto; }
.clean-table { width: 100%; border-collapse: collapse; }
.clean-table th {
  text-align: left;
  padding: 16px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
}
.clean-table td {
  padding: 16px;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
  font-size: 0.95rem;
}
.text-right { text-align: right; }

.badge-type {
  padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600;
}
.badge-type.blue { background: #eff6ff; color: #1e3a8a; }
.badge-type.yellow { background: #fffbeb; color: #b45309; }

.status-dot {
  display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 6px;
}
.status-dot.disponivel { background: #10b981; }
.status-dot.reservado { background: #f59e0b; }
.status-dot.vendido { background: #ef4444; }

.btn-icon {
  background: none; border: none; cursor: pointer; padding: 6px; border-radius: 4px; margin-left: 4px; transition: background 0.2s;
}
.btn-icon:hover { background: #f3f4f6; }
.btn-icon.edit { color: #3b82f6; }
.btn-icon.delete { color: #ef4444; }

.loading, .empty-state { padding: 40px; text-align: center; color: #6b7280; }
</style>