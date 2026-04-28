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
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 outline-none"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 outline-none"
          />
        </div>

        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {{ error }}
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        >
          {{ loading ? 'A entrar...' : 'Entrar' }}
        </button>

      </form>

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
  error.value = ''
  loading.value = true

  try {
    const res = await auth.login({
      email: email.value.trim(),
      password: password.value
    })

    // segurança extra (caso store não redirecione)
    if (res?.token) {
      localStorage.setItem('auth_token', res.token)
    }

    router.push('/dashboard')

  } catch (err) {
    console.error('Login error:', err)

    const status = err.response?.status

    if (status === 401) {
      error.value = 'Credenciais inválidas'
    } else if (status === 500) {
      error.value = 'Erro no servidor. Tenta mais tarde.'
    } else if (!err.response) {
      error.value = 'Sem ligação ao servidor'
    } else {
      error.value = 'Erro inesperado'
    }

  } finally {
    loading.value = false
  }
}
</script>