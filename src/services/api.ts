import axios from 'axios'

const api = axios.create({
  baseURL: 'https://loyalty-api-production-2f87.up.railway.app/api',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api