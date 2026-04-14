<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Ruas</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Nova Rua
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
            placeholder="Nome da rua..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="loadRuas"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Freguesia</label>
          <select
            v-model="filters.freguesia"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadRuas"
          >
            <option value="">Todas</option>
            <option v-for="freguesia in freguesias" :key="freguesia.id" :value="freguesia.id">
              {{ freguesia.freguesia }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="ruas.length === 0" class="text-center py-8 text-gray-500">
        Nenhuma rua encontrada
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rua</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Freguesia</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coordenadas</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="rua in ruas" :key="rua.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ rua.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ rua.rua }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ getFreguesiaName(rua.freguesias_id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ rua.coordenada }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="editRua(rua)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteRua(rua.id)"
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
          {{ showEditModal ? 'Editar Rua' : 'Nova Rua' }}
        </h2>
        
        <form @submit.prevent="saveRua" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nome da Rua</label>
            <input
              v-model="form.rua"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Freguesia</label>
            <select
              v-model="form.freguesias_id"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Selecione uma freguesia</option>
              <option v-for="freguesia in freguesias" :key="freguesia.id" :value="freguesia.id">
                {{ freguesia.freguesia }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Coordenadas</label>
            <input
              v-model="form.coordenada"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: 41.8442,-8.8359"
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

const ruas = ref([])
const freguesias = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const showAddModal = ref(false)
const showEditModal = ref(false)

const filters = ref({
  search: '',
  freguesia: ''
})

const form = ref({
  id: null,
  rua: '',
  freguesias_id: '',
  coordenada: ''
})

onMounted(() => {
  loadRuas()
  loadFreguesias()
})

const loadRuas = async () => {
  try {
    loading.value = true
    const response = await api.getRuas(filters.value)
    ruas.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar ruas:', error)
  } finally {
    loading.value = false
  }
}

const loadFreguesias = async () => {
  try {
    const response = await api.getFreguesias()
    freguesias.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar freguesias:', error)
  }
}

const editRua = (rua) => {
  form.value = { ...rua }
  showEditModal.value = true
}

const saveRua = async () => {
  try {
    saving.value = true
    error.value = ''
    
    if (showEditModal.value) {
      // Editar rua existente
      await api.updateRua(form.value.id, form.value)
    } else {
      // Criar nova rua
      await api.createRua(form.value)
    }
    
    closeModal()
    loadRuas()
  } catch (err) {
    console.error('Erro ao salvar rua:', err)
    error.value = 'Erro ao salvar rua. Tente novamente.'
  } finally {
    saving.value = false
  }
}

const deleteRua = async (id) => {
  if (!confirm('Tem certeza que deseja excluir esta rua?')) {
    return
  }
  
  try {
    await api.deleteRua(id)
    loadRuas()
  } catch (error) {
    console.error('Erro ao excluir rua:', error)
    alert('Erro ao excluir rua. Tente novamente.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    id: null,
    rua: '',
    freguesias_id: '',
    coordenada: ''
  }
  error.value = ''
}

const getFreguesiaName = (freguesiaId) => {
  const freguesia = freguesias.value.find(f => f.id === freguesiaId)
  return freguesia ? freguesia.freguesia : 'Não encontrada'
}
</script>
