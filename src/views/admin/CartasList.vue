<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import { useRouter } from 'vue-router'

const cartas = ref([])
const router = useRouter()

const fetchCartas = async () => {
  try {
    const response = await api.get('cartas/')
    cartas.value = response.data
  } catch (error) {
    console.error('Erro ao buscar cartas:', error)
  }
}

const deleteCarta = async (id) => {
  if (confirm('Tem certeza que deseja excluir esta carta?')) {
    try {
      await api.delete(`cartas/${id}/`)
      fetchCartas()
    } catch (error) {
      console.error('Erro ao excluir carta:', error)
    }
  }
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

onMounted(fetchCartas)
</script>

<template>
  <div class="admin-container">
    <div class="admin-header">
      <h1>Gerenciar Cartas</h1>
      <button class="btn-primary" @click="router.push('/admin/cartas/nova')">
        Nova Carta
      </button>
    </div>

    <div class="admin-card">
      <div class="table-responsive">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Tipo</th>
              <th>Crédito</th>
              <th>Entrada</th>
              <th>Parcelas</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="carta in cartas" :key="carta.id">
              <td>{{ carta.codigo }}</td>
              <td>{{ carta.tipo }}</td>
              <td>{{ formatCurrency(carta.valor_credito) }}</td>
              <td>{{ formatCurrency(carta.valor_entrada) }}</td>
              <td>{{ carta.numero_parcelas }}x {{ formatCurrency(carta.valor_parcela) }}</td>
              <td>
                <span :class="['status-badge', carta.status.toLowerCase()]">
                  {{ carta.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-edit" @click="router.push(`/admin/cartas/editar/${carta.id}`)">
                    Editar
                  </button>
                  <button class="btn-delete" @click="deleteCarta(carta.id)">
                    Excluir
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
}

.admin-table th,
.admin-table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status-badge.disponivel { background: #e6f4ea; color: #1e7e34; }
.status-badge.reservado { background: #fff3cd; color: #856404; }
.status-badge.vendido { background: #f8d7da; color: #721c24; }

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-edit {
  background: #007bff;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}
</style>