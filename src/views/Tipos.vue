<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tipos de Publicidade</h1>
        <router-link 
          to="/tipos/novo" 
          class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150"
        >
          Novo Tipo
        </router-link>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
        <p class="text-gray-600 mt-2">Carregando...</p>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200">
        <!-- Search -->
        <div class="p-4 border-b border-gray-200">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar tipos..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nome
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Descrição
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="tipo in filteredTipos" :key="tipo.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ tipo.publicidade }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">-</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link 
                    :to="`/tipos/${tipo.id}/editar`" 
                    class="text-gray-600 hover:text-gray-900 mr-4"
                  >
                    Editar
                  </router-link>
                  <button 
                    @click="deleteTipo(tipo)" 
                    class="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTipos.length === 0" class="text-center py-12">
          <div class="text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum tipo encontrado</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ search ? 'Tente uma busca diferente' : 'Comece adicionando um novo tipo' }}
            </p>
            <div class="mt-6">
              <router-link 
                to="/tipos/novo" 
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Novo Tipo
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const loading = ref(false)
const tipos = ref([])
const search = ref('')

const filteredTipos = computed(() => {
  if (!search.value) return tipos.value
  
  const searchTerm = search.value.toLowerCase()
  return tipos.value.filter(tipo => 
    tipo.publicidade?.toLowerCase().includes(searchTerm)
  )
})

const loadTipos = async () => {
  loading.value = true
  try {
    const data = await api.getTipos()
    // Garantir que SEMPRE recebemos arrays
    tipos.value = Array.isArray(data) ? data : 
                Array.isArray(data.data) ? data.data : 
                Array.isArray(data.tipos) ? data.tipos : []
  } catch (error) {
    console.error('Erro ao carregar tipos:', error)
    tipos.value = []
  } finally {
    loading.value = false
  }
}

const deleteTipo = async (tipo) => {
  if (!confirm(`Tem certeza que deseja excluir o tipo "${tipo.publicidade}"?`)) {
    return
  }

  try {
    await api.deleteTipo(tipo.id)
    await loadTipos()
  } catch (error) {
    console.error('Erro ao excluir tipo:', error)
    alert('Erro ao excluir tipo. Tente novamente.')
  }
}

onMounted(() => {
  loadTipos()
})
</script>
