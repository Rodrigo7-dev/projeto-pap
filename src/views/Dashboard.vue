<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <div class="max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Painel</h1>
        <p class="text-gray-600">Sistema de Gestão v2.0</p>
      </div>

      <!-- Estatísticas Principais -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-gray-100 rounded-lg p-3">
              <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-2xl font-bold text-gray-900">{{ stats.total_processos || 0 }}</div>
              <div class="text-sm text-gray-600">Processos</div>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-2xl font-bold text-gray-900">{{ stats.processos_validos || 0 }}</div>
              <div class="text-sm text-gray-600">Válidos</div>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-red-100 rounded-lg p-3">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-2xl font-bold text-gray-900">{{ stats.processos_invalidos || 0 }}</div>
              <div class="text-sm text-gray-600">Inválidos</div>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-blue-100 rounded-lg p-3">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
              </svg>
            </div>
            <div class="ml-4">
              <div class="text-2xl font-bold text-gray-900">{{ stats.total_ruas || 0 }}</div>
              <div class="text-sm text-gray-600">Ruas</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navegação Rápida -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <router-link to="/processos" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50 hover:border-gray-300 transition-all">
          <div class="flex flex-col items-center">
            <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <div class="font-medium text-gray-900">Processos</div>
            <div class="text-sm text-gray-500 mt-1">Gerir processos</div>
          </div>
        </router-link>
        <router-link to="/ruas" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50 hover:border-gray-300 transition-all">
          <div class="flex flex-col items-center">
            <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
            </svg>
            <div class="font-medium text-gray-900">Ruas</div>
            <div class="text-sm text-gray-500 mt-1">Gerir ruas</div>
          </div>
        </router-link>
        <router-link to="/freguesias" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50 hover:border-gray-300 transition-all">
          <div class="flex flex-col items-center">
            <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <div class="font-medium text-gray-900">Freguesias</div>
            <div class="text-sm text-gray-500 mt-1">Gerir freguesias</div>
          </div>
        </router-link>
        <router-link to="/tipos" class="bg-white p-6 rounded-lg border border-gray-200 text-center hover:bg-gray-50 hover:border-gray-300 transition-all">
          <div class="flex flex-col items-center">
            <svg class="w-8 h-8 text-gray-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
            </svg>
            <div class="font-medium text-gray-900">Tipos de Publicidades</div>
            <div class="text-sm text-gray-500 mt-1">Gerir Publicidades</div>
          </div>
        </router-link>
      </div>
    
      <!-- Processos Recentes -->
      <div class="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Processos Recentes</h2>
        </div>
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
          <div class="text-gray-600 mt-2">Carregando...</div>
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Processo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Tipo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Rua</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Validade</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="processo in processos" :key="processo.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ processo.processo }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">{{ processo.tipo_publicidade?.publicidade || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-600">{{ processo.rua?.nome || processo.rua?.rua || '-' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(processo.validade)" class="px-2 py-1 text-xs rounded-full">
                    {{ getValidadeText(processo.validade) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="processos.length === 0" class="text-center py-12 text-gray-500">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">Nenhum processo encontrado</h3>
            <p class="mt-1 text-sm text-gray-500">Comece adicionando um novo processo</p>
            <div class="mt-6">
              <router-link to="/processos/novo" class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800">
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
import { ref, onMounted } from 'vue'
import api from '../services/api'

const stats = ref({
  total_processos: 0,
  processos_validos: 0,
  processos_invalidos: 0,
  total_ruas: 0
})

const processos = ref([])
const loading = ref(false)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  loading.value = true
  try {
    const [processosData, ruasData] = await Promise.all([
      api.getProcessos(),
      api.getRuas()
    ])

    // Garantir que SEMPRE recebemos arrays
    const listaProcessos =
      Array.isArray(processosData) ? processosData :
      Array.isArray(processosData.data) ? processosData.data :
      Array.isArray(processosData.processos) ? processosData.processos :
      []

    const listaRuas =
      Array.isArray(ruasData) ? ruasData :
      Array.isArray(ruasData.data) ? ruasData.data :
      Array.isArray(ruasData.ruas) ? ruasData.ruas :
      []

    // Estatísticas
    stats.value = {
      total_processos: listaProcessos.length,
      processos_validos: listaProcessos.filter(p => p.validade === 'valido').length,
      processos_invalidos: listaProcessos.filter(p => p.validade === 'invalido').length,
      total_ruas: listaRuas.length
    }

    // Últimos 10 processos
    processos.value = listaProcessos
      .sort((a, b) => (b.id || 0) - (a.id || 0))
      .slice(0, 10)

  } catch (error) {
    console.error('Erro ao carregar dados:', error)

    stats.value = {
      total_processos: 0,
      processos_validos: 0,
      processos_invalidos: 0,
      total_ruas: 0
    }

    processos.value = []
  } finally {
    loading.value = false
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
</script>
