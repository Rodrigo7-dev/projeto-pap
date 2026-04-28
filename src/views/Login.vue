<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
      <div class="text-center mb-8">
        <img src="../assets/logo_camera.jpg" alt="Logo" class="h-16 mx-auto mb-4">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Sistema</h1>
        <p class="text-gray-600 text-sm">Acesso ao Sistema v2.0</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="email@exemplo.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="Senha"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>
        
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {{ error }}
        </div>
        
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150"
        >
          <span v-if="loading">Entrando...</span>
          <span v-else>Entrar</span>
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <span class="text-sm text-gray-600">Não tem uma conta?</span>
        <router-link to="/registar" class="text-gray-600 hover:text-gray-900 text-sm font-medium ml-1 transition duration-150">
          Criar Conta
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  if (loading.value) return

  error.value = ''
  loading.value = true

  try {
    await auth.login({
      email: email.value.trim(),
      password: password.value
    })

    router.push('/dashboard')

  } catch (err) {
    console.error('Login error:', err)

    const status = err?.response?.status

    if (status === 401) {
      error.value = 'Credenciais inválidas'
      password.value = '' // limpa password por segurança
    } 
    else if (err?.code === 'ECONNABORTED') {
      error.value = 'Tempo esgotado. Tente novamente.'
    } 
    else if (!err?.response) {
      error.value = 'Erro de conexão. Verifique a internet.'
    } 
    else {
      error.value = 'Erro inesperado. Tente novamente.'
    }

    // pequeno UX: focar password após erro
    await nextTick()
  } 
  finally {
    loading.value = false
  }
}
</script>