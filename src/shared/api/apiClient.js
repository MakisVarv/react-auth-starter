import axios from 'axios'
import { AppError } from './errors'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from './accessTokenStore'
import { refreshAccessToken } from './tokenRefresh'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

/**
 * @param {Record<string, string[]> | null} errors
 * @returns {string | null}
 */
function getFirstValidationError(errors) {
  if (errors === null) return null

  for (const messages of Object.values(errors)) {
    if (messages.length > 0) {
      return messages[0]
    }
  }

  return null
}
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken()

  if (token && !config.headers.Authorization) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status ?? null
    const errors = error.response?.data?.errors ?? null
    const code = error.response?.data?.code ?? null
    const originalRequest = error.config
    const shouldAttemptRefresh =
      status === 401 &&
      code === 'access_token_expired' &&
      originalRequest &&
      !originalRequest._retry
    if (shouldAttemptRefresh) {
      originalRequest._retry = true
      try {
        const newAccessToken = await refreshAccessToken()
        if (newAccessToken !== null) {
          setAccessToken(newAccessToken)
          originalRequest.headers.delete('Authorization')
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        clearAccessToken()
        if (axios.isAxiosError(refreshError)) {
          const refreshStatus = refreshError.response?.status ?? null
          const refreshErrors = refreshError.response?.data?.errors ?? null
          const refreshMessage =
            getFirstValidationError(refreshErrors) ??
            refreshError.response?.data?.message ??
            (refreshError.response
              ? 'Request failed. Please try again.'
              : 'Unable to connect to the server.')
          throw new AppError(refreshMessage, refreshStatus, refreshErrors)
        }
        throw refreshError
      }
    }
    const message =
      getFirstValidationError(errors) ??
      error.response?.data?.message ??
      (error.response
        ? 'Request failed. Please try again.'
        : 'Unable to connect to the server.')

    throw new AppError(message, status, errors)
  },
)

export default apiClient
