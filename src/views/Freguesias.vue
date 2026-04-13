<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800">Freguesias</h1>
        <button
          v-if="isAdmin"
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Adicionar Freguesia
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
              placeholder="Pesquisar freguesias..." 
              class="flex-1 px-4 py-2 border border-slate-300 rounded-lg"
            />
            <div class="text-sm text-slate-600">
              Total: <span class="font-bold text-slate-800">{{ totalFreguesias }}</span>
            </div>
          </div>
        </div>

        <!-- Freguesias Grid -->
        <div class="bg-white rounded-lg shadow p-6">
          <div v-if="filteredFreguesias.length === 0" class="text-center py-8 text-slate-500">
            Nenhuma freguesia encontrada
          </div>
          
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-for="freguesia in filteredFreguesias" :key="freguesia.id" 
              class="border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex justify-between items-start">
                <div class="flex-1">
                  <h3 class="font-medium text-slate-800 text-lg mb-2">{{ freguesia.freguesia }}</h3>
                  <div class="text-sm text-slate-500">
                    <p>ID: {{ freguesia.id }}</p>
                    <p>Ruas associadas: {{ getRuasCount(freguesia.id) }}</p>
                  </div>
                </div>
                <div class="flex items-center space-x-2">
                  <button
                    v-if="isAdmin"
                    @click="deleteFreguesia(freguesia.id)"
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
          <h2 class="text-xl font-bold mb-4">Adicionar Nova Freguesia</h2>
          <form @submit.prevent="addFreguesia">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Nome da Freguesia</label>
                <input
                  v-model="newFreguesia.freguesia"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Ex: Nova Freguesia"
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
      freguesias: [],
      ruas: [],
      search: '',
      showAddModal: false,
      newFreguesia: {
        freguesia: ''
      }
    }
  },

  computed: {
    isAdmin() {
      return this.auth.user?.is_admin === true
    },

    filteredFreguesias() {
      if (!this.search) return this.freguesias
      return this.freguesias.filter(freguesia => 
        freguesia.freguesia.toLowerCase().includes(this.search.toLowerCase())
      )
    },

    totalFreguesias() {
      return this.freguesias.length
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

        // Carregar freguesias e ruas em paralelo
        const [freguesiasResponse, ruasResponse] = await Promise.allSettled([
          fetch('http://127.0.0.1:8000/api/freguesias', { headers, signal: controller.signal }),
          fetch('http://127.0.0.1:8000/api/ruas', { headers, signal: controller.signal })
        ])
        
        clearTimeout(timeoutId)

        // Processar freguesias
        if (freguesiasResponse.status === 'fulfilled' && freguesiasResponse.value.ok) {
          const data = await freguesiasResponse.value.json()
          this.freguesias = data.data || data || []
        }

        // Processar ruas
        if (ruasResponse.status === 'fulfilled' && ruasResponse.value.ok) {
          const data = await ruasResponse.value.json()
          this.ruas = data.data || data || []
        }

      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        this.loading = false
      }
    },

    getRuasCount(freguesiaId) {
      return this.ruas.filter(rua => rua.freguesias_id === freguesiaId).length
    },

    async addFreguesia() {
      const token = this.auth.token || localStorage.getItem('auth_token')
      
      try {
        const response = await fetch('http://127.0.0.1:8000/api/freguesias', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.newFreguesia)
        })

        if (response.ok) {
          this.showAddModal = false
          this.newFreguesia = { freguesia: '' }
          this.carregarDados()
        }
      } catch (error) {
        console.error('Erro ao adicionar freguesia:', error)
      }
    },

    async deleteFreguesia(freguesiaId) {
      const ruasCount = this.getRuasCount(freguesiaId)
      if (ruasCount > 0) {
        alert(`Não é possível apagar esta freguesia. Existem ${ruasCount} ruas associadas.`)
        return
      }
      
      if (!confirm('Tem certeza que deseja apagar esta freguesia?')) return
      
      const token = this.auth.token || localStorage.getItem('auth_token')
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/freguesias/${freguesiaId}`, {
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
        console.error('Erro ao apagar freguesia:', error)
      }
    }
  }
}
</script>
