import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null,
    isTokenValid: !!localStorage.getItem('auth_token')
  }),

  getters: {
    isAuthenticated: (state) => !!state.user && !!state.token && state.isTokenValid
  },

  actions: {
    async login(email, password) {
      try {
        const res = await api.post('/login', { email, password })
        
        if (res.data.user && res.data.token) {
          this.token = res.data.token
          this.isTokenValid = true
          this.user = res.data.user
          localStorage.setItem('auth_token', res.data.token)
          
          return { success: true, user: res.data.user, token: res.data.token }
        } else {
          throw new Error('Resposta inválida do servidor')
        }
      } catch (error) {
        this.user = null
        this.token = null
        this.isTokenValid = false
        localStorage.removeItem('auth_token')
        throw new Error('Credenciais inválidas')
      }
    },

    async register(name, email, NIF, password) {
      try {
        const res = await api.post('/register', {
          name,
          email,
          nif: NIF,
          password,
          password_confirmation: password
        })
        
        return res.data
      } catch (error) {
        throw new Error('Erro ao criar conta')
      }
    },

    async logout() {
      try {
        await api.post('/logout')
      } catch (error) {
        console.error('Logout error:', error)
      } finally {
        this.user = null
        this.token = null
        this.isTokenValid = false
        localStorage.removeItem('auth_token')
      }
    }
  }
})