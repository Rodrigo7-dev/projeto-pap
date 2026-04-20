<template>
  <div class="min-h-screen bg-slate-50 p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold text-slate-800 mb-8">Meu Perfil</h1>
      
      <div class="bg-white rounded-xl p-6 shadow-md mb-6">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Informações Pessoais</h2>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nome</label>
            <input v-model="user.name" type="text" disabled class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"/>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input v-model="user.email" type="email" disabled class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"/>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">NIF</label>
            <input v-model="user.nif" type="text" disabled class="w-full px-3 py-2 border border-slate-300 rounded-lg bg-slate-50"/>
          </div>
        </div>
      </div>

      <div class="bg-white rounded-xl p-6 shadow-md">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Estatísticas</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ stats.processos }}</div>
            <div class="text-sm text-slate-600">Processos Criados</div>
          </div>
          
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ stats.validos }}</div>
            <div class="text-sm text-slate-600">Alvarás Válidos</div>
          </div>
          
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ stats.membroDesde }}</div>
            <div class="text-sm text-slate-600">Membro Desde</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import api from '../services/api'

export default {
  setup() {
    const auth = useAuthStore()
    return { auth }
  },

  data() {
    return {
      user: { name: '', email: '', nif: '' },
      stats: { processos: 0, validos: 0, membroDesde: new Date().getFullYear() }
    }
  },

  mounted() {
    this.loadUserData()
    this.loadStats()
  },

  methods: {
    loadUserData() {
      if (this.auth.user) {
        this.user = {
          name: this.auth.user.name || '',
          email: this.auth.user.email || '',
          nif: this.auth.user.nif || ''
        }
      }
    },

    async loadStats() {
      try {
        const response = await api.get('/stats')
        const stats = response.data
        this.stats.processos = stats.total || 0
        this.stats.validos = stats.validos || 0
      } catch (error) {
        console.error('Erro ao carregar estatísticas:', error)
      }
    }
  }
}
</script>
