<template>
  <div class="auth-shell">
    <div class="auth-card">
      <div class="mb-8 text-center">
        <img
          :src="logo"
          alt="Logo"
          class="mx-auto mb-4 h-16 rounded-lg object-cover"
        />
        <h1 class="mb-2 text-2xl font-semibold text-slate-900">
          Criar conta
        </h1>
        <p class="text-sm text-slate-500">
          Preencha os dados para começar
        </p>
      </div>

      <form
        class="space-y-4"
        @submit.prevent="handleRegister"
      >
        <BaseInput
          v-model="form.name"
          label="Nome completo"
          required
          placeholder="João Silva"
        />
        <p
          v-if="fieldErrors.name"
          class="-mt-2 text-sm text-rose-600"
        >
          {{ fieldErrors.name }}
        </p>

        <BaseInput
          v-model="form.email"
          type="email"
          label="Email"
          required
          placeholder="seu@email.com"
        />
        <p
          v-if="fieldErrors.email"
          class="-mt-2 text-sm text-rose-600"
        >
          {{ fieldErrors.email }}
        </p>

        <BaseInput
          v-model="form.nif"
          label="NIF"
          maxlength="9"
          inputmode="numeric"
          placeholder="123456789"
        />
        <p
          v-if="fieldErrors.nif"
          class="-mt-2 text-sm text-rose-600"
        >
          {{ fieldErrors.nif }}
        </p>

        <BaseInput
          v-model="form.password"
          type="password"
          label="Palavra-passe"
          required
          placeholder="Mínimo 6 caracteres"
        />
        <p
          v-if="fieldErrors.password"
          class="-mt-2 text-sm text-rose-600"
        >
          {{ fieldErrors.password }}
        </p>

        <BaseInput
          v-model="form.confirmPassword"
          type="password"
          label="Confirmar palavra-passe"
          required
          placeholder="Repita a palavra-passe"
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
          {{ loading ? 'A criar conta...' : 'Criar conta' }}
        </BaseButton>
      </form>

      <div class="mt-6 text-center">
        <span class="text-sm text-slate-600">Já tem uma conta?</span>
        <router-link
          to="/login"
          class="ml-1 text-sm font-medium text-slate-700 transition hover:text-slate-950"
        >
          Fazer login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

import BaseButton from '@/components/ui/BaseButton.vue'
import BaseInput from '@/components/ui/BaseInput.vue'
import logo from '@/assets/logo_camera.jpg'

const router = useRouter()

const form = ref({
  name: '',
  email: '',
  nif: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const loading = ref(false)

const fieldErrors = ref({
  name: '',
  email: '',
  nif: '',
  password: ''
})

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

  error.value = ''
  clearFieldErrors()

  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'As palavras-passe não coincidem'
    return
  }

  if (form.value.password.length < 6) {
    error.value = 'A palavra-passe deve ter pelo menos 6 caracteres'
    return
  }

      if (!/^\d{9}$/.test(form.value.nif.trim())) {
      error.value = 'O NIF deve conter exatamente 9 dígitos'
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

    router.push({ path: '/login', query: { registered: '1' } })
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
    } else if (status === 500) {
      error.value = 'Erro no servidor'
    } else if (err?.code === 'ECONNABORTED') {
      error.value = 'Tempo esgotado. Tente novamente.'
    } else if (!err?.response) {
      error.value = 'Erro de conexão'
    } else if (status === 409) {
      error.value = err.response.data.error
    } else {
      error.value = 'Erro ao criar conta'
    }
  } finally {
    loading.value = false
  }
}
</script>
