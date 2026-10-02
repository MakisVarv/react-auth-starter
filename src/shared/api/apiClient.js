/**
 * @typedef {import('axios').InternalAxiosRequestConfig & {
 *   _retry?: boolean,
 *   _usesManagedAccessToken?: boolean
 * }} ApiRequestConfig
 */
import axios from 'axios'
import { AppError } from './errors'
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from './accessTokenStore'
import { refreshAccessToken } from './tokenRefresh'
import { notifySessionExpired } from '../auth/sessionEvents'
/** @type {Promise<string | null> | null} */
let refreshPromise = null

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
apiClient.interceptors.request.use(
  /** @param {ApiRequestConfig} config */ (config) => {
    const token = getAccessToken()

    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`
      config._usesManagedAccessToken = true
    }

    return config
  },
)
apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    if (axios.isCancel(error)) {
      throw error
    }
    const status = error.response?.status ?? null
    const errors = error.response?.data?.errors ?? null
    const code = error.response?.data?.code ?? null
    /** @type {ApiRequestConfig | undefined} */
    const originalRequest = error.config
    const shouldAttemptRefresh =
      status === 401 &&
      code === 'access_token_expired' &&
      originalRequest &&
      originalRequest._usesManagedAccessToken &&
      !originalRequest._retry
    if (shouldAttemptRefresh) {
      originalRequest._retry = true

      if (refreshPromise === null) {
        refreshPromise = refreshAccessToken()
      }

      const activeRefresh = refreshPromise
      try {
        const newAccessToken = await activeRefresh
        if (newAccessToken !== null) {
          setAccessToken(newAccessToken)
          originalRequest.headers.delete('Authorization')
          return apiClient(originalRequest)
        } else {
          clearAccessToken()
          notifySessionExpired()
        }
      } catch (refreshError) {
        if (axios.isAxiosError(refreshError)) {
          const refreshStatus = refreshError.response?.status ?? null

          if (refreshStatus === 401) {
            clearAccessToken()
            notifySessionExpired()
          }

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
      } finally {
        if (refreshPromise === activeRefresh) {
          refreshPromise = null
        }
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
