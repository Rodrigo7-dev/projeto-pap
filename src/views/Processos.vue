<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Processos</h1>
        <router-link 
          to="/processos/novo" 
          class="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          Novo Processo
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
            placeholder="Pesquisar processos..." 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Número do Processo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Tipo
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Rua
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Validade
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>

            <tbody class="bg-white divide-y divide-gray-200">
              <tr 
                v-for="processo in filteredProcessos" 
                :key="processo.id" 
                class="hover:bg-gray-50"
              >
                <!-- Número -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ processo.numero_processo || `#${processo.id}` }}
                  </div>
                </td>

                <!-- Tipo -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">
                    {{ processo.tipo_publicidade?.nome || '-' }}
                  </div>
                </td>

                <!-- Rua -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">
                    {{ processo.rua?.nome || processo.rua?.rua || '-' }}
                  </div>
                </td>

                <!-- Validade -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span 
                    :class="getStatusClass(processo.validade)" 
                    class="px-2 py-1 text-xs rounded-full"
                  >
                    {{ getValidadeText(processo.validade) }}
                  </span>
                </td>

                <!-- Ações -->
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <!-- AGORA USA numero_processo NA URL -->
                  <router-link 
                    :to="`/processos/${processo.numero_processo || processo.id}/editar`" 
                    class="text-gray-600 hover:text-gray-900 mr-4"
                  >
                    Editar
                  </router-link>

                  <button 
                    @click="deleteProcesso(processo)" 
                    class="text-red-600 hover:text-red-900"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Estado vazio -->
        <div v-if="filteredProcessos.length === 0" class="text-center py-12">
          <div class="text-gray-500">
            <h3 class="mt-2 text-sm font-medium text-gray-900">
              Nenhum processo encontrado
            </h3>
            <p class="mt-1 text-sm text-gray-500">
              {{ search ? 'Tente uma busca diferente' : 'Comece adicionando um novo processo' }}
            </p>

            <div class="mt-6">
              <router-link 
                v-if="!search"
                to="/processos/novo" 
                class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
              >
                Novo Processo
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
import api from '../services/api'

const loading = ref(false)
const processos = ref([])
const search = ref('')

const filteredProcessos = computed(() => {
  if (!search.value) return processos.value
  
  const searchTerm = search.value.toLowerCase()

  return processos.value.filter(processo => 
    (processo.numero_processo || '').toLowerCase().includes(searchTerm) ||
    (processo.tipo_publicidade?.nome || '').toLowerCase().includes(searchTerm) ||
    (processo.rua?.nome || processo.rua?.rua || '').toLowerCase().includes(searchTerm)
  )
})

const loadProcessos = async () => {
  loading.value = true
  try {
    const data = await api.getProcessos()
    processos.value = data.data || data || []
  } catch (error) {
    console.error('Erro ao carregar processos:', error)
  } finally {
    loading.value = false
  }
}

const deleteProcesso = async (processo) => {
  const processoName = processo.numero_processo || `#${processo.id}`

  if (!confirm(`Tem certeza que deseja excluir o processo "${processoName}"?`)) {
    return
  }

  try {
    // Mantém ID aqui (mais seguro)
    await api.deleteProcesso(processo.id)
    await loadProcessos()
  } catch (error) {
    console.error('Erro ao excluir processo:', error)
    alert('Erro ao excluir processo. Tente novamente.')
  }
}

const getStatusClass = (validade) => {
  if (validade === 'valido') return 'bg-green-100 text-green-800'
  if (validade === 'invalido') return 'bg-red-100 text-red-800'
  return 'bg-yellow-100 text-yellow-800'
}

const getValidadeText = (validade) => {
  if (validade === 'valido') return 'Válido'
  if (validade === 'invalido') return 'Inválido'
  return 'Pendente'
}

onMounted(() => {
  loadProcessos()
})
</script>