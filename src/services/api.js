import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 10000
})

// Token automático
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Tratamento global de erros
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.clear()
      window.location.replace('/login')
    }

    throw error
  }
)

// Métodos específicos da API
const apiMethods = {
  // Processos
  async getProcessos() {
    return this.get('/processos')
  },
  
  async getProcesso(id) {
    return this.get(`/processos/${id}`)
  },
  
  async createProcesso(data) {
    return this.post('/processos', data)
  },
  
  async updateProcesso(id, data) {
    return this.put(`/processos/${id}`, data)
  },
  
  async deleteProcesso(id) {
    return this.delete(`/processos/${id}`)
  },
  
  // Ruas
  async getRuas() {
    return this.get('/ruas')
  },
  
  async getRua(id) {
    return this.get(`/ruas/${id}`)
  },
  
  async createRua(data) {
    return this.post('/ruas', data)
  },
  
  async updateRua(id, data) {
    return this.put(`/ruas/${id}`, data)
  },
  
  async deleteRua(id) {
    return this.delete(`/ruas/${id}`)
  },
  
  // Freguesias
  async getFreguesias() {
    return this.get('/freguesias')
  },
  
  async getFreguesia(id) {
    return this.get(`/freguesias/${id}`)
  },
  
  async createFreguesia(data) {
    return this.post('/freguesias', data)
  },
  
  async updateFreguesia(id, data) {
    return this.put(`/freguesias/${id}`, data)
  },
  
  async deleteFreguesia(id) {
    return this.delete(`/freguesias/${id}`)
  },
  
  // Tipos
  async getTipos() {
    return this.get('/tipos')
  },
  
  async getTipo(id) {
    return this.get(`/tipos/${id}`)
  },
  
  async createTipo(data) {
    return this.post('/tipos', data)
  },
  
  async updateTipo(id, data) {
    return this.put(`/tipos/${id}`, data)
  },
  
  async deleteTipo(id) {
    return this.delete(`/tipos/${id}`)
  }
}

// Adicionar métodos ao objeto api
Object.assign(api, apiMethods)

export default api
