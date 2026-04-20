import axios from 'axios'

// Instância principal da API
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Deve terminar com /api
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 10000
})

// Interceptor para token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Interceptor global de erros
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

// Métodos da API
const apiMethods = {
  // ============================
  // AUTH
  // ============================
  async login(data) {
    return api.post('/login', data)
  },

  async register(data) {
    return api.post('/register', data)
  },

  async logout() {
    return api.post('/logout')
  },

  // ============================
  // PROCESSOS
  // ============================
  async getProcessos() {
    return api.get('/processos')
  },

  async getProcesso(id) {
    return api.get(`/processos/${id}`)
  },

  async createProcesso(data) {
    return api.post('/processos', data)
  },

  async updateProcesso(id, data) {
    return api.put(`/processos/${id}`, data)
  },

  async deleteProcesso(id) {
    return api.delete(`/processos/${id}`)
  },

  // ============================
  // RUAS
  // ============================
  async getRuas() {
    return api.get('/ruas')
  },

  async getRua(id) {
    return api.get(`/ruas/${id}`)
  },

  async createRua(data) {
    return api.post('/ruas', data)
  },

  async updateRua(id, data) {
    return api.put(`/ruas/${id}`, data)
  },

  async deleteRua(id) {
    return api.delete(`/ruas/${id}`)
  },

  // ============================
  // FREGUESIAS
  // ============================
  async getFreguesias() {
    return api.get('/freguesias')
  },

  async getFreguesia(id) {
    return api.get(`/freguesias/${id}`)
  },

  async createFreguesia(data) {
    return api.post('/freguesias', data)
  },

  async updateFreguesia(id, data) {
    return api.put(`/freguesias/${id}`, data)
  },

  async deleteFreguesia(id) {
    return api.delete(`/freguesias/${id}`)
  },

  // ============================
  // TIPO PUBLICIDADE
  // ============================
  async getTipos() {
    return api.get('/tipo-publicidades')
  },

  async getTipo(id) {
    return api.get(`/tipo-publicidades/${id}`)
  },

  async createTipo(data) {
    return api.post('/tipo-publicidades', data)
  },

  async updateTipo(id, data) {
    return api.put(`/tipo-publicidades/${id}`, data)
  },

  async deleteTipo(id) {
    return api.delete(`/tipo-publicidades/${id}`)
  }
}

// Junta os métodos ao axios
Object.assign(api, apiMethods)

export default api
