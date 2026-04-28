import axios from 'axios'

// src/services/api.js
const api = axios.create({
  // Escreve o link diretamente aqui para descartar erro de variável
  baseURL: 'https://myapp-api-production-09ab.up.railway.app/api', 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 10000
})

// TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// RESPONSE NORMALIZADO (IMPORTANTE)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }

    return Promise.reject(error)
  }
)

const apiMethods = {

  // AUTH
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  logout: () => api.post('/logout'),

  // RUAS
  getRuas: () => api.get('/ruas'),
  getRua: (id) => api.get(`/ruas/${id}`),
  createRua: (data) => api.post('/ruas', data),
  updateRua: (id, data) => api.put(`/ruas/${id}`, data),
  deleteRua: (id) => api.delete(`/ruas/${id}`),

  // FREGUESIAS
  getFreguesias: () => api.get('/freguesias'),
  getFreguesia: (id) => api.get(`/freguesias/${id}`),
  createFreguesia: (data) => api.post('/freguesias', data),
  updateFreguesia: (id, data) => api.put(`/freguesias/${id}`),
  deleteFreguesia: (id) => api.delete(`/freguesias/${id}`),

  // TIPOS
  getTipos: () => api.get('/tipo-publicidades'),
  getTipo: (id) => api.get(`/tipo-publicidades/${id}`),
  createTipo: (data) => api.post('/tipo-publicidades', data),
  updateTipo: (id, data) => api.put(`/tipo-publicidades/${id}`),
  deleteTipo: (id) => api.delete(`/tipo-publicidades/${id}`),

  // 🔴 PROCESSOS (FALTAVA ISTO)
  getProcessos: () => api.get('/processos'),
  getProcesso: (id) => api.get(`/processos/${id}`),
  createProcesso: (data) => api.post('/processos', data),
  updateProcesso: (id, data) => api.put(`/processos/${id}`),
  deleteProcesso: (id) => api.delete(`/processos/${id}`)
}

Object.assign(api, apiMethods)

export default api