import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getAuthHeaders, getRefreshToken, setTokens, removeTokens } from '../utils/auth'

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8090'

if (!import.meta.env.VITE_API_URL) {
  console.warn('VITE_API_URL is not defined! Using default: http://localhost:8090')
}

export const $api = axios.create({
  baseURL: apiUrl ? `${apiUrl}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: unknown) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })

  failedQueue = []
}

// Интерцептор для добавления токена авторизации
$api.interceptors.request.use((config) => {
  const authHeaders = getAuthHeaders()
  
  if (!config.headers) {
    config.headers = {} as InternalAxiosRequestConfig['headers']
  }
  
  Object.keys(authHeaders).forEach((key) => {
    config.headers![key] = authHeaders[key as keyof typeof authHeaders]
  })

  return config
})

// Интерцептор для обработки ошибок и refresh token
$api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Обработка ошибок авторизации
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Если уже идет обновление токена, добавляем запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return $api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        // Нет refresh token, перенаправляем на логин
        removeTokens()
        processQueue(error, null)
        const currentPath = window.location.pathname
        if (currentPath !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }

      try {
        // Пытаемся обновить токен
        const response = await axios.post<{ success: boolean; data?: { access_token: string } }>(
          `${apiUrl}/api/v1/auth/refresh`,
          { refresh_token: refreshToken }
        )

        if (response.data.success && response.data.data?.access_token) {
          const newAccessToken = response.data.data.access_token
          setTokens(newAccessToken, refreshToken)

          // Обновляем заголовок в оригинальном запросе
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          }

          processQueue(null, newAccessToken)
          isRefreshing = false

          // Повторяем оригинальный запрос
          return $api(originalRequest)
        } else {
          throw new Error('Invalid refresh response')
        }
      } catch (refreshError) {
        // Ошибка обновления токена, перенаправляем на логин
        removeTokens()
        processQueue(refreshError as AxiosError, null)
        isRefreshing = false
        const currentPath = window.location.pathname
        if (currentPath !== '/login') {
          window.location.href = '/login'
        }
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

