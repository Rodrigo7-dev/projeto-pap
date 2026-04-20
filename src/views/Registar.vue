<template>
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

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

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
    }, 2000)
    
  } catch (err) {
    console.error('Registration error:', err)
    error.value = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
  } finally {
    loading.value = false
  }
}
</script>
