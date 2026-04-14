<template>
  <div class="max-w-7xl mx-auto px-4 py-8">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-800">Tipos de Publicidade</h1>
      <button
        @click="showAddModal = true"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
      >
        Novo Tipo
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white p-4 rounded-lg shadow mb-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
          <input
            v-model="filters.search"
            type="text"
            placeholder="Tipo de publicidade..."
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            @input="loadTipos"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Total</label>
          <div class="flex items-center h-10">
            <span class="text-sm text-gray-600">
              Total: <span class="font-bold text-gray-800">{{ tipos.length }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div v-if="tipos.length === 0" class="text-center py-8 text-gray-500">
        Nenhum tipo de publicidade encontrado
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo de Publicidade</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Processos Associados</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="tipo in tipos" :key="tipo.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tipo.id }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ tipo.publicidade }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ getProcessosCount(tipo.id) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="editTipo(tipo)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteTipo(tipo.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Adicionar/Editar -->
    <div v-if="showAddModal || showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">
          {{ showEditModal ? 'Editar Tipo' : 'Novo Tipo' }}
        </h2>
        
        <form @submit.prevent="saveTipo" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Publicidade</label>
            <input
              v-model="form.publicidade"
              type="text"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Publicidade Digital"
            />
          </div>
          
          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-md text-sm">
            {{ error }}
          </div>
          
          <div class="flex gap-3">
            <button
              type="submit"
              :disabled="saving"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {{ saving ? 'Salvando...' : 'Salvar' }}
            </button>
            <button
              type="button"
              @click="closeModal"
              class="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Cancelar
            </button>
          </div>
        </form>
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
