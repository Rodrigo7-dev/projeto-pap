import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
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
        const data = await api.login(credentials)

        this.token = data.token
        this.user = data.user

        localStorage.setItem('auth_token', data.token)
        localStorage.setItem('auth_user', JSON.stringify(data.user))

        return data
      } catch (error) {
        console.error("Erro no login:", error)
        throw error
      }
    },

    async logout() {
      try {
        await api.logout()
      } catch (e) {}

      this.token = null
      this.user = null

      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },

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