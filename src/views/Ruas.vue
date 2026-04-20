<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Ruas</h1>
        <router-link 
          to="/ruas/nova" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-150"
        >
          Nova Rua
        </router-link>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-gray-600 mt-2">Carregando...</p>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200">
        <!-- Search -->
        <div class="p-4 border-b border-gray-200">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar ruas..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nome da Rua
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Freguesia
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="rua in filteredRuas" :key="rua.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ rua.nome || rua.rua }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">{{ rua.freguesia?.nome || rua.freguesia || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link 
                    :to="`/ruas/${rua.id}/editar`" 
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Editar
                  </router-link>
                  <button 
                    @click="deleteRua(rua)" 
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
        <div v-if="filteredRuas.length === 0" class="text-center py-12">
          <div class="text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma rua encontrada</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ search ? 'Tente uma busca diferente' : 'Comece adicionando uma nova rua' }}
            </p>
            <div class="mt-6">
              <router-link 
                to="/ruas/nova" 
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Nova Rua
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
const ruas = ref([])
const search = ref('')

const filteredRuas = computed(() => {
  if (!search.value) return ruas.value
  
  const searchTerm = search.value.toLowerCase()
  return ruas.value.filter(rua => 
    (rua.nome || rua.rua || '').toLowerCase().includes(searchTerm) ||
    (rua.freguesia?.nome || rua.freguesia || '').toLowerCase().includes(searchTerm)
  )
})

const loadRuas = async () => {
  loading.value = true
  try {
    const data = await api.getRuas()
    ruas.value = data.data || data || []
  } catch (error) {
    console.error('Erro ao carregar ruas:', error)
  } finally {
    loading.value = false
  }
}

const deleteRua = async (rua) => {
  if (!confirm(`Tem certeza que deseja excluir a rua "${rua.nome || rua.rua}"?`)) {
    return
  }

  try {
    await api.deleteRua(rua.id)
    await loadRuas() // Recarregar a lista
  } catch (error) {
    console.error('Erro ao excluir rua:', error)
    alert('Erro ao excluir rua. Tente novamente.')
  }
}

onMounted(() => {
  loadRuas()
})
</script>
