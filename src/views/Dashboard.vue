<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">Painel</h1>
      
      <!-- Stats Imediatos -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-blue-600">{{ stats.totalProcessos }}</div>
          <div class="text-sm text-slate-600">Total Processos</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-green-600">{{ stats.processosValidos }}</div>
          <div class="text-sm text-slate-600">Válidos</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-red-600">{{ stats.processosInvalidos }}</div>
          <div class="text-sm text-slate-600">Inválidos</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <div class="text-2xl font-bold text-purple-600">{{ stats.totalRuas }}</div>
          <div class="text-sm text-slate-600">Ruas</div>
        </div>
      </div>

      <!-- Processos Recentes -->
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Processos Recentes</h2>
        
        <div class="space-y-2">
          <div v-for="processo in ultimosProcessos" :key="processo.id" 
            class="flex items-center justify-between p-3 bg-slate-50 rounded">
            <div class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-sm">
                {{ processo.id }}
              </div>
              <div>
                <div class="font-medium text-slate-800">{{ processo.processo }}</div>
                <div class="text-sm text-slate-500">{{ processo.alvara }}</div>
              </div>
            </div>
            <span :class="processo.validade === 'valido' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'" 
              class="px-2 py-1 rounded text-xs font-medium">
              {{ processo.validade.toUpperCase() }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'

export default {
  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  data() {
    return {
      stats: {
        totalProcessos: 30,
        processosValidos: 15,
        processosInvalidos: 15,
        totalRuas: 8
      },
      ultimosProcessos: [
        { id: 1, processo: 'PROC/0001/2024', alvara: 'ALV/0001/2024', validade: 'valido' },
        { id: 2, processo: 'PROC/0002/2024', alvara: 'ALV/0002/2024', validade: 'invalido' },
        { id: 3, processo: 'PROC/0003/2024', alvara: 'ALV/0003/2024', validade: 'valido' },
        { id: 4, processo: 'PROC/0004/2024', alvara: 'ALV/0004/2024', validade: 'valido' },
        { id: 5, processo: 'PROC/0005/2024', alvara: 'ALV/0005/2024', validade: 'invalido' }
      ]
    }
  }
}
</script>
