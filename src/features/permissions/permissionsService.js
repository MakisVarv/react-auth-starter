import apiClient from '../../shared/api/apiClient'
/** @import { Permission } from './types.js' */

/**
 * @param {string} accessToken
 * @returns {Promise<Permission[]>}
 */
export async function getPermissions(accessToken) {
  const response = await apiClient.get('/permissions/', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}

/**
 * @param {string} permissionId
 * @param {string} accessToken
 * @returns {Promise<Permission>}
 */
export async function getPermission(permissionId, accessToken) {
  const response = await apiClient.get(`/permissions/${permissionId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })

  return response.data
}
