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
const orderFilter = ref('crescente') // crescente ou decrescente
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
  // 1. Filtragem
  let result = cartas.value.filter(carta => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = 
      carta.codigo.toLowerCase().includes(query) ||
      (carta.administradora_detalhes?.nome || '').toLowerCase().includes(query)
    
    const matchesStatus = statusFilter.value === 'TODOS' || carta.status === statusFilter.value
    const matchesTipo = tipoFilter.value === 'TODOS' || carta.tipo === tipoFilter.value
    
    return matchesSearch && matchesStatus && matchesTipo
  })

  // 2. Ordenação (Feedback do Robson)
  result.sort((a, b) => {
    if (orderFilter.value === 'crescente') {
      return a.valor_credito - b.valor_credito
    } else {
      return b.valor_credito - a.valor_credito
    }
  })

  return result
})

const formatCurrency = (value) => {
  if (!value && value !== 0) return '---'
  if (typeof value === 'string' && isNaN(value)) return value // Para o "Consultar" no Seguro
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const getLogoUrl = (logoPath) => {
  if (!logoPath) return ''
  return logoPath // O backend no Render já manda a URL completa do Cloudinary
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
          <p>Organize e gerencie as cotas disponíveis no sistema.</p>
        </div>
        <button class="btn-add" @click="router.push('/admin/cartas/nova')">
          <Plus :size="18" /> Nova Carta
        </button>
      </header>

      <div class="toolbar-v2">
        <div class="search-row">
          <div class="search-box">
            <Search class="search-icon" :size="18" />
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Pesquisar por código ou banco..." 
            />
          </div>
          <button class="btn-clear" @click="limparFiltros" title="Limpar Filtros">
            <X :size="18" />
          </button>
        </div>

        <div class="filters-row">
          <div class="filter-group">
            <label>Status</label>
            <select v-model="statusFilter">
              <option value="TODOS">Todos</option>
              <option value="DISPONIVEL">Disponíveis</option>
              <option value="RESERVADO">Reservadas</option>
              <option value="VENDIDO">Vendidas</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Tipo</label>
            <select v-model="tipoFilter">
              <option value="TODOS">Todos</option>
              <option value="IMOVEL">Imóvel</option>
              <option value="AUTOMOVEL">Automóvel</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Ordenação (Crédito)</label>
            <div class="order-toggle">
              <select v-model="orderFilter">
                <option value="crescente">Menor para Maior</option>
                <option value="decrescente">Maior para Menor</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <div v-if="loading" class="loading-overlay">
          <div class="spinner"></div>
          <span>Buscando estoque...</span>
        </div>

        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>Cód / Tipo</th>
              <th>Administradora</th>
              <th>Crédito</th>
              <th>Entrada</th>
              <th>Status</th>
              <th class="actions-head">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carta in filteredCartas" :key="carta.id" @click="router.push(`/admin/cartas/editar/${carta.id}`)">
              <td>
                <div class="item-type">
                  <div class="icon-circle" :class="carta.tipo.toLowerCase()">
                    <component :is="carta.tipo === 'AUTOMOVEL' ? Car : Home" :size="16" />
                  </div>
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
                  <span class="admin-name">{{ carta.administradora_detalhes?.nome || '---' }}</span>
                </div>
              </td>
              <td class="bold-gold">{{ formatCurrency(carta.valor_credito) }}</td>
              <td class="entrada-val">{{ formatCurrency(carta.valor_entrada) }}</td>
              <td>
                <span :class="['status-tag', carta.status.toLowerCase()]">
                  {{ carta.status }}
                </span>
              </td>
              <td class="actions-cell" @click.stop>
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
          Nenhuma carta encontrada para os filtros aplicados.
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.admin-page { animation: slideUp 0.3s ease-out; }

.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
.header-info h1 { font-size: 1.8rem; font-weight: 900; color: #0f172a; margin: 0; }
.header-info h1 span { color: #f6d001; }
.header-info p { color: #64748b; margin-top: 4px; }

.btn-add {
  background: #000; color: white; border: none; padding: 12px 24px; border-radius: 8px;
  font-weight: 800; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
  border-bottom: 3px solid #f6d001;
}
.btn-add:hover { background: #1a1a1a; transform: translateY(-2px); }

/* TOOLBAR V2 - FOCO EM FILTROS */
.toolbar-v2 {
  background: white; border-radius: 12px; border: 1px solid #e2e8f0;
  padding: 20px; margin-bottom: 2rem; display: flex; flex-direction: column; gap: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.search-row { display: flex; gap: 12px; }
.search-box { flex: 1; position: relative; display: flex; align-items: center; }
.search-icon { position: absolute; left: 16px; color: #94a3b8; }
.search-box input {
  width: 100%; padding: 14px 16px 14px 48px; border-radius: 10px; border: 1px solid #e2e8f0;
  outline: none; transition: 0.2s; font-size: 1rem;
}
.search-box input:focus { border-color: #f6d001; box-shadow: 0 0 0 3px rgba(246, 208, 1, 0.1); }

.btn-clear {
  background: #f1f5f9; color: #64748b; border: none; width: 48px; border-radius: 10px;
  cursor: pointer; transition: 0.2s; display: flex; align-items: center; justify-content: center;
}
.btn-clear:hover { background: #fee2e2; color: #ef4444; }

.filters-row { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; }
.filter-group { display: flex; flex-direction: column; gap: 6px; }
.filter-group label { font-size: 0.75rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
.filter-group select {
  padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: #f8fafc;
  font-weight: 600; color: #1e293b; outline: none; cursor: pointer;
}

/* TABELA */
.table-wrapper { background: white; border-radius: 12px; border: 1px solid #e2e8f0; overflow: hidden; }
.admin-table { width: 100%; border-collapse: collapse; text-align: left; }
.admin-table th { background: #f8fafc; padding: 16px; font-size: 0.75rem; text-transform: uppercase; color: #94a3b8; font-weight: 800; border-bottom: 1px solid #e2e8f0; }
.admin-table td { padding: 18px 16px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; cursor: pointer; }
.admin-table tr:hover td { background: #fffbeb; }

.item-type { display: flex; align-items: center; gap: 14px; }
.icon-circle { 
  width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; 
  justify-content: center; background: #f1f5f9; color: #64748b; 
}
.icon-circle.imovel { background: #eff6ff; color: #2563eb; }
.icon-circle.automovel { background: #fef2f2; color: #dc2626; }

.code-val { font-weight: 900; color: #0f172a; display: block; }
.type-label { font-size: 0.7rem; color: #94a3b8; text-transform: uppercase; font-weight: 700; }

.admin-cell { display: flex; align-items: center; gap: 12px; }
.table-logo { height: 22px; max-width: 80px; object-fit: contain; }
.admin-name { font-weight: 600; color: #334155; }

.bold-gold { font-weight: 800; color: #0f172a; }
.entrada-val { font-weight: 800; color: #b45309; }

.status-tag { padding: 6px 12px; border-radius: 20px; font-size: 0.7rem; font-weight: 900; text-transform: uppercase; }
.status-tag.disponivel { background: #dcfce7; color: #166534; }
.status-tag.reservado { background: #fef3c7; color: #92400e; }
.status-tag.vendido { background: #fee2e2; color: #991b1b; }

.action-group { display: flex; gap: 8px; justify-content: flex-end; }
.action-btn { 
  width: 34px; height: 34px; border-radius: 8px; border: 1px solid #e2e8f0; 
  background: white; display: flex; align-items: center; justify-content: center; 
  cursor: pointer; transition: 0.2s; color: #64748b; 
}
.action-btn.edit:hover { border-color: #000; color: #000; background: #f8fafc; }
.action-btn.delete:hover { border-color: #ef4444; color: #ef4444; background: #fef2f2; }

.loading-overlay, .no-data { padding: 5rem; text-align: center; color: #94a3b8; }
.spinner { 
  width: 30px; height: 30px; border: 3px solid #f1f5f9; border-top-color: #f6d001; 
  border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 15px auto; 
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .filters-row { grid-template-columns: 1fr; }
  .page-header { flex-direction: column; gap: 20px; align-items: flex-start; }
}
</style>