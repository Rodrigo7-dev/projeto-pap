import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // Tenta recuperar do localStorage ao iniciar
    user: JSON.parse(localStorage.getItem('auth_user')) || null,
    token: localStorage.getItem('auth_token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user?.isAdmin || false
  },

  actions: {
    async login(credentials) {
      try {
        // 1. Usamos o método .login() que definiste no api.js
        // Devido ao interceptor de resposta, 'data' já vem limpo (apenas o JSON)
        const data = await api.login(credentials)

        // 2. Guardamos no State
        this.token = data.token
        this.user = data.user

        // 3. Guardamos no LocalStorage
        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))
        
        return data
      } catch (error) {
        console.error("Erro no store ao fazer login:", error)
        throw error
      }
    },

    async logout() {
      try {
        // Usamos o método .logout() do api.js
        await api.logout().catch(() => {})
      } finally {
        // Limpamos tudo, mesmo que o pedido ao servidor falhe
        this.token = null
        this.user = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        // Limpar o header do axios para segurança
        if (api.defaults) {
          delete api.defaults.headers.common['Authorization']
        }
      }
    },

    // Função para validar se o utilizador ainda está logado ao abrir o site
    loadUser() {
      const token = localStorage.getItem('auth_token')
      const user = localStorage.getItem('auth_user')
      
      if (token && user) {
        this.token = token
        this.user = JSON.parse(user)
      }
    }
  }
})