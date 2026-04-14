<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
      <div class="text-center mb-8">
        <img src="../assets/logo_camera.jpg" alt="Logo" class="h-16 mx-auto mb-4">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Sistema de Publicidade</h1>
        <p class="text-gray-600 text-sm">Faça login para acessar o sistema</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="seu@email.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
        >
          <span v-if="loading" class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Entrando...
          </span>
          <span v-else>Entrar</span>
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <router-link to="/registar" class="text-gray-600 hover:text-gray-900 text-sm font-medium transition duration-150">
          Não tem conta? Registar-se
        </router-link>
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
      email: email.value.trim(),
      password: password.value
    })

    router.push('/dashboard')
    
  } catch (err) {
    console.error('Login error:', err)
    
    if (err.response?.status === 401) {
      error.value = 'Email ou senha incorretos'
    } else if (err.response?.status === 422) {
      error.value = 'Verifique os dados informados'
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
