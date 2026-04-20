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
              Total: <span class="font-bold text-slate-800">{{ filteredRuas.length }}</span>
            </div>
          </div>
        </div>

        <!-- Lista -->
        <div class="bg-white rounded-lg shadow">
          <div v-if="paginatedRuas.length === 0" class="text-center py-8 text-slate-500">
            Nenhuma rua encontrada
          </div>
          
          <div v-else class="divide-y divide-slate-200">
            <div v-for="rua in paginatedRuas" :key="rua.id" 
              class="p-4 hover:bg-slate-50 transition-colors">
              
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="font-medium text-slate-800">{{ rua.rua }}</h3>
                  <p class="text-sm text-slate-500">
                    Freguesia: {{ rua.freguesia }}
                  </p>
                  <p class="text-xs text-slate-400">
                    Coordenada: {{ rua.coordenada }}
                  </p>
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
              class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
            >
              Anterior
            </button>
            
            <span class="text-sm text-slate-600">
              Página {{ currentPage }} de {{ totalPages }}
            </span>
            
            <button 
              @click="nextPage" 
              :disabled="currentPage === totalPages"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300"
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
      perPage: 10
    }
  },

  computed: {
    // 🔍 FILTRO PRIMEIRO
    filteredRuas() {
      if (!this.search) return this.ruas

      return this.ruas.filter(rua =>
        rua.rua.toLowerCase().includes(this.search.toLowerCase())
      )
    },

    // 📄 PAGINAÇÃO DEPOIS
    paginatedRuas() {
      const start = (this.currentPage - 1) * this.perPage
      return this.filteredRuas.slice(start, start + this.perPage)
    },

    totalPages() {
      return Math.ceil(this.filteredRuas.length / this.perPage)
    }
  },

  mounted() {
  const token = localStorage.getItem('auth_token')

  if (!token) {
    this.$router.push('/login')
    return
  }

  this.carregarRuas()
},

methods: {
  async carregarRuas() {
    this.loading = true

    try {
      const response = await api.get('/ruas')

      console.log('API:', response.data)

      // 🧠 robusto contra qualquer formato
      if (Array.isArray(response.data)) {
        this.ruas = response.data
      } else if (Array.isArray(response.data.data)) {
        this.ruas = response.data.data
      } else if (Array.isArray(response.data.data?.data)) {
        this.ruas = response.data.data.data
      } else {
        console.error('Formato inválido:', response.data)
        this.ruas = []
      }

    } catch (error) {
      console.error('Erro:', error)
      this.ruas = []
    } finally {
      this.loading = false
    }
  }
}
}
</script>