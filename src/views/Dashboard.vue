<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="text-gray-600 mt-2">Bem-vindo(a) ao sistema!</p>
    </div>

    <!-- Estatísticas -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <div class="text-2xl font-semibold text-gray-900 mb-1">{{ stats.total || 0 }}</div>
        <div class="text-sm text-gray-600">Processos</div>
      </div>
      <div class="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <div class="text-2xl font-semibold text-gray-900 mb-1">{{ stats.validos || 0 }}</div>
        <div class="text-sm text-gray-600">Válidos</div>
      </div>
      <div class="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <div class="text-2xl font-semibold text-gray-900 mb-1">{{ stats.invalidos || 0 }}</div>
        <div class="text-sm text-gray-600">Inválidos</div>
      </div>
      <div class="bg-white p-6 rounded-lg border border-gray-200 text-center">
        <div class="text-2xl font-semibold text-gray-900 mb-1">{{ stats.ruas || 0 }}</div>
        <div class="text-sm text-gray-600">Ruas</div>
      </div>
    </div>
    
    <!-- Menu -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <router-link to="/processos" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50 transition duration-150">
        <div class="font-medium text-gray-900">Processos</div>
      </router-link>
      <router-link to="/ruas" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50 transition duration-150">
        <div class="font-medium text-gray-900">Ruas</div>
      </router-link>
      <router-link to="/freguesias" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50 transition duration-150">
        <div class="font-medium text-gray-900">Freguesias</div>
      </router-link>
    </div>
    
    <!-- Processos Recentes -->
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h2 class="text-lg font-semibold mb-4 text-gray-900">Processos Recentes</h2>
      <div v-if="loading" class="text-center py-6">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400"></div>
        <p class="mt-2 text-gray-600">Carregando...</p>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Processo</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Alvará</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="processo in processos" :key="processo.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ processo.processo || processo.numero_processo || `#${processo.id}` }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ processo.alvara || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span :class="getStatusClass(processo.validade)" class="px-2 py-1 text-xs rounded-full">
                    {{ processo.validade === 'valido' ? 'Válido' : processo.validade === 'invalido' ? 'Inválido' : 'Pendente' }}
                  </span>
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
import { ref, onMounted } from 'vue'
import api from '../services/api'

const stats = ref({})
const processos = ref([])
const loading = ref(false)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    const [statsData, processosData] = await Promise.all([
      api.getStats(),
      api.getProcessos({ limit: 10 })
    ])
    stats.value = statsData
    processos.value = processosData.data || processosData || []
  } catch (error) {
    console.error('Erro ao carregar dados:', error)
  } finally {
    loading.value = false
  }
}

const getStatusClass = (validade) => {
  if (validade === 'valido') {
    return 'bg-green-100 text-green-800'
  } else if (validade === 'invalido') {
    return 'bg-red-100 text-red-800'
  }
  return 'bg-yellow-100 text-yellow-800'
}
</script>
