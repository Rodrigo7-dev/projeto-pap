<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800">Tipos de Publicidade</h1>
        <button
          v-if="isAdmin"
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Adicionar Tipo
        </button>
      </div>
      
      <div v-if="loading" class="text-center py-12">
        <p class="text-slate-600">Carregando...</p>
      </div>

      <div v-else>
        <!-- Search e Stats -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <input 
              v-model="search" 
              type="text" 
              placeholder="Pesquisar tipos de publicidade..." 
              class="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
            />
            <div class="text-sm text-slate-600">
              Total: <span class="font-bold text-slate-800">{{ totalTipos }}</span>
            </div>
          </div>
        </div>

        <!-- Tipos Grid -->
        <div class="bg-white rounded-lg shadow p-6">
          <div v-if="filteredTipos.length === 0" class="text-center py-8 text-slate-500">
            Nenhum tipo de publicidade encontrado
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="tipo in filteredTipos" :key="tipo.id" 
              class="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-medium text-slate-800 text-lg mb-2">{{ tipo.publicidade }}</h3>
                  <div class="text-sm text-slate-500">
                    <p>ID: {{ tipo.id }}</p>
                    <p>Processos: {{ getProcessosCount(tipo.id) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    v-if="isAdmin"
                    @click="deleteTipo(tipo.id)"
                    class="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Apagar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Add Modal -->
      <div v-if="showAddModal && isAdmin" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 w-full max-w-md">
          <h2 class="text-xl font-bold mb-4">Adicionar Novo Tipo</h2>
          <form @submit.prevent="addTipo">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Tipo de Publicidade</label>
                <input
                  v-model="newTipo.publicidade"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Ex: Publicidade Digital"
                />
              </div>
            </div>
            <div class="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                @click="showAddModal = false"
                class="px-4 py-2 border border-slate-300 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Adicionar
              </button>
            </div>
          </form>
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
      loading: true,
      tipos: [],
      processos: [],
      search: '',
      showAddModal: false,
      newTipo: {
        publicidade: ''
      }
    }
  },

  computed: {
    isAdmin() {
      return this.auth.user?.is_admin === true
    },

    filteredTipos() {
      if (!this.search) return this.tipos
      return this.tipos.filter(tipo => 
        tipo.publicidade.toLowerCase().includes(this.search.toLowerCase())
      )
    },

    totalTipos() {
      return this.tipos.length
    }
  },

  mounted() {
    this.carregarDados()
  },

  methods: {
    async carregarDados() {
      this.loading = true
      
      const token = this.auth.token || localStorage.getItem('auth_token')
      
      if (!token) {
        console.error('Token não encontrado')
        this.loading = false
        return
      }

      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 5000)
        
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }

        // Carregar tipos e processos em paralelo
        const [tiposResponse, processosResponse] = await Promise.allSettled([
          fetch('http://127.0.0.1:8000/api/tipopublicidade', { headers, signal: controller.signal }),
          fetch('http://127.0.0.1:8000/api/processos?limit=1000', { headers, signal: controller.signal })
        ])
        
        clearTimeout(timeoutId)

        // Processar tipos
        if (tiposResponse.status === 'fulfilled' && tiposResponse.value.ok) {
          const data = await tiposResponse.value.json()
          this.tipos = data.data || data || []
        }

        // Processar processos
        if (processosResponse.status === 'fulfilled' && processosResponse.value.ok) {
          const data = await processosResponse.value.json()
          this.processos = data.data || data || []
        }

      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        this.loading = false
      }
    },

    getProcessosCount(tipoId) {
      return this.processos.filter(processo => processo.tipo_publicidade_id === tipoId).length
    },

    async addTipo() {
      const token = this.auth.token || localStorage.getItem('auth_token')
      
      try {
        const response = await fetch('http://127.0.0.1:8000/api/tipopublicidade', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.newTipo)
        })

        if (response.ok) {
          this.showAddModal = false
          this.newTipo = { publicidade: '' }
          this.carregarDados()
        }
      } catch (error) {
        console.error('Erro ao adicionar tipo:', error)
      }
    },

    async deleteTipo(tipoId) {
      const processosCount = this.getProcessosCount(tipoId)
      if (processosCount > 0) {
        alert(`Não é possível apagar este tipo. Existem ${processosCount} processos associados.`)
        return
      }
      
      if (!confirm('Tem certeza que deseja apagar este tipo de publicidade?')) return
      
      const token = this.auth.token || localStorage.getItem('auth_token')
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/tipopublicidade/${tipoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        })

        if (response.ok) {
          this.carregarDados()
        }
      } catch (error) {
        console.error('Erro ao apagar tipo:', error)
      }
    }
  }
}
</script>
