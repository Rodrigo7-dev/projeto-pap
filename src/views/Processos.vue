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
      
      <div class="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
        <div class="p-4 border-b border-gray-200 bg-white">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar por n.º processo, rua ou tipo..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead class="bg-gray-50 border-b border-gray-200">
              <tr>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Número do Processo</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Publicidade</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase">Rua</th>
                <th class="px-6 py-3 text-xs font-semibold text-gray-600 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-if="filteredProcessos.length === 0">
                <td colspan="4" class="px-6 py-8 text-center text-gray-500 italic">
                  Nenhum processo encontrado.
                </td>
              </tr>
              <tr v-for="p in filteredProcessos" :key="p.id" class="hover:bg-gray-50 transition">
                <td class="px-6 py-4 font-medium text-gray-900">{{ p.processo }}</td>
                <td class="px-6 py-4 text-sm text-gray-600">
                  {{ p.tipo_publicidade?.publicidade || p.tipo_publicidade?.tipo || '---' }}
                </td>
                <td class="px-6 py-4 text-sm text-gray-600">{{ p.rua?.rua || '---' }}</td>
                <td class="px-6 py-4 text-right space-x-3">
                  <button @click="editProcesso(p.id)" class="text-blue-600 hover:text-blue-800 font-medium">
                    Editar
                  </button>
                  <button @click="handleDelete(p.id, p.processo)" class="text-red-600 hover:text-red-800 font-medium">
                    Eliminar
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
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
const processos = ref([])
const search = ref('')

const loadProcessos = async () => {
  try {
    const res = await api.getProcessos()
    // Como o teu api.js já faz interceptor para response.data:
    processos.value = res || []
  } catch (error) {
    console.error('Erro ao carregar processos:', error)
  }
}

const filteredProcessos = computed(() => {
  const t = search.value.toLowerCase().trim()
  if (!t) return processos.value

  return processos.value.filter(p => 
    (p.processo || '').toLowerCase().includes(t) ||
    (p.tipo_publicidade?.publicidade || '').toLowerCase().includes(t) ||
    (p.tipo_publicidade?.tipo || '').toLowerCase().includes(t) ||
    (p.rua?.rua || '').toLowerCase().includes(t)
  )
})

const editProcesso = (id) => {
  // Rota padrão para edição
  router.push(`/processos/${id}`) 
}

const handleDelete = async (id, num) => {
  if (!id) return

  if (confirm(`Eliminar definitivamente o processo ${num || ''}?`)) {
    try {
      await api.deleteProcesso(id)
      
      // Atualização otimista: remove da lista sem precisar de novo GET
      processos.value = processos.value.filter(p => p.id !== id)
      
      alert('Processo eliminado com sucesso.')
    } catch (error) {
      console.error('Erro ao eliminar:', error)
      const msg = error.response?.data?.message || 'Erro ao eliminar o recurso.'
      alert(`Não foi possível eliminar: ${msg}`)
    }
  }
}

onMounted(loadProcessos)
</script>