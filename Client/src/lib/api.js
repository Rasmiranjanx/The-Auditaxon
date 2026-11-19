import axios from 'axios'

/**
 * Central Axios API client for The Auditaxon.
 * Handles baseURL configuration, JWT injection, and 401 session expiry.
 */
const baseURL = import.meta.env.VITE_API_URL || '/api'

// No default Content-Type: axios sends plain objects as application/json on its own,
// and lets the browser set multipart/form-data (with its boundary) for FormData uploads
// such as the careers resume. Forcing application/json here would make axios serialise
// FormData to JSON and silently drop the uploaded file.
const api = axios.create({
  baseURL,
})

// Request Interceptor: Attach bearer token if stored
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response Interceptor: Handle 401 Unauthenticated
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('adminToken')
      localStorage.removeItem('adminName')
      // If user was inside admin area, redirect to login
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
