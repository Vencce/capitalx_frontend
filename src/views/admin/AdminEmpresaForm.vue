<script setup>
import { ref } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const nome = ref('')
const logo = ref(null)
const loading = ref(false)

const onFileChange = (e) => {
  logo.value = e.target.files[0]
}

const salvar = async () => {
  loading.value = true
  const formData = new FormData()
  formData.append('nome', nome.value)
  if (logo.value) formData.append('logo', logo.value)

  try {
    await api.post('administradoras/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    router.push('/admin/empresas')
  } catch (e) {
    alert('Erro ao salvar')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminLayout>
    <div class="header-action">
      <h2 class="page-title">Nova Administradora</h2>
    </div>
    <div class="card-clean form-wrapper">
      <form @submit.prevent="salvar">
        <div class="form-group">
          <label>Nome da Empresa</label>
          <input v-model="nome" class="input-clean" required placeholder="Ex: Bradesco">
        </div>
        <div class="form-group mt-4">
          <label>Logo (Imagem)</label>
          <input type="file" @change="onFileChange" class="input-clean" accept="image/*">
        </div>
        <div class="form-footer">
          <button type="submit" class="btn-primary" :disabled="loading">Salvar</button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
.form-wrapper { padding: 30px; max-width: 600px; }
.form-group { display: flex; flex-direction: column; gap: 8px; }
.input-clean { padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
.mt-4 { margin-top: 16px; }
.form-footer { margin-top: 20px; text-align: right; }
</style>