<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Gestão de Ruas</h1>
        <router-link 
          to="/ruas/nova" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
        >
          + Nova Rua
        </router-link>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
        <div class="text-gray-600">A carregar ruas...</div>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-white">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar por nome da rua ou freguesia..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome da Rua</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Coordenada</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">Freguesia</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="ruaItem in filteredRuas" :key="ruaItem.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 font-medium text-gray-900">
                  {{ ruaItem.rua }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-500 font-mono">
                  {{ ruaItem.coordenada || 'N/D' }}
                </td>
                <td class="px-6 py-4">
                  <span class="px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                    {{ ruaItem.freguesia?.freguesia || 'Sem Freguesia' }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-4">
                  <button 
                    @click="editRua(ruaItem.id)" 
                    class="text-blue-600 hover:text-blue-900 font-semibold text-sm"
                  >
                    Editar
                  </button>
                  <button 
                    @click="handleDelete(ruaItem.id, ruaItem.rua)" 
                    class="text-red-600 hover:text-red-900 font-semibold text-sm"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredRuas.length === 0" class="text-center py-12 bg-white">
          <svg class="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="text-gray-500">Nenhuma rua encontrada com o termo "{{ search }}".</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api' //

const router = useRouter()
const loading = ref(false)
const ruas = ref([])
const search = ref('')

// Carregar dados da API
const loadRuas = async () => {
  loading.value = true
  try {
    const res = await api.getRuas() //
    // O interceptor já trata o response.data
    ruas.value = res.data || res || []
  } catch (error) {
    console.error('Erro ao carregar ruas:', error)
  } finally {
    loading.value = false
  }
}

// Lógica de pesquisa melhorada para procurar dentro do objeto Freguesia
const filteredRuas = computed(() => {
  const t = search.value.toLowerCase()
  return ruas.value.filter(r => {
    const nomeRua = (r.rua || '').toLowerCase()
    const nomeFreguesia = (r.freguesia?.freguesia || '').toLowerCase()
    return nomeRua.includes(t) || nomeFreguesia.includes(t)
  })
})

const editRua = (id) => {
  router.push(`/ruas/${id}/editar`)
}

const handleDelete = async (id, nome) => {
  if (confirm(`Tem a certeza que deseja eliminar a rua "${nome}"?`)) {
    try {
      await api.deleteRua(id) //
      await loadRuas()
    } catch (error) {
      console.error('Erro ao eliminar:', error)
      alert('Não foi possível eliminar a rua. Pode estar em uso por um processo.')
    }
  }
}

onMounted(loadRuas)
</script>