<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold text-slate-800">Ruas</h1>
        <button
          v-if="isAdmin"
          @click="showAddModal = true"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Adicionar Rua
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
              class="p-4 hover:bg-slate-50">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <h3 class="font-medium text-slate-800 text-lg">{{ rua.rua }}</h3>
                  <p class="text-sm text-slate-500">Freguesia: {{ getFreguesiaName(rua.freguesias_id) }}</p>
                  <p class="text-sm text-slate-400">Coordenadas: {{ rua.coordenada }}</p>
                </div>
                <div class="flex items-center space-x-2">
                  <div class="text-sm text-slate-400">
                    #{{ rua.id }}
                  </div>
                  <button
                    v-if="isAdmin"
                    @click="deleteRua(rua.id)"
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
          <h2 class="text-xl font-bold mb-4">Adicionar Nova Rua</h2>
          <form @submit.prevent="addRua">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Nome da Rua</label>
                <input
                  v-model="newRua.rua"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Ex: Rua Nova"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Freguesia</label>
                <select
                  v-model="newRua.freguesias_id"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg"
                >
                  <option value="">Selecione uma freguesia</option>
                  <option v-for="freguesia in freguesias" :key="freguesia.id" :value="freguesia.id">
                    {{ freguesia.freguesia }}
                  </option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Coordenadas</label>
                <input
                  v-model="newRua.coordenada"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  placeholder="Ex: 41.8442,-8.8359"
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
      ruas: [],
      freguesias: [],
      search: '',
      showAddModal: false,
      newRua: {
        rua: '',
        freguesias_id: '',
        coordenada: ''
      }
    }
  },

  computed: {
    isAdmin() {
      return this.auth.user?.is_admin === true
    },

    filteredRuas() {
      if (!this.search) return this.ruas
      return this.ruas.filter(rua => 
        rua.rua.toLowerCase().includes(this.search.toLowerCase())
      )
    },

    totalRuas() {
      return this.ruas.length
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

        // Carregar ruas e freguesias em paralelo
        const [ruasResponse, freguesiasResponse] = await Promise.allSettled([
          fetch('http://127.0.0.1:8000/api/ruas', { headers, signal: controller.signal }),
          fetch('http://127.0.0.1:8000/api/freguesias', { headers, signal: controller.signal })
        ])
        
        clearTimeout(timeoutId)

        // Processar ruas
        if (ruasResponse.status === 'fulfilled' && ruasResponse.value.ok) {
          const data = await ruasResponse.value.json()
          this.ruas = data.data || data || []
        }

        // Processar freguesias
        if (freguesiasResponse.status === 'fulfilled' && freguesiasResponse.value.ok) {
          const data = await freguesiasResponse.value.json()
          this.freguesias = data.data || data || []
        }

      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        this.loading = false
      }
    },

    getFreguesiaName(freguesiaId) {
      const freguesia = this.freguesias.find(f => f.id === freguesiaId)
      return freguesia ? freguesia.freguesia : 'Não encontrada'
    },

    async addRua() {
      const token = this.auth.token || localStorage.getItem('auth_token')
      
      try {
        const response = await fetch('http://127.0.0.1:8000/api/ruas', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(this.newRua)
        })

        if (response.ok) {
          this.showAddModal = false
          this.newRua = { rua: '', freguesias_id: '', coordenada: '' }
          this.carregarDados()
        }
      } catch (error) {
        console.error('Erro ao adicionar rua:', error)
      }
    },

    async deleteRua(ruaId) {
      if (!confirm('Tem certeza que deseja apagar esta rua?')) return
      
      const token = this.auth.token || localStorage.getItem('auth_token')
      
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/ruas/${ruaId}`, {
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
        console.error('Erro ao apagar rua:', error)
      }
    }
  }
}
</script>
