<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-2xl mx-auto">
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
        <p class="text-gray-600">A carregar...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Nome da Publicidade</label>
          <input
            v-model="form.publicidade"
            type="text"
            required
            placeholder="Ex: Painel, Outdoor, Placa..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          />
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
  publicidade: ''
})

const loadTipo = async () => {
  if (!isEditing.value) return
  loading.value = true
  try {
    const data = await api.getTipo(route.params.id)
    const tipo = data.data || data
    if (tipo) {
      form.value.publicidade = tipo.publicidade || tipo.tipo || ''
    }
  } catch (error) {
    console.error('Erro ao carregar:', error)
    router.push('/tipos')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!form.value.publicidade.trim()) return

  submitting.value = true
  try {
    // ENVIAR APENAS A VARIÁVEL 'publicidade'
    const payload = {
      publicidade: form.value.publicidade.trim()
    }

    if (isEditing.value) {
      await api.updateTipo(route.params.id, payload)
    } else {
      await api.createTipo(payload)
    }
    
    router.push('/tipos')
  } catch (error) {
    console.error('Erro detalhado:', error.response?.data)
    const msg = error.response?.data?.error || "Erro ao salvar. Verifique se o nome já existe."
    alert(msg)
  } finally {
    submitting.value = false
  }
}

onMounted(loadTipo)
</script>