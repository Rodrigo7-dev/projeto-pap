<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-8">
        <router-link to="/tipos" class="text-blue-600 hover:text-blue-800 mr-4 font-bold">
          ← Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Tipo' : 'Novo Tipo' }}
        </h1>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-2"></div>
        <p class="text-gray-600">A carregar dados...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Nome da Publicidade</label>
          <input
            v-model="form.publicidade"
            type="text"
            required
            placeholder="Ex: Painel, Reclame..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div class="mt-6">
          <label class="block text-sm font-bold text-gray-700 mb-2">Observações / Processos</label>
          <textarea
            v-model="form.processos"
            rows="4"
            placeholder="Notas adicionais sobre este tipo de publicidade..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          ></textarea>
        </div>
        
        <div class="mt-8 flex justify-end space-x-4">
          <router-link
            to="/tipos"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-4 py-2 rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <span v-if="submitting">A guardar...</span>
            <span v-else>{{ isEditing ? 'Atualizar' : 'Criar Tipo' }}</span>
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
  publicidade: '',
  processos: ''
})

const loadTipo = async () => {
  if (!isEditing.value) return
  
  loading.value = true
  try {
    // CORREÇÃO: Chama o método getTipo(id) específico que está no teu api.js
    const data = await api.getTipo(route.params.id)
    const tipo = data.data || data
    
    if (tipo) {
      form.value = {
        publicidade: tipo.publicidade || tipo.tipo || '', // Aceita ambas as nomenclaturas
        processos: tipo.processos || tipo.observacoes || ''
      }
    }
  } catch (error) {
    console.error('Erro ao carregar tipo:', error)
    alert('Não foi possível carregar os dados deste tipo.')
    router.push('/tipos')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.publicidade.trim()) return

  submitting.value = true
  try {
    const payload = {
      publicidade: form.value.publicidade.trim(),
      processos: form.value.processos.trim()
    }

    if (isEditing.value) {
      await api.updateTipo(route.params.id, payload)
    } else {
      await api.createTipo(payload)
    }
    
    router.push('/tipos')
  } catch (error) {
    console.error('Erro ao salvar tipo:', error.response?.data || error)
    
    // Tratamento de erro 422 (Validação do Backend)
    const errorData = error.response?.data
    let msg = "Erro ao salvar tipo."
    
    if (errorData?.errors && Array.isArray(errorData.errors)) {
      msg = errorData.errors.map(e => e.msg).join('\n')
    } else if (errorData?.message) {
      msg = errorData.message
    }

    alert(`Atenção:\n${msg}`)
  } finally {
    submitting.value = false
  }
}

onMounted(loadTipo)
</script>