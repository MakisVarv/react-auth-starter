import apiClient from '../../shared/api/apiClient'
import { getCookie } from '../../shared/utils/cookies'
/** @import { RegisterCredentials, UpdateProfileData, LoginCredentials, LoginResponse } from './types.js' */
/** @import { User } from '../users/types.js' */

/**
 * @param {LoginCredentials} credentials
 * @returns {Promise<LoginResponse>}
 */
export async function login(credentials) {
  const response = await apiClient.post('/auth/login', credentials)

  return response.data
}
/**
 * @param {RegisterCredentials} credentials
 * @returns {Promise<User>}
 */
export async function register(credentials) {
  const response = await apiClient.post('/auth/register', credentials)

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

/**
 * @param {UpdateProfileData} data
 * @param {string} accessToken
 * @returns {Promise<User>}
 */

export async function updateProfile(data, accessToken) {
  const response = await apiClient.patch('/auth/me', data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  return response.data
}
/**
 * @param {string} email
 */
export async function forgotPassword(email) {
  const response = await apiClient.post('/auth/forgot-password', { email })

  return response.data
}
/**
 * @param {string} token
 * @param {string} newPassword
 */
export async function resetPassword(token, newPassword) {
  const response = await apiClient.post('/auth/reset-password', {
    token,
    new_password: newPassword,
  })

  return response.data
}
/**
 * @param {string} accessToken
 * @param {string} newPassword
 */
export async function changePassword(accessToken, newPassword) {
  const response = await apiClient.post(
    '/auth/change-password',
    {
      new_password: newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return response.data
}
/**
 * @param {string} accessToken
 * @param {string} newEmail
 */
export async function changeEmail(accessToken, newEmail) {
  const response = await apiClient.post(
    '/auth/change-email',
    {
      new_email: newEmail,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return response.data
}
/**
 * @param {string} accessToken
 * @param {string} currentPassword
 * @returns {Promise<{ access_token: string }>}
 */
export async function reauthenticate(accessToken, currentPassword) {
  const response = await apiClient.post(
    '/auth/reauthenticate',
    {
      current_password: currentPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return response.data
}
/**
 * @param {string} accessToken
 */
export async function logoutAll(accessToken) {
  const response = await apiClient.post(
    '/auth/logout-all',
    {},
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )

  return response.data
}
