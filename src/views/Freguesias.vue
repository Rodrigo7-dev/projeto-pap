<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Freguesias</h1>
        <router-link 
          to="/freguesias/nova" 
          class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
        >
          + Nova Freguesia
        </router-link>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mb-2"></div>
        <p class="text-gray-600">A carregar freguesias...</p>
      </div>

      <div v-else class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-white">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar por nome da freguesia..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Nome da Freguesia
                </th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white">
              <tr v-for="f in filteredFreguesias" :key="f.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ f.freguesia }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                  <button 
                    @click="editFreguesia(f.id)" 
                    class="text-blue-600 hover:text-blue-800"
                  >
                    Editar
                  </button>
                  <button 
                    @click="handleDelete(f.id, f.freguesia)" 
                    class="text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="filteredFreguesias.length === 0" class="text-center py-12 bg-white">
          <p class="text-gray-500">Nenhuma freguesia encontrada.</p>
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

const loadFreguesias = async () => {
  loading.value = true
  try {
    const res = await api.getFreguesias()
    // O teu interceptor no api.js já retorna response.data
    freguesias.value = res.data || res || []
  } catch (error) {
    console.error('Erro ao carregar freguesias:', error)
  } finally {
    loading.value = false
  }
}

const filteredFreguesias = computed(() => {
  const t = search.value.toLowerCase()
  return freguesias.value.filter(f => 
    (f.freguesia || '').toLowerCase().includes(t)
  )
})

const editFreguesia = (id) => {
  router.push(`/freguesias/${id}/editar`)
}

const handleDelete = async (id, nome) => {
  if (confirm(`Deseja eliminar a freguesia "${nome}"?`)) {
    try {
      await api.deleteFreguesia(id)
      await loadFreguesias()
    } catch (error) {
      alert('Erro ao eliminar freguesia. Verifique se existem ruas associadas.')
    }
  }
}

onMounted(loadFreguesias)
</script>