<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">Ruas</h1>
      
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="text-slate-600 mt-2">Carregando...</p>
      </div>

      <div v-else>
        <!-- Search e Stats -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <input 
              v-model="search" 
              type="text" 
              placeholder="Pesquisar ruas..." 
              class="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
            />
            <div class="text-sm text-slate-600">
              Total: <span class="font-bold text-slate-800">{{ totalRuas }}</span>
            </div>
          </div>
        </div>

        <!-- Ruas List -->
        <div class="bg-white rounded-lg shadow">
          <div v-if="filteredRuas.length === 0" class="text-center py-8 text-slate-500">
            Nenhuma rua encontrada
          </div>
          
          <div v-else class="divide-y divide-slate-200">
            <div v-for="rua in filteredRuas" :key="rua.id" 
              class="p-4 hover:bg-slate-50 transition-colors">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-slate-800">{{ rua.rua }}</h3>
                  <p class="text-sm text-slate-500">Freguesia ID: {{ rua.freguesias_id }}</p>
                </div>
                <div class="text-sm text-slate-400">
                  #{{ rua.id }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Paginação -->
        <div v-if="totalPages > 1" class="bg-white rounded-lg shadow p-4 mt-6">
          <div class="flex items-center justify-between">
            <button 
              @click="previousPage" 
              :disabled="currentPage === 1"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            
            <span class="text-sm text-slate-600">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
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
      ruas: [],
      search: '',
      currentPage: 1,
      perPage: 10,
      totalRuas: 0
    }
  },

  computed: {
    filteredRuas() {
      if (!this.search) return this.paginatedRuas
      return this.paginatedRuas.filter(rua => 
        rua.rua.toLowerCase().includes(this.search.toLowerCase())
      )
    },

    paginatedRuas() {
      const start = (this.currentPage - 1) * this.perPage
      const end = start + this.perPage
      return this.ruas.slice(start, end)
    },

    totalPages() {
      return Math.ceil(this.totalRuas / this.perPage)
    }
  },

  mounted() {
    this.carregarRuas()
  },

  methods: {
    async carregarRuas() {
      this.loading = true
      try {
        const response = await api.get('/ruas')
        this.ruas = response.data.data || response.data || []
        this.totalRuas = this.ruas.length
        
        if (window.$notifications) {
          window.$notifications.add('info', 'Ruas Carregadas', `${this.totalRuas} ruas encontradas`)
        }
      } catch (error) {
        console.error('Erro ao carregar ruas:', error)
        this.ruas = []
        if (window.$notifications) {
          window.$notifications.add('error', 'Erro', 'Não foi possível carregar as ruas')
        }
      } finally {
        this.loading = false
      }
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--
      }
    },

    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
      }
    }
  }
}
</script>
