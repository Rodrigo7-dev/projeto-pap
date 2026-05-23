import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token),

    isAdmin: (state) => {
      const value = state.user?.isAdmin

      return (
        value === true ||
        value === 1 ||
        value === '1' ||
        value === 'true'
      )
    }
  },

  actions: {

    async login(credentials) {
      try {
        const data = await api.login(credentials)

        if (!data?.token || !data?.user) {
          throw new Error('Resposta inválida do servidor')
        }

        this.token = data.token
        this.user = data.user

        localStorage.setItem(
          'auth_token',
          data.token
        )

        localStorage.setItem(
          'auth_user',
          JSON.stringify(data.user)
        )

        return data

      } catch (error) {
        console.error('Erro no login:', error)
        throw error
      }
    },

    async logout() {
      try {
        if (this.token) {
          await api.logout()
        }

      } catch (error) {
        console.warn(
          'Logout remoto falhou:',
          error
        )

      } finally {
        this.clearAuth()
      }
    },

    loadUser() {
      try {
        const token =
          localStorage.getItem(
            'auth_token'
          )

        const user =
          localStorage.getItem(
            'auth_user'
          )

        if (!token || !user) {
          this.clearAuth()
          return
        }

        this.token = token
        this.user = JSON.parse(user)

      } catch (error) {
        console.error(
          'Erro ao carregar sessão:',
          error
        )

        this.clearAuth()
      }
    },

    clearAuth() {
      this.token = null
      this.user = null

      localStorage.removeItem(
        'auth_token'
      )

      localStorage.removeItem(
        'auth_user'
      )
    }
  }
})