import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  },
  timeout: 10000
})

// TOKEN
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// RESPONSE NORMALIZADO
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.clear()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default {
  login: (data) => api.post('/login', data),
  register: (data) => api.post('/register', data),
  logout: () => api.post('/logout'),

  getProcessos: () => api.get('/processos'),
  getProcesso: (id) => api.get(`/processos/${id}`),
  createProcesso: (data) => api.post('/processos', data),
  updateProcesso: (id, data) => api.put(`/processos/${id}`, data),
  deleteProcesso: (id) => api.delete(`/processos/${id}`),

  getRuas: () => api.get('/ruas'),
  getTipos: () => api.get('/tipo-publicidades'),
  getFreguesias: () => api.get('/freguesias')
}