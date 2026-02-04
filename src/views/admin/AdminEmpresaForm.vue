<script setup>
import { ref } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { useRouter } from 'vue-router'
import { UploadCloud } from 'lucide-vue-next'

const router = useRouter()
const nome = ref('')
const logo = ref(null)
const preview = ref(null)
const loading = ref(false)

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    logo.value = file
    preview.value = URL.createObjectURL(file)
  }
}

const salvar = async () => {
  if (!nome.value) return alert('O nome é obrigatório')
  
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
    alert('Erro ao salvar empresa.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminLayout>
    <div class="header-action">
      <h2 class="page-title">Nova Administradora</h2>
      <button class="btn-text" @click="router.push('/admin/empresas')">Cancelar</button>
    </div>

    <div class="form-wrapper card-clean">
      <form @submit.prevent="salvar">
        <div class="form-group">
          <label>Nome da Instituição</label>
          <input v-model="nome" class="input-clean" required placeholder="Ex: Banco do Brasil, Bradesco...">
        </div>

        <div class="form-group mt-4">
          <label>Logotipo</label>
          <div class="upload-area" :class="{ 'has-file': preview }">
            <input type="file" @change="onFileChange" accept="image/*" class="file-input">
            <div class="upload-content" v-if="!preview">
              <UploadCloud :size="32" class="icon-upload" />
              <span>Clique para enviar a logo</span>
              <small>PNG ou JPG (Fundo transparente recomendado)</small>
            </div>
            <div class="preview-content" v-else>
              <img :src="preview" class="preview-img" />
              <span class="change-text">Clique para trocar</span>
            </div>
          </div>
        </div>

        <div class="form-footer">
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Salvando...' : 'Cadastrar Empresa' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
.header-action { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
.page-title { font-size: 1.5rem; font-weight: 700; color: #1e293b; margin: 0; }
.btn-text { background: none; border: none; color: #64748b; font-weight: 600; cursor: pointer; }

.form-wrapper { max-width: 500px; margin: 0 auto; padding: 40px; background: white; border-radius: 16px; border: 1px solid #e2e8f0; }

.form-group { display: flex; flex-direction: column; gap: 8px; }
.mt-4 { margin-top: 24px; }
label { font-size: 0.9rem; font-weight: 600; color: #334155; }

.input-clean { padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; outline: none; transition: border 0.2s; background: #f8fafc; }
.input-clean:focus { border-color: #1e3a8a; background: white; }

/* Upload Area Customizada */
.upload-area { position: relative; border: 2px dashed #cbd5e1; border-radius: 12px; padding: 30px; text-align: center; cursor: pointer; transition: all 0.2s; background: #f8fafc; }
.upload-area:hover { border-color: #1e3a8a; background: #eff6ff; }
.upload-area.has-file { border-style: solid; border-color: #e2e8f0; padding: 20px; }

.file-input { position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }

.upload-content { display: flex; flex-direction: column; align-items: center; gap: 8px; color: #64748b; }
.icon-upload { color: #1e3a8a; margin-bottom: 4px; }
.upload-content small { font-size: 0.75rem; color: #94a3b8; }

.preview-content { display: flex; flex-direction: column; align-items: center; gap: 10px; }
.preview-img { max-height: 80px; max-width: 100%; object-fit: contain; }
.change-text { font-size: 0.8rem; color: #1e3a8a; font-weight: 600; }

.form-footer { margin-top: 32px; display: flex; justify-content: flex-end; }
.btn-primary { background-color: #1e3a8a; color: white; padding: 12px 32px; border-radius: 8px; font-weight: 600; border: none; cursor: pointer; width: 100%; transition: background 0.2s; }
.btn-primary:hover { background-color: #1e40af; }
</style>