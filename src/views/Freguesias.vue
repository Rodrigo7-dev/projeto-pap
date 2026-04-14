<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Freguesias</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Nova Freguesia
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Nome da freguesia..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="loadFreguesias"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Total</label>
          <div class="flex items-center h-10">
            <span class="text-sm text-gray-600">
              Total: <span class="font-bold text-gray-800">{{ freguesias.length }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="freguesias.length === 0" class="text-center py-8 text-gray-500">
        Nenhuma freguesia encontrada
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Freguesia</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ruas Associadas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="freguesia in freguesias" :key="freguesia.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ freguesia.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ freguesia.freguesia }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getRuasCount(freguesia.id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="editFreguesia(freguesia)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteFreguesia(freguesia.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Adicionar/Editar -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ showEditModal ? 'Editar Freguesia' : 'Nova Freguesia' }}
        </h2>
        
        <form @submit.prevent="saveFreguesia" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Freguesia</label>
            <input
              v-model="form.freguesia"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Nova Freguesia"
            />
          </div>
          
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            {{ error }}
          </div>
          
          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const freguesias = ref([])
const ruas = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const showAddModal = ref(false)
const showEditModal = ref(false)

const filters = ref({
  search: ''
})

const form = ref({
  id: null,
  freguesia: ''
})

onMounted(() => {
  loadFreguesias()
  loadRuas()
})

const loadFreguesias = async () => {
  try {
    loading.value = true
    const response = await api.getFreguesias(filters.value)
    freguesias.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar freguesias:', error)
  } finally {
    loading.value = false
  }
}

const loadRuas = async () => {
  try {
    const response = await api.getRuas()
    ruas.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar ruas:', error)
  }
}

const editFreguesia = (freguesia) => {
  form.value = { ...freguesia }
  showEditModal.value = true
}

const saveFreguesia = async () => {
  try {
    saving.value = true
    error.value = ''
    
    if (showEditModal.value) {
      // Editar freguesia existente
      await api.updateFreguesia(form.value.id, form.value)
    } else {
      // Criar nova freguesia
      await api.createFreguesia(form.value)
    }
    
    closeModal()
    loadFreguesias()
  } catch (err) {
    console.error('Erro ao salvar freguesia:', err)
    error.value = 'Erro ao salvar freguesia. Tente novamente.'
  } finally {
    saving.value = false
  }
}

const deleteFreguesia = async (id) => {
  const ruasCount = getRuasCount(id)
  if (ruasCount > 0) {
    alert(`Não é possível excluir esta freguesia. Existem ${ruasCount} ruas associadas.`)
    return
  }
  
  if (!confirm('Tem certeza que deseja excluir esta freguesia?')) {
    return
  }
  
  try {
    await api.deleteFreguesia(id)
    loadFreguesias()
  } catch (error) {
    console.error('Erro ao excluir freguesia:', error)
    alert('Erro ao excluir freguesia. Tente novamente.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    id: null,
    freguesia: ''
  }
  error.value = ''
}

const getRuasCount = (freguesiaId) => {
  return ruas.value.filter(rua => rua.freguesias_id === freguesiaId).length
}
</script>
