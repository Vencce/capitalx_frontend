<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Search, Plus, Edit2, Trash2, Filter, 
  Car, Home, ArrowUpDown, X 
} from 'lucide-vue-next'

const cartas = ref([])
const loading = ref(true)
const searchQuery = ref('')
const statusFilter = ref('TODOS')
const tipoFilter = ref('TODOS')
const orderFilter = ref('crescente') // 'crescente' ou 'decrescente'
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
  // 1. Filtragem por busca, status e tipo
  let result = cartas.value.filter(carta => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = 
      carta.codigo.toLowerCase().includes(query) ||
      (carta.administradora_detalhes?.nome || '').toLowerCase().includes(query)
    
    const matchesStatus = statusFilter.value === 'TODOS' || carta.status === statusFilter.value
    const matchesTipo = tipoFilter.value === 'TODOS' || carta.tipo === tipoFilter.value
    
    return matchesSearch && matchesStatus && matchesTipo
  })

  // 2. Ordenação por Valor de Crédito (Feedback Robson)
  result.sort((a, b) => {
    const valA = parseFloat(a.valor_credito) || 0
    const valB = parseFloat(b.valor_credito) || 0
    return orderFilter.value === 'crescente' ? valA - valB : valB - valA
  })

  return result
})

const formatCurrency = (value) => {
  if (!value || value === 0 || value === '0.00') return 'A consultar'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getLogoUrl = (logoPath) => {
  if (!logoPath) return ''
  // Se for Cloudinary (começa com http), retorna direto, senão concatena com base local
  if (logoPath.startsWith('http')) return logoPath
  const API_BASE = 'http://localhost:8000'
  return `${API_BASE}${logoPath.startsWith('/') ? '' : '/'}${logoPath}`
}

const limparFiltros = () => {
  searchQuery.value = ''
  statusFilter.value = 'TODOS'
  tipoFilter.value = 'TODOS'
  orderFilter.value = 'crescente'
}

onMounted(fetchCartas)
</script>

<template>
  <AdminLayout>
    <div class="admin-page">
      <header class="page-header">
        <div class="header-info">
          <h1>Estoque de <span>Cartas</span></h1>
          <p>Gerencie e organize suas cotas de crédito.</p>
        </div>
        <button class="btn-add" @click="router.push('/admin/cartas/nova')">
          <Plus :size="18" /> Nova Carta
        </button>
      </header>

      <div class="toolbar-v2">
        <div class="search-box">
          <Search class="search-icon" :size="18" />
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Pesquisar código ou administradora..." 
          />
        </div>
        
        <div class="filters-grid">
          <div class="filter-item">
            <label>Status</label>
            <select v-model="statusFilter">
              <option value="TODOS">Todos</option>
              <option value="DISPONIVEL">Disponíveis</option>
              <option value="RESERVADO">Reservadas</option>
              <option value="VENDIDO">Vendidas</option>
            </select>
          </div>

          <div class="filter-item">
            <label>Tipo</label>
            <select v-model="tipoFilter">
              <option value="TODOS">Todos</option>
              <option value="IMOVEL">Imóveis</option>
              <option value="AUTOMOVEL">Veículos</option>
            </select>
          </div>

          <div class="filter-item">
            <label>Ordem Crédito</label>
            <select v-model="orderFilter">
              <option value="crescente">Menor para Maior</option>
              <option value="decrescente">Maior para Menor</option>
            </select>
          </div>

          <button class="btn-clear" @click="limparFiltros" title="Limpar Filtros">
            <X :size="18" />
          </button>
        </div>
      </div>

      <div class="table-wrapper">
        <div v-if="loading" class="loading-overlay">
          <div class="spinner"></div>
          <span>Carregando estoque...</span>
        </div>

        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>Cód / Tipo</th>
              <th>Administradora</th>
              <th>Crédito</th>
              <th>Entrada</th>
              <th>Seguro</th>
              <th>Status</th>
              <th class="actions-head">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carta in filteredCartas" :key="carta.id">
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
                  <span>{{ carta.administradora_detalhes?.nome || '---' }}</span>
                </div>
              </td>
              <td class="bold">{{ formatCurrency(carta.valor_credito) }}</td>
              <td class="entrada-val">{{ formatCurrency(carta.valor_entrada) }}</td>
              <td class="muted-val">{{ formatCurrency(carta.seguro_vida) }}</td>
              <td>
                <span :class="['status-tag', carta.status.toLowerCase()]">
                  {{ carta.status }}
                </span>
              </td>
              <td class="actions-cell">
                <div class="action-group">
                  <button class="action-btn edit" @click="router.push(`/admin/cartas/editar/${carta.id}`)">
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
          Nenhuma carta encontrada com esses filtros.
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.admin-page { animation: slideUp 0.3s ease-out; }

.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.header-info h1 { font-size: 1.8rem; font-weight: 800; color: #0f172a; margin: 0; }
.header-info h1 span { color: #f6d001; }
.header-info p { color: #64748b; margin-top: 4px; }

.btn-add {
  background: #000; color: white; border: none; padding: 12px 24px; border-radius: 8px;
  font-weight: 800; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.2s;
  border-bottom: 3px solid #f6d001;
}

.toolbar-v2 {
  background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0;
  margin-bottom: 2rem; display: flex; flex-direction: column; gap: 15px;
}

.search-box { position: relative; width: 100%; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
.search-box input {
  width: 100%; padding: 12px 12px 12px 45px; border-radius: 8px; border: 1px solid #e2e8f0;
  outline: none; font-size: 1rem;
}

.filters-grid { display: flex; flex-wrap: wrap; gap: 15px; align-items: flex-end; }
.filter-item { display: flex; flex-direction: column; gap: 5px; min-width: 150px; }
.filter-item label { font-size: 0.7rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; }
.filter-item select { padding: 8px; border-radius: 6px; border: 1px solid #e2e8f0; font-weight: 600; outline: none; }

.btn-clear { background: #f1f5f9; border: none; padding: 10px; border-radius: 6px; color: #64748b; cursor: pointer; }
.btn-clear:hover { background: #fee2e2; color: #ef4444; }

.table-wrapper { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
.admin-table { width: 100%; border-collapse: collapse; }
.admin-table th { background: #f8fafc; padding: 14px; text-align: left; font-size: 0.75rem; color: #64748b; font-weight: 800; border-bottom: 1px solid #e2e8f0; }
.admin-table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; }

.item-type { display: flex; align-items: center; gap: 10px; }
.type-details { display: flex; flex-direction: column; }
.code-val { font-weight: 800; color: #0f172a; }
.type-label { font-size: 0.65rem; color: #94a3b8; text-transform: uppercase; }

.admin-cell { display: flex; align-items: center; gap: 10px; }
.table-logo { height: 20px; max-width: 70px; object-fit: contain; }

.bold { font-weight: 700; color: #0f172a; }
.entrada-val { font-weight: 800; color: #b45309; }
.muted-val { color: #64748b; font-size: 0.85rem; }

.status-tag { padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; }
.status-tag.disponivel { background: #dcfce7; color: #166534; }
.status-tag.reservado { background: #fef3c7; color: #92400e; }
.status-tag.vendido { background: #fee2e2; color: #991b1b; }

.action-group { display: flex; gap: 8px; justify-content: flex-end; }
.action-btn { width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #64748b; }
.action-btn.edit:hover { border-color: #000; color: #000; }
.action-btn.delete:hover { border-color: #ef4444; color: #ef4444; }

.loading-overlay, .no-data { padding: 4rem; text-align: center; color: #94a3b8; }
.spinner { width: 30px; height: 30px; border: 3px solid #f1f5f9; border-top-color: #f6d001; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 10px; }

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .filters-grid { flex-direction: column; align-items: stretch; }
}
</style>