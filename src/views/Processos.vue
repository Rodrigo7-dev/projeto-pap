<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Processos</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Novo Processo
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Número do processo..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="loadProcessos"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Validade</label>
          <select
            v-model="filters.validade"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadProcessos"
          >
            <option value="">Todos</option>
            <option value="valido">Válido</option>
            <option value="invalido">Inválido</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Alojamento Local</label>
          <select
            v-model="filters.alojamentoLocal"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @change="loadProcessos"
          >
            <option value="">Todos</option>
            <option value="sim">Sim</option>
            <option value="nao">Não</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Carregando...</p>
      </div>
      
      <div v-else-if="processos.length === 0" class="text-center py-8 text-gray-500">
        Nenhum processo encontrado
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processo</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alvará</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Validade</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Alojamento</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Criado em</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="processo in processos" :key="processo.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ processo.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ processo.processo }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ processo.alvara }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getStatusClass(processo.validade)" class="px-2 py-1 text-xs rounded-full">
                  {{ processo.validade === 'valido' ? 'Válido' : 'Inválido' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ processo.alojamentoLocal === 'sim' ? 'Sim' : 'Não' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(processo.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="editProcesso(processo)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteProcesso(processo.id)"
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
          {{ showEditModal ? 'Editar Processo' : 'Novo Processo' }}
        </h2>
        
        <form @submit.prevent="saveProcesso" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Número do Processo</label>
            <input
              v-model="form.processo"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alvará</label>
            <input
              v-model="form.alvara"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Validade</label>
            <select
              v-model="form.validade"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="valido">Válido</option>
              <option value="invalido">Inválido</option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Alojamento Local</label>
            <select
              v-model="form.alojamentoLocal"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="sim">Sim</option>
              <option value="nao">Não</option>
            </select>
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

const processos = ref([])
const loading = ref(false)
const saving = ref(false)
const error = ref('')

const showAddModal = ref(false)
const showEditModal = ref(false)

const filters = ref({
  search: '',
  validade: '',
  alojamentoLocal: ''
})

const form = ref({
  id: null,
  processo: '',
  alvara: '',
  validade: 'valido',
  alojamentoLocal: 'sim'
})

onMounted(() => {
  loadProcessos()
})

const loadProcessos = async () => {
  try {
    loading.value = true
    const response = await api.getProcessos(filters.value)
    processos.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar processos:', error)
  } finally {
    loading.value = false
  }
}

const editProcesso = (processo) => {
  form.value = { ...processo }
  showEditModal.value = true
}

const saveProcesso = async () => {
  try {
    saving.value = true
    error.value = ''
    
    if (showEditModal.value) {
      // Editar processo existente
      await api.updateProcesso(form.value.id, form.value)
    } else {
      // Criar novo processo
      await api.createProcesso(form.value)
    }
    
    closeModal()
    loadProcessos()
  } catch (err) {
    console.error('Erro ao salvar processo:', err)
    error.value = 'Erro ao salvar processo. Tente novamente.'
  } finally {
    saving.value = false
  }
}

const deleteProcesso = async (id) => {
  if (!confirm('Tem certeza que deseja excluir este processo?')) {
    return
  }
  
  try {
    await api.deleteProcesso(id)
    loadProcessos()
  } catch (error) {
    console.error('Erro ao excluir processo:', error)
    alert('Erro ao excluir processo. Tente novamente.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    id: null,
    processo: '',
    alvara: '',
    validade: 'valido',
    alojamentoLocal: 'sim'
  }
  error.value = ''
}

const getStatusClass = (validade) => {
  return validade === 'valido' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('pt-BR')
}
</script>
