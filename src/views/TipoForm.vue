<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-8">
        <router-link to="/tipos" class="text-blue-600 hover:text-blue-800 mr-4">
          ← Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Tipo' : 'Novo Tipo' }}
        </h1>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 mt-2">Carregando...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome do Tipo</label>
          <input
            v-model="form.nome"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Descrição</label>
          <textarea
            v-model="form.descricao"
            rows="4"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>
        
        <div class="mt-8 flex justify-end space-x-4">
          <router-link
            to="/tipos"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="submitting">Salvando...</span>
            <span v-else>{{ isEditing ? 'Atualizar' : 'Criar' }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitting = ref(false)

const isEditing = computed(() => !!route.params.id)

const form = ref({
  nome: '',
  descricao: ''
})

const loadTipo = async () => {
  if (!isEditing.value) return
  
  loading.value = true
  try {
    const data = await api.getTipos({ id: route.params.id })
    const tipo = data.data || data
    if (tipo) {
      form.value = { ...form.value, ...tipo }
    }
  } catch (error) {
    console.error('Erro ao carregar tipo:', error)
    alert('Erro ao carregar tipo.')
    router.push('/tipos')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await api.updateTipo(route.params.id, form.value)
    } else {
      await api.createTipo(form.value)
    }
    
    router.push('/tipos')
  } catch (error) {
    console.error('Erro ao salvar tipo:', error)
    alert('Erro ao salvar tipo. Tente novamente.')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await loadTipo()
})
</script>
