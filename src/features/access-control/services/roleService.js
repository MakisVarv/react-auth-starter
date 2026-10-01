import apiClient from '../../../shared/api/apiClient'
/** @import { Role } from '../types.js' */

/**
 * @returns {Promise<Role[]>}
 */
export async function getRoles() {
  const response = await apiClient.get('/roles/')

  return response.data
}

/**
 * @param {string} roleId
 * @returns {Promise<Role>}
 */
export async function getRole(roleId) {
  const response = await apiClient.get(`/roles/${roleId}`)

  return response.data
}
/**
 * @param {{
 *   name: string,
 *   description: string,
 *   level: number
 * }} payload
 * @returns {Promise<Role>}
 */
export async function createRole(payload) {
  const response = await apiClient.post('/roles/', payload)
  return response.data
}
/**
 * @param {string} roleId
 * @param {{
 *   name?: string,
 *   description?: string,
 *   level?: number
 * }} payload
 * @returns {Promise<Role>}
 */
export async function editRole(roleId, payload) {
  const response = await apiClient.patch(`/roles/${roleId}`, payload)
  return response.data
}
/**
 * @param {string} roleId
 * @param {string} permissionId
 * @returns {Promise<Role>}
 */
export async function addPermissionToRole(roleId, permissionId) {
  const response = await apiClient.post(`/roles/${roleId}/permissions`, {
    permission_id: permissionId,
  })
  return response.data
}
/**
 * @param {string} roleId
 * @param {string} permissionId
 * @returns {Promise<Role>}
 */
export async function removePermissionFromRole(roleId, permissionId) {
  const response = await apiClient.delete(
    `/roles/${roleId}/permissions/${permissionId}`,
  )
  return response.data
}
/**
 * @param {string} roleId
 * @returns {Promise<void>}
 */
export async function deleteRole(roleId) {
  await apiClient.delete(`/roles/${roleId}`)
}
