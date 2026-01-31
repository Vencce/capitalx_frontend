<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { 
  Plus, 
  Search, 
  Pencil, 
  Trash2, 
  ExternalLink,
  ChevronRight
} from 'lucide-vue-next'

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
  await api.delete(`cartas/${id}/`)
  carregarCartas()
}

const cartasFiltradas = computed(() => {
  if (!termoBusca.value) return cartas.value
  const t = termoBusca.value.toLowerCase()
  return cartas.value.filter(c => 
    c.codigo.toLowerCase().includes(t) || 
    (c.administradora_detalhes && c.administradora_detalhes.nome.toLowerCase().includes(t))
  )
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

onMounted(carregarCartas)
</script>

<template>
  <AdminLayout>
    <div class="header-action">
      <div>
        <h2 class="page-title">Gerenciar Cartas</h2>
        <p class="page-subtitle">Visualize e gerencie o estoque de cartas contempladas</p>
      </div>
      <button class="btn-primary" @click="router.push('/admin/cartas/nova')">
        <Plus :size="18" />
        Nova Carta
      </button>
    </div>

    <div class="card-clean content-wrapper">
      <div class="toolbar">
        <div class="search-container">
          <Search class="search-icon" :size="18" />
          <input type="text" v-model="termoBusca" class="input-search" placeholder="Buscar por código ou administradora..." />
        </div>
      </div>

      <div class="table-responsive">
        <table class="modern-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Administradora</th>
              <th>Crédito</th>
              <th>Status</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carta in cartasFiltradas" :key="carta.id">
              <td class="font-mono">#{{ carta.codigo }}</td>
              <td><span class="badge-soft">{{ carta.tipo }}</span></td>
              <td class="text-main font-bold">
                {{ carta.administradora_detalhes ? carta.administradora_detalhes.nome : '---' }}
              </td>
              <td class="font-bold text-price">{{ formatCurrency(carta.valor_credito) }}</td>
              <td>
                 <span class="status-indicator" :class="carta.status.toLowerCase()">
                   <span class="dot"></span> {{ carta.status }}
                 </span>
              </td>
              <td class="actions-cell">
                <div class="actions-group">
                  <button class="action-btn edit" @click="router.push(`/admin/cartas/${carta.id}`)" title="Editar">
                    <Pencil :size="16" />
                  </button>
                  <button class="action-btn delete" @click="deletarCarta(carta.id)" title="Excluir">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="cartasFiltradas.length === 0 && !loading">
              <td colspan="6" class="empty-state">Nenhuma carta encontrada.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.header-action { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.page-title { font-size: 1.5rem; font-weight: 700; color: #111827; margin: 0; }
.page-subtitle { color: #6b7280; font-size: 0.9rem; margin-top: 4px; }

.btn-primary { background-color: #1e3a8a; color: white; padding: 12px 20px; border-radius: 10px; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: transform 0.2s, background 0.2s; }
.btn-primary:hover { background-color: #1e40af; transform: translateY(-1px); }

.card-clean { background: white; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.toolbar { padding: 24px; border-bottom: 1px solid #f1f5f9; }

.search-container { position: relative; width: 100%; max-width: 400px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; pointer-events: none; }
.input-search { width: 100%; padding: 10px 10px 10px 40px; border: 1px solid #e2e8f0; border-radius: 8px; font-size: 0.9rem; transition: all 0.2s; }
.input-search:focus { outline: none; border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1); }

.table-responsive { overflow-x: auto; }
.modern-table { width: 100%; border-collapse: collapse; }
.modern-table th { text-align: left; padding: 16px 24px; background: #f8fafc; color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em; }
.modern-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; }
.text-price { color: #111827; }

.font-mono { font-family: 'JetBrains Mono', monospace; color: #64748b; font-size: 0.85rem; }
.font-bold { font-weight: 600; }
.text-main { color: #1e3a8a; }
.badge-soft { background: #f1f5f9; color: #475569; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700; }

.status-indicator { display: inline-flex; align-items: center; gap: 8px; font-size: 0.8rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
.dot { width: 6px; height: 6px; border-radius: 50%; }
.status-indicator.disponivel { background: #ecfdf5; color: #065f46; }
.status-indicator.disponivel .dot { background: #10b981; }
.status-indicator.reservado { background: #fffbeb; color: #92400e; }
.status-indicator.reservado .dot { background: #f59e0b; }
.status-indicator.vendido { background: #fef2f2; color: #991b1b; }
.status-indicator.vendido .dot { background: #ef4444; }

.actions-group { display: flex; justify-content: flex-end; gap: 8px; }
.action-btn { border: none; cursor: pointer; padding: 8px; border-radius: 8px; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.edit { color: #1e3a8a; background: #eff6ff; }
.edit:hover { background: #dbeafe; }
.delete { color: #ef4444; background: #fef2f2; }
.delete:hover { background: #fee2e2; }

.empty-state { text-align: center; padding: 48px !important; color: #94a3b8; font-weight: 500; }
</style>