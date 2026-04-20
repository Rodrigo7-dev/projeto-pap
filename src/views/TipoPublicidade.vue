<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">Tipos de Publicidade</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-slate-600 mt-2">Carregando...</p>
      </div>

      <div v-else>
        <!-- Search -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <input 
            v-model="search" 
            type="text" 
            placeholder="Pesquisar tipos de publicidade..." 
            class="w-full px-4 py-2 border border-slate-300 rounded-lg"
          />
        </div>

        <!-- Tipos Grid -->
        <div class="bg-white rounded-lg shadow p-6">
          <div v-if="filteredTipos.length === 0" class="text-center py-8 text-slate-500">
            Nenhum tipo encontrado
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="tipo in filteredTipos" :key="tipo.id" 
              class="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-slate-800">{{ tipo.publicidade }}</h3>
                  <p class="text-sm text-slate-500 mt-1">ID: {{ tipo.id }}</p>
                </div>
                <div class="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  #{{ tipo.id }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stats -->
        <div class="mt-6 bg-white rounded-lg shadow p-4">
          <div class="text-center text-slate-600">
            Total de tipos: <span class="font-bold text-slate-800">{{ tipos.length }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api'

export default {
  data() {
    return {
      loading: true,
      tipos: [],
      search: ''
    }
  },

  computed: {
    filteredTipos() {
      if (!this.search) return this.tipos
      return this.tipos.filter(tipo => 
        tipo.publicidade.toLowerCase().includes(this.search.toLowerCase())
      )
    }
  },

  mounted() {
    this.carregarTipos()
  },

  methods: {
    async carregarTipos() {
      this.loading = true
      try {
        const response = await api.get('/tipoPublicidade')
        this.tipos = response.data.data || response.data || []
      } catch (error) {
        console.error('Erro ao carregar tipos:', error)
        this.tipos = []
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
