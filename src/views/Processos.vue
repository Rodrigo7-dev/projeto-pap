<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Gestão de Processos</h1>
        <router-link 
          to="/processos/novo" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm"
        >
          + Novo Processo
        </router-link>
      </div>
      
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <span class="ml-3 text-gray-600">A carregar processos...</span>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-white">
          <div class="relative">
            <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              🔍
            </span>
            <input 
              v-model="search" 
              type="text" 
              placeholder="Pesquisar por n.º processo, rua ou tipo..." 
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Processo</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Publicidade</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Localização (Rua)</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Validade</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="processo in filteredProcessos" :key="processo.id" class="hover:bg-blue-50/30 transition">
                <td class="px-6 py-4">
                  <div class="text-sm font-bold text-gray-900">{{ processo.processo }}</div>
                  <div class="text-xs text-gray-500">ID: #{{ processo.id }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-700">{{ processo.tipo_publicidade?.publicidade || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-700">{{ processo.rua?.rua || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4">
                  <span :class="getStatusClass(processo.validade)" class="px-2.5 py-1 text-xs font-medium rounded-full">
                    {{ formatDate(processo.validade) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right space-x-3">
                  <button 
                    @click="editProcesso(processo.id)" 
                    class="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Editar
                  </button>
                  <button 
                    @click="handleDelete(processo)" 
                    class="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredProcessos.length === 0" class="text-center py-16">
          <p class="text-gray-500">Nenhum processo encontrado para a sua pesquisa.</p>
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
const processos = ref([])
const search = ref('')

// 1. Carregar Dados
const loadProcessos = async () => {
  loading.value = true
  try {
    const response = await api.getProcessos()
    // Ajuste para lidar com diferentes formatos de resposta da API
    processos.value = response.data || response || []
  } catch (error) {
    console.error('Erro ao carregar processos:', error)
  } finally {
    loading.value = false
  }
}

// 2. Filtragem Inteligente
const filteredProcessos = computed(() => {
  const term = search.value.toLowerCase()
  return processos.value.filter(p => 
    p.processo?.toLowerCase().includes(term) ||
    p.tipo_publicidade?.publicidade?.toLowerCase().includes(term) ||
    p.rua?.rua?.toLowerCase().includes(term)
  )
})

// 3. Formatação e Estilo de Validade
const formatDate = (dateString) => {
  if (!dateString) return 'Sem data'
  return new Date(dateString).toLocaleDateString('pt-PT')
}

const getStatusClass = (validade) => {
  if (!validade) return 'bg-gray-100 text-gray-800'
  
  const hoje = new Date()
  const dataValidade = new Date(validade)

  if (dataValidade < hoje) {
    return 'bg-red-100 text-red-700' // Expirado
  } else if (dataValidade <= new Date(hoje.getTime() + 30 * 24 * 60 * 60 * 1000)) {
    return 'bg-yellow-100 text-yellow-700' // Expira em 30 dias
  }
  return 'bg-green-100 text-green-700' // Válido
}

// 4. Ações
const editProcesso = (id) => {
  router.push(`/processos/${id}/editar`)
}

const handleDelete = async (processo) => {
  if (confirm(`Tem a certeza que deseja eliminar o processo ${processo.processo}?`)) {
    try {
      await api.deleteProcesso(processo.id)
      await loadProcessos() // Recarrega a lista
    } catch (error) {
      alert('Erro ao eliminar processo.')
    }
  }
}

onMounted(loadProcessos)
</script>