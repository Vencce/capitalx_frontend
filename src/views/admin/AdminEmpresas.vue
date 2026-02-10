<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { useRouter } from 'vue-router'
import { Plus, Trash2, Building2 } from 'lucide-vue-next'

const router = useRouter()
const empresas = ref([])
const loading = ref(true)

const carregar = async () => {
  try {
    const res = await api.get('administradoras/')
    empresas.value = res.data
  } catch (error) {
    console.error("Erro ao carregar administradoras")
  } finally {
    loading.value = false
  }
}

const deletar = async (id) => {
  if(!confirm('Tem certeza que deseja excluir esta administradora? As cartas vinculadas podem ser afetadas.')) return
  try {
    await api.delete(`administradoras/${id}/`)
    carregar()
  } catch (error) {
    alert('Erro ao excluir. Verifique se existem cartas vinculadas.')
  }
}

const getLogoUrl = (path) => {
  if (!path) return ''
  // Se já for link completo (Cloudinary), usa ele
  if (path.startsWith('http')) return path
  // Se for relativo, adiciona o dominio do backend
  return `https://capitalxinvest.onrender.com${path}`
}

onMounted(carregar)
</script>

<template>
  <AdminLayout>
    <div class="page-header">
      <div>
        <h2 class="page-title">Administradoras</h2>
        <p class="page-subtitle">Gerencie os bancos e consórcios parceiros</p>
      </div>
      <button class="btn-primary" @click="router.push('/admin/empresas/nova')">
        <Plus :size="18" /> Nova Empresa
      </button>
    </div>
    
    <div class="card-clean table-container">
      <table class="data-table">
        <thead>
          <tr>
            <th width="15%">Logo</th>
            <th>Nome da Instituição</th>
            <th width="10%" class="text-right">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="3" class="text-center py-4">Carregando parceiros...</td>
          </tr>
          <tr v-else-if="empresas.length === 0">
            <td colspan="3" class="text-center py-4">Nenhuma administradora cadastrada.</td>
          </tr>
          <tr v-for="emp in empresas" :key="emp.id">
            <td>
              <div class="logo-box">
                <img v-if="emp.logo" :src="getLogoUrl(emp.logo)" class="mini-logo" alt="Logo" />
                <Building2 v-else :size="24" class="text-muted" />
              </div>
            </td>
            <td>
              <span class="empresa-nome">{{ emp.nome }}</span>
            </td>
            <td class="text-right">
              <button class="btn-icon delete" @click="deletar(emp.id)" title="Excluir">
                <Trash2 :size="18" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </AdminLayout>
</template>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
.page-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; }
.page-subtitle { color: #64748b; font-size: 0.9rem; margin-top: 4px; }

.btn-primary { background-color: #1e3a8a; color: white; padding: 10px 20px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; }
.btn-primary:hover { background-color: #1e40af; }

.table-container { background: white; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.02); }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: 16px 24px; border-bottom: 1px solid #e2e8f0; text-align: left; background: #f8fafc; color: #64748b; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.data-table td { padding: 16px 24px; border-bottom: 1px solid #f1f5f9; vertical-align: middle; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover { background: #fdfdfd; }

.logo-box { width: 50px; height: 50px; background: #f8fafc; border-radius: 8px; display: flex; align-items: center; justify-content: center; border: 1px solid #f1f5f9; }
.mini-logo { max-width: 80%; max-height: 80%; object-fit: contain; }
.empresa-nome { font-weight: 600; color: #334155; font-size: 1rem; }

.text-right { text-align: right; }
.text-center { text-align: center; }
.text-muted { color: #94a3b8; }
.py-4 { padding-top: 2rem; padding-bottom: 2rem; }

.btn-icon { background: none; border: none; cursor: pointer; padding: 8px; border-radius: 6px; color: #94a3b8; transition: all 0.2s; }
.btn-icon.delete:hover { background: #fee2e2; color: #ef4444; }
</style>