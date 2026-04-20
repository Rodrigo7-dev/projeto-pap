<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Painel</h1>
        <p class="text-gray-600">Sistema de Gestão v2.0</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="text-2xl font-semibold text-gray-900">{{ stats.total_processos || 0 }}</div>
          <div class="text-sm text-gray-600">Processos</div>
        </div>
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="text-2xl font-semibold text-gray-900">{{ stats.processos_validos || 0 }}</div>
          <div class="text-sm text-gray-600">Válidos</div>
        </div>
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="text-2xl font-semibold text-gray-900">{{ stats.processos_invalidos || 0 }}</div>
          <div class="text-sm text-gray-600">Inválidos</div>
        </div>
        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <div class="text-2xl font-semibold text-gray-900">{{ stats.total_ruas || 0 }}</div>
          <div class="text-sm text-gray-600">Ruas</div>
        </div>
      </div>
    
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <router-link to="/processos" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50">
          <div class="font-medium text-gray-900">Processos</div>
        </router-link>
        <router-link to="/ruas" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50">
          <div class="font-medium text-gray-900">Ruas</div>
        </router-link>
        <router-link to="/freguesias" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50">
          <div class="font-medium text-gray-900">Freguesias</div>
        </router-link>
      </div>
    
      <div class="bg-white rounded-lg border border-gray-200 p-6">
        <h2 class="text-lg font-semibold mb-4 text-gray-900">Processos Recentes</h2>
        <div v-if="loading" class="text-center py-6">
          <div class="text-gray-600">Carregando...</div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Processo</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Alvará</th>
                <th class="px-4 py-2 text-left text-xs font-medium text-gray-700">Validade</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="processo in processos" :key="processo.id" class="hover:bg-gray-50">
                <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{{ processo.numero_processo || `#${processo.id}` }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{{ processo.alvara || '-' }}</td>
                <td class="px-4 py-3 whitespace-nowrap text-sm">
                  <span :class="getStatusClass(processo.validade)" class="px-2 py-1 text-xs rounded-full">
                    {{ getValidadeText(processo.validade) }}
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

const getValidadeText = (validade) => {
  if (validade === 'valido') return 'Válido'
  if (validade === 'invalido') return 'Inválido'
  return 'Pendente'
}
</script>
