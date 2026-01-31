<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const empresas = ref([])

const carregar = async () => {
  const res = await api.get('administradoras/')
  empresas.value = res.data
}

const deletar = async (id) => {
  if(!confirm('Excluir esta empresa?')) return
  await api.delete(`administradoras/${id}/`)
  carregar()
}

onMounted(carregar)
</script>

<template>
  <AdminLayout>
    <div class="header-action">
      <h2 class="page-title">Administradoras</h2>
      <button class="btn-primary" @click="router.push('/admin/empresas/nova')">+ Nova Empresa</button>
    </div>
    
    <div class="card-clean content-wrapper">
      <table class="modern-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Nome</th>
            <th class="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="emp in empresas" :key="emp.id">
            <td>
              <img v-if="emp.logo" :src="emp.logo" class="mini-logo" />
              <span v-else class="no-logo">-</span>
            </td>
            <td class="font-bold text-main">{{ emp.nome }}</td>
            <td class="actions-cell">
              <div class="actions-group">
                <button class="action-btn delete" @click="deletar(emp.id)">Excluir</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<style scoped>
.header-action { display: flex; justify-content: space-between; margin-bottom: 24px; }
.btn-primary { background-color: #1e3a8a; color: white; padding: 10px 20px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; }
.content-wrapper { padding: 0; overflow: hidden; }

.modern-table { width: 100%; border-collapse: collapse; }
.modern-table th { padding: 16px 24px; border-bottom: 1px solid #e2e8f0; text-align: left; background: #f8fafc; color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
.modern-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.text-right { text-align: right; }

.mini-logo { height: 35px; width: auto; object-fit: contain; }
.no-logo { color: #cbd5e1; font-weight: bold; }
.font-bold { font-weight: 600; font-size: 1rem; }
.text-main { color: #1e3a8a; }

/* CORREÇÃO DAS AÇÕES */
.actions-cell { text-align: right; }
.actions-group { display: flex; justify-content: flex-end; }
.action-btn { cursor: pointer; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 0.8rem; }
.delete { background: #fee2e2; color: #b91c1c; }
.delete:hover { background: #fecaca; }
</style>