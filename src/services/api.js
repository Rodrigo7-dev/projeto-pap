import axios from 'axios'

// API base URL
const API_URL = 'https://myapp-api-production-a4fa.up.railway.app/api'

// Criar instância axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Métodos da API
export default {
  // Login
  async login(credentials) {
    try {
      const response = await api.post('/api/login', credentials)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Register
  async register(userData) {
    try {
      const response = await api.post('/register', userData)
      return response.data
    } catch (error) {
      throw error
    }
  },
  
  // Logout
  async logout() {
    try {
      await api.post('/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  },
  
  // Stats
  async getStats() {
    const response = await api.get('/stats')
    return response.data
  },
  
  // Processos
  async getProcessos(params = {}) {
    const response = await api.get('/processos', { params })
    return response.data
  },
  
  async createProcesso(data) {
    const response = await api.post('/processos', data)
    return response.data
  },
  
  async updateProcesso(id, data) {
    const response = await api.put(`/processos/${id}`, data)
    return response.data
  },
  
  async deleteProcesso(id) {
    const response = await api.delete(`/processos/${id}`)
    return response.data
  },
  
  // Ruas
  async getRuas(params = {}) {
    const response = await api.get('/ruas', { params })
    return response.data
  },
  
  async createRua(data) {
    const response = await api.post('/ruas', data)
    return response.data
  },
  
  async updateRua(id, data) {
    const response = await api.put(`/ruas/${id}`, data)
    return response.data
  },
  
  async deleteRua(id) {
    const response = await api.delete(`/ruas/${id}`)
    return response.data
  },
  
  // Freguesias
  async getFreguesias(params = {}) {
    const response = await api.get('/freguesias', { params })
    return response.data
  },
  
  async createFreguesia(data) {
    const response = await api.post('/freguesias', data)
    return response.data
  },
  
  async updateFreguesia(id, data) {
    const response = await api.put(`/freguesias/${id}`, data)
    return response.data
  },
  
  async deleteFreguesia(id) {
    const response = await api.delete(`/freguesias/${id}`)
    return response.data
  },
  
  // Tipos
  async getTipos(params = {}) {
    const response = await api.get('/tipopublicidade', { params })
    return response.data
  },
  
  async createTipo(data) {
    const response = await api.post('/tipopublicidade', data)
    return response.data
  },
  
  async updateTipo(id, data) {
    const response = await api.put(`/tipopublicidade/${id}`, data)
    return response.data
  },
  
  async deleteTipo(id) {
    const response = await api.delete(`/tipopublicidade/${id}`)
    return response.data
  }
}
