<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Estatísticas -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div class="bg-white p-4 rounded shadow text-center">
        <div class="text-2xl font-bold text-blue-600">{{ stats.total || 0 }}</div>
        <div class="text-sm text-gray-600">Processos</div>
      </div>
      <div class="bg-white p-4 rounded shadow text-center">
        <div class="text-2xl font-bold text-green-600">{{ stats.validos || 0 }}</div>
        <div class="text-sm text-gray-600">Válidos</div>
      </div>
      <div class="bg-white p-4 rounded shadow text-center">
        <div class="text-2xl font-bold text-red-600">{{ stats.invalidos || 0 }}</div>
        <div class="text-sm text-gray-600">Inválidos</div>
      </div>
      <div class="bg-white p-4 rounded shadow text-center">
        <div class="text-2xl font-bold text-purple-600">{{ stats.ruas || 0 }}</div>
        <div class="text-sm text-gray-600">Ruas</div>
      </div>
    </div>
    
    <!-- Menu -->
    <div class="grid grid-cols-3 gap-4 mb-8">
      <router-link to="/ruas" class="bg-blue-50 p-4 rounded text-center hover:bg-blue-100">
        <div class="font-semibold text-blue-900">Ruas</div>
      </router-link>
      <router-link to="/freguesias" class="bg-green-50 p-4 rounded text-center hover:bg-green-100">
        <div class="font-semibold text-green-900">Freguesias</div>
      </router-link>
      <router-link to="/tipopublicidade" class="bg-purple-50 p-4 rounded text-center hover:bg-purple-100">
        <div class="font-semibold text-purple-900">Tipos</div>
      </router-link>
    </div>
    
    <!-- Processos -->
    <div class="bg-white rounded shadow p-4">
      <h2 class="text-lg font-bold mb-4">Processos Recentes</h2>
      <div v-if="loading" class="text-center py-4">
        <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
      <div v-else>
        <table class="w-full">
          <thead class="bg-gray-100">
            <tr>
              <th class="px-4 py-2 text-left text-sm">Processo</th>
              <th class="px-4 py-2 text-left text-sm">Alvará</th>
              <th class="px-4 py-2 text-left text-sm">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="processo in processos" :key="processo.id" class="border-b">
              <td class="px-4 py-2 text-sm">{{ processo.processo }}</td>
              <td class="px-4 py-2 text-sm">{{ processo.alvara }}</td>
              <td class="px-4 py-2 text-sm">
                <span :class="getStatusClass(processo.validade)" class="px-2 py-1 text-xs rounded">
                  {{ processo.validade === 'valido' ? 'Válido' : 'Inválido' }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
