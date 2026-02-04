<script setup>
import { ref, onMounted } from 'vue'
import api from '../../services/api'
import AdminLayout from '../../components/AdminLayout.vue'
import { Save, Phone, Mail, Instagram, Facebook } from 'lucide-vue-next'

const form = ref({
  whatsapp: '',
  email_contato: '',
  instagram_link: '',
  facebook_link: ''
})
const loading = ref(false)

onMounted(async () => {
  try {
    const res = await api.get('configuracoes/')
    form.value = res.data
  } catch (e) {
    console.error(e)
  }
})

const salvar = async () => {
  loading.value = true
  try {
    await api.post('configuracoes/', form.value)
    alert('Configurações atualizadas com sucesso!')
  } catch (e) {
    alert('Erro ao salvar.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AdminLayout>
    <div class="header-action">
      <h2 class="page-title">Configurações Gerais</h2>
    </div>

    <div class="card-clean form-wrapper">
      <form @submit.prevent="salvar">
        
        <div class="section-title">Contato Principal</div>
        
        <div class="form-group">
          <label>WhatsApp (Apenas números)</label>
          <div class="input-icon">
            <Phone :size="18" class="icon" />
            <input v-model="form.whatsapp" class="input-clean" placeholder="Ex: 5547999999999">
          </div>
          <small class="hint">Este é o número que receberá as mensagens dos botões do site.</small>
        </div>

        <div class="form-group">
          <label>E-mail de Contato</label>
          <div class="input-icon">
            <Mail :size="18" class="icon" />
            <input v-model="form.email_contato" class="input-clean" placeholder="contato@empresa.com">
          </div>
        </div>

        <div class="section-title mt-4">Redes Sociais</div>

        <div class="form-group">
          <label>Link do Instagram</label>
          <div class="input-icon">
            <Instagram :size="18" class="icon" />
            <input v-model="form.instagram_link" class="input-clean" placeholder="https://instagram.com/...">
          </div>
        </div>

        <div class="form-group">
          <label>Link do Facebook</label>
          <div class="input-icon">
            <Facebook :size="18" class="icon" />
            <input v-model="form.facebook_link" class="input-clean" placeholder="https://facebook.com/...">
          </div>
        </div>

        <div class="form-footer">
          <button type="submit" class="btn-primary" :disabled="loading">
            <Save :size="18" /> {{ loading ? 'Salvando...' : 'Salvar Alterações' }}
          </button>
        </div>
      </form>
    </div>
  </AdminLayout>
</template>

<style scoped>
.form-wrapper { max-width: 600px; margin: 0 auto; padding: 40px; }
.section-title { font-size: 0.9rem; font-weight: 700; color: #1e3a8a; text-transform: uppercase; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-bottom: 16px; }
.mt-4 { margin-top: 32px; }

.form-group { margin-bottom: 16px; }
label { display: block; font-weight: 600; font-size: 0.9rem; color: #334155; margin-bottom: 6px; }
.hint { font-size: 0.8rem; color: #64748b; }

.input-icon { position: relative; display: flex; align-items: center; }
.input-icon .icon { position: absolute; left: 12px; color: #94a3b8; }
.input-clean { width: 100%; padding: 10px 10px 10px 40px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 1rem; outline: none; transition: all 0.2s; }
.input-clean:focus { border-color: #1e3a8a; box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1); }

.form-footer { margin-top: 32px; display: flex; justify-content: flex-end; }
.btn-primary { background: #1e3a8a; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: background 0.2s; }
.btn-primary:hover { background: #1e40af; }
</style>