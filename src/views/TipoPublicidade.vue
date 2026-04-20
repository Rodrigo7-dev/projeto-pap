<template>
<<<<<<< HEAD
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">Tipos de Publicidade</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-slate-600 mt-2">Carregando...</p>
      </div>

      <div v-else>
        <!-- Search -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar tipos de publicidade..." 
            class="w-full px-4 py-2 border border-slate-300 rounded-lg"
          />
        </div>

        <!-- Tipos Grid -->
        <div class="bg-white rounded-lg shadow p-6">
          <div v-if="filteredTipos.length === 0" class="text-center py-8 text-slate-500">
            Nenhum tipo encontrado
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="tipo in filteredTipos" :key="tipo.id" 
              class="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-slate-800">{{ tipo.publicidade }}</h3>
                  <p class="text-sm text-slate-500 mt-1">ID: {{ tipo.id }}</p>
                </div>
                <div class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  #{{ tipo.id }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-6 bg-white rounded-lg shadow p-4">
          <div class="text-center text-slate-600">
            Total de tipos: <span class="font-bold text-slate-800">{{ tipos.length }}</span>
          </div>
        </div>
=======
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Tipos de Publicidade</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Novo Tipo
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
            placeholder="Tipo de publicidade..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="loadTipos"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Total</label>
          <div class="flex items-center h-10">
            <span class="text-sm text-gray-600">
              Total: <span class="font-bold text-gray-800">{{ tipos.length }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="tipos.length === 0" class="text-center py-8 text-gray-500">
        Nenhum tipo de publicidade encontrado
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Publicidade</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processos Associados</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tipo in tipos" :key="tipo.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tipo.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tipo.publicidade }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getProcessosCount(tipo.id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="editTipo(tipo)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteTipo(tipo.id)"
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
          {{ showEditModal ? 'Editar Tipo' : 'Novo Tipo' }}
        </h2>
        
        <form @submit.prevent="saveTipo" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Publicidade</label>
            <input
              v-model="form.publicidade"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Publicidade Digital"
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
>>>>>>> 6dc2544f944c9ab0674f1b635ef1d7d627e17f74
      </div>
    </div>
  </div>
</template>

<<<<<<< HEAD
<script>
import api from '../services/api'

export default {
  data() {
    return {
      loading: true,
      tipos: [],
      search: ''
    }
  },

  computed: {
    filteredTipos() {
      if (!this.search) return this.tipos
      return this.tipos.filter(tipo => 
        tipo.publicidade.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },

  mounted() {
    this.carregarTipos()
  },

  methods: {
    async carregarTipos() {
      this.loading = true
      try {
        const response = await api.get('/tipoPublicidade')
        this.tipos = response.data.data || response.data || []
      } catch (error) {
        console.error('Erro ao carregar tipos:', error)
        this.tipos = []
      } finally {
        this.loading = false
      }
    }
  }
}
=======
<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const tipos = ref([])
const processos = ref([])
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
  publicidade: ''
})

onMounted(() => {
  loadTipos()
  loadProcessos()
})

const loadTipos = async () => {
  try {
    loading.value = true
    const response = await api.getTipos(filters.value)
    tipos.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar tipos:', error)
  } finally {
    loading.value = false
  }
}

const loadProcessos = async () => {
  try {
    const response = await api.getProcessos({ limit: 1000 })
    processos.value = response.data || []
  } catch (error) {
    console.error('Erro ao carregar processos:', error)
  }
}

const editTipo = (tipo) => {
  form.value = { ...tipo }
  showEditModal.value = true
}

const saveTipo = async () => {
  try {
    saving.value = true
    error.value = ''
    
    if (showEditModal.value) {
      // Editar tipo existente
      await api.updateTipo(form.value.id, form.value)
    } else {
      // Criar novo tipo
      await api.createTipo(form.value)
    }
    
    closeModal()
    loadTipos()
  } catch (err) {
    console.error('Erro ao salvar tipo:', err)
    error.value = 'Erro ao salvar tipo. Tente novamente.'
  } finally {
    saving.value = false
  }
}

const deleteTipo = async (id) => {
  const processosCount = getProcessosCount(id)
  if (processosCount > 0) {
    alert(`Não é possível excluir este tipo. Existem ${processosCount} processos associados.`)
    return
  }
  
  if (!confirm('Tem certeza que deseja excluir este tipo de publicidade?')) {
    return
  }
  
  try {
    await api.deleteTipo(id)
    loadTipos()
  } catch (error) {
    console.error('Erro ao excluir tipo:', error)
    alert('Erro ao excluir tipo. Tente novamente.')
  }
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  form.value = {
    id: null,
    publicidade: ''
  }
  error.value = ''
}

const getProcessosCount = (tipoId) => {
  return processos.value.filter(processo => processo.tipo_publicidade_id === tipoId).length
}
>>>>>>> 6dc2544f944c9ab0674f1b635ef1d7d627e17f74
</script>
