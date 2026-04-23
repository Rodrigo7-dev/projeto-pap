<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-8">
        <router-link to="/freguesias" class="text-blue-600 hover:text-blue-800 mr-4">
          ← Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Freguesia' : 'Nova Freguesia' }}
        </h1>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 mt-2">A carregar dados...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Nome da Freguesia</label>
          <input
            v-model="form.freguesia"
            type="text"
            required
            placeholder="Insira o nome da freguesia"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div class="mt-8 flex justify-end space-x-4">
          <router-link
            to="/freguesias"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition font-bold"
          >
            <span v-if="submitting">A guardar...</span>
            <span v-else>{{ isEditing ? 'Atualizar Freguesia' : 'Criar Freguesia' }}</span>
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
  freguesia: ''
})

const loadFreguesia = async () => {
  if (!isEditing.value) return
  
  loading.value = true
  try {
    // CORREÇÃO: Usar o método específico para buscar UMA freguesia pelo ID
    const res = await api.getFreguesia(route.params.id)
    const data = res.data || res

    if (data) {
      // Garantimos que mapeamos apenas o campo necessário para o input
      form.value.freguesia = data.freguesia
    }
  } catch (error) {
    console.error('Erro ao carregar freguesia:', error)
    alert('Erro ao carregar os dados da freguesia.')
    router.push('/freguesias')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await api.updateFreguesia(route.params.id, form.value)
    } else {
      await api.createFreguesia(form.value)
    }
    router.push('/freguesias')
  } catch (error) {
    console.error('Erro ao salvar:', error)
    alert('Erro ao guardar. Verifique se o nome já existe.')
  } finally {
    submitting.value = false
  }
}

onMounted(loadFreguesia)
</script>