import apiClient from '../../shared/api/apiClient'
/** @import { UsersQueryParams, UsersResponse,User } from './types.js' */

/**
 * @param {UsersQueryParams} params
 * @param {AbortSignal} [signal]
 * @returns {Promise<UsersResponse>}
 */

export async function getUsers(params, signal) {
  const response = await apiClient.get('/users/', {
    params,
    signal,
  })
  return response.data
}
/**
 * @param {string} userId
 * @returns {Promise<User>}
 */

export async function getUser(userId) {
  const response = await apiClient.get(`/users/${userId}`)
  return response.data
}
/**
 * @param {{
 *   first_name: string,
 *   last_name: string,
 *   email: string,
 *   password: string,
 *   phone: string | null,
 *   role_id: string
 * }} payload
 * @returns {Promise<User>}
 */
export async function createUser(payload) {
  const response = await apiClient.post('/users/', payload)
  return response.data
}
/**
 * @param {string} userId
 * @param {{
 *   first_name?: string,
 *   last_name?: string,
 *   email?: string,
 *   phone?: string | null
 * }} payload
 * @returns {Promise<User>}
 */
export async function editUser(userId, payload) {
  const response = await apiClient.patch(`/users/${userId}`, payload)
  return response.data
}
/**
 * @param {string} userId
 * @param {boolean} isActive
 * @returns {Promise<User>}
 */
export async function changeUserStatus(userId, isActive) {
  const response = await apiClient.patch(`/users/${userId}/status`, {
    is_active: isActive,
  })
  return response.data
}
/**
 * @param {string} userId
 * @param {string} roleId
 * @returns {Promise<User>}
 */
export async function changeRole(userId, roleId) {
  const response = await apiClient.patch(`/users/${userId}/role`, {
    role_id: roleId,
  })
  return response.data
}
/**
 * @param {string} userId
 * @returns {Promise<void>}
 */
export async function deleteUser(userId) {
  await apiClient.delete(`/users/${userId}`)
}
