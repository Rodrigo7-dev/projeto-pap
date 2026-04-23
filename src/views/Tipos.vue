<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Tipos de Publicidade</h1>
        <router-link 
          to="/tipos/novo" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
        >
          + Novo Tipo
        </router-link>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent mb-2"></div>
        <p class="text-gray-600">A carregar tipos...</p>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-white">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar por nome de publicidade..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Publicidade
                </th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Processos / Observações
                </th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="tipo in filteredTipos" :key="tipo.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-bold text-gray-900">{{ tipo.publicidade }}</div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm text-gray-600">
                    {{ tipo.processos || 'Sem observações' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button 
                    @click="editTipo(tipo.id)" 
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button 
                    @click="deleteTipo(tipo)" 
                    class="text-red-600 hover:text-red-800"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredTipos.length === 0" class="text-center py-12 bg-white">
          <p class="text-gray-500">Nenhum tipo de publicidade encontrado.</p>
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

const loadTipos = async () => {
  loading.value = true
  try {
    const res = await api.getTipos()
    // Aceita o formato direto ou dentro de .data
    tipos.value = res.data || res || []
  } catch (error) {
    console.error('Erro ao carregar tipos:', error)
  } finally {
    loading.value = false
  }
}

const filteredTipos = computed(() => {
  const t = search.value.toLowerCase()
  return tipos.value.filter(tipo => 
    (tipo.publicidade || '').toLowerCase().includes(t) ||
    (tipo.processos || '').toLowerCase().includes(t)
  )
})

const editTipo = (id) => {
  router.push(`/tipos/${id}/editar`)
}

const deleteTipo = async (tipo) => {
  if (!confirm(`Tem certeza que deseja excluir "${tipo.publicidade}"?`)) return

  try {
    await api.deleteTipo(tipo.id)
    await loadTipos()
  } catch (error) {
    alert('Erro ao excluir tipo. Pode haver processos que dependem deste tipo.')
  }
}

onMounted(loadTipos)
</script>