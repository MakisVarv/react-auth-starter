import apiClient from '../api/apiClient'
import { getCookie } from '../utils/cookies'
/** @import { LoginCredentials, LoginResponse, User } from './types.js' */
/**
 * @param {LoginCredentials} credentials
 * @returns {Promise<LoginResponse>}
 */
export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials)

  return response.data
}
/**
 * @returns {Promise<void>}
 */
export async function logout() {
  const csrfToken = getCookie('csrf_refresh_token')
  if (csrfToken == null) {
    return
  }
  await apiClient.post(
    '/auth/logout',
    {},
    {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
      },
    },
  )
}
/**
 * @returns {Promise<string | null>}
 */
export async function refresh() {
  const csrfToken = getCookie('csrf_refresh_token')
  if (csrfToken == null) {
    return null
  }
  const response = await apiClient.post(
    '/auth/refresh',
    {},
    {
      headers: {
        'X-CSRF-TOKEN': csrfToken,
      },
    },
  )

  return response.data.access_token
}

/**
 * @param {string} accessToken
 * @returns {Promise<User>}
 */

export async function getCurrentUser(accessToken) {
  const response = await apiClient.get('/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
