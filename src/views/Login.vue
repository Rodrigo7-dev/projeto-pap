<template>
  <div class="login-container">
    <div class="login-form">
      <div class="login-header">
        <img src="../assets/logo_camera.jpg" alt="Logo" class="logo">
        <h1>Sistema de Gestão de Publicidade</h1>
        <p>Acesso ao Sistema</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="email@exemplo.com"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Senha"
          />
        </div>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="submit-button"
        >
          <span v-if="loading">Autenticando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
      
      <div class="register-link">
        <router-link to="/register">Não tem conta? Registar</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  try {
    error.value = ''
    loading.value = true

    await auth.login({
      email: email.value,
      password: password.value
    })

    router.push('/dashboard')
    
  } catch (err) {
    console.error('Login error:', err)
    
    if (err.response?.status === 401) {
      error.value = 'Credenciais inválidas'
    } else if (err.code === 'ECONNABORTED') {
      error.value = 'Tempo esgotado. Tente novamente.'
    } else if (err.message.includes('Network Error')) {
      error.value = 'Erro de conexão. Verifique sua internet.'
    } else {
      error.value = 'Ocorreu um erro. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #f5f5f5;
  font-family: Arial, sans-serif;
}

.login-form {
  background: #fff;
  border: 1px solid #ddd;
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.logo {
  height: 60px;
  margin-bottom: 20px;
}

.login-header h1 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: normal;
}

.login-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: normal;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #999;
}

.error-message {
  background: #ffe8e8;
  color: #a52a2a;
  padding: 12px;
  border: 1px solid #ffcccc;
  border-radius: 4px;
  margin-bottom: 20px;
  font-size: 14px;
}

.submit-button {
  width: 100%;
  padding: 12px;
  background: #333;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
}

.submit-button:hover:not(:disabled) {
  background: #555;
}

.submit-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  text-align: center;
  margin-top: 20px;
}

.register-link a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
}

.register-link a:hover {
  color: #333;
}
</style>
