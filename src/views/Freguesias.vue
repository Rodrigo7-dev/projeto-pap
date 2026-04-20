<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Freguesias</h1>
        <router-link 
          to="/freguesias/nova" 
          class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition duration-150"
        >
          Nova Freguesia
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
            placeholder="Pesquisar freguesias..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

        <!-- Table -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Nome da Freguesia
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="freguesia in filteredFreguesias" :key="freguesia.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ freguesia.nome }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link 
                    :to="`/freguesias/${freguesia.id}/editar`" 
                    class="text-gray-600 hover:text-gray-900 mr-4"
                  >
                    Editar
                  </router-link>
                  <button 
                    @click="deleteFreguesia(freguesia)" 
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
        <div v-if="filteredFreguesias.length === 0" class="text-center py-12">
          <div class="text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma freguesia encontrada</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ search ? 'Tente uma busca diferente' : 'Comece adicionando uma nova freguesia' }}
            </p>
            <div class="mt-6">
              <router-link 
                to="/freguesias/nova" 
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Nova Freguesia
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
const freguesias = ref([])
const search = ref('')

const filteredFreguesias = computed(() => {
  if (!search.value) return freguesias.value
  
  const searchTerm = search.value.toLowerCase()
  return freguesias.value.filter(freguesia => 
    freguesia.nome?.toLowerCase().includes(searchTerm)
  )
})

const loadFreguesias = async () => {
  loading.value = true
  try {
    const data = await api.getFreguesias()
    freguesias.value = data.data || data || []
  } catch (error) {
    console.error('Erro ao carregar freguesias:', error)
  } finally {
    loading.value = false
  }
}

const deleteFreguesia = async (freguesia) => {
  if (!confirm(`Tem certeza que deseja excluir a freguesia "${freguesia.nome}"?`)) {
    return
  }

  try {
    await api.deleteFreguesia(freguesia.id)
    await loadFreguesias() // Recarregar a lista
  } catch (error) {
    console.error('Erro ao excluir freguesia:', error)
    alert('Erro ao excluir freguesia. Tente novamente.')
  }
}

onMounted(() => {
  loadFreguesias()
})
</script>
