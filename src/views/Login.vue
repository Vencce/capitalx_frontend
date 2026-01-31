<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  try {
    // Tenta fazer login no Django
    const response = await api.post('login/', {
      username: username.value,
      password: password.value
    })

    // Se der certo, salva o token no navegador
    const token = response.data.token
    localStorage.setItem('token', token)
    
    // Redireciona para o Painel
    router.push('/painel')
    
  } catch (err) {
    console.error(err)
    error.value = 'Usuário ou senha inválidos.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <div class="brand">
        <h2>Capital<span class="highlight">X</span></h2>
        <span class="badge">Admin</span>
      </div>
      
      <p class="subtitle">Acesse o painel gerenciador</p>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Usuário</label>
          <input 
            type="text" 
            v-model="username" 
            placeholder="Digite seu usuário" 
            required 
            autofocus
          />
        </div>

        <div class="form-group">
          <label>Senha</label>
          <input 
            type="password" 
            v-model="password" 
            placeholder="Digite sua senha" 
            required 
          />
        </div>

        <div v-if="error" class="error-msg">
          {{ error }}
        </div>

        <button type="submit" :disabled="loading" class="btn-login">
          {{ loading ? 'Entrando...' : 'Entrar' }}
        </button>
      </form>
      
      <div class="footer-link">
        <router-link to="/">Voltar ao site</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6;
  font-family: 'Segoe UI', sans-serif;
}

.login-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.brand {
  font-size: 1.8rem;
  color: #111827;
  font-weight: 800;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.highlight { color: #10b981; }

.badge {
  font-size: 0.7rem;
  background: #eff6ff;
  color: #1e3a8a;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 30px;
  font-size: 0.95rem;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  background-color: #f9fafb;
}

input:focus {
  border-color: #1e3a8a;
  background-color: white;
}

.btn-login {
  width: 100%;
  padding: 12px;
  background-color: #1e3a8a;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 10px;
}

.btn-login:hover {
  background-color: #1e40af;
}

.btn-login:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.error-msg {
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 15px;
  background: #fef2f2;
  padding: 8px;
  border-radius: 6px;
}

.footer-link {
  margin-top: 25px;
}

.footer-link a {
  color: #6b7280;
  text-decoration: none;
  font-size: 0.9rem;
}

.footer-link a:hover {
  color: #1e3a8a;
  text-decoration: underline;
}
</style>