<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Search, RefreshCw, Car, Home, X, ExternalLink
} from 'lucide-vue-next'

const cartas = ref([])
const loading = ref(true)
const syncLoading = ref(false)
const searchQuery = ref('')
const tipoFilter = ref('TODOS')

const fetchCartasParceiro = async () => {
  try {
    loading.value = true
    const response = await api.get('cartas/?origem=PARCEIRO')
    cartas.value = response.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const handleSync = async () => {
  if (!confirm('Deseja atualizar o estoque com a API parceira agora?')) return
  syncLoading.value = true
  try {
    const res = await api.post('api/cartas/sincronizar/')
    alert(`Sucesso! ${res.data.novas} novas cartas e ${res.data.atualizadas} atualizadas.`)
    fetchCartasParceiro()
  } catch (error) {
    alert('Erro na sincronização')
  } finally {
    syncLoading.value = false
  }
}

const filteredCartas = computed(() => {
  return cartas.value.filter(carta => {
    const query = searchQuery.value.toLowerCase()
    const matchesSearch = carta.codigo.toLowerCase().includes(query) ||
      (carta.administradora_detalhes?.nome || '').toLowerCase().includes(query)
    const matchesTipo = tipoFilter.value === 'TODOS' || carta.tipo === tipoFilter.value
    return matchesSearch && matchesTipo
  })
})

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

const getLogoUrl = (logoPath) => {
  if (!logoPath) return ''
  if (logoPath.startsWith('http')) return logoPath
  return `https://capitalxinvest.onrender.com${logoPath.startsWith('/') ? '' : '/'}${logoPath}`
}

onMounted(fetchCartasParceiro)
</script>

<template>
  <AdminLayout>
    <div class="admin-page">
      <header class="page-header">
        <div class="header-info">
          <h1>Estoque <span>Integração</span></h1>
          <p>Cartas sincronizadas automaticamente via API Fraga & Bitello.</p>
        </div>
        <button class="btn-sync" @click="handleSync" :disabled="syncLoading">
          <RefreshCw :class="{ 'spin': syncLoading }" :size="18" />
          {{ syncLoading ? 'Sincronizando...' : 'Sincronizar Agora' }}
        </button>
      </header>

      <div class="toolbar-v2">
        <div class="search-box">
          <Search class="search-icon" :size="18" />
          <input v-model="searchQuery" type="text" placeholder="Pesquisar nas cartas do parceiro..." />
        </div>
        <div class="filters-grid">
          <div class="filter-item">
            <label>Tipo de Bem</label>
            <select v-model="tipoFilter">
              <option value="TODOS">Todos os tipos</option>
              <option value="IMOVEL">Imóveis</option>
              <option value="AUTOMOVEL">Veículos</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-wrapper">
        <div v-if="loading" class="loading-overlay">
          <div class="spinner"></div>
          <span>Buscando dados da API...</span>
        </div>

        <table v-else class="admin-table">
          <thead>
            <tr>
              <th>Cód / Tipo</th>
              <th>Administradora</th>
              <th>Crédito</th>
              <th>Entrada</th>
              <th>Parcelas</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carta in filteredCartas" :key="carta.id">
              <td>
                <div class="item-type">
                  <component :is="carta.tipo === 'AUTOMOVEL' ? Car : Home" :size="14" />
                  <span class="code-val">#{{ carta.codigo }}</span>
                </div>
              </td>
              <td>
                <div class="admin-cell">
                  <img :src="getLogoUrl(carta.administradora_detalhes?.logo_url_externa)" class="table-logo" />
                  <span>{{ carta.administradora_detalhes?.nome }}</span>
                </div>
              </td>
              <td class="bold">{{ formatCurrency(carta.valor_credito) }}</td>
              <td class="entrada-val">{{ formatCurrency(carta.valor_entrada) }}</td>
              <td>{{ carta.numero_parcelas }}x {{ formatCurrency(carta.valor_parcela) }}</td>
              <td>
                <span :class="['status-tag', carta.status.toLowerCase()]">{{ carta.status }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
/* Estrutura Geral */
.admin-page { 
  animation: slideUp 0.3s ease-out; 
  padding: 10px;
}

.page-header { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  margin-bottom: 2rem; 
}

.header-info h1 { 
  font-size: 1.8rem; 
  font-weight: 800; 
  color: #0f172a; 
  margin: 0; 
}

.header-info h1 span { 
  color: #1e3a8a; /* Azul Capital X para diferenciar */
  border-bottom: 3px solid #f6d001;
}

.header-info p { 
  color: #64748b; 
  margin-top: 4px; 
}

/* Botão de Sincronização */
.btn-sync {
  background: #1e3a8a;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.2);
}

.btn-sync:hover:not(:disabled) {
  background: #1e40af;
  transform: translateY(-2px);
}

.btn-sync:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Toolbar e Busca */
.toolbar-v2 {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.search-box { 
  position: relative; 
  width: 100%; 
}

.search-icon { 
  position: absolute; 
  left: 14px; 
  top: 50%; 
  transform: translateY(-50%); 
  color: #94a3b8; 
}

.search-box input {
  width: 100%;
  padding: 12px 12px 12px 45px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  outline: none;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-box input:focus {
  border-color: #1e3a8a;
}

.filters-grid { 
  display: flex; 
  flex-wrap: wrap; 
  gap: 15px; 
  align-items: flex-end; 
}

.filter-item { 
  display: flex; 
  flex-direction: column; 
  gap: 5px; 
  min-width: 200px; 
}

.filter-item label { 
  font-size: 0.7rem; 
  font-weight: 800; 
  color: #94a3b8; 
  text-transform: uppercase; 
}

.filter-item select { 
  padding: 10px; 
  border-radius: 6px; 
  border: 1px solid #e2e8f0; 
  font-weight: 600; 
  outline: none; 
  background: #f8fafc;
}

/* Tabela */
.table-wrapper {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.admin-table { 
  width: 100%; 
  border-collapse: collapse; 
}

.admin-table th {
  background: #f8fafc;
  padding: 14px;
  text-align: left;
  font-size: 0.75rem;
  color: #64748b;
  font-weight: 800;
  border-bottom: 1px solid #e2e8f0;
  text-transform: uppercase;
}

.admin-table td {
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 0.9rem;
  color: #334155;
}

.item-type { 
  display: flex; 
  align-items: center; 
  gap: 10px; 
}

.code-val { 
  font-weight: 800; 
  color: #1e3a8a; 
}

.admin-cell { 
  display: flex; 
  align-items: center; 
  gap: 12px; 
}

.table-logo { 
  height: 24px; 
  max-width: 80px; 
  object-fit: contain; 
  filter: grayscale(0.2);
}

.bold { 
  font-weight: 700; 
  color: #0f172a; 
}

.entrada-val { 
  font-weight: 800; 
  color: #b45309; 
}

/* Status Tags */
.status-tag {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.status-tag.disponivel { background: #dcfce7; color: #166534; }
.status-tag.reservado { background: #fef3c7; color: #92400e; }

/* Animações e Loading */
.loading-overlay { 
  padding: 5rem; 
  text-align: center; 
  color: #94a3b8; 
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f1f5f9;
  border-top-color: #1e3a8a;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.spin { 
  animation: spin 1s linear infinite; 
}

@keyframes spin { 
  to { transform: rotate(360deg); } 
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Responsividade */
@media (max-width: 768px) {
  .page-header { 
    flex-direction: column; 
    align-items: flex-start; 
    gap: 1.5rem; 
  }
  
  .btn-sync { 
    width: 100%; 
    justify-content: center; 
  }
  
  .filters-grid { 
    flex-direction: column; 
    align-items: stretch; 
  }
  
  .filter-item { 
    min-width: 100%; 
  }
  
  .admin-table th:nth-child(4),
  .admin-table td:nth-child(4),
  .admin-table th:nth-child(5),
  .admin-table td:nth-child(5) {
    display: none; /* Esconde colunas menos importantes no mobile */
  }
}
</style>