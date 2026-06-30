<template>
  <div class="auth-shell">
    <div class="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div class="mb-8 text-center">
        <img
          src="../assets/logo_camera.jpg"
          alt="Logo"
          class="mx-auto mb-4 h-16 rounded-lg"
        />
        <h1 class="mb-2 text-2xl font-semibold text-slate-900">
          Sistema
        </h1>
        <p class="text-sm text-slate-500">
          Acesso ao sistema
        </p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="handleLogin"
      >
        <BaseInput
          v-model="email"
          type="email"
          label="Email"
          required
          placeholder="email@exemplo.com"
        />

        <BaseInput
          v-model="password"
          type="password"
          label="Palavra-passe"
          required
          placeholder="Palavra-passe"
        />

        <div
          v-if="error"
          class="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700"
        >
          {{ error }}
        </div>

        <BaseButton
          type="submit"
          :disabled="loading"
          class="w-full"
        >
          {{ loading ? 'A entrar...' : 'Entrar' }}
        </BaseButton>
      </form>

      <div class="mt-6 text-center">
        <span class="text-sm text-slate-600">Não tem uma conta?</span>
        <router-link
          to="/registar"
          class="ml-1 text-sm font-medium text-slate-700 transition hover:text-slate-950"
        >
          Criar conta
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'

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
      error.value = 'Erro de conexão. Verifique a internet.'
    } else {
      error.value = 'Ocorreu um erro. Tente novamente.'
    }
  } finally {
    loading.value = false
  }
}
</script>
