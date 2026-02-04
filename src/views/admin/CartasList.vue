<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { Search, Plus, Edit3, Trash2, Calendar, DollarSign } from 'lucide-vue-next'

const router = useRouter()
const cartas = ref([])
const loading = ref(true)
const termoBusca = ref('')

const carregarCartas = async () => {
  try {
    const response = await api.get('cartas/')
    cartas.value = response.data
  } catch (error) { console.error(error) } finally { loading.value = false }
}

const deletarCarta = async (id) => {
  if (!confirm('Excluir esta carta permanentemente?')) return
  try { await api.delete(`cartas/${id}/`); cartas.value = cartas.value.filter(c => c.id !== id) } catch (error) { alert('Erro.') }
}

const cartasFiltradas = computed(() => {
  if (!termoBusca.value) return cartas.value
  const t = termoBusca.value.toLowerCase()
  return cartas.value.filter(c => c.codigo.toLowerCase().includes(t) || c.administradora_detalhes.nome.toLowerCase().includes(t))
})

const formatMoney = (v) => v ? parseFloat(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-'
const formatDate = (d) => d ? d.split('-').reverse().join('/') : '-'

onMounted(carregarCartas)
</script>

<template>
  <AdminLayout>
    <div class="page-header">
      <div>
        <h2 class="page-title">Gerenciar Cartas</h2>
        <p class="page-subtitle">Controle total do seu estoque</p>
      </div>
      <button class="btn-primary" @click="router.push('/admin/cartas/nova')">
        <Plus :size="20" /> Nova Carta
      </button>
    </div>

    <div class="card-table">
      <div class="table-toolbar">
        <div class="search-wrapper">
          <Search :size="18" class="search-icon" />
          <input v-model="termoBusca" type="text" placeholder="Buscar por código ou banco..." />
        </div>
        <span class="badge-count">{{ cartasFiltradas.length }} registros</span>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Cód.</th>
              <th>Banco</th>
              <th>Crédito</th>
              <th>Entrada</th>
              <th>Status</th>
              <th class="text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="6" class="text-center py-8">Carregando...</td></tr>
            <tr v-else-if="cartasFiltradas.length === 0"><td colspan="6" class="text-center py-8">Nada encontrado.</td></tr>
            
            <tr v-for="carta in cartasFiltradas" :key="carta.id">
              <td><span class="code-pill">#{{ carta.codigo }}</span></td>
              <td>
                <div class="bank-info">
                  <span class="bank-name">{{ carta.administradora_detalhes.nome }}</span>
                  <span class="type-tag" :class="carta.tipo.toLowerCase()">{{ carta.tipo === 'IMOVEL' ? 'Imóvel' : 'Auto' }}</span>
                </div>
              </td>
              <td class="font-medium text-blue">{{ formatMoney(carta.valor_credito) }}</td>
              <td class="font-medium">{{ formatMoney(carta.valor_entrada) }}</td>
              <td>
                <span class="status-badge" :class="carta.status.toLowerCase()">{{ carta.status }}</span>
              </td>
              <td class="text-right">
                <div class="action-buttons">
                  <button class="btn-icon edit" @click="router.push(`/admin/cartas/${carta.id}`)"><Edit3 :size="18" /></button>
                  <button class="btn-icon delete" @click="deletarCarta(carta.id)"><Trash2 :size="18" /></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }
.page-title { font-size: 1.8rem; font-weight: 800; color: var(--text-main); margin: 0; letter-spacing: -0.5px; }
.page-subtitle { color: var(--text-muted); margin-top: 4px; }

.btn-primary { 
  background-color: var(--primary-blue); color: white; padding: 12px 24px; border-radius: 10px; 
  font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; 
  box-shadow: var(--shadow-md); transition: all 0.2s;
}
.btn-primary:hover { background-color: #172554; transform: translateY(-2px); }

/* TABLE CARD */
.card-table { background: white; border-radius: 16px; border: 1px solid var(--border-color); box-shadow: var(--shadow-sm); overflow: hidden; }

.table-toolbar { padding: 20px 24px; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; background: #fdfdfd; }
.search-wrapper { position: relative; width: 300px; }
.search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--text-muted); }
.search-wrapper input { 
  width: 100%; padding: 10px 12px 10px 40px; border: 1px solid var(--border-color); border-radius: 8px; 
  outline: none; transition: all 0.2s; background: white;
}
.search-wrapper input:focus { border-color: var(--brand-yellow); box-shadow: 0 0 0 3px rgba(246, 208, 1, 0.2); }
.badge-count { background: #f1f5f9; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }

table { width: 100%; border-collapse: collapse; }
th { text-align: left; padding: 16px 24px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: var(--text-muted); background: #f8fafc; border-bottom: 1px solid var(--border-color); }
td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; color: var(--text-main); font-size: 0.95rem; }
tr:hover { background-color: #fffbeb; /* Hover Amarelo muito suave */ }
tr:last-child td { border-bottom: none; }

.code-pill { font-family: monospace; background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-size: 0.85rem; color: #475569; }
.bank-info { display: flex; flex-direction: column; gap: 2px; }
.bank-name { font-weight: 600; }
.type-tag { font-size: 0.7rem; color: #94a3b8; }

.font-medium { font-weight: 600; }
.text-blue { color: var(--primary-blue); }

.status-badge { padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.status-badge.disponivel { background: #dcfce7; color: #166534; }
.status-badge.reservado { background: #fef9c3; color: #854d0e; }
.status-badge.vendido { background: #fee2e2; color: #991b1b; }

.action-buttons { display: flex; justify-content: flex-end; gap: 8px; }
.btn-icon { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 6px; border: 1px solid transparent; background: transparent; cursor: pointer; transition: all 0.2s; color: var(--text-muted); }
.btn-icon:hover { background: #f1f5f9; border-color: var(--border-color); }
.btn-icon.edit:hover { color: var(--brand-yellow); border-color: var(--brand-yellow); background: #fffbeb; }
.btn-icon.delete:hover { color: #ef4444; border-color: #ef4444; background: #fef2f2; }

.text-right { text-align: right; } .text-center { text-align: center; } .py-8 { padding-top: 3rem; padding-bottom: 3rem; }
</style>