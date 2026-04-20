import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await api.login(credentials)
        
        if (response.user && response.token) {
          this.token = response.token
          this.user = response.user
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('auth_user', JSON.stringify(response.user))
          
          return response
        } else {
          throw new Error('Resposta inválida do servidor')
        }
      } catch (error) {
        this.user = null
        this.token = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        throw error
      }
    },

    async register(userData) {
      try {
        const response = await api.register(userData)
        
        if (response.user && response.token) {
          this.token = response.token
          this.user = response.user
          localStorage.setItem('auth_token', response.token)
          localStorage.setItem('auth_user', JSON.stringify(response.user))
          
          return response
        } else {
          throw new Error('Resposta inválida do servidor')
        }
      } catch (error) {
        this.user = null
        this.token = null
        localStorage.removeItem('auth_token')
        localStorage.removeItem('auth_user')
        throw error
      }
    },

    async logout() {
      await api.logout()
      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },

    // Carregar usuário do localStorage
    loadUser() {
      const user = localStorage.getItem('auth_user')
      if (user) {
        this.user = JSON.parse(user)
      }
    }
  }
})
