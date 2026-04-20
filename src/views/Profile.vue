<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Meu Perfil</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 mt-2">Carregando...</p>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200">
        <div class="p-6">
          <div class="flex items-center mb-6">
            <div class="h-20 w-20 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {{ userInitials }}
            </div>
            <div class="ml-6">
              <h2 class="text-xl font-semibold text-gray-900">{{ user.name }}</h2>
              <p class="text-gray-600">{{ user.email }}</p>
            </div>
          </div>
          
          <div class="border-t border-gray-200 pt-6">
            <h3 class="text-lg font-medium text-gray-900 mb-4">Informações da Conta</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Nome</label>
                <input
                  v-model="form.name"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  required
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          
          <div class="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              @click="handleLogout"
              class="px-4 py-2 border border-red-300 rounded-md text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Sair
            </button>
            <button
              @click="handleUpdate"
              :disabled="updating"
              class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span v-if="updating">Atualizando...</span>
              <span v-else>Atualizar Perfil</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const loading = ref(false)
const updating = ref(false)

const user = computed(() => auth.user || {})
const userInitials = computed(() => {
  const name = user.value.name || ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

const form = ref({
  name: '',
  email: ''
})

const loadUser = () => {
  form.value = {
    name: user.value.name || '',
    email: user.value.email || ''
  }
}

const handleUpdate = async () => {
  updating.value = true
  try {
    // Aqui você faria a chamada à API para atualizar o perfil
    // await api.updateProfile(form.value)
    
    // Por enquanto, apenas atualiza o store localmente
    auth.user = { ...auth.user, ...form.value }
    
    alert('Perfil atualizado com sucesso!')
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error)
    alert('Erro ao atualizar perfil. Tente novamente.')
  } finally {
    updating.value = false
  }
}

const handleLogout = async () => {
  await auth.logout()
  router.push('/login')
}

onMounted(() => {
  loadUser()
})
</script>
