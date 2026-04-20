<template>
<<<<<<< HEAD
  <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc;">
    <div style="width: 100%; max-width: 400px; margin: 0 16px;">
      <div style="background: white; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); padding: 32px;">
        
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 64px; height: 64px; background: #8b5cf6; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px;">
            <svg style="width: 32px; height: 32px; color: white;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 style="font-size: 24px; font-weight: bold; color: #1e293b; margin-bottom: 8px;">Criar nova conta</h1>
          <p style="color: #64748b;">Preencha os dados para começar</p>
        </div>

        <form @submit.prevent="handleRegister" style="display: flex; flex-direction: column; gap: 16px;">
          
          <div>
            <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Nome completo</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="João Silva"
              style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;"
              required
            />
          </div>

          <div>
            <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="seu@email.com"
              style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;"
              required
            />
          </div>

          <div>
            <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">NIF</label>
            <input
              v-model="form.nif"
              type="text"
              placeholder="123456789"
              maxlength="9"
              style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;"
              required
            />
          </div>

          <div>
            <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Senha</label>
            <input
              v-model="form.password"
              type="password"
              placeholder="••••••••"
              style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;"
              required
            />
          </div>

          <div>
            <label style="display: block; font-size: 14px; font-weight: 500; color: #374151; margin-bottom: 4px;">Confirmar senha</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="••••••••"
              style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px;"
              required
            />
          </div>

          <div v-if="error" style="padding: 12px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px;">
            <p style="color: #dc2626; font-size: 14px;">{{ error }}</p>
          </div>

          <div v-if="success" style="padding: 12px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px;">
            <p style="color: #16a34a; font-size: 14px;">{{ success }}</p>
          </div>

          <button
            type="submit"
            :disabled="loading"
            style="width: 100%; padding: 8px 16px; background: #8b5cf6; color: white; font-weight: 500; border-radius: 8px; border: none; cursor: pointer;"
          >
            {{ loading ? 'Criando conta...' : 'Criar conta' }}
          </button>
        </form>

        <p style="margin-top: 24px; text-align: center; font-size: 14px; color: #64748b;">
          Já tem uma conta?
          <router-link to="/login" style="color: #8b5cf6; font-weight: 500; margin-left: 4px;">
            Fazer login
          </router-link>
        </p>

=======
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
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            v-model="form.email"
            type="email"
            placeholder="seu@email.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">NIF</label>
          <input
            v-model="form.nif"
            type="text"
            placeholder="123456789"
            maxlength="9"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input
            v-model="form.password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-transparent"
            required
          />
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
>>>>>>> 6dc2544f944c9ab0674f1b635ef1d7d627e17f74
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
<<<<<<< HEAD
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'
=======
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
>>>>>>> 6dc2544f944c9ab0674f1b635ef1d7d627e17f74

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

<<<<<<< HEAD
const auth = useAuthStore()
const router = useRouter()

const handleRegister = async () => {
  error.value = null
  success.value = null
  
  // Validações básicas
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'As senhas não coincidem'
    return
  }
  
  if (form.value.nif.length !== 9 || !/^\d+$/.test(form.value.nif)) {
    error.value = 'O NIF deve conter exatamente 9 números'
    return
  }
  
  if (form.value.password.length < 6) {
    error.value = 'A senha deve ter pelo menos 6 caracteres'
    return
  }
  
  loading.value = true
  
  try {
    await auth.register(
      form.value.name,
      form.value.email,
      form.value.nif,
      form.value.password
    )
    
    success.value = 'Conta criada com sucesso! Redirecionando...'
    
    setTimeout(() => {
      router.push('/login')
=======
const handleRegister = async () => {
  try {
    error.value = null
    success.value = null
    loading.value = true

    // Validações básicas
    if (form.value.password !== form.value.confirmPassword) {
      error.value = 'As senhas não coincidem'
      return
    }
    
    if (form.value.password.length < 6) {
      error.value = 'A senha deve ter pelo menos 6 caracteres'
      return
    }

    // Enviar para API usando o auth store
    const response = await auth.register({
      name: form.value.name.trim(),
      email: form.value.email.trim(),
      nif: form.value.nif.trim(),
      password: form.value.password,
      password_confirmation: form.value.confirmPassword
    })

    success.value = 'Conta criada com sucesso! Redirecionando...'
    
    // Redirecionar para dashboard após 2 segundos
    setTimeout(() => {
      router.push('/dashboard')
>>>>>>> 6dc2544f944c9ab0674f1b635ef1d7d627e17f74
    }, 2000)
    
  } catch (err) {
    console.error('Registration error:', err)
<<<<<<< HEAD
    error.value = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
=======
    
    if (err.response?.status === 422) {
      const errors = err.response.data?.errors
      if (errors?.email) {
        error.value = 'Email já está em uso'
      } else if (errors?.name) {
        error.value = 'Nome inválido'
      } else if (errors?.password) {
        error.value = 'A senha deve ter pelo menos 6 caracteres'
      } else {
        error.value = 'Verifique os dados informados'
      }
    } else if (err.response?.status === 500) {
      error.value = 'Erro no servidor. Tente novamente.'
    } else if (err.code === 'ECONNABORTED') {
      error.value = 'Tempo esgotado. Tente novamente.'
    } else if (err.message.includes('Network Error')) {
      error.value = 'Erro de conexão. Verifique sua internet.'
    } else {
      error.value = 'Erro ao criar conta. Tente novamente.'
    }
>>>>>>> 6dc2544f944c9ab0674f1b635ef1d7d627e17f74
  } finally {
    loading.value = false
  }
}
</script>
