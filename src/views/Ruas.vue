<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Ruas</h1>
        <router-link 
          to="/ruas/nova" 
          class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Nova Rua
        </router-link>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="text-gray-600">Carregando...</div>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar ruas..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

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
                  <div class="text-sm font-medium text-gray-900">{{ rua.nome || rua.rua || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">{{ rua.freguesia?.nome || rua.freguesia || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <router-link 
                    :to="`/ruas/${rua.id}/editar`" 
                    class="text-gray-600 hover:text-gray-900 mr-4"
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

        <div v-if="filteredRuas.length === 0" class="text-center py-12">
          <div class="text-gray-500">
            <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhuma rua encontrada</h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ search ? 'Tente uma busca diferente' : 'Comece adicionando uma nova rua' }}
            </p>
            <div class="mt-6">
              <router-link 
                v-if="!search"
                to="/ruas/nova" 
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
              >
                Nova Rua - 111
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
  const ruaName = rua.nome || rua.rua || `#${rua.id}`
  if (!confirm(`Tem certeza que deseja excluir a rua "${ruaName}"?`)) {
    return
  }

  try {
    await api.deleteRua(rua.id)
    await loadRuas()
  } catch (error) {
    console.error('Erro ao excluir rua:', error)
    alert('Erro ao excluir rua. Tente novamente.')
  }
}

onMounted(() => {
  loadRuas()
})
</script>