<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Estatísticas -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg text-center border border-blue-200 transform transition duration-200 hover:scale-105">
        <div class="text-3xl font-bold text-blue-700 mb-2">{{ stats.total || 0 }}</div>
        <div class="text-sm text-blue-600 font-medium">Processos</div>
      </div>
      <div class="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg text-center border border-green-200 transform transition duration-200 hover:scale-105">
        <div class="text-3xl font-bold text-green-700 mb-2">{{ stats.validos || 0 }}</div>
        <div class="text-sm text-green-600 font-medium">Válidos</div>
      </div>
      <div class="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg text-center border border-red-200 transform transition duration-200 hover:scale-105">
        <div class="text-3xl font-bold text-red-700 mb-2">{{ stats.invalidos || 0 }}</div>
        <div class="text-sm text-red-600 font-medium">Inválidos</div>
      </div>
      <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl shadow-lg text-center border border-purple-200 transform transition duration-200 hover:scale-105">
        <div class="text-3xl font-bold text-purple-700 mb-2">{{ stats.ruas || 0 }}</div>
        <div class="text-sm text-purple-600 font-medium">Ruas</div>
      </div>
    </div>
    
    <!-- Menu -->
    <div class="grid grid-cols-3 gap-6 mb-8">
      <router-link to="/ruas" class="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-center hover:from-blue-600 hover:to-blue-700 transform transition duration-200 hover:scale-105 shadow-lg">
        <div class="font-semibold text-white text-lg">📍 Ruas</div>
      </router-link>
      <router-link to="/freguesias" class="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-center hover:from-green-600 hover:to-green-700 transform transition duration-200 hover:scale-105 shadow-lg">
        <div class="font-semibold text-white text-lg">🏛️ Freguesias</div>
      </router-link>
      <router-link to="/tipopublicidade" class="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-center hover:from-purple-600 hover:to-purple-700 transform transition duration-200 hover:scale-105 shadow-lg">
        <div class="font-semibold text-white text-lg">📢 Tipos</div>
      </router-link>
    </div>
    
    <!-- Processos -->
    <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <h2 class="text-xl font-bold mb-6 text-gray-800">📋 Processos Recentes</h2>
      <div v-if="loading" class="text-center py-8">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-2 text-gray-600">Carregando processos...</p>
      </div>
      <div v-else>
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Processo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Alvará</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="processo in processos" :key="processo.id" class="hover:bg-gray-50 transition duration-150">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ processo.processo }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{ processo.alvara }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  <span :class="getStatusClass(processo.validade)" class="px-3 py-1 text-xs rounded-full font-medium">
                    {{ processo.validade === 'valido' ? 'Válido' : 'Inválido' }}
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
    processos.value = processosData.data || []
  } catch (error) {
    console.error('Erro:', error)
  } finally {
    loading.value = false
  }
}

const getStatusClass = (validade) => {
  return validade === 'valido' 
    ? 'bg-green-100 text-green-800' 
    : 'bg-red-100 text-red-800'
}
</script>
