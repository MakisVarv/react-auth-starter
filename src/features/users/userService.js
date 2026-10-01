import apiClient from '../../shared/api/apiClient'
/** @import { UsersQueryParams, UsersResponse,User } from './types.js' */

/**
 * @param {UsersQueryParams} params
 * @param {string} accessToken
 * @returns {Promise<UsersResponse>}
 */

export async function getUsers(params, accessToken) {
  const response = await apiClient.get('/users/', {
    params,
  })
  return response.data
}
/**
 * @param {string} userId
 * @param {string} accessToken
 * @returns {Promise<User>}
 */

export async function getUser(userId, accessToken) {
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
 * @param {string} accessToken
 * @returns {Promise<User>}
 */
export async function createUser(payload, accessToken) {
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
 * @param {string} accessToken
 * @returns {Promise<User>}
 */
export async function editUser(userId, payload, accessToken) {
  const response = await apiClient.patch(`/users/${userId}`, payload)
  return response.data
}
/**
 * @param {string} userId
 * @param {boolean} isActive
 * @param {string} accessToken
 * @returns {Promise<User>}
 */
export async function changeUserStatus(userId, isActive, accessToken) {
  const response = await apiClient.patch(`/users/${userId}/status`, {
    is_active: isActive,
  })
  return response.data
}
/**
 * @param {string} userId
 * @param {string} roleId
 * @param {string} accessToken
 * @returns {Promise<User>}
 */
export async function changeRole(userId, roleId, accessToken) {
  const response = await apiClient.patch(`/users/${userId}/role`, {
    role_id: roleId,
  })
  return response.data
}
/**
 * @param {string} userId
 * @param {string} accessToken
 * @returns {Promise<void>}
 */
export async function deleteUser(userId, accessToken) {
  await apiClient.delete(`/users/${userId}`)
}
