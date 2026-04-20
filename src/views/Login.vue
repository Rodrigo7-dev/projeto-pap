<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <div class="login-icon">
          <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1>Bem-vindo!</h1>
        <p>Inicie sessão para continuar</p>
      </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label>Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="email@exemplo.com"
              autocomplete="username"
              required
            />
          </div>

          <div class="form-group">
            <label>Palavra-passe</label>
            <input
              v-model="password"
              type="password"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
          </div>

          <div v-if="error" class="error-message">
            <p>{{ error }}</p>
          </div>

          <button type="submit" :disabled="loading" class="login-btn">
            {{ loading ? 'A entrar...' : 'Entrar' }}
          </button>
        </form>

        <p class="register-link">
          Não tem conta?
          <router-link to="/registar">Registar-se</router-link>
        </p>

        <div class="quick-login">
          <p><strong>Login rápido:</strong></p>
          <p>Email: maria@exemplo.com</p>
          <p>Palavra-passe: 123456</p>
        </div>

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
  background: #f8fafc;
}

.login-box {
  width: 100%;
  max-width: 400px;
  margin: 0 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 32px;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.login-icon {
  width: 64px;
  height: 64px;
  background: #3b82f6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: white;
}

.login-header h1 {
  font-size: 24px;
  font-weight: bold;
  color: #1e293b;
  margin-bottom: 8px;
}

.login-header p {
  color: #64748b;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 4px;
}

.form-group input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.error-message {
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
}

.error-message p {
  color: #dc2626;
  font-size: 14px;
}

.login-btn {
  width: 100%;
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  font-weight: 500;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.register-link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.register-link a {
  color: #3b82f6;
  font-weight: 500;
  margin-left: 4px;
}

.quick-login {
  margin-top: 16px;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 12px;
}
</style>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const email = ref('maria@exemplo.com')
const password = ref('123456')
const error = ref(null)
const loading = ref(false)

const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  error.value = null
  loading.value = true
  
  try {
    await auth.login(email.value, password.value)
    router.push('/dashboard')
  } catch (err) {
    error.value = 'Email ou palavra-passe incorretos'
  } finally {
    loading.value = false
  }
}
</script>
