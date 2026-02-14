<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import logoSrc from '../assets/imagens/logo_branco.png' // Importando a logo oficial
import { User, Lock, ArrowRight, Loader2 } from 'lucide-vue-next'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await api.post('login/', {
      username: username.value,
      password: password.value
    })

    const token = response.data.token
    localStorage.setItem('token', token)
    
    router.push('/painel')
    
  } catch (err) {
    console.error(err)
    error.value = 'Acesso negado. Verifique suas credenciais.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-page">
    <div class="bg-decoration">
      <div class="pattern-overlay"></div>
    </div>

    <div class="login-card">
      <div class="header">
        <div class="brand">
          <img :src="logoSrc" alt="Capital X" class="login-logo" />
        </div>
        <p class="subtitle">Painel Administrativo</p>
      </div>

      <form @submit.prevent="handleLogin">
        
        <div class="input-wrapper">
          <label>Usuário</label>
          <div class="input-box">
            <User :size="18" class="icon" />
            <input 
              type="text" 
              v-model="username" 
              placeholder="Digite seu usuário" 
              required 
              autofocus
            />
          </div>
        </div>

        <div class="input-wrapper">
          <label>Senha</label>
          <div class="input-box">
            <Lock :size="18" class="icon" />
            <input 
              type="password" 
              v-model="password" 
              placeholder="••••••••" 
              required 
            />
          </div>
        </div>

        <div v-if="error" class="error-box">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="btn-submit">
          <span v-if="!loading" class="content-btn">
            Entrar no Sistema <ArrowRight :size="18" />
          </span>
          <span v-else class="content-btn">
            <Loader2 :size="20" class="spin" /> Verificando...
          </span>
        </button>
      </form>
      
      <div class="footer">
        <router-link to="/" class="back-link">
          &larr; Voltar para o site
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #111111;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

/* Fundo Decorativo Premium */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 60vh;
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
  top: 0;
  left: 0;
  z-index: 0;
  clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
  border-bottom: 2px solid #F6D001;
}

.pattern-overlay {
  position: absolute;
  top: 0; left: 0; width: 100%; height: 100%;
  opacity: 0.15;
  background-image: radial-gradient(#64748b 0.8px, transparent 0.8px);
  background-size: 24px 24px;
}

.login-card {
  position: relative;
  z-index: 1;
  background: white;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.header { text-align: center; margin-bottom: 35px; }

.login-logo {
  height: 45px;
  width: auto;
  margin-bottom: 15px;
  filter: brightness(0); /* Garante que a logo fique preta no card branco */
}

.subtitle { 
  color: #64748b; 
  font-size: 0.9rem; 
  font-weight: 700; 
  text-transform: uppercase;
  letter-spacing: 1px;
}

.input-wrapper { margin-bottom: 20px; }
label { display: block; font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-bottom: 8px; text-transform: uppercase; }

.input-box {
  position: relative;
  display: flex; align-items: center;
}

.icon {
  position: absolute; left: 14px; color: #94a3b8; pointer-events: none;
}

input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  color: #0f172a;
  outline: none;
  transition: all 0.2s;
  background-color: #f8fafc;
}

input:focus {
  border-color: #F6D001;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(246, 208, 1, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 16px;
  background: #000000;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 10px;
  border-bottom: 4px solid #F6D001;
}

.btn-submit:hover:not(:disabled) {
  background: #F6D001;
  color: #000000;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px -5px rgba(246, 208, 1, 0.3);
}

.btn-submit:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  border-bottom: 4px solid #64748b;
}

.content-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.error-box {
  background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px;
  font-size: 0.85rem; font-weight: 600; text-align: center; margin-bottom: 20px;
  border: 1px solid #fecaca;
}

.footer { text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
.back-link { color: #64748b; text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: color 0.2s; }
.back-link:hover { color: #F6D001; }

@media (max-width: 480px) {
  .login-card { padding: 35px 20px; max-width: 90%; }
  .bg-decoration { height: 45vh; }
}
</style>