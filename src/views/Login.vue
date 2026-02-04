<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
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
    
    // Redireciona para o Dashboard (rota /painel)
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
    <div class="bg-decoration"></div>

    <div class="login-card">
      <div class="header">
        <div class="brand">
          <span class="logo-icon">CX</span>
          <h1>Capital<span class="highlight">X</span></h1>
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
  background-color: #f1f5f9;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  position: relative;
  overflow: hidden;
}

/* Fundo Decorativo */
.bg-decoration {
  position: absolute;
  width: 100%;
  height: 50vh;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  top: 0;
  left: 0;
  z-index: 0;
  clip-path: polygon(0 0, 100% 0, 100% 80%, 0 100%);
}

.login-card {
  position: relative;
  z-index: 1;
  background: white;
  padding: 48px;
  width: 100%;
  max-width: 420px;
  border-radius: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}

.header { text-align: center; margin-bottom: 40px; }

.brand { 
  display: flex; align-items: center; justify-content: center; gap: 12px; margin-bottom: 8px; 
}

.logo-icon {
  width: 40px; height: 40px; background: #1e3a8a; color: white;
  border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 1.1rem; letter-spacing: -1px;
}

h1 { font-size: 1.8rem; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; margin: 0; }
.highlight { color: #10b981; }

.subtitle { color: #64748b; font-size: 0.95rem; font-weight: 500; }

.input-wrapper { margin-bottom: 24px; }
label { display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 8px; margin-left: 2px; }

.input-box {
  position: relative;
  display: flex; align-items: center;
}

.icon {
  position: absolute; left: 14px; color: #94a3b8; pointer-events: none;
}

input {
  width: 100%;
  padding: 14px 16px 14px 44px; /* Espaço para o ícone */
  border: 1px solid #cbd5e1;
  border-radius: 12px;
  font-size: 1rem;
  color: #1e293b;
  outline: none;
  transition: all 0.2s;
  background-color: #f8fafc;
}

input:focus {
  border-color: #1e3a8a;
  background-color: white;
  box-shadow: 0 0 0 4px rgba(30, 58, 138, 0.1);
}

.btn-submit {
  width: 100%;
  padding: 14px;
  background: #1e3a8a;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 10px;
  box-shadow: 0 4px 6px -1px rgba(30, 58, 138, 0.2);
}

.btn-submit:hover:not(:disabled) {
  background: #1e40af;
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(30, 58, 138, 0.3);
}

.btn-submit:disabled {
  background: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

.content-btn {
  display: flex; align-items: center; justify-content: center; gap: 10px;
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { 100% { transform: rotate(360deg); } }

.error-box {
  background: #fee2e2; color: #991b1b; padding: 12px; border-radius: 8px;
  font-size: 0.9rem; font-weight: 500; text-align: center; margin-bottom: 20px;
  border: 1px solid #fecaca;
}

.footer { text-align: center; margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
.back-link { color: #64748b; text-decoration: none; font-size: 0.9rem; font-weight: 500; transition: color 0.2s; }
.back-link:hover { color: #1e3a8a; }

@media (max-width: 480px) {
  .login-card { padding: 32px 24px; max-width: 90%; }
  .bg-decoration { height: 40vh; }
}
</style>