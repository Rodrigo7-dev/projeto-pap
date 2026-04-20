import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('auth_token') || null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token
  },

  actions: {
    initialize() {
      const token = localStorage.getItem('auth_token')
      if (token) {
        this.token = token
      }
    },

    async login(email, password) {
      try {
        const res = await api.post('/login', { email, password })

        if (res.data.user && res.data.token) {
          this.token = res.data.token
          this.user = res.data.user

          localStorage.setItem('auth_token', res.data.token)

          return true
        } else {
          throw new Error('Resposta inválida')
        }

      } catch (error) {
        this.user = null
        this.token = null
        localStorage.removeItem('auth_token')
        throw error
      }
    },

    async logout() {
      try {
        await api.post('/logout')
      } catch (e) {}

      this.user = null
      this.token = null
      localStorage.removeItem('auth_token')
    }
  }
})