<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="bg-white p-8 rounded-lg shadow-sm w-full max-w-md border border-gray-200">
      <div class="text-center mb-8">
        <img src="../assets/logo_camera.jpg" alt="Logo" class="h-16 mx-auto mb-4">
        <h1 class="text-2xl font-semibold text-gray-900 mb-2">Criar Conta</h1>
        <p class="text-gray-600 text-sm">Preencha os dados para começar</p>
      </div>
      
      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
          <input
            v-model="form.name"
            type="text"
            placeholder="João Silva"
            :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-transparent', 
                      fieldErrors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-500']"
            required
          />
          <div v-if="fieldErrors.name" class="mt-1 text-sm text-red-600">
            {{ fieldErrors.name }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-transparent', 
                      fieldErrors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-500']"
            required
          />
          <div v-if="fieldErrors.email" class="mt-1 text-sm text-red-600">
            {{ fieldErrors.email }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">NIF</label>
          <input
            v-model="form.nif"
            type="text"
            placeholder="123456789"
            maxlength="9"
            :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-transparent', 
                      fieldErrors.nif ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-500']"
          />
          <div v-if="fieldErrors.nif" class="mt-1 text-sm text-red-600">
            {{ fieldErrors.nif }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            :class="['w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-transparent', 
                      fieldErrors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-gray-500']"
            required
          />
          <div v-if="fieldErrors.password" class="mt-1 text-sm text-red-600">
            {{ fieldErrors.password }}
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
          <input
            v-model="form.confirmPassword"
            type="password"
            placeholder="Repita a senha"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            required
          />
        </div>
        
        <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
          {{ error }}
        </div>

        <div v-if="success" class="bg-green-50 border border-green-200 text-green-700 px-3 py-2 rounded-md text-sm">
          {{ success }}
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
            Criando conta...
          </span>
          <span v-else>Criar Conta</span>
        </button>
      </form>
      
      <div class="mt-6 text-center">
        <span class="text-sm text-gray-600">Já tem uma conta?</span>
        <router-link to="/login" class="text-gray-600 hover:text-gray-900 text-sm font-medium ml-1 transition duration-150">
          Fazer Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  nif: '',
  password: '',
  confirmPassword: ''
})

const error = ref(null)
const success = ref(null)
const loading = ref(false)

const fieldErrors = ref({
  name: '',
  email: '',
  nif: '',
  password: ''
})

const resetFields = () => {
  form.value = {
    name: '',
    email: '',
    nif: '',
    password: '',
    confirmPassword: ''
  }
}

const clearFieldErrors = () => {
  fieldErrors.value = {
    name: '',
    email: '',
    nif: '',
    password: ''
  }
}

const handleRegister = async () => {
  if (loading.value) return

  error.value = null
  success.value = null
  clearFieldErrors()

  // 🔴 validações locais
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'As senhas não coincidem'
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }

  loading.value = true

  try {
    await api.register({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      nif: form.value.nif?.trim() || null,
      password: form.value.password,
      password_confirmation: form.value.confirmPassword
    })

    success.value = 'Conta criada com sucesso!'

    resetFields()

    setTimeout(() => {
      router.push('/dashboard')
    }, 1200)

  } catch (err) {
    console.error('Registration error:', err)

    const status = err?.response?.status
    const errors = err?.response?.data?.errors

    if (status === 422 && errors) {
      fieldErrors.value = {
        name: errors.name?.[0] || '',
        email: errors.email?.[0] || '',
        nif: errors.nif?.[0] || '',
        password: errors.password?.[0] || ''
      }

      error.value = 'Verifique os campos'
    }

    else if (status === 500) {
      error.value = 'Erro no servidor'
    }

    else if (err?.code === 'ECONNABORTED') {
      error.value = 'Tempo esgotado. Tente novamente.'
    }

    else if (!err?.response) {
      error.value = 'Erro de conexão'
    }

    else {
      error.value = 'Erro ao criar conta'
    }

  } finally {
    loading.value = false
  }
}
</script>