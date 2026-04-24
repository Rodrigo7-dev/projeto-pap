<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center mb-8">
        <router-link to="/ruas" class="text-blue-600 hover:text-blue-800 mr-4 font-medium">
          ← Voltar
        </router-link>
        <h1 class="text-3xl font-bold text-gray-900">
          {{ isEditing ? 'Editar Rua' : 'Nova Rua' }}
        </h1>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-2"></div>
        <p class="text-gray-600">A carregar dados...</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Nome da Rua</label>
            <input
              v-model="form.rua"
              type="text"
              required
              placeholder="Ex: Avenida Central"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Freguesia</label>
            <select
              v-model="form.freguesia_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="" disabled>Selecione uma freguesia</option>
              <option v-for="freguesia in freguesias" :key="freguesia.id" :value="freguesia.id">
                {{ freguesia.freguesia }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">Coordenada</label>
            <input
              v-model="form.coordenada"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Ex: 41.1579, -8.6291"
            />
          </div>
        </div>
        
        <div class="mt-8 flex justify-end space-x-4">
          <router-link
            to="/ruas"
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </router-link>
          <button
            type="submit"
            :disabled="submitting"
            class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {{ submitting ? 'A guardar...' : (isEditing ? 'Atualizar Rua' : 'Criar Rua') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api' //

const router = useRouter()
const route = useRoute()

const loading = ref(false)
const submitting = ref(false)
const freguesias = ref([])

const isEditing = computed(() => !!route.params.id)

const form = ref({
  rua: '', // Corrigido: era 'nome'
  freguesia_id: '',
  coordenada: ''
})

const loadFreguesias = async () => {
  try {
    const data = await api.getFreguesias() //
    freguesias.value = data.data || data || []
  } catch (error) {
    console.error('Erro ao carregar freguesias:', error)
  }
}

const loadRua = async () => {
  if (!isEditing.value) return
  
  loading.value = true
  try {
    // Corrigido: Usar o método getRua(id) que definiste na api.js
    const data = await api.getRua(route.params.id) 
    const ruaData = data.data || data
    
    if (ruaData) {
      form.value = {
        rua: ruaData.rua || '',
        // Se o backend devolver o objeto freguesia, extraímos o ID
        freguesia_id: ruaData.freguesia?.id || ruaData.freguesia_id || '',
        coordenada: ruaData.coordenada || ''
      }
    }
  } catch (error) {
    console.error('Erro ao carregar rua:', error)
    router.push('/ruas')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await api.updateRua(route.params.id, form.value) //
    } else {
      await api.createRua(form.value) //
    }
    router.push('/ruas')
  } catch (error) {
    console.error('Erro ao salvar rua:', error.response?.data)
    alert('Erro ao salvar rua. Verifique se preencheu todos os campos.')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  await loadFreguesias()
  if (isEditing.value) {
    await loadRua()
  }
})
</script>