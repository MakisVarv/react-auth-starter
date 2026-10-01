import apiClient from '../../../shared/api/apiClient'
/** @import { Permission } from '../types.js' */

/**
 * @returns {Promise<Permission[]>}
 */
export async function getPermissions() {
  const response = await apiClient.get('/permissions/')

  return response.data
}

/**
 * @param {string} permissionId
 * @returns {Promise<Permission>}
 */
export async function getPermission(permissionId) {
  const response = await apiClient.get(`/permissions/${permissionId}`)

  return response.data
}
