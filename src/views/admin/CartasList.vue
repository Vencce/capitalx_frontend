<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Search, Plus, Edit2, Trash2, Filter, 
  Car, Home, ShieldCheck, Landmark 
} from 'lucide-vue-next'

const cartas = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('TODOS')
const router = useRouter()

const fetchCartas = async () => {
  try {
    loading.value = true
    const response = await api.get('cartas/')
    cartas.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const deleteCarta = async (id) => {
  if (confirm('Deseja realmente excluir esta carta?')) {
    try {
      await api.delete(`cartas/${id}/`)
      fetchCartas()
    } catch (error) {
      console.error(error)
    }
  }
}

const filteredCartas = computed(() => {
  return cartas.value.filter(carta => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = 
      carta.codigo.toLowerCase().includes(query) ||
      (carta.administradora_detalhes?.nome || '').toLowerCase().includes(query)
    
    const matchesStatus = statusFilter.value === 'TODOS' || carta.status === statusFilter.value
    
    return matchesSearch && matchesStatus
  })
})

const formatCurrency = (value) => {
  if (!value && value !== 0) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getLogoUrl = (logoPath) => {
  if (!logoPath) return ''
  const API_BASE = 'http://localhost:8000'
  return logoPath.startsWith('http') ? logoPath : `${API_BASE}${logoPath}`
}

onMounted(fetchCartas)
</script>

<template>
  <AdminLayout>
    <div class="admin-page">
      <header class="page-header">
        <div class="header-info">
          <h1>Cartas de Crédito</h1>
          <p>Gerencie o estoque e atualize as informações das cotas.</p>
        </div>
        <button class="btn-add" @click="router.push('/admin/cartas/nova')">
          <Plus :size="18" /> Nova Carta
        </button>
      </header>

      <div class="toolbar">
        <div class="search-box">
          <Search class="search-icon" :size="18" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Pesquisar por código ou banco..." 
          />
        </div>
        
        <div class="filter-box">
          <Filter :size="18" />
          <select v-model="statusFilter">
            <option value="TODOS">Todos os Status</option>
            <option value="DISPONIVEL">Disponíveis</option>
            <option value="RESERVADO">Reservadas</option>
            <option value="VENDIDO">Vendidas</option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <div v-if="loading" class="loading-overlay">
          <div class="spinner"></div>
          <span>Atualizando lista...</span>
        </div>

        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>Cód / Tipo</th>
              <th>Administradora</th>
              <th>Crédito</th>
              <th>Entrada</th>
              <th>Saldo Devedor</th>
              <th>Seguro</th>
              <th>Status</th>
              <th class="actions-head">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carta in filteredCartas" :key="carta.id" @click="router.push(`/admin/cartas/${carta.id}`)">
              <td>
                <div class="item-type">
                  <component :is="carta.tipo === 'AUTOMOVEL' ? Car : Home" :size="14" />
                  <div class="type-details">
                    <span class="code-val">#{{ carta.codigo }}</span>
                    <span class="type-label">{{ carta.tipo }}</span>
                  </div>
                </div>
              </td>
              <td>
                <div class="admin-cell">
                  <img 
                    v-if="carta.administradora_detalhes?.logo" 
                    :src="getLogoUrl(carta.administradora_detalhes.logo)" 
                    class="table-logo"
                  />
                  <span>{{ carta.administradora_detalhes?.nome || 'Pendente' }}</span>
                </div>
              </td>
              <td class="bold">{{ formatCurrency(carta.valor_credito) }}</td>
              <td class="entrada-val">{{ formatCurrency(carta.valor_entrada) }}</td>
              <td class="muted-val">{{ formatCurrency(carta.saldo_devedor) }}</td>
              <td class="muted-val">{{ formatCurrency(carta.seguro_vida) }}</td>
              <td>
                <span :class="['status-tag', carta.status.toLowerCase()]">
                  {{ carta.status }}
                </span>
              </td>
              <td class="actions-cell" @click.stop>
                <div class="action-group">
                  <button class="action-btn edit" @click="router.push(`/admin/cartas/${carta.id}`)">
                    <Edit2 :size="14" />
                  </button>
                  <button class="action-btn delete" @click="deleteCarta(carta.id)">
                    <Trash2 :size="14" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="!loading && filteredCartas.length === 0" class="no-data">
          Nenhuma carta encontrada.
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.admin-page { animation: slideUp 0.3s ease-out; }

.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; }
.header-info h1 { font-size: 1.6rem; font-weight: 800; color: #1e293b; margin: 0; }
.header-info p { color: #64748b; margin-top: 4px; font-size: 0.95rem; }

.btn-add {
  background: #1e3a8a; color: white; border: none; padding: 12px 20px; border-radius: 10px;
  font-weight: 700; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s;
}
.btn-add:hover { background: #1e40af; transform: translateY(-2px); box-shadow: 0 4px 12px rgba(30,58,138,0.2); }

.toolbar {
  background: white; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;
  display: flex; gap: 16px; margin-bottom: 2rem; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}
.search-box { flex: 1; position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 14px; color: #94a3b8; }
.search-box input {
  width: 100%; padding: 11px 12px 11px 44px; border-radius: 8px; border: 1px solid #e2e8f0;
  outline: none; transition: 0.2s;
}
.search-box input:focus { border-color: #fcd34d; box-shadow: 0 0 0 3px rgba(252, 211, 77, 0.1); }

.filter-box { display: flex; align-items: center; gap: 10px; border-left: 1px solid #e2e8f0; padding-left: 16px; }
.filter-box select { padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; font-weight: 600; color: #475569; outline: none; }

.table-wrapper { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
.admin-table { width: 100%; border-collapse: collapse; text-align: left; }
.admin-table th { background: #f8fafc; padding: 14px 16px; font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700; border-bottom: 1px solid #e2e8f0; }
.admin-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; cursor: pointer; }
.admin-table tr:hover td { background: #fffbeb; }

.item-type { display: flex; align-items: center; gap: 12px; }
.type-details { display: flex; flex-direction: column; }
.code-val { font-weight: 800; color: #1e293b; }
.type-label { font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; }

.admin-cell { display: flex; align-items: center; gap: 10px; }
.table-logo { height: 18px; max-width: 70px; object-fit: contain; }

.bold { font-weight: 700; color: #1e293b; }
.entrada-val { font-weight: 800; color: #b45309; }
.muted-val { color: #64748b; font-weight: 500; font-size: 0.85rem; }

.status-tag { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
.status-tag.disponivel { background: #dcfce7; color: #166534; }
.status-tag.reservado { background: #fef3c7; color: #92400e; }
.status-tag.vendido { background: #fee2e2; color: #991b1b; }

.action-group { display: flex; gap: 6px; justify-content: flex-end; }
.action-btn { width: 30px; height: 30px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.2s; color: #64748b; }
.action-btn.edit:hover { border-color: #1e3a8a; color: #1e3a8a; background: #eff6ff; }
.action-btn.delete:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

.loading-overlay, .no-data { padding: 4rem; text-align: center; color: #94a3b8; }
.spinner { width: 24px; height: 24px; border: 3px solid #f1f5f9; border-top-color: #fcd34d; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 12px auto; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 1024px) {
  .toolbar { flex-direction: column; }
  .filter-box { border-left: none; border-top: 1px solid #e2e8f0; padding-left: 0; padding-top: 12px; }
}
</style>