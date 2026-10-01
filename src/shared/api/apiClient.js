import axios from 'axios'
import { AppError } from './errors'
import { getAccessToken } from './accessTokenStore'

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

  (error) => {
    const status = error.response?.status ?? null
    const errors = error.response?.data?.errors ?? null

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
