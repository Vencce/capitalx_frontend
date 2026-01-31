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
  if (!confirm('Tem certeza?')) return
  await api.delete(`cartas/${id}/`)
  carregarCartas()
}

const cartasFiltradas = computed(() => {
  if (!termoBusca.value) return cartas.value
  const t = termoBusca.value.toLowerCase()
  return cartas.value.filter(c => c.codigo.toLowerCase().includes(t))
})

const formatCurrency = (val) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

onMounted(carregarCartas)
</script>

<template>
  <AdminLayout>
    <div class="header-action">
      <h2 class="page-title">Gerenciar Cartas</h2>
      <button class="btn-primary" @click="router.push('/admin/cartas/nova')">+ Nova Carta</button>
    </div>

    <div class="card-clean content-wrapper">
      <div class="toolbar">
        <input type="text" v-model="termoBusca" class="input-search" placeholder="Buscar por código..." />
      </div>

      <table class="modern-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Tipo</th>
            <th>Admin</th>
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
              {{ carta.administradora_detalhes ? carta.administradora_detalhes.nome : '...' }}
            </td>
            <td class="font-bold">{{ formatCurrency(carta.valor_credito) }}</td>
            <td>
               <span class="status-indicator" :class="carta.status.toLowerCase()">
                 <span class="dot"></span> {{ carta.status }}
               </span>
            </td>
            <td class="actions-cell">
              <div class="actions-group">
                <button class="action-btn edit" @click="router.push(`/admin/cartas/${carta.id}`)">Editar</button>
                <button class="action-btn delete" @click="deletarCarta(carta.id)">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<style scoped>
.header-action { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.btn-primary { background-color: #1e3a8a; color: white; padding: 10px 20px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; }
.content-wrapper { padding: 0; overflow: hidden; }
.toolbar { padding: 20px; border-bottom: 1px solid #e2e8f0; }
.input-search { width: 100%; max-width: 300px; padding: 10px; border: 1px solid #cbd5e1; border-radius: 6px; }

.modern-table { width: 100%; border-collapse: collapse; }
.modern-table th { text-align: left; padding: 16px 24px; background: #f8fafc; color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.modern-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; color: #334155; font-size: 0.9rem; }
.text-right { text-align: right; }

.font-mono { font-family: monospace; color: #64748b; }
.font-bold { font-weight: 600; }
.text-main { color: #1e3a8a; }
.badge-soft { background: #f1f5f9; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }

.status-indicator { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 600; }
.dot { width: 6px; height: 6px; border-radius: 50%; }
.status-indicator.disponivel .dot { background: #10b981; }
.status-indicator.reservado .dot { background: #f59e0b; }
.status-indicator.vendido .dot { background: #ef4444; }

/* CORREÇÃO DAS AÇÕES */
.actions-cell { text-align: right; }
.actions-group { display: flex; justify-content: flex-end; gap: 8px; }
.action-btn { background: none; border: none; font-size: 0.8rem; font-weight: 600; cursor: pointer; padding: 6px 12px; border-radius: 6px; }
.edit { color: #3b82f6; background: #eff6ff; }
.delete { color: #ef4444; background: #fef2f2; }
</style>